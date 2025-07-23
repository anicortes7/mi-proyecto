import { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

export default function SearchModal({ isOpen, onClose, onPerfumeAdded }) {
  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState({ top: '', middle: '', base: '' });
  const [type, setType] = useState('');
  const [size, setSize] = useState(undefined);
  const [wishlist, setWishlist] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const fetchAutocomplete = async (input) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    const res = await fetch('/api/autocomplete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: input }),
    });

    const data = await res.json();
    console.log('Datos recibidos:', data);

    if (data.perfumes && data.perfumes.length > 0) {
      setSuggestions(data.perfumes);
    } else {
      setSuggestions([]);
    }
  };

  const debouncedAutocomplete = useCallback(debounce(fetchAutocomplete, 300), []);

  const handleQueryChange = (e) => {
    const input = e.target.value;
    setQuery(input);
    debouncedAutocomplete(input);
  };

  const handleSuggestionClick = (perfume) => {
    setQuery(perfume.perfume || '');
    setBrand(perfume.brand || '');
    setNotes({
      top: perfume.notes?.top || '',
      middle: perfume.notes?.middle || '',
      base: perfume.notes?.base || '',
    });
    setWishlist(perfume.wishlist || false);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/perfumes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: query, brand, notes, type, size, wishlist }),
    });
    setQuery('');
    setBrand('');
    setNotes({ top: '', middle: '', base: '' });
    setType('');
    setSize(undefined);
    setWishlist(false);
    setSuggestions([]);
    onPerfumeAdded();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Perfume</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="mb-3 position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Perfume, marca o notas"
                  value={query}
                  onChange={handleQueryChange}
                  required
                />
                {suggestions.length > 0 && (
                  <ul
                    className="list-group position-absolute w-100"
                    style={{
                      zIndex: 1000,
                      maxHeight: '200px',
                      overflowY: 'auto',
                      backgroundColor: 'var(--color-bg)',
                    }}
                  >
                    {suggestions.map((perfume, index) => (
                      <li
                        key={index}
                        className="list-group-item list-group-item-action"
                        onMouseDown={() => handleSuggestionClick(perfume)}
                        style={{ cursor: 'pointer' }}
                      >
                        <strong>{perfume.perfume}</strong> - {perfume.brand}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {brand && (
                <div className="mb-3">
                  <p className="mb-0">
                    <strong>Marca:</strong> {brand}
                  </p>
                </div>
              )}

              <select
                className="form-select mb-3"
                value={type}
                onChange={(e) => setType(e.target.value)}
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
                value={size || ''}
                onChange={(e) =>
                  e.target.value === ''
                    ? setSize(undefined)
                    : setSize(Number(e.target.value))
                }
              />

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="wishlistCheck"
                  checked={wishlist}
                  onChange={(e) => setWishlist(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="wishlistCheck">
                  Añadir a Wishlist
                </label>
              </div>

              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
