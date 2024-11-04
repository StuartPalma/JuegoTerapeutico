<?php
session_start(); // Inicia la sesión

// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mi_base_de_datos";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtiene y sanitiza los datos del formulario
$nombre = $conn->real_escape_string($_POST['nombre']);
$apellido = $conn->real_escape_string($_POST['apellido']);
$correo = $conn->real_escape_string($_POST['correo']);
$contrasena = password_hash($_POST['contrasena'], PASSWORD_BCRYPT); // Encripta la contraseña

// Inserta los datos en la base de datos
$sql = "INSERT INTO usuarios (nombre, apellido, correo, contrasena) VALUES ('$nombre', '$apellido', '$correo', '$contrasena')";

if ($conn->query($sql) === TRUE) {
    // Guarda los datos del usuario en la sesión
    $_SESSION['nombre'] = $nombre;
    $_SESSION['apellido'] = $apellido;
    $_SESSION['correo'] = $correo;

    // Redirige a una página de bienvenida o dashboard
    header("Location: bienvenida.php");
    exit();
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>