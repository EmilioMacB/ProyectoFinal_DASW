// ============================================
// ESTADO GLOBAL
// ============================================
const state = {
    currentRoutine: null,
    savedRoutines: [],
    isLogged: false,
    isSavedRoutine: false,
    currentSavedRoutineIndex: null,
};

const API_URL = "http://localhost:3000";

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener("DOMContentLoaded", async function () {
    updateAuthState();
    await initializeRoutineDisplay();
    setupEventListeners();
});

async function initializeRoutineDisplay() {
    const temporaryRoutine = JSON.parse(localStorage.getItem("rutina"));

    if (state.isLogged) {
        await loadSavedRoutines();

        // Prioridad 1: rutina temporal en localStorage
        if (temporaryRoutine) {
            state.currentRoutine = temporaryRoutine;
            state.isSavedRoutine = false;
        }
        // Prioridad 2: última rutina guardada
        else if (state.savedRoutines.length > 0) {
            const lastRoutine = state.savedRoutines[state.savedRoutines.length - 1];
            state.currentRoutine = lastRoutine.days;
            state.isSavedRoutine = true;
            state.currentSavedRoutineIndex = state.savedRoutines.length - 1;
        }
    } else {
        // Usuario no logueado: mostrar solo rutina temporal si existe
        if (temporaryRoutine) {
            state.currentRoutine = temporaryRoutine;
        }
    }

    renderRoutine();
}

function updateAuthState() {
    state.isLogged = localStorage.getItem("isLogged") === "true";
}

function setupEventListeners() {
    const saveBtn = document.getElementById("saveRoutineBtn");
    const viewMoreBtn = document.getElementById("viewRoutinesBtn");

    if (saveBtn) {
        saveBtn.addEventListener("click", handleSaveRoutine);
    }

    if (viewMoreBtn) {
        viewMoreBtn.addEventListener("click", () => {
            const modal = new bootstrap.Modal(document.getElementById("routinesModal"));
            modal.show();
        });
    }
}

// ============================================
// RENDERIZACIÓN PRINCIPAL
// ============================================
function renderRoutine() {
    const emptyState = document.getElementById("emptyStateContainer");
    const routineContent = document.getElementById("routineContent");

    if (!state.currentRoutine) {
        emptyState.classList.remove("is-hidden");
        routineContent.classList.add("is-hidden");
        return;
    }

    emptyState.classList.add("is-hidden");
    routineContent.classList.remove("is-hidden");

    mostrarRutina(state.currentRoutine);
    updateProgress(state.currentRoutine);
    updateViewMoreButton();
}

function updateViewMoreButton() {
    const viewMoreBtn = document.getElementById("viewRoutinesBtn");
    if (viewMoreBtn) {
        viewMoreBtn.classList.toggle("is-hidden", !(state.isLogged && state.savedRoutines.length > 0));
    }
}

// ============================================
// MOSTRAR RUTINA (original)
// ============================================
function mostrarRutina(rutina) {
    const rutinaContainer = document.getElementById("rutinaContainer");
    rutinaContainer.innerHTML = "";

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

// ============================================
// PROGRESO (original)
// ============================================
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

                const totalExercises = rutina.reduce((acc, d) => acc + d.exercises.length, 0);
                const progressPercentage = (completedCount / totalExercises) * 100;
                progressBar.style.width = `${progressPercentage}%`;
            });
        });
    });
}

// ============================================
// GUARDAR RUTINA
// ============================================
async function handleSaveRoutine() {
    if (!state.currentRoutine) {
        showToast("No hay rutina para guardar", "error");
        return;
    }

    if (!state.isLogged) {
        routineToSave = state.currentRoutine;
        const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
        loginModal.show();
    } else {
        await saveRoutineToDatabase(state.currentRoutine);
    }
}

async function saveRoutineToDatabase(routine) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_URL}/api/users/saveRoutine`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ routine: routine }),
        });

        const data = await response.json();

        if (response.ok) {
            // Limpiar rutina temporal de localStorage
            localStorage.removeItem("rutina");

            // Recargar rutinas guardadas
            await loadSavedRoutines();

            // Mostrar última rutina guardada
            if (state.savedRoutines.length > 0) {
                const lastRoutine = state.savedRoutines[state.savedRoutines.length - 1];
                state.currentRoutine = lastRoutine.days;
                state.isSavedRoutine = true;
                state.currentSavedRoutineIndex = state.savedRoutines.length - 1;
            }

            renderRoutine();
            showToast("Rutina guardada exitosamente", "success");
        } else {
            showToast(`Error: ${data.message}`, "error");
        }
    } catch (error) {
        console.error("Error al guardar rutina:", error);
        showToast("Hubo un error al guardar la rutina", "error");
    }
}

// ============================================
// CARGAR Y MOSTRAR RUTINAS GUARDADAS
// ============================================
async function loadSavedRoutines() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_URL}/api/users/routines`, {
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (response.ok) {
            const data = await response.json();
            state.savedRoutines = data.routines || [];
        }
    } catch (error) {
        console.error("Error cargando rutinas guardadas:", error);
    }
}

function displaySavedRoutinesModal() {
    const listContainer = document.getElementById("routinesList");
    listContainer.innerHTML = "";

    if (state.savedRoutines.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-4">
                <p class="empty-routines-message">No hay rutinas guardadas</p>
            </div>
        `;
        return;
    }

    state.savedRoutines.forEach((routine, index) => {
        const createdDate = new Date(routine.createdAt);
        const formattedDate = createdDate.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        const isActive = state.currentSavedRoutineIndex === index && state.isSavedRoutine;
        const totalExercises = routine.days.reduce((acc, day) => acc + day.exercises.length, 0);

        const item = document.createElement("div");
        item.className = `routine-item ${isActive ? "active" : ""}`;

        // Info section
        const infoDiv = document.createElement("div");
        infoDiv.className = "routine-item-info";

        const nameDiv = document.createElement("div");
        nameDiv.className = "routine-item-name";
        nameDiv.textContent = routine.name;

        const detailsDiv = document.createElement("div");
        detailsDiv.className = "routine-item-details";

        // Date detail
        const dateDetail = document.createElement("div");
        dateDetail.className = "routine-item-detail";
        const dateIcon = document.createElement("i");
        dateIcon.className = "fa-solid fa-calendar routine-item-icon";
        dateIcon.setAttribute("aria-hidden", "true");
        const dateSpan = document.createElement("span");
        dateSpan.textContent = formattedDate;
        dateDetail.appendChild(dateIcon);
        dateDetail.appendChild(dateSpan);

        // Days detail
        const daysDetail = document.createElement("div");
        daysDetail.className = "routine-item-detail";
        const daysIcon = document.createElement("i");
        daysIcon.className = "fa-solid fa-layer-group routine-item-icon";
        daysIcon.setAttribute("aria-hidden", "true");
        const daysSpan = document.createElement("span");
        daysSpan.textContent = `${routine.days.length} días`;
        daysDetail.appendChild(daysIcon);
        daysDetail.appendChild(daysSpan);

        // Exercises detail
        const exDetail = document.createElement("div");
        exDetail.className = "routine-item-detail";
        const exIcon = document.createElement("i");
        exIcon.className = "fa-solid fa-dumbbell routine-item-icon";
        exIcon.setAttribute("aria-hidden", "true");
        const exSpan = document.createElement("span");
        exSpan.textContent = `${totalExercises} ejercicios`;
        exDetail.appendChild(exIcon);
        exDetail.appendChild(exSpan);

        detailsDiv.appendChild(dateDetail);
        detailsDiv.appendChild(daysDetail);
        detailsDiv.appendChild(exDetail);

        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(detailsDiv);

        // Button
        const button = document.createElement("button");
        button.className = "routine-item-select";
        button.textContent = isActive ? "Viendo" : "Ver";
        button.addEventListener("click", () => selectRoutineFromModal(index));

        item.appendChild(infoDiv);
        item.appendChild(button);
        listContainer.appendChild(item);
    });
}

function selectRoutineFromModal(index) {
    const routine = state.savedRoutines[index];
    if (!routine) return;

    state.currentRoutine = routine.days;
    state.isSavedRoutine = true;
    state.currentSavedRoutineIndex = index;

    renderRoutine();
    displaySavedRoutinesModal(); // Actualizar modal para mostrar el nuevo estado

    showToast(`Mostrando ${routine.name}`, "success");
}

// ============================================
// EVENTO: CUANDO SE ABRE EL MODAL
// ============================================
document.addEventListener("DOMContentLoaded", function () {
    const routinesModal = document.getElementById("routinesModal");
    if (routinesModal) {
        routinesModal.addEventListener("show.bs.modal", function () {
            displaySavedRoutinesModal();
        });
    }
});

// ============================================
// RECARGAR AL ACTUALIZAR RUTINA (desde cuestionario)
// ============================================
window.addEventListener("storage", function (e) {
    if (e.key === "rutina" && e.newValue) {
        // Nueva rutina generada desde el cuestionario
        state.currentRoutine = JSON.parse(e.newValue);
        state.isSavedRoutine = false;
        state.currentSavedRoutineIndex = null;
        renderRoutine();
        showToast("Nueva rutina generada", "info");
    }

    if (e.key === "isLogged") {
        // Usuario se logueó/deslogueó desde otra tab
        updateAuthState();
        initializeRoutineDisplay();
    }
});

// ============================================
// INTEGRACIÓN CON LOGIN (authModal.js)
// ============================================
function onLoginSuccess() {
    updateAuthState();
    initializeRoutineDisplay();
}
