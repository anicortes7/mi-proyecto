import Head from 'next/head';
import { useEffect, useState } from 'react';
import SearchModal from '../components/SearchModal';

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
            <div key={perfume.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{perfume.name}</h5>
                  <p className="card-text mb-1">
                    <strong>Marca:</strong> {perfume.brand}
                  </p>
                  <p className="card-text mb-3">
                    {perfume.notes?.top && <>Top: {perfume.notes.top}<br /></>}
                    {perfume.notes?.middle && <>Middle: {perfume.notes.middle}<br /></>}
                    {perfume.notes?.base && <>Base: {perfume.notes.base}</>}
                  </p>
                  <button
                    className="btn mt-auto"
                    style={{ backgroundColor: '#c1121f', color: 'white' }}
                    onClick={() => handleDelete(perfume.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
