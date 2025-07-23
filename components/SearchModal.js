import { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

export default function SearchModal({ show, handleClose, handleAddPerfume }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState('');

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
    setNotes(perfume.notes || '');
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddPerfume({
      name: query,
      brand: brand,
      notes: notes,
    });
    setQuery('');
    setBrand('');
    setNotes('');
    handleClose();
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="modal-header">
              <h5 className="modal-title">Agregar Perfume</h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Perfume, marca o notas"
                value={query}
                onChange={handleQueryChange}
                required
              />
              {suggestions.length > 0 && (
                <ul className="list-group">
                  {suggestions.map((perfume, index) => (
                    <li
                      key={index}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleSuggestionClick(perfume)}
                      style={{ cursor: 'pointer' }}
                    >
                      <strong>{perfume.perfume}</strong> - {perfume.brand}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
