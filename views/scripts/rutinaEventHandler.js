document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('click', function() {
        let parentListItem = this.closest('.card-body');
        if (parentListItem) {
            this.textContent = 'Terminado';
            // Actualizar el progreso
            updateProgress();
        }
    });
});

function updateProgress() {
    let totalActivities = document.querySelectorAll('.card').length;
    let completedActivities = document.querySelectorAll('button:contains("Terminado")').length;
    let progressPercentage = (completedActivities / totalActivities) * 100;
    document.querySelector('.progress-bar').style.width = progressPercentage + '%';
}
