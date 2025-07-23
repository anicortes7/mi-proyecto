import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,     // ⚠️ Asegúrate de tener esto en Vercel y .env.local
  process.env.SUPABASE_ANON_KEY // ⚠️ Asegúrate de tener esto en Vercel y .env.local
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('perfumes').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { name, brand, notes, type, size, wishlist } = req.body;

    const insertData = {
      name,
      brand,
      notes,
    };

    if (type !== undefined) insertData.type = type;
    if (size !== undefined) insertData.size = size;
    if (wishlist !== undefined) insertData.wishlist = wishlist;

    const { data, error } = await supabase
      .from('perfumes')
      .insert([insertData])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
  }

  if (req.method === 'PUT') {
    const { id, type, rating, size, wishlist } = req.body;

    const updateData = {};
    if (type !== undefined) updateData.type = type;
    if (rating !== undefined) updateData.rating = rating;
    if (size !== undefined) updateData.size = size;
    if (wishlist !== undefined) updateData.wishlist = wishlist;

    const { data, error } = await supabase
      .from('perfumes')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data[0]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    const { error } = await supabase.from('perfumes').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ message: 'Perfume eliminado' });
  }
}
