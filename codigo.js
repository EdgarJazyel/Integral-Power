// 1. Inicialización de Efecto de Partículas en el Fondo
particlesJS("particles-js", {
  "particles": {
    "number": { "value": 70, "density": { "enable": true, "value_area": 900 } },
    "color": { "value": "#7df9ff" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.3 },
    "size": { "value": 2.5 },
    "line_linked": { "enable": true, "distance": 140, "color": "#7f00ff", "opacity": 0.3, "width": 1 },
    "move": { "enable": true, "speed": 1.5, "direction": "none", "straight": false }
  },
  "interactivity": { "events": { "onhover": { "enable": true, "mode": "grab" } } },
  "retina_detect": true
});

function irCalculadora() {
  document.getElementById("calculadora").scrollIntoView({ behavior: "smooth" });
}

// Control global del lienzo de la gráfica
let graficoInstancia = null;

function calcularIntegral() {
  let expresion = document.getElementById("expresion").value;
  let resultado = document.getElementById("resultado");

  expresion = expresion.replace(/\s/g, "").toLowerCase();

  let regex = /^([-+]?\d*)x\^?([-+]?\d+)$/;
  let partes = expresion.match(regex);

  resultado.classList.remove("oculto");

  if (!partes) {
    resultado.innerHTML = "<p style='color: #ff4c4c;'>⚠️ Revisa el formato. Intenta usar algo como: 4x^3, -2x5 o x2.</p>";
    return;
  }

  let coefStr = partes[1];
  let coeficiente = 1;
  if (coefStr === "-") coeficiente = -1;
  else if (coefStr !== "" && coefStr !== "+") coeficiente = parseInt(coefStr);

  let exponente = parseInt(partes[2]);

  if (exponente === -1) {
    let coefFormat = coeficiente === 1 ? "" : (coeficiente === -1 ? "-" : coeficiente);
    resultado.innerHTML = `<h3>Resultado:</h3><p><b>${coefFormat}ln|x| + C</b></p>`;
    generarGrafica(coeficiente, exponente, true);
    return;
  }

  let nuevoExponente = exponente + 1;
  let fraccionHTML = "";
  
  if (coeficiente % nuevoExponente === 0) {
    let cociente = coeficiente / nuevoExponente;
    let cocienteFormat = cociente === 1 ? "" : (cociente === -1 ? "-" : cociente);
    fraccionHTML = `${cocienteFormat}x<sup>${nuevoExponente}</sup>`;
  } else {
    fraccionHTML = `<sup>${coeficiente}x<sup>${nuevoExponente}</sup></sup> / <sub>${nuevoExponente}</sub>`;
  }

  resultado.innerHTML = `
    <h3 style="color: #7df9ff;">Resultado:</h3>
    <p style="font-size: 1.4rem;"><b>${fraccionHTML} + C</b></p>
  `;

  // Renderizar comportamiento de la curva en la gráfica
  generarGrafica(coeficiente, exponente, false);
}

// 2. Lógica para trazar y rellenar el área bajo la curva con Chart.js
function generarGrafica(coef, exp, esLogaritmica) {
  const ctx = document.getElementById('graficaIntegral').getContext('2d');
  
  if (graficoInstancia) {
    graficoInstancia.destroy();
  }

  const valoresX = [];
  const valoresY = [];

  if (esLogaritmica) {
    for (let x = 0.5; x <= 5; x += 0.2) {
      valoresX.push(x.toFixed(1));
      valoresY.push(coef * Math.log(x));
    }
  } else {
    for (let x = -3; x <= 3; x += 0.2) {
      valoresX.push(x.toFixed(1));
      valoresY.push(coef * Math.pow(x, exp));
    }
  }

  graficoInstancia = new Chart(ctx, {
    type: 'line',
    data: {
      labels: valoresX,
      datasets: [{
        label: esLogaritmica ? 'F(x) = ln|x|' : `f(x) = ${coef}x^${exp}`,
        data: valoresY,
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.15)',
        fill: true,
        tension: 0.2,
        pointRadius: 1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#fff' } } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#bbb' } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#bbb' } }
      }
    }
  });
}

// 3. Solucionador Matemático de Matrices por Eliminación de Gauss-Jordan
function resolverGaussJordan() {
  let sistema = [
    [parseFloat(document.getElementById("a00").value || 0), parseFloat(document.getElementById("a01").value || 0), parseFloat(document.getElementById("a02").value || 0), parseFloat(document.getElementById("b0").value || 0)],
    [parseFloat(document.getElementById("a10").value || 0), parseFloat(document.getElementById("a11").value || 0), parseFloat(document.getElementById("a12").value || 0), parseFloat(document.getElementById("b1").value || 0)],
    [parseFloat(document.getElementById("a20").value || 0), parseFloat(document.getElementById("a21").value || 0), parseFloat(document.getElementById("a22").value || 0), parseFloat(document.getElementById("b2").value || 0)]
  ];

  let contenedor = document.getElementById("resultadoGauss");
  contenedor.classList.remove("oculto");

  let n = 3;
  for (let i = 0; i < n; i++) {
    let pivote = sistema[i][i];
    if (Math.abs(pivote) < 0.00001) {
      contenedor.innerHTML = "<p style='color: #ff4c4c;'>⚠️ Error: Pivote nulo detectado. El sistema no cuenta con una solución única directa.</p>";
      return;
    }

    for (let j = i; j <= n; j++) {
      sistema[i][j] /= pivote;
    }

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        let factor = sistema[k][i];
        for (let j = i; j <= n; j++) {
          sistema[k][j] -= factor * sistema[i][j];
        }
      }
    }
  }

  let solX = sistema[0][3].toFixed(2);
  let solY = sistema[1][3].toFixed(2);
  let solZ = sistema[2][3].toFixed(2);

  contenedor.innerHTML = `
    <h3 style="color: #7df9ff;">Matriz Identidad Reducida:</h3>
    <p>| 1  0  0  :  <b>${solX}</b> |</p>
    <p>| 0  1  0  :  <b>${solY}</b> |</p>
    <p>| 0  0  1  :  <b>${solZ}</b> |</p>
    <br>
    <h3 style="color: #b56cff;">Soluciones del Sistema:</h3>
    <p><b>x</b> = ${solX} &nbsp;&nbsp;|&nbsp;&nbsp; <b>y</b> = ${solY} &nbsp;&nbsp;|&nbsp;&nbsp; <b>z</b> = ${solZ}</p>
  `;
}

let puntos = 0;
function verificarRespuesta() {
  let respuesta = document.getElementById("respuesta").value.replace(/\s/g, "").toLowerCase();
  let mensaje = document.getElementById("mensaje");

  if (["8x7/7+c", "8x^7/7+c", "(8x7)/7+c", "(8x^7)/7+c"].includes(respuesta)) {
    puntos += 10;
    mensaje.style.color = "#00ff7f";
    mensaje.innerHTML = "¡Excelente, we! Tu resultado es matemáticamente correcto. +10 XP";
  } else {
    mensaje.style.color = "#ff4c4c";
    mensaje.innerHTML = "Ese no es el valor. No olvides dividir por el exponente incrementado.";
  }
  document.getElementById("puntos").innerText = puntos;
}
