import https from 'https';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Ejemplo: recibís un perfumeId por query o parámetro
  // Acá pongo un perfumeId fijo porque en tu ejemplo usan un path con id
  const perfumeId = req.query.id || '66c70dee71fb63515fcfa1bf';

  const options = {
    method: 'GET',
    hostname: 'fragrancefinder-api.p.rapidapi.com',
    path: `/dupes/${perfumeId}`,
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
        // Mandá lo que necesites, por ej:
        res.status(200).json({
          notes: data.notes || '',
          image: data.image || '',
          // agrega más campos según la respuesta real
        });
      } catch (e) {
        res.status(500).json({ error: 'Error parseando la respuesta de la API' });
      }
    });
  });

  request.on('error', (error) => {
    res.status(500).json({ error: error.message });
  });

  request.end();
}
