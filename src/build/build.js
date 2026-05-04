import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import pug from 'pug';
import { marked } from 'marked';
import { getAllPersons, getPersonById, getCategories } from '../data/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BUILD_DIR = path.join(__dirname, '../../public');
const CLIENT_DIR = path.join(__dirname, '../client');
const DATA_DIR = path.join(__dirname, '../data');
const BLOGS_DIR = path.join(__dirname, '../blogs');

const PRODUCTION_BASE_URL = 'https://guoshi.html5beta.com';

const IMAGE_STYLES = [
  { id: 'original', name: '原图', nameEn: 'Original' },
  { id: 'bw', name: '黑白', nameEn: 'Black & White' },
  { id: 'sepia', name: '复古', nameEn: 'Sepia' },
  { id: 'vintage', name: '怀旧', nameEn: 'Vintage' },
  { id: 'warm', name: '暖色', nameEn: 'Warm' },
  { id: 'cool', name: '冷色', nameEn: 'Cool' },
  { id: 'contrast', name: '高对比', nameEn: 'High Contrast' },
  { id: 'bright', name: '明亮', nameEn: 'Bright' }
];

const LANGUAGES = [
  { code: 'zh', dir: '' },
  { code: 'en', dir: 'en' }
];

function getPersonUrl(personId, lang) {
  const langPrefix = lang === 'en' ? '/en' : '';
  return `${PRODUCTION_BASE_URL}${langPrefix}/${personId}`;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content };
  
  const frontmatter = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      frontmatter[key.trim()] = valueParts.join(':').trim();
    }
  }
  
  return { data: frontmatter, content: match[2] };
}

function loadBlogPosts() {
  const posts = [];
  
  if (!fs.existsSync(BLOGS_DIR)) {
    return posts;
  }
  
  const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith('.md'));
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(BLOGS_DIR, file), 'utf-8');
    const { data, content: markdownContent } = parseFrontmatter(content);
    
    const slug = file.replace('.md', '');
    const contentEn = marked(markdownContent);
    
    posts.push({
      slug,
      title: data.title || slug,
      titleEn: data.titleEn || data.title || slug,
      date: data.date || '',
      author: data.author || '',
      authorEn: data.authorEn || data.author || '',
      category: data.category || '',
      categoryEn: data.categoryEn || data.category || '',
      excerpt: data.excerpt || '',
      excerptEn: data.excerptEn || data.excerpt || '',
      content: marked(markdownContent),
      contentEn: contentEn
    });
  }
  
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return posts;
}

async function copyPersonPhotos(person) {
  const srcDir = path.join(DATA_DIR, person.id);
  const destDir = path.join(BUILD_DIR, person.id, 'photos');
  
  if (await fs.pathExists(srcDir)) {
    await fs.ensureDir(destDir);
    const files = await fs.readdir(srcDir);
    for (const file of files) {
      if (file === 'data.json') continue;
      const src = path.join(srcDir, file);
      const dest = path.join(destDir, file);
      await fs.copy(src, dest);
    }
    console.log(`Copied photos for ${person.name}`);
  }
}

async function build() {
  console.log('Starting build...');
  
  await fs.emptyDir(BUILD_DIR);
  console.log('Cleaned build directory');
  
  const persons = getAllPersons();
  const categories = getCategories();
  const blogPosts = loadBlogPosts();
  
  const homeTemplate = pug.compileFile(path.join(CLIENT_DIR, 'index.pug'));
  const personTemplate = pug.compileFile(path.join(CLIENT_DIR, 'person.pug'));
  const blogListTemplate = pug.compileFile(path.join(CLIENT_DIR, 'blog-list.pug'));
  const blogPostTemplate = pug.compileFile(path.join(CLIENT_DIR, 'blog-post.pug'));
  
  console.log('Compiled Pug templates');
  console.log(`Found ${blogPosts.length} blog posts`);
  
  for (const lang of LANGUAGES) {
    const langPrefix = lang.dir ? `/${lang.dir}` : '';
    const buildDir = path.join(BUILD_DIR, lang.dir);
    
    const homeHtml = homeTemplate({
      persons,
      categories,
      imageStyles: IMAGE_STYLES,
      productionBaseUrl: PRODUCTION_BASE_URL,
      lang: lang.code,
      isProduction: true
    });
    
    await fs.outputFile(path.join(buildDir, 'index.html'), homeHtml);
    console.log(`Built: ${lang.dir || '.'}/index.html`);
    
    for (const person of persons) {
      const personHtml = personTemplate({
        person,
        persons,
        imageStyles: IMAGE_STYLES,
        productionBaseUrl: PRODUCTION_BASE_URL,
        getPersonUrl: (id) => getPersonUrl(id, lang.code),
        lang: lang.code,
        isProduction: true
      });
      
      await fs.outputFile(path.join(buildDir, person.id, 'index.html'), personHtml);
      console.log(`Built: ${lang.dir || '.'}/${person.id}/index.html`);
    }
    
    const blogListHtml = blogListTemplate({
      posts: blogPosts,
      productionBaseUrl: PRODUCTION_BASE_URL,
      lang: lang.code,
      categories,
      imageStyles: IMAGE_STYLES
    });
    
    await fs.outputFile(path.join(buildDir, 'blog', 'index.html'), blogListHtml);
    console.log(`Built: ${lang.dir || '.'}/blog/index.html`);
    
    for (let i = 0; i < blogPosts.length; i++) {
      const post = blogPosts[i];
      const prevPost = i < blogPosts.length - 1 ? blogPosts[i + 1] : null;
      const nextPost = i > 0 ? blogPosts[i - 1] : null;
      
      const blogPostHtml = blogPostTemplate({
        post,
        prevPost,
        nextPost,
        productionBaseUrl: PRODUCTION_BASE_URL,
        lang: lang.code,
        categories,
        persons,
        imageStyles: IMAGE_STYLES
      });
      
      await fs.outputFile(path.join(buildDir, 'blog', post.slug, 'index.html'), blogPostHtml);
      console.log(`Built: ${lang.dir || '.'}/blog/${post.slug}/index.html`);
    }
  }
  
  for (const person of persons) {
    await copyPersonPhotos(person);
  }
  
  const publicDir = path.join(CLIENT_DIR, 'public');
  if (await fs.pathExists(publicDir)) {
    await fs.copy(publicDir, BUILD_DIR);
    console.log('Copied static assets');
  }
  
  console.log('\nBuild complete!');
  console.log(`Output directory: ${BUILD_DIR}`);
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
