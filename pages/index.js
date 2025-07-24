import Head from 'next/head';
import { useEffect, useState } from 'react';
import SearchModal from '../components/SearchModal';
import Display from '../components/Display';

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
      <main className="container py-5">
        {/* Título + Botón */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">La colección de perfumes de Tomi</h1>
          <button
            className="btn-add-perfume"
            onClick={() => setModalOpen(true)}
          >
            <img
              src="/icons/plus.svg"
              alt="Agregar"
              className="btn-add-icon"
            />
            <span className="fw-bold">Agregar Perfume</span>
          </button>
        </div>

        <SearchModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onPerfumeAdded={fetchPerfumes}
        />

        {/* Contenedor de Tabs */}
        <div className="tabs-wrapper">
          <div className="tabs-custom d-flex mb-4">
            <button
              className={`tab-custom flex-fill text-center py-2 fw-semibold ${activeTab === 'collection' ? 'active' : ''}`}
              onClick={() => setActiveTab('collection')}
            >
              Mi Colección ({collection.length})
            </button>
            <button
              className={`tab-custom flex-fill text-center py-2 fw-semibold ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              Wishlist ({wishlist.length})
            </button>
          </div>
        </div>

        <Display
          perfumes={perfumes}
          activeTab={activeTab}
          onDelete={handleDelete}
          onUpdated={fetchPerfumes}
          onMoveToCollection={moveToCollection}
        />
      </main>
    </>
  );
}
