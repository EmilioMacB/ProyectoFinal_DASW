document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('click', function () {
        let parentListItem = this.closest('.card-body');
        if (parentListItem) {
            this.textContent = 'Terminado';
            this.classList.add('completed'); // Añadir clase 'completed'
            updateProgress(); // Actualizar progreso
        }
    });
});

function updateProgress() {
    const totalActivities = document.querySelectorAll('.card').length;
    const completedActivities = document.querySelectorAll('button.completed').length;
    const progressPercentage = (completedActivities / totalActivities) * 100;
    document.querySelector('.progress-bar').style.width = `${progressPercentage}%`;
}

// Registro de usuario
document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar recargar la página

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const contraseña = document.getElementById("contraseña").value;
    const confContraseña = document.getElementById("confContraseña").value;

    if (contraseña !== confContraseña) {
        alert("Las contraseñas no coinciden");
        return;
    }

    const usuario = { Name: nombre, Email: correo, Password: contraseña };

    try {
        const response = await fetch("http://localhost:3000/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario),
        });

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

// Inicio de sesión
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

            if (data.routine) {
                mostrarRutina(data.routine); // Mostrar rutina del backend
            } else {
                console.log("No se encontró rutina guardada para este usuario.");
            }
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Hubo un problema al iniciar sesión");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const rutina = JSON.parse(localStorage.getItem("rutina"));

    if (!rutina) {
        alert("No se encontró una rutina. Completa el cuestionario primero.");
        return;
    }

    mostrarRutina(rutina);
    updateProgress(rutina);
});

function mostrarRutina(rutina) {
    const rutinaContainer = document.getElementById("rutinaContainer");
    rutinaContainer.innerHTML = ""; // Limpiar contenedor dinámico

    rutina.forEach((dia) => {
        const rutinaItem = document.createElement("div");
        rutinaItem.classList.add("col-md-6", "mb-4");
        rutinaItem.innerHTML = `
            <div class="card rutina-card">
                <h5 class="card-title text-center text-uppercase my-3">${dia.day}</h5>
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

function updateProgress(rutina) {
    const progressList = document.getElementById("progressList");
    const progressBar = document.getElementById("progressBar");

    progressList.innerHTML = "";
    let completedCount = 0;

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

            listItem.addEventListener("click", () => {
                if (statusBadge.textContent === "X") {
                    statusBadge.textContent = "✔";
                    completedCount++;
                } else {
                    statusBadge.textContent = "X";
                    completedCount--;
                }

                const progressPercentage = (completedCount / rutina.length) * 100;
                progressBar.style.width = `${progressPercentage}%`;
            });
        });
    });
}
