const currentDate = document.querySelector(".current.date");
const daysTag = document.querySelector(".dias");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const streakImage = document.getElementById("streak-image");
const streakButton = document.getElementById("streak-button");

let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();
let selectedDays = new Set(); // Conjunto para almacenar los días seleccionados

const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const renderCalendario = () => {
    const firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
    const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();

    let days = "";

    // Días del mes anterior
    for (let i = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; i > 0; i--) {
        days += `<td class="inactive">${lastDateOfLastMonth - i + 1}</td>`;
    }

    // Días del mes actual
    for (let i = 1; i <= lastDateOfMonth; i++) {
        const isSelected = selectedDays.has(i) ? "selected" : "";
        days += `<td class="${isSelected}" data-day="${i}">${i}</td>`;
        if ((i + firstDayOfMonth - 1) % 7 === 0) days += "</tr><tr>";
    }

    // Días del próximo mes
    for (let i = 1; (days.match(/<\/tr>/g) || []).length < 6; i++) {
        days += `<td class="inactive">${i}</td>`;
        if ((lastDateOfMonth + firstDayOfMonth + i - 1) % 7 === 0) days += "</tr><tr>";
    }

    currentDate.innerText = `${meses[currMonth]} ${currYear}`;
    daysTag.innerHTML = `<tr>${days}</tr>`;

    // Desactivar botones si alcanzan los límites
    prevButton.disabled = currYear === 2024 && currMonth === 0;
    nextButton.disabled = currYear === 2025 && currMonth === 11;
};

const actualizarRacha = () => {
    const streak = [...selectedDays].reduce((maxStreak, day, index, arr) => {
        if (index > 0 && day === arr[index - 1] + 1) return maxStreak + 1;
        return 1;
    }, 0);

    streakButton.innerText = `¡${streak} días consecutivos!`;

    if (streak === 0) {
        streakImage.src = "https://i.pinimg.com/736x/f0/f7/55/f0f755c4e38efd7dc0b10ddce9c7d247.jpg";
    } else if (streak <= 3) {
        streakImage.src = "https://i.pinimg.com/736x/17/4c/ae/174cae556febe2c6b14dbbcd3028c264.jpg";
    } else if (streak <= 6) {
        streakImage.src = "https://i.pinimg.com/736x/14/b4/a7/14b4a7e7d444607bc2661f8c38ac583a.jpg";
    } else {
        streakImage.src = "https://i.pinimg.com/736x/63/71/63/637163f11a7e107ba0a933dfca40fd26.jpg";
    }
};

daysTag.addEventListener("click", (e) => {
    const day = parseInt(e.target.dataset.day);
    if (!isNaN(day)) {
        if (selectedDays.has(day)) {
            selectedDays.delete(day); // Deseleccionar
        } else {
            selectedDays.add(day); // Seleccionar
        }
        renderCalendario();
        actualizarRacha();
    }
});

prevButton.addEventListener("click", () => {
    currMonth -= 1;
    if (currMonth < 0) {
        currMonth = 11;
        currYear -= 1;
    }
    renderCalendario();
});

nextButton.addEventListener("click", () => {
    currMonth += 1;
    if (currMonth > 11) {
        currMonth = 0;
        currYear += 1;
    }
    renderCalendario();
});

renderCalendario();