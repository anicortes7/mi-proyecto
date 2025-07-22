export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { name, brand } = req.body;

  const response = await fetch('https://YOUR_RAPIDAPI_ENDPOINT_HERE', {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'YOUR_RAPIDAPI_HOST',
    },
  });

  const data = await response.json();

  // Devuelve solo lo necesario
  return res.status(200).json({
    notes: data.notes,
    image: data.image,
  });
}
