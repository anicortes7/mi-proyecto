export default function PerfumeCard({ perfume, onDelete }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{perfume.name}</h5>
          <p className="card-text mb-1">
            <strong>Marca:</strong> {perfume.brand}
          </p>
          <p className="card-text mb-3">
            {perfume.notes?.top && <>Top: {perfume.notes.top}<br /></>}
            {perfume.notes?.middle && <>Middle: {perfume.notes.middle}<br /></>}
            {perfume.notes?.base && <>Base: {perfume.notes.base}</>}
          </p>
          <button
            className="btn mt-auto"
            style={{ backgroundColor: '#c1121f', color: 'white' }}
            onClick={() => onDelete(perfume.id)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
