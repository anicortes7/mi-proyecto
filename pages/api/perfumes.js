import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,     // ✅ Configurado en Vercel y .env.local
  process.env.SUPABASE_ANON_KEY // ✅ Configurado en Vercel y .env.local
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('perfumes').select('*');
    if (error) {
      console.error('GET error:', error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    try {
      const { name, brand, notes, type, size, wishlist } = req.body;

      console.log('POST body:', req.body);

      // Validar valores
      if (!name || !brand) {
        console.error('Validation error: name or brand missing');
        return res.status(400).json({ error: 'Name and brand are required' });
      }

      const insertData = {
        name,
        brand,
        notes, // Asegúrate que notes es un objeto válido si la columna es JSONB
      };

      if (type !== undefined) insertData.type = type;
      if (size !== undefined) insertData.size = size;
      if (wishlist !== undefined) insertData.wishlist = !!wishlist; // ⚡️ Fuerza booleano

      console.log('Insert data:', insertData);

      const { data, error } = await supabase
        .from('perfumes')
        .insert([insertData])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data[0]);
    } catch (err) {
      console.error('Unexpected POST error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, type, rating, size, wishlist } = req.body;

      console.log('PUT body:', req.body);

      const updateData = {};
      if (type !== undefined) updateData.type = type;
      if (rating !== undefined) updateData.rating = rating;
      if (size !== undefined) updateData.size = size;
      if (wishlist !== undefined) updateData.wishlist = !!wishlist;

      console.log('Update data:', updateData);

      const { data, error } = await supabase
        .from('perfumes')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data[0]);
    } catch (err) {
      console.error('Unexpected PUT error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      console.log('DELETE id:', id);

      const { error } = await supabase.from('perfumes').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ message: 'Perfume eliminado' });
    } catch (err) {
      console.error('Unexpected DELETE error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Método no permitido
  return res.status(405).json({ error: 'Method not allowed' });
}
