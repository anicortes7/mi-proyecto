import PerfumeCard from './PerfumeCard';

export default function Display({
  perfumes,
  activeTab,
  onDelete,
  onUpdated,
  onMoveToCollection,
}) {
  const collection = perfumes.filter((p) => !p.wishlist);
  const wishlist = perfumes.filter((p) => p.wishlist);

  return (
    <>
      {activeTab === 'collection' && (
        <>
          {collection.length === 0 && <p>No hay perfumes en tu colección aún.</p>}
          <div className="row">
            {collection.map((perfume) => (
              <PerfumeCard
                key={perfume.id}
                perfume={perfume}
                onDelete={onDelete}
                onUpdated={onUpdated}
              />
            ))}
          </div>
        </>
      )}

      {activeTab === 'wishlist' && (
        <>
          {wishlist.length === 0 && <p>No hay perfumes en tu wishlist aún.</p>}
          <div className="row">
            {wishlist.map((perfume) => (
              <PerfumeCard
                key={perfume.id}
                perfume={perfume}
                onDelete={onDelete}
                onUpdated={onUpdated}
                onMoveToCollection={onMoveToCollection}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
