import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { query } = req.body;

  if (!query || query.length < 2) {
    return res.status(400).json({ error: 'Query muy corto' });
  }

  const filePath = path.join(process.cwd(), 'public', 'data', 'fra_cleaned.csv');
  const file = fs.readFileSync(filePath, 'utf8');

  const parsed = Papa.parse(file, { header: true }).data;

  const results = parsed.filter(row => {
    const perfume = (row.Perfume || '').toLowerCase().replace(/-/g, ' ');
    const brand = (row.Brand || '').toLowerCase().replace(/-/g, ' ');
    const top = (row.Top || '').toLowerCase();
    const middle = (row.Middle || '').toLowerCase();
    const base = (row.Base || '').toLowerCase();
    const q = query.toLowerCase();

    return (
      perfume.includes(q) ||
      brand.includes(q) ||
      top.includes(q) ||
      middle.includes(q) ||
      base.includes(q)
    );
  });

  const formatted = results.map(row => ({
    perfume: row.Perfume?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '',
    brand: row.Brand?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '',
    notes: {
      top: row.Top || '',
      middle: row.Middle || '',
      base: row.Base || '',
    },
  }));

  res.status(200).json({ perfumes: formatted });
}
