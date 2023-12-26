const tabModal = document.querySelector("#tabModal");

const tabs = [
  { text: "Avaliações", windowId: "avaliacoesTab" },
  { text: "Atividades", windowId: "atividadesTab" },
  { text: "Faltas", windowId: "faltasTab" },
];

console.log(JSON.stringify(tabs));

const ctx = document.getElementById('myChart');

const data = {
  labels: ['1º tri', '2º tri', '3º tri'],
  datasets: [{
    label: 'Nota média',
    data: [10, 7, 4],
    fill: true,
    borderColor: '#0b53b7',
    tension: 0.1
  }]
};

new Chart(ctx, {
  type: 'line',
  data: data,
  
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});