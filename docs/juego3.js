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
            // Seleccionar 5 palabras aleatorias
            const palabraRandom = [];
            const shuffled = data.sort(() => 0.5 - Math.random()); // Mezclar las palabras aleatoriamente
            for (let i = 0; i < 5; i++) {
                palabraRandom.push(shuffled[i]);
            }

            // Insertar palabras en el área de juego
            const gameArea = document.getElementById('gameArea1');
            palabraRandom.forEach(palabra => {
                const palabraDiv = document.createElement('div');
                palabraDiv.classList.add('object');
                palabraDiv.setAttribute('draggable', 'true');
                palabraDiv.setAttribute('data-weight', palabra.id);
                palabraDiv.textContent = palabra.name;
                gameArea.appendChild(palabraDiv);
            });

            // Asignar eventos a los nuevos elementos
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
                // Intercambiar contenido y atributos
                const tempHTML = this.innerHTML;
                const tempWeight = this.getAttribute('data-weight');

                this.innerHTML = draggedItem.innerHTML;
                this.setAttribute('data-weight', draggedItem.getAttribute('data-weight'));

                draggedItem.innerHTML = tempHTML;
                draggedItem.setAttribute('data-weight', tempWeight);
            } else {
                console.error('draggedItem es null, no se puede realizar el intercambio.');
            }
        });
    });
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
