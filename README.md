# Perfume Tracker con Supabase

Pequeño proyecto Node.js + Supabase + Vercel para trackear perfumes.

## 🚀 Deploy

1. Sube este proyecto a GitHub.
2. Crea una cuenta en [Vercel](https://vercel.com/) y conéctalo a tu repo.
3. Configura en **Vercel → Settings → Environment Variables**:
   - `SUPABASE_URL` → tu URL de Supabase
   - `SUPABASE_ANON_KEY` → tu clave pública
4. Crea la tabla `perfumes` en Supabase:
   - `id` bigint, primary key, auto increment
   - `name` text
   - `brand` text
   - `notes` text
5. Haz deploy 🚀

✅ **Todo guardado en la nube**, disponible desde cualquier dispositivo.
