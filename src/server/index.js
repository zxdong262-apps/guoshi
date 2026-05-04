import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '../../public');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(PUBLIC_DIR));

app.use((req, res) => {
  const pathname = req.path;
  
  if (pathname === '/') {
    return res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
  }
  
  if (pathname.endsWith('.html')) {
    return res.sendFile(path.join(PUBLIC_DIR, pathname));
  }
  
  const htmlPath = path.join(PUBLIC_DIR, pathname, 'index.html');
  res.sendFile(htmlPath, (err) => {
    if (err) {
      res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
