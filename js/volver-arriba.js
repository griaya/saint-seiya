// Botón "Volver arriba" compartido por las cuatro páginas.
// Aparece al acercarse al final de la página y solo si realmente hay scroll:
// en páginas cortas (Categorías, Créditos) no tiene sentido mostrarlo.
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('volver-arriba');

    if (!btn) {
        return;
    }

    const UMBRAL_FINAL = 320; // px desde el final donde aparece el botón

    function actualizar() {
        const doc = document.documentElement;
        const hayScroll = doc.scrollHeight > window.innerHeight + 4;
        const cercaDelFinal =
            window.scrollY > 0 &&
            window.innerHeight + window.scrollY >= doc.scrollHeight - UMBRAL_FINAL;

        btn.classList.toggle('visible', hayScroll && cercaDelFinal);
    }

    window.addEventListener('scroll', actualizar, { passive: true });
    window.addEventListener('resize', actualizar);
    actualizar();

    btn.addEventListener('click', () => {
        const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reducir ? 'auto' : 'smooth' });
    });
});
