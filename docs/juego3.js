let draggedItem = null; // Objeto que se está arrastrando
let movimiento = 0; // Contador de movimientos
let segundos = 0;
let minutos = 0; // Minutos del cronómetro
let cronometroInterval; // Intervalo del cronómetro
let cronometroPausado = false; // Estado del cronómetro (pausado o no)

// Función principal para iniciar el cronómetro
function iniciarCronometro() {
    if (cronometroInterval !== null) {
        clearInterval(cronometroInterval);
    }
    cronometroInterval = setInterval(() => {
        if (!cronometroPausado) {
            segundos++;
            if (segundos === 60) {
                minutos++;
                segundos = 0;
            }
            document.getElementById('cronometro').innerText =
                `Tiempo: ${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            guardarTiempoenlocalstorage();
        }
    }, 1000);
}

// Guardar tiempo en Local Storage
function guardarTiempoenlocalstorage() {
    localStorage.setItem('minutos', minutos);
    localStorage.setItem('segundos', segundos);
}

// Inicializar el juego
window.onload = function () {
    if (localStorage.getItem('minutos') && localStorage.getItem('segundos')) {
        minutos = parseInt(localStorage.getItem('minutos'), 10);
        segundos = parseInt(localStorage.getItem('segundos'), 10);
    }
    iniciarCronometro();
    document.getElementById('pausarBtn').addEventListener('click', pausarBoton);
    cargarPalabras();
};

// Cargar palabras desde JSON
function cargarPalabras() {
    fetch('palabra.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const palabraRandom = [];
            const shuffled = data.sort(() => 0.5 - Math.random());
            for (let i = 0; i < 5; i++) {
                palabraRandom.push(shuffled[i]);
            }

            const gameArea = document.getElementById('gameArea1');
            palabraRandom.forEach((palabra, index) => {
                const palabraDiv = document.createElement('div');
                palabraDiv.classList.add('object');
                palabraDiv.setAttribute('draggable', 'true');
                palabraDiv.setAttribute('data-weight', palabra.id);
                palabraDiv.setAttribute('data-correct-position', index); // Posición correcta
                palabraDiv.textContent = palabra.name;
                gameArea.appendChild(palabraDiv);
            });

            asignarEventosArrastrar();
        })
        .catch(error => console.error('Error al cargar la palabra:', error));
}


// Asignar eventos de arrastrar y soltar
function asignarEventosArrastrar() {
    document.querySelectorAll('.object').forEach(item => {
        item.addEventListener('dragstart', function (e) {
            draggedItem = this;
            setTimeout(() => this.style.visibility = 'hidden', 0);
        });

        item.addEventListener('dragend', function (e) {
            setTimeout(() => this.style.visibility = 'visible', 0);
            draggedItem = null;
        });

        item.addEventListener('dragover', function (e) {
            e.preventDefault(); // Permitir soltar el objeto aquí
        });

        item.addEventListener('drop', function (e) {
            e.preventDefault();
            if (draggedItem) {
                movimiento++;
                document.getElementById('contador').innerText = `Movimientos: ${movimiento}`;

                // asignar longitud de la palabra
                const palabra1 = this.innerHTML;
                const palabra2 = draggedItem.innerHTML
                console.log(`Palabra 1: ${palabra1} - ${verificarLongitudPalabra(palabra1)}`);
                console.log(`Palabra 2: ${palabra2} - ${verificarLongitudPalabra(palabra2)}`);

                // Intercambiar contenido y atributos
                const tempHTML = this.innerHTML;
                const tempWeight = this.getAttribute('data-weight');

                this.innerHTML = draggedItem.innerHTML;
                this.setAttribute('data-weight', draggedItem.getAttribute('data-weight'));

                draggedItem.innerHTML = tempHTML;
                draggedItem.setAttribute('data-weight', tempWeight);
                
                //verificar orden 
                //ordenCorrecto();
            } else {
                console.error('draggedItem es null, no se puede realizar el intercambio.');
            }

            ordenCorrecto();
        });
        item.addEventListener('touchstart', function (e) {
            draggedItem = this;
            setTimeout(() => this.style.visibility = 'hidden', 0);
            e.preventDefault();
        });

        item.addEventListener('touchend', function (e) {
            setTimeout(() => this.style.visibility = 'visible', 0);
            if (draggedItem !== null) {
                // Incrementar el movimiento al soltar
                movimiento++;
                document.getElementById('contador').innerText = `Movimientos: ${movimiento}`;
                // Encontrar el elemento debajo del toque final
                const touchLocation = e.changedTouches[0];
                const element = document.elementFromPoint(touchLocation.clientX, touchLocation.clientY);
                if (element && element.classList.contains('object') && element !== draggedItem) {
                    
                    //verificar longitud de la palabra
                    const palabra1 = this.innerHTML;
                    const palabra2 = draggedItem.innerHTML
                    console.log(`Palabra 1: ${palabra1} - ${verificarLongitudPalabra(palabra1)}`);
                    console.log(`Palabra 2: ${palabra2} - ${verificarLongitudPalabra(palabra2)}`);
                    // Intercambiamos los objetos arrastrados
                    const tempHTML = element.innerHTML;
                    const tempWeight = element.getAttribute('data-weight');
                    const tempId = element.id;

                    // Intercambiamos contenido y atributos
                    element.innerHTML = draggedItem.innerHTML;
                    element.setAttribute('data-weight', draggedItem.getAttribute('data-weight'));
                    element.id = draggedItem.id;

                    draggedItem.innerHTML = tempHTML;
                    draggedItem.setAttribute('data-weight', tempWeight);
                    draggedItem.id = tempId;
                }
            }
            draggedItem = null;
            // Verificamos el orden automáticamente después de soltar
            ordenCorrecto();
        });

        item.addEventListener('touchmove', function (e) {
            e.preventDefault();
        });
        
    });

}

//funcion para verificar el orden de las palabras 
function ordenCorrecto() {
    const dropArea = document.getElementById('dropArea'); // Contenedor de palabras
    const bloques = Array.from(dropArea.querySelectorAll('.object'))
        .filter(obj => obj.style.visibility !== 'hidden' && obj.hasAttribute('data-weight'));

    if (bloques.length === 0) {
        console.error('No hay bloques en dropArea para verificar.');
        return;
    }

    let correctos = 0;

    // Iterar por los bloques en su posición actual dentro de dropArea
    bloques.forEach((bloque, index) => {
        const correctPosition = bloque.getAttribute('data-correct-position'); // Posición esperada
        const currentWeight = bloque.getAttribute('data-weight'); // Peso actual asignado
        const palabra = bloque.innerHTML.trim(); // Palabra actual en el bloque

        if (!correctPosition || !currentWeight) {
            console.warn(`El bloque en la posición ${index} no tiene atributos correctos.`);
            bloque.style.backgroundColor = '#D53032'; // Rojo si no cumple
            return;
        }

        // Verificar si la posición actual coincide con la esperada
        if (parseInt(correctPosition) === index) {
            correctos++;
            bloque.style.backgroundColor = 'lightgreen'; // Verde si es correcto
        } else {
            bloque.style.backgroundColor = '#D53032'; // Rojo si es incorrecto
        }
    });

    console.log(`Total correctos: ${correctos}, Bloques necesarios: ${bloques.length}`);

    // Si todos los bloques están en la posición correcta
    if (correctos === bloques.length) {
        const tiempoActual = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        limpiarCronometro();
        window.location.href = `ventanaGanadora.html?movimientos=${movimiento}&tiempo=${tiempoActual}`;
    }
}


// Verificar la longitud de las palabras
function verificarLongitudPalabra(palabra) {
    return palabra.trim().length; // Asegurarse de ignorar espacios adicionales
}






//funcion para verificar la longitud
function verificarLongitudPalabra(palabra){
    return palabra.length;
}
// Funciones del cronómetro
function pausarCronometro() {
    cronometroPausado = true;
}

function reanudarCronometro() {
    cronometroPausado = false;
}

function limpiarCronometro() {
    clearInterval(cronometroInterval);
    cronometroInterval = null;
    segundos = 0;
    minutos = 0;
    document.getElementById('cronometro').innerText = 'Tiempo: 00:00';
    localStorage.removeItem('minutos');
    localStorage.removeItem('segundos');
}

// Botón de pausa
function pausarBoton() {
    pausarCronometro();
    const modal = document.getElementById('pausa');
    modal.style.display = 'flex';
    document.getElementById('tiempo').innerText =
        `Tiempo transcurrido: ${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

function volverAlJuego() {
    const modal = document.getElementById('pausa');
    modal.style.display = 'none';
    reanudarCronometro();
}

function salirDelJuego() {
    limpiarCronometro();
    window.location.href = 'tableroJuegos.html';
}
