import { useState } from 'react';

export default function PerfumeCard({ perfume, onDelete, onUpdated }) {
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

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm position-relative">
        {perfume.type && (
          <span
            className="badge bg-primary position-absolute"
            style={{ top: '10px', right: '10px', fontWeight: 'normal' }}
          >
            {perfume.type}
          </span>
        )}

        {perfume.size && (
          <span
            className="badge bg-secondary position-absolute"
            style={{ top: perfume.type ? '40px' : '10px', right: '10px', fontWeight: 'normal' }}
          >
            {perfume.size} ml
          </span>
        )}

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{perfume.name}</h5>
          <p className="card-text mb-1">{perfume.brand}</p>

          <p className="card-text mb-1">
            {perfume.notes?.top && (
              <>
                <strong>Top:</strong> {perfume.notes.top}
                <br />
              </>
            )}
            {perfume.notes?.middle && (
              <>
                <strong>Middle:</strong> {perfume.notes.middle}
                <br />
              </>
            )}
            {perfume.notes?.base && (
              <>
                <strong>Base:</strong> {perfume.notes.base}
              </>
            )}
          </p>

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

          <div className="mt-auto d-flex justify-content-between">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowEdit(true)}
            >
              Editar
            </button>
            <button
              className="btn btn-sm"
              style={{ backgroundColor: '#c1121f', color: 'white' }}
              onClick={() => onDelete(perfume.id)}
            >
              Eliminar
            </button>
          </div>
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
