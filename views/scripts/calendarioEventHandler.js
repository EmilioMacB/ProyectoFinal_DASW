document.addEventListener('DOMContentLoaded', () => {
    const tablaCalendario = document.querySelector('#tabla-calendario tbody');
    const streakButton = document.querySelector('#streak-button');
    const streakImage = document.querySelector('#streak-image');

    let diasMarcados = new Set();
    let streak = 0;

    // Generar el calendario
    function generarCalendario() {
        let dia = 1;
        for (let i = 0; i < 5; i++) {
            const fila = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const celda = document.createElement('td');
                if (dia <= 30) {
                    celda.textContent = dia;
                    celda.dataset.dia = dia;
                    celda.addEventListener('click', () => marcarDia(celda));
                    dia++;
                }
                fila.appendChild(celda);
            }
            tablaCalendario.appendChild(fila);
        }
    }

    // Marcar un día
    function marcarDia(celda) {
        const dia = parseInt(celda.dataset.dia);
        if (diasMarcados.has(dia)) {
            diasMarcados.delete(dia);
            celda.classList.remove('marcado');
        } else {
            diasMarcados.add(dia);
            celda.classList.add('marcado');
        }
        calcularRacha();
    }

    // Calcular la racha y actualizar imagen
    function calcularRacha() {
        const diasOrdenados = Array.from(diasMarcados).sort((a, b) => a - b);
        let rachaMaxima = 0;
        let rachaActual = 0;

        for (let i = 0; i < diasOrdenados.length; i++) {
            if (i === 0 || diasOrdenados[i] === diasOrdenados[i - 1] + 1) {
                rachaActual++;
            } else {
                rachaMaxima = Math.max(rachaMaxima, rachaActual);
                rachaActual = 1;
            }
        }
        streak = Math.max(rachaMaxima, rachaActual);
        streakButton.textContent = `${streak} day streak!`;
        actualizarImagen();
    }

    // Actualizar imagen según la racha
    function actualizarImagen() {
        streakImage.classList.remove('active');
        if (streak === 0) {
            streakImage.src = 'https://i.pinimg.com/736x/f0/f7/55/f0f755c4e38efd7dc0b10ddce9c7d247.jpg'; // Imagen inicial
        } else if (streak <= 3) {
            streakImage.src = 'https://i.pinimg.com/736x/17/4c/ae/174cae556febe2c6b14dbbcd3028c264.jpg'; // Imagen para racha baja
        } else if (streak <= 6) {
            streakImage.src = 'https://i.pinimg.com/736x/14/b4/a7/14b4a7e7d444607bc2661f8c38ac583a.jpg'; // Imagen para racha media
        } else {
            streakImage.src = 'https://i.pinimg.com/736x/63/71/63/637163f11a7e107ba0a933dfca40fd26.jpg'; // Imagen para racha alta
        }
        // Agregar animación de cambio
        setTimeout(() => streakImage.classList.add('active'), 100);
    }

    generarCalendario();
});
