import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export default function handler(req,res){
  const filePath = path.join(process.cwd(),'users.json');
  const users = JSON.parse(fs.readFileSync(filePath,'utf8'));

  if(req.method==='GET'){
    return res.status(200).json(users.map(u => ({ username: u.username })));
  }

  if(req.method==='POST'){
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({ message:'Usuario y contraseña requeridos' });
    if(users.find(u => u.username===username)) return res.status(400).json({ message:'Usuario ya existe' });

    const hash = bcrypt.hashSync(password,10);
    users.push({ username, passwordHash: hash });
    fs.writeFileSync(filePath, JSON.stringify(users,null,2));
    return res.status(200).json({ message:'Usuario agregado correctamente' });
  }

  return res.status(405).json({ message:'Método no permitido' });
}
