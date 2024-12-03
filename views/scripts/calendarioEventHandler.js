const currentDate = document.querySelector(".current.date");
const daysTag = document.querySelector(".dias");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const streakImage = document.getElementById("streak-image");
const streakButton = document.getElementById("streak-button");

// Modal y elementos relacionados
const routineModal = document.getElementById("routineModal");
const saveRoutineButton = document.getElementById("saveRoutine");
const routineSelect = document.getElementById("routineSelect");

let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();
let selectedDaysByMonth = {}; // Objeto para almacenar días seleccionados y rutinas

let selectedDayForRoutine = null; // Día seleccionado para asignar una rutina

const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const renderCalendario = () => {
    const firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
    const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();

    if (!selectedDaysByMonth[`${currYear}-${currMonth}`]) {
        selectedDaysByMonth[`${currYear}-${currMonth}`] = {};
    }

    const selectedDays = selectedDaysByMonth[`${currYear}-${currMonth}`];

    let days = "";

    for (let i = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); i > 0; i--) {
        days += `<td class="inactive">${lastDateOfLastMonth - i + 1}</td>`;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
        const routine = selectedDays[i]?.routine || ""; // Verificar si tiene rutina asignada
        const isSelected = routine ? "selected" : ""; // Día seleccionado si tiene rutina
        days += `<td class="${isSelected}" data-day="${i}">
                    ${i}
                    ${routine ? `<span class="routine-label">${routine}</span>` : ""}
                 </td>`;
        if ((i + firstDayOfMonth - 1) % 7 === 0) days += "</tr><tr>";
    }

    for (let i = 1; (days.match(/<\/tr>/g) || []).length < 6; i++) {
        days += `<td class="inactive">${i}</td>`;
        if ((lastDateOfMonth + firstDayOfMonth + i - 1) % 7 === 0) days += "</tr><tr>";
    }

    currentDate.innerText = `${meses[currMonth]} ${currYear}`;
    daysTag.innerHTML = `<tr>${days}</tr>`;

    prevButton.disabled = currYear === 2024 && currMonth === 0;
    nextButton.disabled = currYear === 2025 && currMonth === 11;
};

const actualizarRacha = () => {
    const selectedDays = Object.keys(selectedDaysByMonth[`${currYear}-${currMonth}`] || {}).map(Number).sort((a, b) => a - b);

    let streak = 0;
    let maxStreak = 0;

    for (let i = 0; i < selectedDays.length; i++) {
        if (i === 0 || selectedDays[i] === selectedDays[i - 1] + 1) {
            streak++;
        } else {
            streak = 1;
        }
        maxStreak = Math.max(maxStreak, streak);
    }

    streakButton.innerText = `¡${maxStreak} días consecutivos!`;

    if (maxStreak === 0) {
        streakImage.src = "https://i.pinimg.com/736x/f0/f7/55/f0f755c4e38efd7dc0b10ddce9c7d247.jpg";
    } else if (maxStreak <= 3) {
        streakImage.src = "https://i.pinimg.com/736x/17/4c/ae/174cae556febe2c6b14dbbcd3028c264.jpg";
    } else if (maxStreak <= 6) {
        streakImage.src = "https://i.pinimg.com/736x/14/b4/a7/14b4a7e7d444607bc2661f8c38ac583a.jpg";
    } else {
        streakImage.src = "https://i.pinimg.com/736x/63/71/63/637163f11a7e107ba0a933dfca40fd26.jpg";
    }
};

daysTag.addEventListener("click", (e) => {
    const day = parseInt(e.target.dataset.day);
    if (!isNaN(day)) {
        selectedDayForRoutine = day; // Guardar el día seleccionado
        routineModal.style.display = "block"; // Mostrar modal
    }
});

saveRoutineButton.addEventListener("click", () => {
    const routine = routineSelect.value;
    if (!selectedDaysByMonth[`${currYear}-${currMonth}`][selectedDayForRoutine]) {
        selectedDaysByMonth[`${currYear}-${currMonth}`][selectedDayForRoutine] = {};
    }
    selectedDaysByMonth[`${currYear}-${currMonth}`][selectedDayForRoutine].routine = routine;
    routineModal.style.display = "none"; // Ocultar modal
    renderCalendario();
    actualizarRacha();
});

prevButton.addEventListener("click", () => {
    currMonth -= 1;
    if (currMonth < 0) {
        currMonth = 11;
        currYear -= 1;
    }
    renderCalendario();
    actualizarRacha();
});

nextButton.addEventListener("click", () => {
    currMonth += 1;
    if (currMonth > 11) {
        currMonth = 0;
        currYear += 1;
    }
    renderCalendario();
    actualizarRacha();
});

renderCalendario();
actualizarRacha();
