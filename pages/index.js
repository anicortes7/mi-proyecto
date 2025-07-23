import Head from 'next/head';
import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

export default function Home() {
  const [perfumes, setPerfumes] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Carga perfumes guardados
  const fetchPerfumes = async () => {
    const res = await fetch('/api/perfumes');
    const data = await res.json();
    setPerfumes(data);
  };

  useEffect(() => {
    fetchPerfumes();
  }, []);

  // Submit para guardar perfume
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/perfumes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: query }),
    });
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setShowModal(false);
    fetchPerfumes();
  };

  // Borrar perfume
  const handleDelete = async (id) => {
    await fetch('/api/perfumes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchPerfumes();
  };

  // Traer sugerencias autocomplete
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

        {/* Botón para abrir modal */}
        <button
          className="btn btn-primary mb-4"
          onClick={() => setShowModal(true)}
        >
          Agregar Perfume
        </button>

        {/* Modal */}
        {showModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowModal(false)} // Cierra modal si clickeás afuera
          >
            <div
              className="modal-dialog"
              role="document"
              onClick={(e) => e.stopPropagation()} // Evita cerrar modal al click dentro
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Agregar Perfume</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowModal(false)}
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
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Lista de perfumes */}
        {perfumes.length === 0 && <p>No hay perfumes guardados aún.</p>}

        <div className="row">
          {perfumes.map((perfume) => (
            <div key={perfume.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{perfume.name}</h5>
                  <p className="card-text mb-1">
                    <strong>Marca:</strong> {perfume.brand}
                  </p>
                  <p className="card-text mb-3">
                    <strong>Notas:</strong> {perfume.notes || '-'}
                  </p>
                  <button
                    className="btn mt-auto"
                    style={{ backgroundColor: '#c1121f', color: 'white' }}
                    onClick={() => handleDelete(perfume.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
