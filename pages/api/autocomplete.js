import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

function formatName(slug) {
  if (!slug) return '';
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { query } = req.body;

  if (!query || query.length < 2) {
    return res.status(400).json({ error: 'Se necesita un query' });
  }

  const results = [];
  const filePath = path.join(process.cwd(), 'public', 'data', 'fra_cleaned.csv');

  console.log('Ruta CSV:', filePath);

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const name = row.perfume?.toLowerCase() || '';
      const brand = row.brand?.toLowerCase() || '';
      const notes = row.notes?.toLowerCase() || '';
      const q = query.toLowerCase();

      console.log('Fila:', { name, brand, notes, q });

      if (name.includes(q) || brand.includes(q) || notes.includes(q)) {
        results.push({
          perfume: formatName(row.perfume),
          brand: formatName(row.brand),
          notes: row.notes
            ? row.notes.split(',').map(n => formatName(n.trim()))
            : [],
          id: row.id || row._id || null,
        });
      }
    })
    .on('end', () => {
      console.log('Resultados encontrados:', results);
      res.status(200).json({ perfumes: results.slice(0, 10) });
    })
    .on('error', (err) => {
      console.error('Error:', err);
      res.status(500).json({ error: 'Error procesando el archivo CSV' });
    });
}
