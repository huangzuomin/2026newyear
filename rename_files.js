const fs = require('fs');
const path = require('path');

const dir = 'I:\\2026新年卡\\public\\templates\\T01';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.png')) {
        const oldPath = path.join(dir, file);
        const newName = file.replace(/\s*[+]\s*/g, '_').replace(/\s+/g, '_');
        const newPath = path.join(dir, newName);

        if (oldPath !== newPath) {
            console.log(`Renaming: ${file} -> ${newName}`);
            fs.renameSync(oldPath, newPath);
        }
    }
});
