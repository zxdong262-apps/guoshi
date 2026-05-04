import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '../public');

describe('Build Output Tests', () => {
  test('public directory should exist', () => {
    assert.ok(fs.existsSync(PUBLIC_DIR), 'public directory should exist');
  });

  test('index.html should exist', () => {
    const indexPath = path.join(PUBLIC_DIR, 'index.html');
    assert.ok(fs.existsSync(indexPath), 'index.html should exist');
  });

  test('index.html should have valid HTML structure', () => {
    const indexPath = path.join(PUBLIC_DIR, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');
    
    assert.ok(content.includes('<!DOCTYPE html>'), 'Should have DOCTYPE');
    assert.ok(content.includes('<html'), 'Should have html tag');
    assert.ok(content.includes('<head>'), 'Should have head tag');
    assert.ok(content.includes('<body>'), 'Should have body tag');
  });

  test('index.html should contain hero information', () => {
    const indexPath = path.join(PUBLIC_DIR, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');
    
    assert.ok(content.includes('国士'), 'Should contain site name');
    assert.ok(content.includes('毛泽东'), 'Should contain Mao Zedong');
    assert.ok(content.includes('袁隆平'), 'Should contain Yuan Longping');
  });
});

describe('Person Pages Tests', () => {
  const persons = [
    'mao-zedong',
    'qian-xuesen',
    'yuan-longping'
  ];

  for (const personId of persons) {
    test(`${personId} page should exist`, () => {
      const pagePath = path.join(PUBLIC_DIR, personId, 'index.html');
      assert.ok(fs.existsSync(pagePath), `${personId}/index.html should exist`);
    });

    test(`${personId} page should have valid HTML`, () => {
      const pagePath = path.join(PUBLIC_DIR, personId, 'index.html');
      const content = fs.readFileSync(pagePath, 'utf-8');
      
      assert.ok(content.includes('<!DOCTYPE html>'), 'Should have DOCTYPE');
      assert.ok(content.includes('style-btn'), 'Should have style buttons');
      assert.ok(content.includes('print-btn'), 'Should have print button');
      assert.ok(content.includes('save-image-btn'), 'Should have save image button');
    });

    test(`${personId} should have photos folder`, () => {
      const photosDir = path.join(PUBLIC_DIR, personId, 'photos');
      assert.ok(fs.existsSync(photosDir), `${personId}/photos/ should exist`);
    });
  }
});

describe('Static Assets Tests', () => {
  test('CSS file should exist', () => {
    const cssPath = path.join(PUBLIC_DIR, 'css', 'style.css');
    assert.ok(fs.existsSync(cssPath), 'css/style.css should exist');
  });

  test('JavaScript file should exist', () => {
    const jsPath = path.join(PUBLIC_DIR, 'js', 'main.js');
    assert.ok(fs.existsSync(jsPath), 'js/main.js should exist');
  });

  test('CSS should have required styles', () => {
    const cssPath = path.join(PUBLIC_DIR, 'css', 'style.css');
    const content = fs.readFileSync(cssPath, 'utf-8');
    
    assert.ok(content.includes('.header'), 'Should have header styles');
    assert.ok(content.includes('.footer'), 'Should have footer styles');
    assert.ok(content.includes('.person-card'), 'Should have person card styles');
    assert.ok(content.includes('.style-btn'), 'Should have style button styles');
    assert.ok(content.includes('.portrait-image.style-bw'), 'Should have CSS filter styles');
    assert.ok(content.includes('@media print'), 'Should have print styles');
  });

  test('JS should have style switching functionality', () => {
    const jsPath = path.join(PUBLIC_DIR, 'js', 'main.js');
    const content = fs.readFileSync(jsPath, 'utf-8');
    
    assert.ok(content.includes('style-btn'), 'Should reference style buttons');
    assert.ok(content.includes('photo-thumb'), 'Should reference photo thumbnails');
    assert.ok(content.includes('print-btn'), 'Should reference print button');
    assert.ok(content.includes('save-image-btn'), 'Should reference save image button');
  });
});

describe('Data Module Tests', () => {
  let dataModule;
  let getAllPersons, getPersonById, getPersonsByCategory, getCategories;

  test('should import data module', async () => {
    dataModule = await import('../src/data/index.js');
    getAllPersons = dataModule.getAllPersons;
    getPersonById = dataModule.getPersonById;
    getPersonsByCategory = dataModule.getPersonsByCategory;
    getCategories = dataModule.getCategories;
    assert.ok(dataModule, 'Should import data module');
  });

  test('should have 3 persons', () => {
    const persons = getAllPersons();
    assert.strictEqual(persons.length, 3, 'Should have 3 persons');
  });

  test('should get person by ID', () => {
    const person = getPersonById('mao-zedong');
    assert.ok(person, 'Should find Mao Zedong');
    assert.strictEqual(person.name, '毛泽东');
  });

  test('should return undefined for unknown ID', () => {
    const person = getPersonById('unknown');
    assert.strictEqual(person, undefined);
  });

  test('should get persons by category', () => {
    const politics = getPersonsByCategory('politics');
    assert.ok(politics.length > 0, 'Should have politics persons');
    
    const science = getPersonsByCategory('science');
    assert.ok(science.length > 0, 'Should have science persons');
  });

  test('should get all categories', () => {
    const categories = getCategories();
    assert.ok(categories.includes('politics'), 'Should have politics');
    assert.ok(categories.includes('science'), 'Should have science');
  });

  test('each person should have required fields', () => {
    const persons = getAllPersons();
    for (const person of persons) {
      assert.ok(person.id, `${person.name} should have id`);
      assert.ok(person.name, 'Should have name');
      assert.ok(person.nameEn, 'Should have nameEn');
      assert.ok(person.altNames, 'Should have altNames');
      assert.ok(Array.isArray(person.altNames), 'altNames should be array');
      assert.ok(person.quotes, 'Should have quotes');
      assert.ok(Array.isArray(person.quotes), 'quotes should be array');
      assert.ok(person.quotes.length > 0, 'Should have at least one quote');
      assert.ok(person.photos, 'Should have photos');
      assert.ok(Array.isArray(person.photos), 'photos should be array');
      assert.ok(person.photos.length > 0, 'Should have at least one photo');
    }
  });
});
