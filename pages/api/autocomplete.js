import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { query } = req.body;

  if (!query || query.length < 3) {
    return res.status(400).json({ error: 'Se necesita un query de al menos 3 caracteres' });
  }

  const results = [];
  const filePath = path.join(process.cwd(), 'public', 'data', 'fra_cleaned.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const perfume = row.Perfume?.toLowerCase() || '';
      const brand = row.Brand?.toLowerCase() || '';

      const notes = [row.Top, row.Middle, row.Base]
        .filter(Boolean)
        .join(', ');

      if (perfume.includes(query.toLowerCase()) || brand.includes(query.toLowerCase())) {
        results.push({
          name: formatString(row.Perfume),
          brand: formatString(row.Brand),
          notes: formatString(notes),
        });
      }
    })
    .on('end', () => {
      console.log('Resultados encontrados:', results);
      res.status(200).json({ perfumes: results });
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).json({ error: 'Error leyendo CSV' });
    });
}

function formatString(str) {
  if (!str) return '';
  return str
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}
