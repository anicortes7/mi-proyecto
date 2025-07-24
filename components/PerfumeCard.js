import { useState } from 'react';

export default function PerfumeCard({ perfume, onDelete, onUpdated, onMoveToCollection }) {
  const [showModal, setShowModal] = useState(false);
  const [newType, setNewType] = useState(perfume.type || '');
  const [newSize, setNewSize] = useState(perfume.size || '');
  const [rating, setRating] = useState(perfume.rating || 0);

  const handleUpdate = async () => {
    await fetch('/api/perfumes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: perfume.id, type: newType, size: newSize }),
    });
    setShowModal(false);
    onUpdated();
  };

  const handleDelete = async () => {
    await onDelete(perfume.id);
    setShowModal(false);
  };

  const handleRating = async (newRating) => {
    setRating(newRating);
    await fetch('/api/perfumes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: perfume.id, rating: newRating }),
    });
    onUpdated();
  };

  const capitalizeList = (text) => {
    if (!text) return '';
    return text
      .split(',')
      .map((part) => part.trim())
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(', ');
  };

  return (
    <div className="col-md-4 mb-4">
      <div
        className="card h-100 shadow-sm d-flex flex-column cursor-pointer"
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
                <span><strong>Top:</strong> {capitalizeList(perfume.notes.top)}</span>
              </div>
            )}
            {perfume.notes?.middle && (
              <div className="d-flex align-items-center mb-1">
                <img src="/icons/middle.svg" alt="Middle" style={{ width: '16px', marginRight: '6px' }} />
                <span><strong>Middle:</strong> {capitalizeList(perfume.notes.middle)}</span>
              </div>
            )}
            {perfume.notes?.base && (
              <div className="d-flex align-items-center">
                <img src="/icons/base.svg" alt="Base" style={{ width: '16px', marginRight: '6px' }} />
                <span><strong>Base:</strong> {capitalizeList(perfume.notes.base)}</span>
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
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{perfume.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Marca:</strong> {perfume.brand}</p>
                <p><strong>Tipo:</strong> {perfume.type}</p>
                <p><strong>Tamaño:</strong> {perfume.size} ml</p>
                <p><strong>Notas:</strong></p>
                {perfume.notes?.top && (
                  <p>🌿 <strong>Top:</strong> {capitalizeList(perfume.notes.top)}</p>
                )}
                {perfume.notes?.middle && (
                  <p>🌸 <strong>Middle:</strong> {capitalizeList(perfume.notes.middle)}</p>
                )}
                {perfume.notes?.base && (
                  <p>🌲 <strong>Base:</strong> {capitalizeList(perfume.notes.base)}</p>
                )}

                <div className="d-flex justify-content-end gap-3">
                  <button
                    onClick={handleUpdate}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <img src="/icons/editar.svg" alt="Editar" style={{ width: '24px' }} />
                  </button>
                  <button
                    onClick={handleDelete}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <img src="/icons/eliminar.svg" alt="Eliminar" style={{ width: '24px' }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
