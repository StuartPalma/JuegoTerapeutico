// firebaseConfig.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCx9LP5qF7Ce55QxcGIKskvppiQGYfYYL0",
    authDomain: "juegoterrapeuticoepn.firebaseapp.com",
    projectId: "juegoterrapeuticoepn",
    storageBucket: "juegoterrapeuticoepn.firebasestorage.app",
    messagingSenderId: "537931533464",
    appId: "1:537931533464:web:789d18eddff759799d14ed",
    measurementId: "G-WB9KER4NJB"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para almacenar los datos del juego en la base de datos
async function almacenarDatosPartida(movimientos, tiempoJuego) {
    const pacienteId = "paciente123"; // Ajustar según la lógica de tu aplicación para obtener dinámicamente el ID del paciente
    let evaluacion = "";

    if (movimientos <= 9) {
        evaluacion = "Excelente";
    } else if (movimientos <= 15) {
        evaluacion = "Regular";
    } else {
        evaluacion = "Pésimo";
    }

    try {
        await addDoc(collection(db, "datos_partida"), {
            pacienteId: pacienteId,
            tiempoJuego: tiempoJuego,
            movimientos: movimientos,
            evaluacion: evaluacion,
            fecha: new Date().toISOString()
        });
        console.log("Datos de partida almacenados correctamente");
    } catch (e) {
        console.error("Error al almacenar los datos de la partida: ", e);
    }
}

// Exportar la función para usarla en otros scripts
export { almacenarDatosPartida };
