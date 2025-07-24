import { useState } from 'react';
import CardModal from './CardModal';

export default function PerfumeCard({ perfume, onDelete, onUpdated, onMoveToCollection }) {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(perfume.rating || 0);

  const handleRating = async (newRating) => {
    setRating(newRating);
    await fetch('/api/perfumes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: perfume.id, rating: newRating }),
    });
    onUpdated();
  };

  return (
    <div className="col-md-4 mb-4">
      <div
        className="card h-100 shadow-sm d-flex flex-column"
        style={{ cursor: 'pointer' }}
        onClick={() => setShowModal(true)}
      >
        <div className="card-body d-flex flex-column flex-grow-1 pb-2">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h5 className="card-title mb-0">{perfume.name}</h5>
            <div className="d-flex flex-column align-items-end">
              {perfume.type && (
                <span
                  className="badge mb-1"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#fff',
                    fontWeight: 'normal',
                  }}
                >
                  {perfume.type}
                </span>
              )}
              {perfume.size && (
                <span
                  className="badge"
                  style={{
                    backgroundColor: 'var(--color-secondary)',
                    color: '#fff',
                    fontWeight: 'normal',
                  }}
                >
                  {perfume.size} ml
                </span>
              )}
            </div>
          </div>

          <p className="card-text mb-1">{perfume.brand}</p>

          <div className="mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRating(star);
                }}
                style={{
                  cursor: 'pointer',
                  color: star <= rating ? '#FFD700' : '#CCC',
                  fontSize: '1.5rem',
                }}
              >
                ★
              </span>
            ))}
          </div>

          <div className="mb-3">
            {perfume.notes?.top && (
              <div className="d-flex align-items-center mb-1">
                <img src="/icons/top.svg" alt="Top" style={{ width: '16px', marginRight: '6px' }} />
                <span><strong>Top:</strong> {perfume.notes.top}</span>
              </div>
            )}
            {perfume.notes?.middle && (
              <div className="d-flex align-items-center mb-1">
                <img src="/icons/middle.svg" alt="Middle" style={{ width: '16px', marginRight: '6px' }} />
                <span><strong>Middle:</strong> {perfume.notes.middle}</span>
              </div>
            )}
            {perfume.notes?.base && (
              <div className="d-flex align-items-center">
                <img src="/icons/base.svg" alt="Base" style={{ width: '16px', marginRight: '6px' }} />
                <span><strong>Base:</strong> {perfume.notes.base}</span>
              </div>
            )}
          </div>

          {perfume.wishlist && onMoveToCollection && (
            <div className="mt-2 d-flex justify-content-end">
              <button
                className="btn btn-sm btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveToCollection(perfume.id);
                }}
              >
                Mover a Colección
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <CardModal
          perfume={perfume}
          onClose={() => setShowModal(false)}
          onDelete={onDelete}
          onUpdated={onUpdated}
        />
      )}
    </div>
  );
}
