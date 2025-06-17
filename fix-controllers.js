const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'src', 'controller');
const files = fs.readdirSync(controllersDir);

files.forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(controllersDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Substitui todos os return res.status
    content = content.replace(/return res\.status/g, 'res.status');
    
    // Adiciona tipagem Promise<void> a todas as funções de controlador
    content = content.replace(/export const (\w+) = async \(req: Request, res: Response\) =>/g, 
                              'export const $1 = async (req: Request, res: Response): Promise<void> =>');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Arquivo ${file} atualizado.`);
  }
});

console.log('Todos os controladores foram atualizados com sucesso.');
