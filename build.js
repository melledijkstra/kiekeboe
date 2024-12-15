import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, 'src');
const OUT_DIR = path.join(__dirname, '.dist');

// read .env file
dotenv.config();

console.log('Starting build process...');
cleanFolder(OUT_DIR);

console.log('Copying files from', SRC_DIR, 'to', OUT_DIR);
copyFolderSync(SRC_DIR, OUT_DIR);

const manifestPath = path.join(__dirname, 'manifest.json');
const clientId = process.env.CLIENT_ID;

if (!clientId) {
  throw new Error('CLIENT_ID environment variable is not set.');
}

const template = fs.readFileSync(manifestPath, 'utf8');
const manifest = template.replace('%CLIENT_ID%', clientId);

console.log('Writing manifest.json');
fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), manifest);

console.log('Successfully built the extension');


function cleanFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    console.log('Cleaning folder:', folderPath);
    fs.rmSync(folderPath, { recursive: true, force: true });
  }
  fs.mkdirSync(folderPath, { recursive: true });
}

function copyFolderSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath); // Recursively copy directories
    } else {
      fs.copyFileSync(srcPath, destPath); // Copy files
    }
  }
}
