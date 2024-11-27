// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCx9LP5qF7Ce55QxcGIKskvppiQGYfYYL0",
    authDomain: "juegoterrapeuticoepn.firebaseapp.com",
    projectId: "juegoterrapeuticoepn",
    storageBucket: "juegoterrapeuticoepn.appspot.com",
    messagingSenderId: "537931533464",
    appId: "1:537931533464:web:789d18eddff759799d14ed",
    measurementId: "G-WB9KER4NJB"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Obtener el ID del paciente desde localStorage
const idPaciente = localStorage.getItem('idPaciente');
if (!idPaciente) {
    alert('No se encontró el ID del paciente. Por favor, inicia sesión nuevamente.');
    window.location.href = "loginPaciente.html";
}

// Función para calcular el rango de calidad
function calcularRango(movimientos) {
    if (movimientos >= 5 && movimientos <= 9) return "Excelente";
    if (movimientos >= 10 && movimientos <= 12) return "Regular";
    return "Pésimo";
}

// Cargar los datos del paciente y los juegos
async function cargarDatosPaciente() {
    try {
        // Obtener datos del paciente
        const pacienteDoc = await db.collection('pacientes').doc(idPaciente).get();
        if (!pacienteDoc.exists) {
            alert('No se encontraron datos del paciente.');
            return;
        }

        const pacienteData = pacienteDoc.data();

        // Mostrar datos del paciente
        const pacienteInfoDiv = document.getElementById('paciente-info');
        pacienteInfoDiv.innerHTML = `
            <p><strong>Nombre:</strong> ${pacienteData.nombre}</p>
            <p><strong>Apellido:</strong> ${pacienteData.apellido}</p>
            <p><strong>Edad:</strong> ${pacienteData.edad}</p>
            
        `;

        // Obtener juegos relacionados con el paciente
        const juegosSnapshot = await db.collection('juegos').where('idPaciente', '==', idPaciente).get();

        // Mostrar cantidad de juegos jugados
        document.getElementById('total-juegos').innerText = juegosSnapshot.size;

        // Mostrar lista de juegos
        const juegosLista = document.getElementById('juegos-lista');
        let juegosHtml = '';
        let contador = 1;

        juegosSnapshot.forEach(doc => {
            const juego = doc.data();
            juegosHtml += `
                <tr>
                    <td>${contador++}</td>
                    <td>${juego.movimientos}</td>
                    <td>${juego.tiempo}</td>
                    <td>${calcularRango(juego.movimientos)}</td>
                </tr>
            `;
        });

        juegosLista.innerHTML = juegosHtml;
    } catch (error) {
        console.error('Error al cargar los datos del paciente:', error);
        alert('Hubo un error al cargar los datos. Por favor, inténtalo de nuevo.');
    }
}

// Llamar a la función para cargar los datos
cargarDatosPaciente();
