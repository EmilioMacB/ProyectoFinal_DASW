document.addEventListener("DOMContentLoaded", () => {
    const filtroMusculo = document.getElementById("filtroMusculo");
    const filtroNivel = document.getElementById("filtroNivel");
    const btnBuscar = document.getElementById("btnBuscar");
    const resultados = document.getElementById("resultados");

    let ejerciciosData = {};

    // Cargar datos desde el archivo JSON
    fetch("scripts/datos_ejercicios.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al cargar el archivo JSON");
            }
            return response.json();
        })
        .then((data) => {
            ejerciciosData = data;

            // Mostrar todos los ejercicios al cargar la página
            filtroMusculo.value = "todos";
            filtroNivel.value = "todos";
            buscarEjercicios(); // Mostrar todos los ejercicios por defecto
        })
        .catch((error) => {
            console.error("Error al cargar los datos:", error);
            resultados.innerHTML = "<p class='text-center text-danger'>No se pudieron cargar los datos de ejercicios.</p>";
        });

    // Función para renderizar ejercicios
    function renderizarEjercicios(ejercicios) {
        resultados.innerHTML = ""; // Limpiar resultados previos
        if (ejercicios.length === 0) {
            resultados.innerHTML = "<p class='text-center text-danger'>No hay ejercicios disponibles para esta selección.</p>";
            return;
        }
        ejercicios.forEach((ejercicio) => {
            // Estructura exterior
            const colDiv = document.createElement("div");
            colDiv.className = "col-md-6";

            const cardDiv = document.createElement("div");
            cardDiv.className = "card mb-3 shadow";

            const rowDiv = document.createElement("div");
            rowDiv.className = "row g-0";

            // Columna imagen
            const imgColDiv = document.createElement("div");
            imgColDiv.className = "col-md-4";

            const img = document.createElement("img");
            img.className = "img-fluid rounded-start";
            img.setAttribute("src", ejercicio.img);
            img.setAttribute("alt", ejercicio.nombre);
            imgColDiv.appendChild(img);

            // Columna contenido
            const contentColDiv = document.createElement("div");
            contentColDiv.className = "col-md-8";

            const cardBody = document.createElement("div");
            cardBody.className = "card-body";

            const title = document.createElement("h5");
            title.className = "card-title";
            title.textContent = ejercicio.nombre;

            const reps = document.createElement("p");
            reps.className = "card-text";
            reps.textContent = ejercicio.repeticiones;

            const link = document.createElement("a");
            link.className = "btn btn-primary btn-sm";
            link.setAttribute("href", ejercicio.video);
            link.setAttribute("target", "_blank");
            link.textContent = "Ver Video";

            // Ensamblar
            cardBody.appendChild(title);
            cardBody.appendChild(reps);
            cardBody.appendChild(link);
            contentColDiv.appendChild(cardBody);
            rowDiv.appendChild(imgColDiv);
            rowDiv.appendChild(contentColDiv);
            cardDiv.appendChild(rowDiv);
            colDiv.appendChild(cardDiv);
            resultados.appendChild(colDiv);
        });
    }

    // Función para buscar y filtrar ejercicios
    function buscarEjercicios() {
        const musculo = filtroMusculo.value;
        const nivel = filtroNivel.value;

        let ejerciciosFiltrados = [];

        if (musculo === "todos") {
            // Si no se selecciona un músculo específico, mostrar todos los ejercicios
            for (const musculoKey in ejerciciosData) {
                for (const nivelKey in ejerciciosData[musculoKey]) {
                    ejerciciosFiltrados = ejerciciosFiltrados.concat(ejerciciosData[musculoKey][nivelKey]);
                }
            }
        } else if (nivel === "todos") {
            // Si el nivel es "Todos", mostrar todos los niveles para el músculo seleccionado
            if (ejerciciosData[musculo]) {
                for (const nivelKey in ejerciciosData[musculo]) {
                    ejerciciosFiltrados = ejerciciosFiltrados.concat(ejerciciosData[musculo][nivelKey]);
                }
            }
        } else {
            // Filtrar ejercicios específicos
            ejerciciosFiltrados = ejerciciosData[musculo]?.[nivel] || [];
        }

        // Renderizar los ejercicios filtrados
        renderizarEjercicios(ejerciciosFiltrados);
    }

    // Agregar evento al botón de buscar
    btnBuscar.addEventListener("click", buscarEjercicios);
});