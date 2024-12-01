document.addEventListener("DOMContentLoaded", () => {
    // Datos de ejercicios organizados por categoría y nivel
    const ejerciciosData = {
        espalda: {
            principiante: [
                { nombre: "Polea hacia abajo con cable", repeticiones: "15 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/latzug.png", video: "https://youtu.be/CAwf7n6Luuc" },
                { nombre: "Superman", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/rueckenstrecken-liegend.png", video: "https://youtu.be/Ikq3OCFoP7c" }, 
                { nombre: "Remo con cable", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/rudern-kabelzug.png", video: "https://youtu.be/GZbfZ033f74" },
                { nombre: "Banda de vuelo inverso", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/reverse-flys-fitnessbank.png", video: "https://youtu.be/38leTE2y1I8" },
            ],
            intermedio: [
                { nombre: "Remo con mancuerna", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/rudern-kurzhantel.png", video: "https://youtu.be/6KNmHxw-SpE" }, 
                { nombre: "Dominadas asistidas", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/klimmzuege-maschine-unterstuetzt.png", video: "https://youtu.be/aP83vi_2Jhw" }, 
                { nombre: "Remo inclinado con barra", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/rudern-langhantel.png", video: "https://youtu.be/kBWAon7ItDw" },
                { nombre: "Pull-over", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2019/05/ueberzuege-kurzhantel.png", video: "https://youtu.be/5YStMv6m2g8" }, 
            ],
            avanzado: [
                { nombre: "Dominadas al cuello", repeticiones: "8 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/klimmzuege-nacken.png", video: "https://youtu.be/vau6Bx2cvSQ" },
                { nombre: "Peso muerto convencional", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/deadlift-kreuzheben.png", video: "https://youtu.be/ytGaGIn3SjE" }, 
                { nombre: "Remo inclinado con barra pesada", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/rudern-langhantel.png", video: "https://youtu.be/kBWAon7ItDw" },
                { nombre: "Pull-ups cerrados", repeticiones: "8 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/klimmzuege-hammergriff.png", video: "https://youtu.be/BOKk34bxFDM" }, 
            ],
        },
        pecho: {
            principiante: [
                { nombre: "Press de pecho", repeticiones: "15 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/brustpresse-flach.png", video: "https://youtu.be/xUm0BiZCWlQ" }, 
                { nombre: "Press de banca con mancuernas", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2019/07/bankdruecken-kurzhantel-flachbank.png", video: "https://youtu.be/5n9TlaoRD58" },
                { nombre: "Aperturas con mancuerna", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2019/02/fliegende-flachbank-kurzhanteln-1.png", video: "https://youtu.be/QENKPHhQVi4" },
                { nombre: "Flexiones inclinadas", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/negativ-liegestuetze.png", video: "https://youtu.be/WBmXffkfcXQ" },
            ],
            intermedio: [
                { nombre: "Press de banca con barra", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2018/11/bankdruecken-flachbank-langhantel.png", video: "https://youtu.be/TDSXgCB6KfI" },
                { nombre: "Aperturas con mancuernas en banco inclinado", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/fliegende-schraegbank.png", video: "https://youtu.be/IMALXhhHRKM" }, 
                { nombre: "Fondos", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/arnold-dips.png", video: "https://youtu.be/yN6Q1UI_xkE" }, 
                { nombre: "Press inclinado con mancuernas", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/bankdruecken-kurzhantel-schraeg.png", video: "https://youtu.be/Pf1nDoqx_1A" }, 
            ],
            avanzado: [
                { nombre: "Press de banca con barra pesada", repeticiones: "8 repeticiones", img: "https://training.fit/wp-content/uploads/2018/11/bankdruecken-flachbank-langhantel.png", video: "https://youtu.be/TDSXgCB6KfI" },
                { nombre: "Press inclinado con barra", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/schraegbankdruecken-langhantel.png", video: "https://youtu.be/LfyQBUKR8SE" }, 
                { nombre: "Aperturas con mancuernas pesadas", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2019/02/fliegende-flachbank-kurzhanteln-1.png", video: "https://youtu.be/QENKPHhQVi4" }, 
                { nombre: "Push-ups explosivas con bola de ejercicio", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/liegestuetze-gymnastikball.png", video: "https://youtu.be/yNkEaV5pGjA" }, 
            ],
        },
        brazos: {
            principiante: [
                { nombre: "Curls de bíceps con mancuernas", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2018/12/bizepscurls-800x448.png", video: "https://youtu.be/ykJmrZ5v0Oo" },
                { nombre: "Extensión de tríceps", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/trizepsdruecken-kabelzug.png", video: "https://youtu.be/AG01W61kwog" },
                { nombre: "Press militar con mancuernas", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/schulterdruecken-kurzhanteln-800x448.png", video: "https://youtu.be/qEwKCR5JCog" }, 
                { nombre: "Elevaciones laterales con mancuernas", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/seitenheben-kurzhanteln-800x448.png", video: "https://youtu.be/q9LhHrHShs4" }, 
            ],
            intermedio: [
                { nombre: "Curls de barra recta", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/bizepscurls-stehend-langhantel-1024x573.png", video: "https://youtu.be/QZEqB6wUPxQ" }, 
                { nombre: "Rompecraneos acostado", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/stirndruecken-langhantel-800x448.png", video: "https://youtu.be/trVzEReByPg" }, 
                { nombre: "Press militar con barra trasnuca", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/schulterdruecken-langhantel-800x448.png", video: "https://youtu.be/VA-Z3aFrnEA" }, 
                { nombre: "Elevaciones frontales con mancuernas", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/seitenheben-kurzhanteln-800x448.png", video: "https://youtu.be/-t7fuZ0KhDA" }, 
            ],
            avanzado: [
                { nombre: "Curl de bíceps inclinado", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/bizepscurls-schraegbank-800x448.png", video: "https://youtu.be/soxrZlIl35U" }, 
                { nombre: "Fondos para tríceps", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/dips.png", video: "https://youtu.be/yN6Q1UI_xkE" }, 
                { nombre: "Elevaciones Frontales con barra", repeticiones: "8 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/frontheben-langhantel.png", video: "https://youtu.be/Ofo2DQdT7DA" }, 
                { nombre: "Arnold press con mancuernas", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/arnold-press-2.png", video: "https://youtu.be/3ml7BH7mNwQ" }, 
            ],
        },
        piernas: {
            principiante: [
                { nombre: "Sentadillas sin peso", repeticiones: "15 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/kniebeugen-800x448.png", video: "https://youtu.be/aclHkVaku9U" }, 
                { nombre: "Zancadas sin peso", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/ausfallschritt-1024x573.png", video: "https://youtu.be/QOVaHwm-Q6U" }, 
                { nombre: "Extensión de piernas", repeticiones: "15 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/beinstrecken-geraet-1.png", video: "https://youtu.be/ljO4jkwv8wQ" }, 
                { nombre: "Elevaciones de talones", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/wadenheben-stufen-1024x573.png", video: "https://youtu.be/cktrbwJdYSo" }, 
            ],
            intermedio: [
                { nombre: "Sentadillas con mancuernas", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/kniebeugen-kurzhanteln-800x448.png", video: "https://youtu.be/v_c67Omje48" }, 
                { nombre: "Peso muerto rumano con mancuernas", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/kreuzheben-gestreckte-beine-kurzhantel.png", video: "https://youtu.be/v_c67Omje48" }, 
                { nombre: "Press de pierna sentado", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/beinpresse-800x448.png", video: "https://youtu.be/IZxyjW7MPJQ" }, 
                { nombre: "Aperturas de lado", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/seitlicher-ausfallschritt-800x448.png", video: "https://youtu.be/rvqLVxYqEvo" }, 
            ],
            avanzado: [
                { nombre: "Sentadilla trasera con barra", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/good-mornings.png", video: "https://youtu.be/bEv6CCg2BC8" }, 
                { nombre: "Peso muerto convencional", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/deadlift-kreuzheben-800x448.png", video: "https://youtu.be/ytGaGIn3SjE" },
                { nombre: "Zancadas caminando con barra", repeticiones: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/ausfallschritt-langhantel.png", video: "https://youtu.be/I__9oV1UDv0" }, 
                { nombre: "Peso muerto con agarre sumo", repeticiones: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/sumo-kreuzheben-1024x573.png", video: "https://youtu.be/cDlOSfu-zHY" }, 
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
