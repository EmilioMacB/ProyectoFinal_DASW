
/* barra de progreso */
function setProgress(percent) {
    var progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = percent + '%';
    progressBar.setAttribute('aria-valuenow', percent);
}


document.getElementById('nextQuestion').addEventListener('click', function() {
    // Aquí cambiarías el contenido del modal según la lógica de tu cuestionario
    var modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = 'Contenido de la siguiente pregunta';
    // Actualizar también el título del modal si es necesario
    var modalTitle = document.getElementById('cuestionarioModalLabel');
    modalTitle.textContent = 'Nueva pregunta';
  });
  
