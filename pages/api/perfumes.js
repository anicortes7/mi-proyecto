import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,     // ⚠️ PONER ESTO EN VERCEL Y .env.local
  process.env.SUPABASE_ANON_KEY // ⚠️ PONER ESTO EN VERCEL Y .env.local
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('perfumes').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { name, brand, notes } = req.body;
    const { data, error } = await supabase
      .from('perfumes')
      .insert([{ name, brand, notes }])
      .select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  if (req.method === 'PUT') {
    const { id, type } = req.body;
    const { data, error } = await supabase
      .from('perfumes')
      .update({ type })
      .eq('id', id)
      .select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data[0]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    const { error } = await supabase.from('perfumes').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Perfume eliminado' });
  }

  // Si no coincide ningún método permitido
  return res.status(405).json({ error: 'Método no permitido' });
}
