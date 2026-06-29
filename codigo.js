function irCalculadora() {
  document.getElementById("calculadora").scrollIntoView({
    behavior: "smooth"
  });
}

function calcularIntegral() {
  let expresion = document.getElementById("expresion").value;
  let resultado = document.getElementById("resultado");

  // Limpiamos espacios
  expresion = expresion.replace(/\s/g, "").toLowerCase();

  // Regex perrón: acepta opcionalmente signos +/-, coeficiente, la 'x', el '^' opcional y el exponente (ej. -5x^3 o 4x2)
  let regex = /^([-+]?\d*)x\^?([-+]?\d+)$/;
  let partes = expresion.match(regex);

  resultado.classList.remove("oculto");

  if (!partes) {
    resultado.innerHTML = "<p style='color: #ff4c4c;'>⚠️ Formato incorrecto. Intenta con algo como <b>4x^3</b>, <b>-5x2</b> o <b>x4</b>.</p>";
    return;
  }

  // Parseo inteligente de coeficientes (si está vacío o es un simple '-', lo ajustamos)
  let coefStr = partes[1];
  let coeficiente = 1;
  if (coefStr === "-") coeficiente = -1;
  else if (coefStr !== "" && coefStr !== "+") coeficiente = parseInt(coefStr);

  let exponente = parseInt(partes[2]);

  if (exponente === -1) {
    let coefFormat = coeficiente === 1 ? "" : (coeficiente === -1 ? "-" : coeficiente);
    resultado.innerHTML = `
      <h3 style="color: #7df9ff;">Resultado:</h3>
      <p style="font-size: 1.2rem;"><b>∫ ${expresion} dx = ${coefFormat}ln|x| + C</b></p>
      <hr style="border: 0.5px solid rgba(255,255,255,0.2); margin: 10px 0;">
      <p>💡 <b>Regla especial:</b> La integral de x⁻¹ (o 1/x) es el logaritmo natural del valor absoluto de x.</p>
    `;
    return;
  }

  let nuevoExponente = exponente + 1;
  
  // Simplificación visual de la fracción final
  let fraccionHTML = "";
  if (coeficiente % nuevoExponente === 0) {
    let cociente = coeficiente / nuevoExponente;
    let cocienteFormat = cociente === 1 ? "" : (cociente === -1 ? "-" : cociente);
    fraccionHTML = `${cocienteFormat}x<sup>${nuevoExponente}</sup>`;
  } else {
    fraccionHTML = `<sup>${coeficiente}x<sup>${nuevoExponente}</sup></sup> / <sub>${nuevoExponente}</sub>`;
  }

  resultado.innerHTML = `
    <h3 style="color: #7df9ff;">Resultado Final:</h3>
    <p style="font-size: 1.5rem; margin: 10px 0;"><b>${fraccionHTML} + C</b></p>
    
    <hr style="border: 0.5px solid rgba(255,255,255,0.2); margin: 15px 0;">
    <h3 style="color: #b56cff;">Procedimiento paso a paso:</h3>
    <ul style="list-style-type: none; padding: 0;">
      <li style="margin-bottom: 8px;"><b>1.</b> Identificamos <b>n</b> (exponente) = ${exponente} y <b>a</b> (coeficiente) = ${coeficiente}.</li>
      <li style="margin-bottom: 8px;"><b>2.</b> Sumamos 1 al exponente: ${exponente} + 1 = <b>${nuevoExponente}</b>.</li>
      <li style="margin-bottom: 8px;"><b>3.</b> Dividimos todo entre el nuevo exponente: ${coeficiente} / ${nuevoExponente}.</li>
      <li style="margin-bottom: 8px;"><b>4.</b> Agregamos la constante de integración <b>C</b>.</li>
    </ul>
  `;
}

// Lógica de juego / práctica
let puntos = 0;

function verificarRespuesta() {
  let respuesta = document.getElementById("respuesta").value;
  let mensaje = document.getElementById("mensaje");

  respuesta = respuesta.replace(/\s/g, "").toLowerCase();

  // Aceptamos variaciones comunes
  if (
    respuesta === "8x7/7+c" ||
    respuesta === "8x^7/7+c" ||
    respuesta === "(8x7)/7+c" ||
    respuesta === "(8x^7)/7+c"
  ) {
    puntos += 10;
    mensaje.style.color = "#00ff7f";
    mensaje.innerHTML = "¡Correcto, we! Ganaste 10 puntos de XP. 🚀";
  } else {
    mensaje.style.color = "#ff4c4c";
    mensaje.innerHTML = "Mmm... no es correcto. Recuerda la regla: suma 1 al exponente y divide.";
  }

  document.getElementById("puntos").innerText = puntos;
}

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