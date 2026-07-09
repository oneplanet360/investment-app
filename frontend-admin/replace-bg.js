const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let count = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  if (content.includes('bg-[#f0f2f8]')) {
    content = content.replace(/bg-\[#f0f2f8\]/g, 'bg-[var(--theme-bg)]');
    modified = true;
  }
  
  if (content.includes('bg-[#0d1b4b]')) {
    content = content.replace(/bg-\[#0d1b4b\]/g, 'bg-[var(--theme-sidebar)]');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(file, content);
    count++;
  }
});

console.log(`Updated ${count} files.`);
