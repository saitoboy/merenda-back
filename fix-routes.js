const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'src', 'routes');
const files = fs.readdirSync(routesDir);

files.forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(routesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Garante que a importação do Router está correta
    if (!content.includes("import { Router } from 'express';")) {
      content = content.replace(/import .* from ['"]express['"];?/, "import { Router } from 'express';");
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Arquivo ${file} verificado e corrigido se necessário.`);
  }
});

console.log('Todos os arquivos de rota foram verificados.');
