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

document.addEventListener("DOMContentLoaded", function () {
    const rutina = JSON.parse(localStorage.getItem("rutina"));

    if (!rutina) {
        showToast("No se encontró una rutina. Completa el cuestionario primero.", "error");
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

        const card = document.createElement("div");
        card.className = "card rutina-card";

        const cardTitle = document.createElement("h5");
        cardTitle.className = "card-title text-center text-uppercase my-3";
        cardTitle.textContent = dia.day;

        const rutinaBody = document.createElement("div");
        rutinaBody.className = "rutina-body";

        dia.exercises.forEach((ex) => {
            const exerciseItem = document.createElement("div");
            exerciseItem.className = "exercise-item d-flex align-items-center";

            const img = document.createElement("img");
            img.className = "exercise-img me-3";
            img.setAttribute("src", ex.img);
            img.setAttribute("alt", ex.name);

            const infoDiv = document.createElement("div");

            const nameP = document.createElement("p");
            nameP.className = "exercise-title mb-1";
            const strong = document.createElement("strong");
            strong.textContent = ex.name;
            nameP.appendChild(strong);

            const repsP = document.createElement("p");
            repsP.className = "exercise-reps mb-1";
            repsP.textContent = ex.reps;

            const videoLink = document.createElement("a");
            videoLink.className = "btn btn-link text-decoration-none";
            videoLink.setAttribute("href", ex.video);
            videoLink.setAttribute("target", "_blank");
            videoLink.textContent = "Ver Tutorial";

            infoDiv.appendChild(nameP);
            infoDiv.appendChild(repsP);
            infoDiv.appendChild(videoLink);

            exerciseItem.appendChild(img);
            exerciseItem.appendChild(infoDiv);
            rutinaBody.appendChild(exerciseItem);
        });

        card.appendChild(cardTitle);
        card.appendChild(rutinaBody);
        rutinaItem.appendChild(card);
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
