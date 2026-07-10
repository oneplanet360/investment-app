const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace ../../services/adminX with ../../services/admin/adminX
    content = content.replace(/from "(\.\.\/\.\.\/services)\/(admin[a-zA-Z0-9_]+)/g, 'from "$1/admin/$2');
    content = content.replace(/from '(\.\.\/\.\.\/services)\/(admin[a-zA-Z0-9_]+)/g, "from '$1/admin/$2");
    
    // Replace ../../../services/adminX with ../../../services/admin/adminX
    content = content.replace(/from "(\.\.\/\.\.\/\.\.\/services)\/(admin[a-zA-Z0-9_]+)/g, 'from "$1/admin/$2');
    content = content.replace(/from '(\.\.\/\.\.\/\.\.\/services)\/(admin[a-zA-Z0-9_]+)/g, "from '$1/admin/$2");
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
