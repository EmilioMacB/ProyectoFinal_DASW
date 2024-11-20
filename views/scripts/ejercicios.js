document.addEventListener("DOMContentLoaded", () => {
    // Datos de ejercicios organizados por categoría y nivel
    const ejerciciosData = {
        espalda: {
            principiante: [
                { nombre: "Polea hacia abajo con cable", repeticiones: "15 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/latzug.png" },
                { nombre: "Superman", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/rueckenstrecken-liegend.png" }, 
                { nombre: "Remo con cable", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/rudern-kabelzug.png" },
                { nombre: "Banda de vuelo inverso", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/reverse-flys-fitnessbank.png" },
            ],
            intermedio: [
                { nombre: "Remo con mancuerna", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/rudern-kurzhantel.png" }, 
                { nombre: "Dominadas asistidas", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/klimmzuege-maschine-unterstuetzt.png" }, 
                { nombre: "Remo inclinado con barra", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/rudern-langhantel.png" },
                { nombre: "Pull-over", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2019/05/ueberzuege-kurzhantel.png" }, 
            ],
            avanzado: [
                { nombre: "Dominadas al cuello", repeticiones: "8 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/klimmzuege-nacken.png" },
                { nombre: "Peso muerto convencional", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/deadlift-kreuzheben.png" }, 
                { nombre: "Remo inclinado con barra pesada", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/rudern-langhantel.png" },
                { nombre: "Pull-ups cerrados", repeticiones: "8 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/klimmzuege-hammergriff.png" }, 
            ],
        },
        pecho: {
            principiante: [
                { nombre: "Press de pecho", repeticiones: "15 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/brustpresse-flach.png" }, 
                { nombre: "Press de banca con mancuernas", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2019/07/bankdruecken-kurzhantel-flachbank.png" },
                { nombre: "Aperturas con mancuerna", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2019/02/fliegende-flachbank-kurzhanteln-1.png" },
                { nombre: "Flexiones inclinadas", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/negativ-liegestuetze.png" },
            ],
            intermedio: [
                { nombre: "Press de banca con barra", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2018/11/bankdruecken-flachbank-langhantel.png" },
                { nombre: "Aperturas con mancuernas en banco inclinado", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/fliegende-schraegbank.png" }, 
                { nombre: "Fondos", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/arnold-dips.png" }, 
                { nombre: "Press inclinado con mancuernas", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/bankdruecken-kurzhantel-schraeg.png" }, 
            ],
            avanzado: [
                { nombre: "Press de banca con barra pesada", repeticiones: "8 repeticiones", img: "https://training.fit/wp-content/uploads/2018/11/bankdruecken-flachbank-langhantel.png" },
                { nombre: "Press inclinado con barra", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/schraegbankdruecken-langhantel.png" }, 
                { nombre: "Aperturas con mancuernas pesadas", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2019/02/fliegende-flachbank-kurzhanteln-1.png" }, 
                { nombre: "Push-ups explosivas con bola de ejercicio", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/liegestuetze-gymnastikball.png" }, 
            ],
        },
        brazos: {
            principiante: [
                { nombre: "Curls de bíceps con mancuernas", repeticiones: "12 repeticiones", img: "https://i.blogs.es/277dd4/martillo1/650_1200.webp" },
                { nombre: "Extensión de tríceps", repeticiones: "12 repeticiones", img: "https://eresfitness.com/wp-content/uploads/2019/06/Extensi%C3%B3n-de-tr%C3%ADceps-en-polea-alta-MUSCULOS-INVOLUCRADOS.jpg.webp" },
                { nombre: "Press militar con mancuernas", repeticiones: "10 repeticiones", img: "https://mundoentrenamiento.com/wp-content/uploads/2019/06/press-militar-con-mancuernas.jpg" }, 
                { nombre: "Elevaciones laterales con mancuernas", repeticiones: "12 repeticiones", img: "https://eresfitness.com/wp-content/uploads/2019/09/Elevaciones-laterales-con-mancuernas.jpg.webp" }, 
            ],
            intermedio: [
                { nombre: "Curls de barra recta", repeticiones: "10 repeticiones", img: "https://static.strengthlevel.com/images/exercises/barbell-curl/barbell-curl-800.jpg" }, 
                { nombre: "Extensiones de tríceps en banco", repeticiones: "12 repeticiones", img: "https://static.strengthlevel.com/images/exercises/lying-tricep-extension/lying-tricep-extension-800.jpg" }, 
                { nombre: "Press militar con barra", repeticiones: "10 repeticiones", img: "https://i.blogs.es/6485db/pres-hombro/650_1200.jpg" }, 
                { nombre: "Elevaciones frontales con mancuernas", repeticiones: "10 repeticiones", img: "https://static.strengthlevel.com/images/exercises/dumbbell-front-raise/dumbbell-front-raise-800.jpg" }, 
            ],
            avanzado: [
                { nombre: "Curl de bíceps con barra Z", repeticiones: "10 repeticiones", img: "https://static.strengthlevel.com/images/exercises/ez-bar-curl/ez-bar-curl-800.jpg" }, 
                { nombre: "Fondos para tríceps con lastre", repeticiones: "10 repeticiones", img: "https://static.strengthlevel.com/images/exercises/seated-dip-machine/seated-dip-machine-800.jpg" }, 
                { nombre: "Press militar de pie con barra", repeticiones: "8 repeticiones", img: "https://static.strengthlevel.com/images/exercises/military-press/military-press-800.jpg" }, 
                { nombre: "Arnold press con mancuernas", repeticiones: "10 repeticiones", img: "https://static.strengthlevel.com/images/exercises/arnold-press/arnold-press-800.jpg" }, 
            ],
        },
        piernas: {
            principiante: [
                { nombre: "Sentadillas sin peso", repeticiones: "15 repeticiones", img: "https://bulevip.com/blog/wp-content/uploads/2018/10/sentadillas-tecnica.jpg" }, 
                { nombre: "Zancadas sin peso", repeticiones: "12 repeticiones", img: "https://hips.hearstapps.com/hmg-prod/images/zancadas-caminando-1601550936.jpg" }, 
                { nombre: "Puente de glúteos", repeticiones: "15 repeticiones", img: "https://i.blogs.es/494588/puente1/650_1200.jpg" }, 
                { nombre: "Elevaciones de talones", repeticiones: "12 repeticiones", img: "https://nielasher.com/cdn/shop/articles/ankle_sprain_6_CALF_RAISES_-_Catalina_2613x.png?v=1642422895" }, 
            ],
            intermedio: [
                { nombre: "Sentadillas con mancuernas", repeticiones: "12 repeticiones", img: "https://ginasiovirtual.com/wp-content/uploads/2021/06/Agachamento-com-um-halter.jpg" }, 
                { nombre: "Peso muerto rumano con mancuernas", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/kreuzheben-gestreckte-beine-kurzhantel.png" }, 
                { nombre: "Hip thrust con barra", repeticiones: "10 repeticiones", img: "https://100x100fitness.com/img/cms/Hip-thrust-.jpg" }, 
                { nombre: "Sentadilla búlgara", repeticiones: "10 repeticiones", img: "https://image.tuasaude.com/media/article/so/rn/sentadillas-bulgaras_63162_l.jpg" }, 
            ],
            avanzado: [
                { nombre: "Sentadilla trasera con barra", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/good-mornings.png" }, 
                { nombre: "Peso muerto convencional", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/deadlift-kreuzheben.png" },
                { nombre: "Zancadas caminando con barra", repeticiones: "12 repeticiones", img: "https://static.strengthlevel.com/images/exercises/dumbbell-lunge/dumbbell-lunge-800.jpg" }, 
                { nombre: "Hip thrust con barra pesada", repeticiones: "10 repeticiones", img: "https://100x100fitness.com/img/cms/Hip-thrust-.jpg" }, 
            ],
        },
    };

    // Renderizar ejercicios
    Object.keys(ejerciciosData).forEach((categoria) => {
        ["principiante", "intermedio", "avanzado"].forEach((nivel) => {
            const contenedor = document.getElementById(`${categoria}-${nivel}`);
            renderizarEjercicios(ejerciciosData[categoria][nivel], contenedor);
        });
    });

    // Función para renderizar tarjetas
    function renderizarEjercicios(ejercicios, contenedor) {
        contenedor.innerHTML = "";
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += card;
        });
    }
});
