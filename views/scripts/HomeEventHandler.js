alert("¡Si no lo has hecho, crea una cuenta para guardar tu rutina!");

const preguntas = [
    {
        titulo: "¿Cuál es tu nivel de experiencia en el entrenamiento con pesas?",
        opciones: [
            { id: "novato", texto: "Novato (0-6 meses)" },
            { id: "intermedio", texto: "Intermedio (6-12 meses)" },
            { id: "avanzado", texto: "Avanzado (1-3 años)" }
        ]
    },
    {
        titulo: "¿Cuál es tu principal objetivo?",
        opciones: [
            { id: "peso", texto: "Pérdida de peso" },
            { id: "musculo", texto: "Ganar Músculo" },
            { id: "condicion", texto: "Mejorar mi condición física" }
        ]
    },
    {
        titulo: "¿Cuántos días a la semana planeas entrenar?",
        opciones: [
            { id: "1-2", texto: "1-2 días" },
            { id: "3-4", texto: "3-4 días" },
            { id: "5-mas", texto: "5 o más días" }
        ]
    },
    {
        titulo: "¿Cuánto tiempo puedes dedicar a cada sesión de entrenamiento?",
        opciones: [
            { id: "30min", texto: "Menos de 30 minutos" },
            { id: "30-60min", texto: "30 a 60 minutos" },
            { id: "60min", texto: "Más de 60 minutos" }
        ]
    },
    {
        titulo: "¿Vas al gimnasio o entrenas en casa?",
        opciones: [
            { id: "gym", texto: "Gimnasio (Ejercicios con equipo)" },
            { id: "casa", texto: "Casa (Ejercicios con tu propio peso)" },
        ]
    }
];

let preguntaActual = 0;

function actualizarModal(pregunta) {
    const modalTitle = document.getElementById('cuestionarioModalLabel');
    const modalBody = document.querySelector('.modal-body');
    modalTitle.textContent = pregunta.titulo;

    let contenidoHtml = '<div class="card text-white bg-dark mb-3" style="max-width: 50rem;"><div class="card-body"><fieldset>';
    pregunta.opciones.forEach(opcion => {
        contenidoHtml += `
            <div class="radio-input">
                <label class="label">
                    <input type="radio" id="${opcion.id}" name="value-radio" value="${opcion.id}" />
                    <p class="text">${opcion.texto}</p>
                </label>
            </div>
        `;
    });
    contenidoHtml += '</fieldset></div></div>';

    contenidoHtml += `
        <div style="max-width: 700px; margin: auto; margin-bottom: 20px;">
            <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: ${((preguntaActual + 1) / preguntas.length * 100)}%;"></div>
            </div>
        </div>
        <button id="nextQuestion" class="button text-white float-end mt-2 border-light inverse-hover">
            <span>${preguntaActual + 1 === preguntas.length ? 'Terminar' : 'Siguiente'}</span>
        </button>
    `;

    modalBody.innerHTML = contenidoHtml;

    if (preguntaActual + 1 < preguntas.length) {
        document.getElementById('nextQuestion').addEventListener('click', handleNextQuestion);
    } else {
        document.getElementById('nextQuestion').addEventListener('click', function() {
            // Redirigir a la página de la rutina recomendada
            window.location.href = 'rutina.html';
        });
    }
}

function handleNextQuestion() {
    // Verificar si se ha seleccionado una opción
    const opciones = document.querySelectorAll('input[name="value-radio"]:checked');
    if (opciones.length === 0) {
        // Si no se ha seleccionado ninguna opción, mostrar una alerta
        alert("Selecciona una opción antes de continuar");
        return; // No avanzar a la siguiente pregunta
    }

    preguntaActual++;
    if (preguntaActual < preguntas.length) {
        actualizarModal(preguntas[preguntaActual]);
    } else {
        // Redirigir a la página de la rutina recomendada
        window.location.href = 'rutina.html';
    }
}

document.getElementById('nextQuestion').addEventListener('click', handleNextQuestion);

document.addEventListener('DOMContentLoaded', function() {
    actualizarModal(preguntas[0]); // Carga la primera pregunta
});
