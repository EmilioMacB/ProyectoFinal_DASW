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
            const card = `
                <div class="col-md-6">
                    <div class="card mb-3 shadow">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="${ejercicio.img}" class="img-fluid rounded-start" alt="${ejercicio.nombre}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${ejercicio.nombre}</h5>
                                    <p class="card-text">${ejercicio.repeticiones}</p>
                                    <a href="${ejercicio.video}" target="_blank" class="btn btn-primary btn-sm">Ver Video</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            resultados.innerHTML += card;
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