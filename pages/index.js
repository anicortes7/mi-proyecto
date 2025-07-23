import Head from 'next/head';
import { useEffect, useState } from 'react';
import SearchModal from '../components/SearchModal';
import PerfumeCard from '../components/PerfumeCard';

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

  // Separar perfumes en wishlist y colección
  const wishlistPerfumes = perfumes.filter(p => p.wishlist);
  const collectionPerfumes = perfumes.filter(p => !p.wishlist);

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

        {/* Sección Wishlist */}
        <section className="mb-5">
          <h2>Wishlist</h2>
          {wishlistPerfumes.length === 0 ? (
            <p>No hay perfumes en la wishlist.</p>
          ) : (
            <div className="row">
              {wishlistPerfumes.map((perfume) => (
                <PerfumeCard
                  key={perfume.id}
                  perfume={perfume}
                  onDelete={handleDelete}
                  onUpdated={fetchPerfumes}
                />
              ))}
            </div>
          )}
        </section>

        {/* Sección Colección */}
        <section>
          <h2>Perfumes en la colección</h2>
          {collectionPerfumes.length === 0 ? (
            <p>No hay perfumes guardados aún.</p>
          ) : (
            <div className="row">
              {collectionPerfumes.map((perfume) => (
                <PerfumeCard
                  key={perfume.id}
                  perfume={perfume}
                  onDelete={handleDelete}
                  onUpdated={fetchPerfumes}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
