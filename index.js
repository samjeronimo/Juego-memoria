function cargarDOM() {
    let DOM = document.querySelector('#root');
    DOM.className = "DOM";

    // Crear pantalla de bienvenida
    let pantallaInicio = document.createElement('div');
    pantallaInicio.className = "pantalla-inicio";

    let titulo = document.createElement('h1');
    titulo.textContent = "Puzzle Playground";

    let descripcion = document.createElement('p');
    descripcion.textContent = "¡Pon a prueba tu memoria!";

    let botonIniciar = document.createElement('button');
    botonIniciar.id = "btn-iniciar";
    botonIniciar.textContent = "Comenzar";

    // Agregar hijos a pantallaInicio
    pantallaInicio.appendChild(titulo);
    pantallaInicio.appendChild(descripcion);
    pantallaInicio.appendChild(botonIniciar);

    // Agregar pantallaInicio al DOM
    DOM.appendChild(pantallaInicio);

    // Cuando clickeen "Comenzar"
    botonIniciar.onclick = () => {
        pantallaInicio.remove();
        iniciarJuego(DOM);
    };

    return DOM;
}

let vidasRestantes = 5;  // Vidas globales, inicializadas a 5
let puntos = 0;


function actualizarVidas(header) {
    // Primero elimina vidas actuales
    const vidasActuales = header.querySelectorAll('.vida');
    vidasActuales.forEach(img => img.remove());

    // Total corazones (fijos a 5)
    const totalVidas = 5;

    for (let i = 0; i < totalVidas; i++) {
        let vida = document.createElement('img');
        vida.className = "vida";

        if (i < vidasRestantes) {
            // Corazón lleno (color)
            vida.src = "./img/img.png";
        } else {
            // Corazón vacío (gris)
            vida.src = "https://img.freepik.com/vector-premium/icono-corazon-pixelado-vacio-vacio-vacio-ausencia-amor-soledad-anhelo-emociones-vacias-simbolo-digital-pixel-art-retro-nostalgia-icono-linea-vectorial-negocios-publicidad_855332-1962.jpg";
            vida.style.opacity = "0.5";  // opcional para hacerlo más tenue
        }

        header.appendChild(vida);
    }
}


function iniciarJuego(DOM) {
    DOM.innerHTML = "";

    let header = document.createElement('div');
    header.className = "header";
    DOM.appendChild(header);

    let titulo = document.createElement('h1');
    titulo.textContent = "Puzzle Playground";
    titulo.className = "titulo-header";
    header.appendChild(titulo);

    actualizarVidas(header);

    let cronometro = document.createElement('div');
    cronometro.className = "cronometro";
    cronometro.textContent = "Tiempo: 00";
    header.appendChild(cronometro);

    let puntosTexto = document.createElement('div');
    puntosTexto.className = "puntos";
    puntosTexto.innerHTML = `
        <div class="marcador">
            <span class="etiqueta">Puntos</span>
            <span class="valor">${puntos}</span>
        </div>
    `;
    header.appendChild(puntosTexto);



    let tablero = document.createElement('div');
    tablero.className = "tablero";
    DOM.appendChild(tablero);

    let nivelActual = 1;

    const botonNivel = document.createElement('button');
    botonNivel.className = "boton-nivel";
    botonNivel.textContent = `Nivel ${nivelActual + 1}`;

    // INICIALMENTE DESHABILITADO
    botonNivel.disabled = true;
    botonNivel.style.opacity = "0.6";
    botonNivel.style.cursor = "default";

    DOM.appendChild(botonNivel);

    generarNivel(nivelActual, tablero, header, botonNivel);

    // NO asignar onclick aquí, se asignará cuando se complete el nivel
}


function actualizarPuntos(header) {
    const puntosBox = header.querySelector('.puntos .valor');
    if (puntosBox) {
        puntosBox.textContent = puntos;
    }

}




cargarDOM();


function crearCarta(valor) {
    let carta = document.createElement('div');
    carta.className = "carta";
    carta.dataset.valor = valor; // guardamos el valor para comparar pares

    let front = document.createElement('div');
    front.className = "front";

    let back = document.createElement('div');
    back.className = "back";

    let img = document.createElement('img');
    img.src = `./img/${valor}`;
    img.alt = "carta";
    img.className = "imagen-carta";

    back.appendChild(img);


    carta.appendChild(front);
    carta.appendChild(back);

    return carta;
}


function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function generarNivel(nivel, tablero, header, botonNivel) {
    if (nivel > 5) return;

    tablero.innerHTML = "";

    const cantidadCartas = 4 + (nivel - 1) * 2;

    let tiempo = 8 + nivel * 2 + Math.floor(cantidadCartas / 2);
    iniciarCronometro(tiempo, () => {

        vidasRestantes--;  // Restar una vida
        actualizarVidas(header);

        if (vidasRestantes > 0) {
            mostrarCartelVidaPerdida(() => {
                generarNivel(nivel, tablero, header, botonNivel);  // Reinicia mismo nivel
            });
        } else {
            mostrarCartelGameOver();
        }
    });


    const columnas = Math.ceil(Math.sqrt(cantidadCartas));
    tablero.style.gridTemplateColumns = `repeat(${columnas}, auto)`;

    // Array de emojis para los pares (puedes poner imágenes o lo que prefieras)
    const imagenes = [
        "amarillo.png",
        "azul.png",
        "flor.png",
        "protaAzul.png",
        "rosa.png",
        "verde.png"
    ];
    

    // Tomamos la cantidad necesaria de pares (cantidadCartas / 2)
    let valores = imagenes.slice(0, cantidadCartas / 2);

    // Creamos un array con dos de cada valor
    let cartasValores = valores.concat(valores);

    // Mezclamos
    mezclarArray(cartasValores);

    // Variables para control de juego
    let cartasVolteadas = [];
    let paresEncontrados = 0;

    cartasValores.forEach(valor => {
        const carta = crearCarta(valor);

        carta.addEventListener('click', () => {
            if (carta.classList.contains('volteada') || cartasVolteadas.length === 2 || carta.classList.contains('encontrada')) return;

            carta.classList.add('volteada');
            cartasVolteadas.push(carta);

            if (cartasVolteadas.length === 2) {
                const [carta1, carta2] = cartasVolteadas;

                if (carta1.dataset.valor === carta2.dataset.valor) {
                    // Par correcto
                    carta1.classList.add('encontrada');
                    carta2.classList.add('encontrada');

                    // Opacidad para indicar encontrado
                    carta1.style.opacity = "0.5";
                    carta2.style.opacity = "0.5";

                    paresEncontrados++;

                    // Limpiar volteadas
                    cartasVolteadas = [];

                    // ¿Se terminaron las cartas?
                    if (paresEncontrados === cantidadCartas / 2) {

                        // Asignar puntos según el nivel (puedes ajustar los valores si deseas)
                        let puntosGanados = 10 + (nivel - 1) * 2;  // 10, 12, 14, 16, 18
                        puntos += puntosGanados;

                        // Penalización por vidas perdidas (por cada vida perdida, -1 punto)
                        let penalizacion = 5 - vidasRestantes;
                        puntos -= penalizacion;

                        // Asegurarse de que no bajen de cero
                        if (puntos < 0) puntos = 0;

                        // Actualizar visualmente los puntos
                        actualizarPuntos(header);


                        const boton = document.querySelector('.boton-nivel');
                        clearInterval(temporizador); // Detener el cronómetro al ganar
                        if (nivel < 5) {
                            // ACTIVAR BOTÓN SOLO CUANDO TERMINE EL NIVEL
                            botonNivel.disabled = false;
                            botonNivel.style.opacity = "1";
                            botonNivel.style.cursor = "pointer";
                            botonNivel.textContent = `Nivel ${nivel + 1}`;

                            botonNivel.onclick = () => {
                                generarNivel(nivel + 1, tablero, header, botonNivel);
                                // DESHABILITAR BOTÓN AL PASAR AL SIGUIENTE NIVEL
                                botonNivel.disabled = true;
                                botonNivel.style.opacity = "0.6";
                                botonNivel.style.cursor = "default";
                            };   
                        } else {
                            boton.textContent = "🎉 ¡Completado!";
                            boton.disabled = true;
                            boton.style.opacity = "0.6";
                            boton.style.cursor = "default";

                            mostrarCartelFinal();
                        }
                    }
                } else {
                    // Par incorrecto - esperar y voltear atrás
                    setTimeout(() => {
                        carta1.classList.remove('volteada');
                        carta2.classList.remove('volteada');
                        cartasVolteadas = [];
                    }, 1000);
                }
            }
        });

        tablero.appendChild(carta);
    });
}


let temporizador; // Global para controlarlo

function iniciarCronometro(tiempoInicial, callbackFin) {
    clearInterval(temporizador);
    let tiempoRestante = tiempoInicial;
    const cronometro = document.querySelector('.cronometro');
    cronometro.textContent = `Tiempo: ${tiempoRestante}s`;
    cronometro.classList.remove('critico'); // Resetear clase

    temporizador = setInterval(() => {
        tiempoRestante--;
        
        // Añadir clase critico cuando quedan 5 segundos o menos
        if(tiempoRestante <= 5) {
            cronometro.classList.add('critico');
        }
        
        cronometro.textContent = `Tiempo: ${tiempoRestante}s`;

        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            callbackFin();
        }
    }, 1000);
}



function mostrarCartelFinal() {
    // Calcular estadísticas
    const vidasPerdidas = 5 - vidasRestantes;
    const nivelMaximo = 5;
    const eficiencia = Math.round((puntos / (100 + nivelMaximo * 2)) * 100);

    // Crear elementos
    const cartel = document.createElement('div');
    const container = document.createElement('div');
    const titulo = document.createElement('h1');
    const mensaje = document.createElement('p');
    const grid = document.createElement('div');
    const btnReiniciar = document.createElement('button');

    // Configurar clases (estilos en CSS)
    cartel.className = "cartel-final";
    container.className = "estadisticas-container";
    grid.className = "estadisticas-grid";
    btnReiniciar.className = "boton-reiniciar";

    // Configurar contenido
    titulo.textContent = "🎉 ¡Felicidades! 🎉";
    mensaje.textContent = "¡Completaste todos los niveles del juego!";
    btnReiniciar.textContent = "Jugar de nuevo";

    // Crear estadísticas
    const crearEstadistica = (icono, valor, tituloText) => {
        const stat = document.createElement('div');
        const icon = document.createElement('span');
        const value = document.createElement('span');
        const title = document.createElement('span');

        stat.className = "estadistica";
        icon.className = "estadistica-icono";
        value.className = "estadistica-valor";
        title.className = "estadistica-titulo";

        icon.textContent = icono;
        value.textContent = valor;
        title.textContent = tituloText;

        stat.appendChild(icon);
        stat.appendChild(value);
        stat.appendChild(title);

        return stat;
    };

    // Añadir estadísticas al grid
    grid.appendChild(crearEstadistica("🏆", puntos, "Puntos totales"));
    grid.appendChild(crearEstadistica("💔", vidasPerdidas, "Vidas perdidas"));
    grid.appendChild(crearEstadistica("📈", `${eficiencia}%`, "Eficiencia"));
    grid.appendChild(crearEstadistica("🚀", `${nivelMaximo}/5`, "Nivel alcanzado"));

    // Configurar botón
    btnReiniciar.onclick = () => {
        cartel.remove();
        vidasRestantes = 5;
        puntos = 0;
        const DOM = document.querySelector('#root');
        DOM.innerHTML = "";
        cargarDOM();
    };

    // Ensamblar todo
    container.appendChild(titulo);
    container.appendChild(mensaje);
    container.appendChild(grid);
    container.appendChild(btnReiniciar);
    cartel.appendChild(container);
    document.body.appendChild(cartel);
}


function mostrarCartelVidaPerdida(callback) {
    const cartel = document.createElement('div');
    cartel.className = "cartel-vida-perdida";
    cartel.innerHTML = `
        <h2>💔 ¡Perdiste una vida!</h2>
        <p>¡Inténtalo de nuevo!</p>
        <button id="btn-reintentar">Reintentar nivel</button>
    `;

    document.body.appendChild(cartel);

    document.querySelector('#btn-reintentar').onclick = () => {
        cartel.remove();
        callback(); // Esto vuelve a iniciar el nivel
    };
}


function mostrarCartelGameOver() {
    const cartel = document.createElement('div');
    cartel.className = "cartel-gameover";

    cartel.innerHTML = `
        <h1>💔 ¡Game Over!</h1>
        <p>Se te acabaron las vidas, pero puedes volver a intentarlo.</p>
        <button id="btn-reiniciar">Reiniciar Juego</button>
    `;

    document.body.appendChild(cartel);

    document.querySelector('#btn-reiniciar').onclick = () => {
        cartel.remove();
        vidasRestantes = 5;
        puntos = 0;
        const DOM = document.querySelector('#root');
        DOM.innerHTML = "";
        cargarDOM();
    };
}





cargarDOM();

export { cargarDOM };
