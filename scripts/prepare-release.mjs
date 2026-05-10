import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const siteUrl = (process.env.SITE_URL || '').trim().replace(/\/$/, '');

if (!siteUrl || !/^https?:\/\//i.test(siteUrl)) {
  console.error('SITE_URL inválida. Exemplo: SITE_URL=https://seu-dominio.com npm run release:prepare');
  process.exit(1);
}

const files = ['index.html', 'robots.txt', 'sitemap.xml'];

for (const file of files) {
  const filePath = resolve(root, file);
  const content = await readFile(filePath, 'utf8');
  const replaced = content.replaceAll('__SITE_URL__', siteUrl);
  await writeFile(filePath, replaced, 'utf8');
}

console.log(`Release metadata preparada com SITE_URL=${siteUrl}`);
