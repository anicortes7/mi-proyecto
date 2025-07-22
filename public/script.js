const form = document.getElementById('perfume-form');
const perfumeList = document.getElementById('perfume-list');

async function fetchPerfumes() {
  const res = await fetch('/api/perfumes');
  const perfumes = await res.json();
  perfumeList.innerHTML = '';
  perfumes.forEach((perfume, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${perfume.name}</td>
      <td>${perfume.brand}</td>
      <td>${perfume.notes}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deletePerfume(${index})">Eliminar</button></td>
    `;
    perfumeList.appendChild(row);
  });
}

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('perfumeName').value.trim();
  const brand = document.getElementById('perfumeBrand').value.trim();
  const notes = document.getElementById('perfumeNotes').value.trim();

  await fetch('/api/perfumes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, brand, notes })
  });

  form.reset();
  fetchPerfumes();
});

async function deletePerfume(index) {
  await fetch('/api/perfumes', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ index })
  });
  fetchPerfumes();
}

fetchPerfumes();
