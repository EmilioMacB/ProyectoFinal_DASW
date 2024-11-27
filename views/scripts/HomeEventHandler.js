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
            { id: "musculo", texto: "Ganar músculo" },
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
            { id: "casa", texto: "Casa (Ejercicios con tu propio peso)" }
        ]
    }
];

let preguntaActual = 0; // Índice de la pregunta actual
const respuestas = {}; // Objeto para almacenar las respuestas del cuestionario

// Función para actualizar el modal con la pregunta actual
function actualizarModal(pregunta) {
    const modalTitle = document.getElementById('cuestionarioModalLabel');
    const modalBody = document.querySelector('.modal-body');

    // Cambiar el título del modal
    modalTitle.textContent = pregunta.titulo;

    // Generar dinámicamente las opciones de respuesta
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

    // Barra de progreso y botón
    contenidoHtml += `
        <div style="max-width: 700px; margin: auto; margin-bottom: 20px;">
            <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="${((preguntaActual + 1) / preguntas.length) * 100}" aria-valuemin="0" aria-valuemax="100" style="width: ${((preguntaActual + 1) / preguntas.length) * 100}%;">
                </div>
            </div>
        </div>
        <button id="nextQuestion" class="button text-white float-end mt-2 border-light inverse-hover">
            <span>${preguntaActual + 1 === preguntas.length ? 'Terminar' : 'Siguiente'}</span>
        </button>
    `;

    modalBody.innerHTML = contenidoHtml;

    // Agregar manejador para el botón "Siguiente"
    const nextButton = document.getElementById('nextQuestion');
    if (preguntaActual + 1 < preguntas.length) {
        nextButton.addEventListener('click', handleNextQuestion);
    } else {
        nextButton.addEventListener('click', enviarRespuestas);
    }
}

// Función para manejar el clic en "Siguiente"
function handleNextQuestion() {
    // Verificar si se seleccionó una opción
    const opcionSeleccionada = document.querySelector('input[name="value-radio"]:checked');
    if (!opcionSeleccionada) {
        alert("Selecciona una opción antes de continuar");
        return; // No avanzar si no se seleccionó una opción
    }

    // Guardar la respuesta seleccionada
    const preguntaActualKey = preguntas[preguntaActual].titulo; // Usar el título como clave
    respuestas[preguntaActualKey] = opcionSeleccionada.value;

    // Avanzar a la siguiente pregunta
    preguntaActual++;
    if (preguntaActual < preguntas.length) {
        actualizarModal(preguntas[preguntaActual]);
    }
}

// Función para enviar las respuestas al backend
async function enviarRespuestas() {
    const respuestasBackend = {
        nivel: respuestas["¿Cuál es tu nivel de experiencia en el entrenamiento con pesas?"],
        objetivo: respuestas["¿Cuál es tu principal objetivo?"],
        dias: respuestas["¿Cuántos días a la semana planeas entrenar?"],
        tiempo: respuestas["¿Cuánto tiempo puedes dedicar a cada sesión de entrenamiento?"],
    };

    try {
        const response = await fetch("http://localhost:3000/api/users/generateRoutine", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(respuestasBackend),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Rutina generada exitosamente");
            localStorage.setItem("rutina", JSON.stringify(data.routine)); // Guardar rutina en localStorage
            window.location.href = "rutina.html"; // Redirigir a la página de la rutina
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error al enviar respuestas:", error);
        alert("Hubo un problema al generar la rutina");
    }
}

// Cargar la primera pregunta cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    actualizarModal(preguntas[0]); // Mostrar la primera pregunta en el modal
});
