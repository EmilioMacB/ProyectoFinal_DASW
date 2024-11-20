document.addEventListener("DOMContentLoaded", () => {
    // Datos de ejercicios organizados por categoría y nivel
    const ejerciciosData = {
        espalda: {
            principiante: [
                { nombre: "Remo invertido", repeticiones: "15 repeticiones", img: "https://homegymreview.co.uk/wp-content/uploads/exercises/02131101-Cable-Seated-High-Row-V-bar_Back_max-scaled.jpg" },
                { nombre: "Superman", repeticiones: "12 repeticiones", img: "https://www.hola.com/horizon/original_aspect_ratio/ae8212ffad20-superman-pasos-a.jpg" }, 
                { nombre: "Pullover con mancuerna", repeticiones: "10 repeticiones", img: "https://eresfitness.com/wp-content/uploads/2019/07/Pullover-con-mancuerna.jpg" },
                { nombre: "Plancha con extensión de brazos", repeticiones: "12 repeticiones", img: "https://www.entrenamientos.com/media/cache/exercise_375/uploads/exercise/plancha-flexion-brazos-init-pos-7783.png" },
            ],
            intermedio: [
                { nombre: "Remo con mancuerna", repeticiones: "12 repeticiones", img: "https://static.strengthlevel.com/images/exercises/dumbbell-row/dumbbell-row-800.jpg" }, 
                { nombre: "Dominadas asistidas", repeticiones: "10 repeticiones", img: "https://previews.123rf.com/images/lioputra/lioputra2303/lioputra230300383/201321470-hombre-haciendo-ejercicio-de-dominadas-m%C3%A1quina-o-dominada-asistida-ilustraci%C3%B3n-vectorial-plana.jpg" }, 
                { nombre: "Remo inclinado con barra", repeticiones: "12 repeticiones", img: "https://static.strengthlevel.com/images/exercises/yates-row/yates-row-800.jpg" },
                { nombre: "Pull-over con barra", repeticiones: "10 repeticiones", img: "https://i.pinimg.com/736x/80/0d/ec/800dec5cb0e6f6173f71e09210d01ab3.jpg" }, 
            ],
            avanzado: [
                { nombre: "Dominadas con lastre", repeticiones: "8 repeticiones", img: "https://www.entrenamientos.com/media/cache/exercise_375/uploads/exercise/dominadas-lastradas-init-pos-9821.png" },
                { nombre: "Peso muerto convencional", repeticiones: "10 repeticiones", img: "https://cdn.shopify.com/s/files/1/0425/7667/4983/files/3_3b9d091a-c44e-4875-8a5c-58b024b403c1.png?v=1706627159" }, 
                { nombre: "Remo inclinado con barra pesada", repeticiones: "10 repeticiones", img: "https://static.strengthlevel.com/images/exercises/yates-row/yates-row-800.jpg" },
                { nombre: "Pull-ups cerrados", repeticiones: "8 repeticiones", img: "https://eresfitness.com/wp-content/uploads/2020/02/18651105-Hammer-Grip-Pull-up-on-Dip-Cage_Back_max.png" }, 
            ],
        },
        pecho: {
            principiante: [
                { nombre: "Push-ups estándar", repeticiones: "15 repeticiones", img: "https://media.istockphoto.com/id/578104104/es/vector/paso-a-la-instrucci%C3%B3n-en-push-up.jpg?s=612x612&w=0&k=20&c=RNxtdjWZVPjCdk6dBd4wlgNVX7qB6cPFoakeb1Mux8c=" }, 
                { nombre: "Press de banca con mancuernas", repeticiones: "12 repeticiones", img: "https://static.strengthlevel.com/images/exercises/dumbbell-bench-press/dumbbell-bench-press-800.jpg" },
                { nombre: "Aperturas con mancuerna", repeticiones: "10 repeticiones", img: "https://static.strengthlevel.com/images/exercises/dumbbell-fly/dumbbell-fly-800.jpg" },
                { nombre: "Flexiones inclinadas", repeticiones: "12 repeticiones", img: "https://i.pinimg.com/originals/d9/0e/26/d90e2674bcbbc0332370a6ffe6c0c1a3.jpg" },
            ],
            intermedio: [
                { nombre: "Press de banca con barra", repeticiones: "12 repeticiones", img: "https://eresfitness.com/wp-content/uploads/2019/11/Press-declinado-con-barra.jpg.webp" },
                { nombre: "Aperturas con mancuernas en banco inclinado", repeticiones: "10 repeticiones", img: "https://static.strengthlevel.com/images/exercises/incline-dumbbell-fly/incline-dumbbell-fly-800.jpg" }, 
                { nombre: "Push-ups con peso en la espalda", repeticiones: "10 repeticiones", img: "https://hips.hearstapps.com/hmg-prod/images/3-weighted-pushup-1495476721.jpg?crop=1xw:1xh;center,top&resize=640:*" }, 
                { nombre: "Press inclinado con mancuernas", repeticiones: "12 repeticiones", img: "https://static.strengthlevel.com/images/exercises/incline-bench-press/incline-bench-press-800.jpg" }, 
            ],
            avanzado: [
                { nombre: "Press de banca con barra pesada", repeticiones: "8 repeticiones", img: "https://bulevip.com/blog/wp-content/uploads/2019/09/press-de-banca-musculos.jpg" },
                { nombre: "Press inclinado con barra", repeticiones: "10 repeticiones", img: "https://static.strengthlevel.com/images/exercises/incline-bench-press/incline-bench-press-800.jpg" }, 
                { nombre: "Aperturas con mancuernas pesadas", repeticiones: "10 repeticiones", img: "https://static.strengthlevel.com/images/exercises/incline-dumbbell-fly/incline-dumbbell-fly-800.jpg" }, 
                { nombre: "Push-ups explosivas con clap", repeticiones: "10 repeticiones", img: "https://www.shutterstock.com/image-vector/sport-woman-doing-exercise-clapping-600nw-2282691199.jpg" }, 
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
                { nombre: "Peso muerto rumano con mancuernas", repeticiones: "12 repeticiones", img: "https://www.hola.com/horizon/original_aspect_ratio/de54c939487b-adobestock485034129.jpg" }, 
                { nombre: "Hip thrust con barra", repeticiones: "10 repeticiones", img: "https://100x100fitness.com/img/cms/Hip-thrust-.jpg" }, 
                { nombre: "Sentadilla búlgara", repeticiones: "10 repeticiones", img: "https://image.tuasaude.com/media/article/so/rn/sentadillas-bulgaras_63162_l.jpg" }, 
            ],
            avanzado: [
                { nombre: "Sentadilla trasera con barra", repeticiones: "10 repeticiones", img: "https://crossfitstein.com/wp-content/uploads/2020/03/back-squat.jpg" }, 
                { nombre: "Peso muerto convencional", repeticiones: "12 repeticiones", img: "https://www.hola.com/horizon/original_aspect_ratio/de54c939487b-adobestock485034129.jpg" },
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
