const map = L.map('map').setView([38.7369, -9.1395], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

const marcadores = {};

faculdades.forEach(faculdade => {
  const marker = L.marker(faculdade.coords).addTo(map);
  marker.bindPopup(`
    <b>${faculdade.nome}</b>
    <a href="${faculdade.link}" target="_blank">Ver mais</a>
  `);
  marcadores[faculdade.nome.toLowerCase()] = marker;
});

const searchBox = document.getElementById('searchBox');
const resultsList = document.getElementById('resultsList');

function procurarFaculdades(termo) {
  resultsList.innerHTML = '';
  if (termo.trim() === '') return;

  faculdades.forEach((faculdade) => {
    if (faculdade.nome.toLowerCase().includes(termo)) {
      const li = document.createElement('li');
      li.textContent = faculdade.nome;
      li.addEventListener('click', () => {
        centrarNoMarcador(faculdade.nome);
      });
      resultsList.appendChild(li);
    }
  });
}

function centrarNoMarcador(nome) {
  const marcador = marcadores[nome.toLowerCase()];
  if (marcador) {
    map.setView(marcador.getLatLng(), 17);
    marcador.openPopup();
    resultsList.innerHTML = '';
    searchBox.value = '';
  }
}

// Eventos da caixa de pesquisa
searchBox.addEventListener('input', () => {
  const termo = searchBox.value.toLowerCase();
  procurarFaculdades(termo);
});

searchBox.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const termo = searchBox.value.toLowerCase();
    const resultado = faculdades.find(f => f.nome.toLowerCase().includes(termo));
    if (resultado) {
      centrarNoMarcador(resultado.nome);
    }
  }
});
