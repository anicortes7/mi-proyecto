import Head from 'next/head';
import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

export default function Home() {
  const [perfumes, setPerfumes] = useState([]);
  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchPerfumes = async () => {
    const res = await fetch('/api/perfumes');
    const data = await res.json();
    setPerfumes(data);
  };

  useEffect(() => {
    fetchPerfumes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/perfumes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: query, brand, notes }),
    });
    setQuery('');
    setBrand('');
    setNotes('');
    setSuggestions([]);
    setShowSuggestions(false);
    fetchPerfumes();
  };

  const handleDelete = async (id) => {
    await fetch('/api/perfumes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchPerfumes();
  };

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
    console.log('Datos recibidos:', data);

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
    setQuery(perfume.name || '');
    setBrand(perfume.brand || '');
    setNotes(perfume.notes || '');
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

        <form className="row g-3 mb-4" onSubmit={handleSubmit} autoComplete="off">
          <div className="col-md-4 position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Perfume, marca o notas"
              value={query}
              onChange={handleQueryChange}
              required
              onFocus={() => query.length >= 2 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul
                className="list-group position-absolute w-100"
                style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
              >
                {suggestions.map((perfume, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action"
                    onMouseDown={() => handleSuggestionClick(perfume)}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>{perfume.name}</strong> - {perfume.brand}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Marca"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Notas"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Agregar Perfume
            </button>
          </div>
        </form>

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
