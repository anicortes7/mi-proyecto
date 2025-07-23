import { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

export default function SearchModal({ show, onClose, onSave }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchAutocomplete = async (input) => {
    if (input.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const res = await fetch('/api/autocomplete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: input }),
    });

    const data = await res.json();

    if (data.perfumes && data.perfumes.length > 0) {
      setSuggestions(data.perfumes);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const debouncedAutocomplete = useCallback(debounce(fetchAutocomplete, 300), []);

  const handleQueryChange = (e) => {
    const input = e.target.value;
    setQuery(input);
    debouncedAutocomplete(input);
  };

  const handleSuggestionClick = (perfume) => {
    setQuery(`${perfume.perfume} - ${perfume.brand}`);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSave(query);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Perfume</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="modal-body position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por perfume, marca o notas"
                value={query}
                onChange={handleQueryChange}
                required
                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                autoFocus
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul
                  className="list-group position-absolute w-100"
                  style={{
                    zIndex: 1050,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    top: '100%',
                    left: 0,
                  }}
                >
                  {suggestions.map((perfume, index) => (
                    <li
                      key={index}
                      className="list-group-item list-group-item-action"
                      onMouseDown={() => handleSuggestionClick(perfume)}
                      style={{ cursor: 'pointer' }}
                    >
                      <strong>{perfume.perfume}</strong> - {perfume.brand} <br />
                      <small>{perfume.notes}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
