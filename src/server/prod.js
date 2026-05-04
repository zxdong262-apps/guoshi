import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '../../public');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(PUBLIC_DIR));

app.listen(PORT, () => {
  console.log(`Production server running at http://localhost:${PORT}`);
});
