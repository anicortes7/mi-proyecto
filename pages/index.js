import Head from 'next/head';
import { useEffect, useState } from 'react';
import SearchModal from '../components/SearchModal';
import PerfumeCard from '../components/PerfumeCard';

export default function Home() {
  const [perfumes, setPerfumes] = useState([]);
  const [activeTab, setActiveTab] = useState('collection');
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

  const moveToCollection = async (id) => {
    await fetch('/api/perfumes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, wishlist: false }),
    });
    fetchPerfumes();
  };

  const collection = perfumes.filter((p) => !p.wishlist);
  const wishlist = perfumes.filter((p) => p.wishlist);

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

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'collection' ? 'active' : ''}`}
              onClick={() => setActiveTab('collection')}
            >
              Mi Colección
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              Mi Wishlist
            </button>
          </li>
        </ul>

        {/* Contenido */}
        {activeTab === 'collection' && (
          <>
            {collection.length === 0 && <p>No hay perfumes en tu colección aún.</p>}
            <div className="row">
              {collection.map((perfume) => (
                <PerfumeCard
                  key={perfume.id}
                  perfume={perfume}
                  onDelete={handleDelete}
                  onUpdated={fetchPerfumes}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'wishlist' && (
          <>
            {wishlist.length === 0 && <p>No hay perfumes en tu wishlist aún.</p>}
            <div className="row">
              {wishlist.map((perfume) => (
                <PerfumeCard
                  key={perfume.id}
                  perfume={perfume}
                  onDelete={handleDelete}
                  onUpdated={fetchPerfumes}
                  onMoveToCollection={moveToCollection}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
