document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('click', function() {
        let parentListItem = this.closest('.card-body');
        if (parentListItem) {
            this.textContent = 'Terminado';
            // Actualizar el progreso
            updateProgress();
        }
    });
});

function updateProgress() {
    let totalActivities = document.querySelectorAll('.card').length;
    let completedActivities = document.querySelectorAll('button:contains("Terminado")').length;
    let progressPercentage = (completedActivities / totalActivities) * 100;
    document.querySelector('.progress-bar').style.width = progressPercentage + '%';
}

document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar recargar la página

    // Obtener los valores del formulario
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const contraseña = document.getElementById("contraseña").value;
    const confContraseña = document.getElementById("confContraseña").value;

    // Validar que las contraseñas coincidan
    if (contraseña !== confContraseña) {
        alert("Las contraseñas no coinciden");
        return;
    }

    // Crear el objeto de usuario
    const usuario = { Name: nombre, Email: correo, Password: contraseña };

    try {
        // Hacer la solicitud al backend
        const response = await fetch("http://localhost:3000/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario),
        });

        // Manejar la respuesta del servidor
        const data = await response.json();
        if (response.ok) {
            alert("Usuario registrado con éxito");
            this.reset(); // Reiniciar el formulario
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al registrar el usuario");
    }
});
