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
    const totalActivities = document.querySelectorAll('.card').length;
    const completedActivities = document.querySelectorAll('button.completed').length;
    const progressPercentage = (completedActivities / totalActivities) * 100;
    document.querySelector('.progress-bar').style.width = progressPercentage + '%';
}

document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.add('completed'); // Añadir clase 'completed'
        this.textContent = 'Terminado';
        updateProgress(); // Actualizar progreso
    });
});


// Parte del registro
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

// iniciar sesion
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevenir recarga de la página al enviar el formulario

    // Capturar los valores ingresados en el formulario
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // Realizar la solicitud al backend
        const response = await fetch("http://localhost:3000/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Email: email, Password: password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Inicio de sesión exitoso");

            // Si hay datos adicionales, como la rutina del usuario
            if (data.routine) {
                mostrarRutina(data.routine); // Mostrar rutina del backend
            } else {
                console.log("No se encontró rutina guardada para este usuario.");
            }
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al iniciar sesión");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Recuperar rutina del localStorage
    const rutina = JSON.parse(localStorage.getItem("rutina"));

    if (!rutina) {
        alert("No se encontró una rutina. Completa el cuestionario primero.");
        return;
    }

    // Mostrar rutina en la página
    mostrarRutina(rutina);

    // Actualizar progreso dinámicamente
    updateProgress(rutina);
});

// Función para mostrar la rutina en el contenedor
function mostrarRutina(rutina) {
    const rutinaContainer = document.getElementById("rutinaContainer");
    rutinaContainer.innerHTML = ""; // Limpiar contenedor dinámico

    rutina.forEach((dia) => {
        const rutinaItem = document.createElement("div");
        rutinaItem.classList.add("col-md-6", "mb-4"); // Espacio entre tarjetas
        rutinaItem.innerHTML = `
            <div class="card rutina-card">
                <h5 class="card-title text-center text-uppercase my-3"> ${dia.day}</h5>
                <div class="rutina-body">
                    ${dia.exercises.map(ex => `
                        <div class="exercise-item d-flex align-items-center">
                            <img src="${ex.img}" alt="${ex.name}" class="exercise-img me-3">
                            <div>
                                <p class="exercise-title mb-1"><strong>${ex.name}</strong></p>
                                <p class="exercise-reps mb-1">${ex.reps}</p>
                                <a href="${ex.video}" target="_blank" class="btn btn-link text-decoration-none">Ver Tutorial</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        rutinaContainer.appendChild(rutinaItem);
    });
}


// Función para actualizar el progreso dinámicamente
function updateProgress(rutina) {
    const progressList = document.getElementById("progressList");
    const progressBar = document.getElementById("progressBar");

    // Limpiar progreso anterior
    progressList.innerHTML = "";
    let completedCount = 0;

    // Generar lista dinámica de progreso
    rutina.forEach((dia) => {
        dia.exercises.forEach((ejercicio) => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.textContent = ejercicio.name;

            const statusBadge = document.createElement("span");
            statusBadge.className = "badge bg-primary rounded-pill";
            statusBadge.textContent = "X";

            listItem.appendChild(statusBadge);
            progressList.appendChild(listItem);

            // Evento para marcar como completado
            listItem.addEventListener("click", () => {
                if (statusBadge.textContent === "X") {
                    statusBadge.textContent = "✔";
                    completedCount++;
                } else {
                    statusBadge.textContent = "X";
                    completedCount--;
                }

                // Actualizar barra de progreso
                const progressPercentage = (completedCount / rutina.length) * 100;
                progressBar.style.width = `${progressPercentage}%`;
            });
        });
    });
}


// Manejo del inicio de sesión desde rutina.html
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Email: email, Password: password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Inicio de sesión exitoso");

            const rutina = JSON.parse(localStorage.getItem("rutina"));
            if (rutina) {
                await guardarRutinaEnPerfil(data.userId, rutina);
                localStorage.removeItem("rutina"); // Limpia el localStorage
            }

            // Si el usuario ya tiene una rutina guardada en el backend
            if (data.routine) {
                mostrarRutina(data.routine);
            }
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Hubo un problema al iniciar sesión");
    }
});

// Función para guardar la rutina en el perfil del usuario
async function guardarRutinaEnPerfil(userId, rutina) {
    try {
        const response = await fetch("http://localhost:3000/api/users/saveRoutine", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, routine: rutina }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error al guardar la rutina: ${errorData.message}`);
        } else {
            alert("Rutina guardada con éxito en tu perfil.");
        }
    } catch (error) {
        console.error("Error al guardar la rutina en el perfil del usuario:", error);
    }
}
