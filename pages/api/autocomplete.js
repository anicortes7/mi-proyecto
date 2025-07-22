import https from 'https';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { query } = req.body;

  if (!query || query.length < 3) {
    return res.status(400).json({ error: 'Se necesita un query de al menos 3 caracteres' });
  }

  const options = {
    method: 'GET',
    hostname: 'fragrancefinder-api.p.rapidapi.com',
    path: `/perfumes/search?q=${encodeURIComponent(query)}`,
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'fragrancefinder-api.p.rapidapi.com',
    },
  };

  const request = https.request(options, (response) => {
    let chunks = [];

    response.on('data', (chunk) => {
      chunks.push(chunk);
    });

    response.on('end', () => {
      const body = Buffer.concat(chunks).toString();
      try {
        const data = JSON.parse(body);
        res.status(200).json({ perfumes: data || [] }); // envio el array completo
      } catch (e) {
        res.status(500).json({ error: 'Error parseando respuesta de la API' });
      }
    });
  });

  request.on('error', (error) => {
    res.status(500).json({ error: error.message });
  });

  request.end();
}
