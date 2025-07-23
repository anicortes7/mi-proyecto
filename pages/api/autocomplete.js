import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { query } = req.body;

  if (!query || query.length < 2) {
    return res.status(400).json({ error: 'Query demasiado corto' });
  }

  const filePath = path.join(process.cwd(), 'public', 'data', 'fra_cleaned.csv');
  const csv = fs.readFileSync(filePath, 'utf8');
  const parsed = Papa.parse(csv, { header: true });

  const results = [];

  parsed.data.forEach((row) => {
    const perfume = row.Perfume || '';
    const brand = row.Brand || '';
    const top = row.Top || '';
    const middle = row.Middle || '';
    const base = row.Base || '';

    const notes = [top, middle, base].filter(Boolean).join(', ');

    // Match simple: query contenido en perfume, brand o notes
    const q = query.toLowerCase();
    if (
      perfume.toLowerCase().includes(q) ||
      brand.toLowerCase().includes(q) ||
      notes.toLowerCase().includes(q)
    ) {
      results.push({
        name: formatString(perfume),
        brand: formatString(brand),
        notes: formatString(notes),
      });
    }
  });

  console.log('Resultados finales:', results);

  res.status(200).json({ perfumes: results.slice(0, 10) }); // Limita a 10 sugerencias
}

function formatString(str) {
  return str
    .split('-')
    .join(' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}
