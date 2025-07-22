// api/perfumes.js

let perfumes = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(perfumes);
  } else if (req.method === 'POST') {
    const { name, brand, notes } = req.body;
    if (!name || !brand) {
      res.status(400).json({ error: 'Faltan campos obligatorios' });
      return;
    }
    const perfume = { name, brand, notes: notes || '' };
    perfumes.push(perfume);
    res.status(201).json({ message: 'Perfume agregado', perfume });
  } else if (req.method === 'DELETE') {
    const { index } = req.body;
    if (index >= 0 && index < perfumes.length) {
      perfumes.splice(index, 1);
      res.status(200).json({ message: 'Perfume eliminado' });
    } else {
      res.status(400).json({ error: 'Índice inválido' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
