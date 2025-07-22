import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL; // ✅ usa variable de entorno
const supabaseKey = process.env.SUPABASE_ANON_KEY; // ✅ usa variable de entorno
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('perfumes').select('*');
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { name, brand, notes } = req.body;
    if (!name || !brand) {
      return res.status(400).json({ error: 'Faltan campos' });
    }
    const { data, error } = await supabase.from('perfumes').insert([
      { name, brand, notes }
    ]).select();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data[0]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Falta id' });
    }
    const { error } = await supabase.from('perfumes').delete().eq('id', id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ message: 'Perfume eliminado' });
  }

  if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
