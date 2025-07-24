import { useState } from 'react';

export default function CardModal({ perfume, onClose, onDelete, onUpdated }) {
  const [newType, setNewType] = useState(perfume.type || '');
  const [newSize, setNewSize] = useState(perfume.size || '');

  const handleUpdate = async () => {
    await fetch('/api/perfumes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: perfume.id, type: newType, size: newSize }),
    });
    onClose();
    onUpdated();
  };

  const handleDelete = async () => {
    await onDelete(perfume.id);
    onClose();
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
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{perfume.name}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p><strong>Marca:</strong> {perfume.brand}</p>
            <p><strong>Tipo:</strong> {perfume.type}</p>
            <p><strong>Tamaño:</strong> {perfume.size} ml</p>

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

            <div className="d-flex justify-content-end gap-1 mt-4">
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
  );
}
