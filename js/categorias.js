// --- Pestañas de categoría: muestran una sola categoría por vez ---
document.addEventListener('DOMContentLoaded', () => {
    const tabs = Array.from(document.querySelectorAll('.tab-categoria'));
    const paneles = Array.from(document.querySelectorAll('.categoria-bloque[role="tabpanel"]'));
    const aviso = document.getElementById('categorias-aviso');

    if (!tabs.length || !paneles.length) {
        return;
    }

    function marcarTeclado(tabActiva) {
        tabs.forEach((t) => {
            t.tabIndex = (!tabActiva || t === tabActiva) ? 0 : -1;
        });
    }

    // Muestra solo el panel de la pestaña elegida
    function activar(tab) {
        const idPanel = tab.getAttribute('aria-controls');

        tabs.forEach((t) => {
            t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });

        paneles.forEach((panel) => {
            panel.hidden = panel.id !== idPanel;
        });

        if (aviso) {
            aviso.hidden = true;
        }

        marcarTeclado(tab);
    }

    // Vuelve al estado inicial: ninguna categoría elegida
    function volverAlInicio() {
        tabs.forEach((t) => {
            t.setAttribute('aria-selected', 'false');
        });

        paneles.forEach((panel) => {
            panel.hidden = true;
        });

        if (aviso) {
            aviso.hidden = false;
        }

        marcarTeclado(null);
    }

    tabs.forEach((tab, indice) => {
        tab.addEventListener('click', () => {
            // Un segundo clic en la pestaña activa vuelve al estado inicial
            if (tab.getAttribute('aria-selected') === 'true') {
                volverAlInicio();
            } else {
                activar(tab);
            }
        });

        tab.addEventListener('keydown', (evento) => {
            let destino = null;

            if (evento.key === 'ArrowRight') {
                destino = tabs[(indice + 1) % tabs.length];
            } else if (evento.key === 'ArrowLeft') {
                destino = tabs[(indice - 1 + tabs.length) % tabs.length];
            } else if (evento.key === 'Home') {
                destino = tabs[0];
            } else if (evento.key === 'End') {
                destino = tabs[tabs.length - 1];
            } else if (evento.key === 'Escape') {
                evento.preventDefault();
                volverAlInicio();
                return;
            }

            if (destino) {
                evento.preventDefault();
                destino.focus();
                activar(destino);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Los datos se cargan desde data/personajes.js (window.PERSONAJES).
    // Así el carrusel y la página de personajes usan la misma fuente.
    const datosCategorias = {
        bronce: { titulo: 'Caballeros de Bronce' },
        plata: { titulo: 'Caballeros de Plata' },
        oro: { titulo: 'Caballeros de Oro' }
    };

    function personajesDe(categoria) {
        const todos = (window.PERSONAJES && window.PERSONAJES.results) || [];
        return todos.filter((personaje) => personaje.categoria.toLowerCase() === categoria);
    }

    const overlay = document.getElementById('carrusel-overlay');
    const titulo = document.getElementById('carrusel-titulo');
    const contador = document.getElementById('carrusel-contador');
    const imagen = document.getElementById('carrusel-imagen');
    const nombre = document.getElementById('carrusel-nombre');
    const btnPrev = document.getElementById('carrusel-prev');
    const btnNext = document.getElementById('carrusel-next');
    const btnDetener = document.getElementById('carrusel-detener');
    const botonesCategoria = document.querySelectorAll('.btn-categoria[data-categoria]');

    if (!overlay || !titulo || !contador || !imagen || !nombre || !btnPrev || !btnNext || !btnDetener) {
        return;
    }

    let personajes = [];
    let indice = 0;
    let botonOrigen = null;

    function render() {
        const personaje = personajes[indice];
        if (!personaje) {
            return;
        }

        imagen.src = personaje.imagen;
        imagen.alt = personaje.nombre;
        nombre.textContent = personaje.nombre;
        contador.textContent = (indice + 1) + ' / ' + personajes.length;
    }

    function abrir(categoria, boton) {
        const datos = datosCategorias[categoria];
        if (!datos) {
            return;
        }

        personajes = personajesDe(categoria);
        if (personajes.length === 0) {
            return;
        }

        indice = 0;
        botonOrigen = boton;

        titulo.textContent = datos.titulo;
        render();

        overlay.classList.add('activo');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('carrusel-abierto');
        btnDetener.focus();
    }

    function cerrar() {
        overlay.classList.remove('activo');
        document.body.classList.remove('carrusel-abierto');

        imagen.removeAttribute('src');
        imagen.alt = '';
        nombre.textContent = '';
        contador.textContent = '0 / 0';

        if (botonOrigen) {
            botonOrigen.focus();
            botonOrigen = null;
        }

        overlay.setAttribute('aria-hidden', 'true');
    }

    function anterior() {
        if (personajes.length === 0) {
            return;
        }
        indice = (indice - 1 + personajes.length) % personajes.length;
        render();
    }

    function siguiente() {
        if (personajes.length === 0) {
            return;
        }
        indice = (indice + 1) % personajes.length;
        render();
    }

    botonesCategoria.forEach((boton) => {
        boton.addEventListener('click', () => {
            abrir(boton.dataset.categoria, boton);
        });
    });

    btnPrev.addEventListener('click', anterior);
    btnNext.addEventListener('click', siguiente);
    btnDetener.addEventListener('click', cerrar);

    overlay.addEventListener('click', (evento) => {
        if (evento.target === overlay) {
            cerrar();
        }
    });

    document.addEventListener('keydown', (evento) => {
        if (!overlay.classList.contains('activo')) {
            return;
        }

        if (evento.key === 'Escape') {
            evento.preventDefault();
            cerrar();
        } else if (evento.key === 'ArrowLeft') {
            evento.preventDefault();
            anterior();
        } else if (evento.key === 'ArrowRight') {
            evento.preventDefault();
            siguiente();
        }
    });
});
