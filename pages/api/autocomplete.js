import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { query } = req.body;

  if (!query || query.length < 2) {
    return res.status(400).json({ error: 'Se necesita un query de al menos 2 caracteres' });
  }

  const search = query.trim().toLowerCase();
  const results = [];
  const filePath = path.join(process.cwd(), 'public', 'data', 'fra_cleaned.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const perfume = (row.Perfume || '').trim().toLowerCase();
      const brand = (row.Brand || '').trim().toLowerCase();

      if (perfume.includes(search) || brand.includes(search)) {
        const notes = [row.Top, row.Middle, row.Base].filter(Boolean).join(', ');
        const formatted = {
          name: formatString(row.Perfume),
          brand: formatString(row.Brand),
          notes: formatString(notes),
        };
        console.log('Fila que matchea:', formatted);
        results.push(formatted);
      }
    })
    .on('end', () => {
      console.log('Resultados finales:', results);
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
