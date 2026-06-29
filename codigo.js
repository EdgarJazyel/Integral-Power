// 🔥 Función Maestra para cambiar de pantallas (Navegación)
function cambiarPantalla(idPantallaDestino) {
  // 1. Buscamos todas las pantallas y las apagamos
  let pantallas = document.querySelectorAll('.pantalla');
  pantallas.forEach(pantalla => {
    pantalla.classList.remove('activa');
  });

  // 2. Prendemos solo la que el usuario quiere ver
  let pantallaDestino = document.getElementById(idPantallaDestino);
  pantallaDestino.classList.add('activa');

  // 3. Subimos el scroll hasta arriba suavecito
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
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

// 🔥 AQUÍ ESTÁN LAS FUNCIONES QUE FALTABAN PARA LOS BOTONES 🔥
function resolverSustitucion() {
  let div = document.getElementById("resultadoSustitucion");
  div.classList.toggle("oculto");
  div.innerHTML = `
    <p><b>Integral:</b> ∫ (3x² + 2)(x³ + 2x − 1)⁵ dx</p>
    <br>
    <p><b>1.</b> u = x³ + 2x − 1</p>
    <p><b>2.</b> du = (3x² + 2)dx</p>
    <p><b>3.</b> Sustituimos: ∫ u⁵ du</p>
    <p><b>4.</b> Integramos: u⁶ / 6 + C</p>
    <p style="color: #7df9ff; margin-top: 10px;"><b>Resultado:</b> (x³ + 2x − 1)⁶ / 6 + C</p>
  `;
}

function resolverPartes() {
  let div = document.getElementById("resultadoPartes");
  div.classList.toggle("oculto");
  div.innerHTML = `
    <p><b>Integral:</b> ∫ x eˣ dx</p>
    <br>
    <p><b>1.</b> Asignamos variables según ILATE:</p>
    <p style="margin-left: 15px;">u = x  => du = dx</p>
    <p style="margin-left: 15px;">dv = eˣ dx => v = eˣ</p>
    <p><b>2.</b> Usamos la fórmula: uv − ∫ v du</p>
    <p><b>3.</b> x eˣ − ∫ eˣ dx</p>
    <p style="color: #7df9ff; margin-top: 10px;"><b>Resultado:</b> x eˣ − eˣ + C</p>
  `;
}

// Zona de práctica
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
