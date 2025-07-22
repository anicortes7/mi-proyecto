import https from 'https';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { query } = req.body; // El texto que buscás para autocomplete

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
      console.log('Respuesta raw API:', body); // Log para ver respuesta cruda
      try {
        const data = JSON.parse(body);
        console.log('Datos parseados:', data); // Log para ver datos parseados
        // Mandamos perfumes para que el frontend muestre sugerencias
        res.status(200).json({ perfumes: data.perfumes || [] });
      } catch (e) {
        console.error('Error parseando respuesta de la API:', e);
        res.status(500).json({ error: 'Error parseando respuesta de la API' });
      }
    });
  });

  request.on('error', (error) => {
    console.error('Error en la petición a la API externa:', error);
    res.status(500).json({ error: error.message });
  });

  request.end();
}
