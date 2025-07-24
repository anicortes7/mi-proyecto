import { useState } from 'react';

export default function PerfumeCard({ perfume, onDelete, onUpdated, onMoveToCollection }) {
  const [showEdit, setShowEdit] = useState(false);
  const [newType, setNewType] = useState(perfume.type || '');
  const [newSize, setNewSize] = useState(perfume.size || '');
  const [rating, setRating] = useState(perfume.rating || 0);

  const handleUpdate = async () => {
    await fetch('/api/perfumes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: perfume.id, type: newType, size: newSize }),
    });
    setShowEdit(false);
    onUpdated();
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
      <div className="card h-100 shadow-sm d-flex flex-column">
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
                onClick={() => handleRating(star)}
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

          <div className="mt-auto d-flex justify-content-end gap-2 pt-3">
            <button
              className="btn btn-sm btn-secondary"
              style={{ color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
              onClick={() => setShowEdit(true)}
            >
              Editar
            </button>
            <button
              className="btn btn-sm btn-delete"
              onClick={() => onDelete(perfume.id)}
            >
              Eliminar
            </button>
          </div>

          {perfume.wishlist && onMoveToCollection && (
            <div className="mt-2 d-flex justify-content-end">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => onMoveToCollection(perfume.id)}
              >
                Mover a Colección
              </button>
            </div>
          )}
        </div>
      </div>

      {showEdit && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Detalles</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEdit(false)}
                ></button>
              </div>
              <div className="modal-body">
                <select
                  className="form-select mb-3"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="EDT">Eau de Toilette (EDT)</option>
                  <option value="EDP">Eau de Parfum (EDP)</option>
                  <option value="Parfum">Parfum</option>
                  <option value="Cologne">Cologne</option>
                  <option value="Mist">Body Mist</option>
                </select>

                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Tamaño (ml)"
                  value={newSize}
                  onChange={(e) => setNewSize(Number(e.target.value))}
                />

                <button className="btn btn-primary" onClick={handleUpdate}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
