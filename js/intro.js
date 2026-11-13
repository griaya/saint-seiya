document.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('intro-screen');

    if (intro) {
        // 6000 milisegundos (6 segundos) para dar tiempo a que termine de desvanecerse suavemente
        setTimeout(() => {
            intro.style.display = 'none';
        }, 6000);
    }
});