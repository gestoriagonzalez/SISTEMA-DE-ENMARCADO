import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export default function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).json({ message:'Método no permitido' });

  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ message:'Usuario y contraseña requeridos' });

  const filePath = path.join(process.cwd(), 'users.json');
  const users = JSON.parse(fs.readFileSync(filePath,'utf8'));

  const user = users.find(u => u.username === username);
  if(user && bcrypt.compareSync(password, user.passwordHash)){
    res.status(200).json({ ok:true, role: username==='admin'?'admin':'user' });
  } else {
    res.status(401).json({ ok:false, message:'Usuario o contraseña incorrectos' });
  }
}
const filePath = path.join(process.cwd(),'users.json');
const users = JSON.parse(fs.readFileSync(filePath,'utf8'));
console.log('Usuarios leídos:', users);
console.log('Datos recibidos:', username, password);
