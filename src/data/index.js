import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadPersons() {
  const persons = [];
  const entries = fs.readdirSync(__dirname, { withFileTypes: true });
  
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('.') || entry.name === 'photos') continue;
    
    const dataPath = path.join(__dirname, entry.name, 'data.json');
    if (!fs.existsSync(dataPath)) continue;
    
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      const photos = data.photos.map(photo => ({
        ...photo,
        path: `/${data.id}/photos/${photo.file}`
      }));
      
      persons.push({
        ...data,
        photos
      });
    } catch (err) {
      console.warn(`Failed to load ${entry.name}: ${err.message}`);
    }
  }
  
  return persons;
}

export const persons = loadPersons();

export function getAllPersons() {
  return persons;
}

export function getPersonById(id) {
  return persons.find(p => p.id === id);
}

export function getPersonsByCategory(category) {
  return persons.filter(p => p.category === category);
}

export function getCategories() {
  return [...new Set(persons.map(p => p.category))];
}
