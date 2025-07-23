import Head from 'next/head';
import { useEffect, useState } from 'react';
import SearchModal from '../components/SearchModal';
import PerfumeCard from '../components/PerfumeCard'; // Importa acá

export default function Home() {
  const [perfumes, setPerfumes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPerfumes = async () => {
    const res = await fetch('/api/perfumes');
    const data = await res.json();
    setPerfumes(data);
  };

  useEffect(() => {
    fetchPerfumes();
  }, []);

  const handleDelete = async (id) => {
    await fetch('/api/perfumes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchPerfumes();
  };

  return (
    <>
      <Head>
        <title>Mi Colección de Perfumes</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </Head>
      <main className="container py-5" style={{ backgroundColor: '#FDF0D5' }}>
        <h1 className="mb-4">La colección de perfumes de Tomi</h1>

        <button className="btn btn-primary mb-4" onClick={() => setModalOpen(true)}>
          Agregar Perfume
        </button>

        <SearchModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onPerfumeAdded={fetchPerfumes}
        />

        {perfumes.length === 0 && <p>No hay perfumes guardados aún.</p>}

        <div className="row">
          {perfumes.map((perfume) => (
            <PerfumeCard key={perfume.id} perfume={perfume} onDelete={handleDelete} />
          ))}
        </div>
      </main>
    </>
  );
}
