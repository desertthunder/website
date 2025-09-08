import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function processCss() {
  const srcDir = path.join(__dirname, '../../assets/css/local');
  const destDir = path.join(__dirname, '../../_includes/css');

  try {
    await fs.mkdir(destDir, {recursive: true});

    const files = await fs.readdir(srcDir);
    const cssFiles = files.filter(file => file.endsWith('.css'));

    for (const file of cssFiles) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);
      const content = await fs.readFile(srcPath, 'utf8');
      await fs.writeFile(destPath, content);
    }

    console.log(`[11ty] Pre-processed ${cssFiles.length} CSS files for template includes`);
  } catch (error) {
    console.warn('[11ty] Warning: Could not pre-process CSS files:', error.message);
  }
}
