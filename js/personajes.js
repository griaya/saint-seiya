// Página de personajes: grilla, búsqueda y modal de ficha.
// Los datos llegan desde data/personajes.js (window.PERSONAJES), por lo que
// funciona tanto con doble clic (file://) como en GitHub Pages.

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor-personajes');
    const form = document.getElementById('buscador-personajes');
    const input = document.getElementById('input-buscador');
    const mensaje = document.getElementById('mensaje-busqueda');
    const modal = document.getElementById('modal-ficha');

    if (!contenedor || !form || !input || !mensaje || !modal) {
        return;
    }

    const personajes = (window.PERSONAJES && window.PERSONAJES.results) || [];

    // Orden visual pedido: Bronce, Oro y Plata.
    const CATEGORIAS = [
        { clave: 'bronce', nombre: 'Bronce', titulo: 'Caballeros de Bronce' },
        { clave: 'oro', nombre: 'Oro', titulo: 'Caballeros de Oro' },
        { clave: 'plata', nombre: 'Plata', titulo: 'Caballeros de Plata' }
    ];

    // Minúsculas y sin acentos: "Fénix" y "fenix" se consideran iguales.
    function normalizar(texto) {
        return String(texto || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    // Palabras de enlace que no aportan a la búsqueda.
    const PALABRAS_IGNORADAS = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'y', 'e', 'o', 'u']);

    // Divide la consulta en palabras y descarta los enlaces.
    function palabrasDe(texto) {
        return normalizar(texto)
            .split(/\s+/)
            .filter((palabra) => palabra && !PALABRAS_IGNORADAS.has(palabra));
    }

    // Escapa caracteres especiales para usarlos dentro de una expresión regular.
    function escaparRegExp(texto) {
        return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Coincidencia al inicio de una palabra: evita que "oro" encuentre "meteoro".
    function coincidePalabra(texto, palabra) {
        return new RegExp('(^|[^a-z0-9])' + escaparRegExp(palabra)).test(texto);
    }

    function crearCard(personaje) {
        const card = document.createElement('article');
        card.className = 'card-personaje';
        card.dataset.id = personaje.id;
        card.dataset.nombre = normalizar(personaje.nombre);
        card.dataset.busqueda = normalizar([
            personaje.armadura,
            personaje.tecnica,
            personaje.categoria,
            personaje.procedencia
        ].filter(Boolean).join(' '));

        const cajaImagen = document.createElement('div');
        cajaImagen.className = 'card-personaje-imagen';

        const imagen = document.createElement('img');
        imagen.src = personaje.imagen;
        imagen.alt = personaje.nombre;
        imagen.loading = 'lazy';
        cajaImagen.appendChild(imagen);

        const nombre = document.createElement('h3');
        nombre.className = 'card-personaje-nombre';
        nombre.textContent = personaje.nombre;

        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'btn-identidad';
        boton.textContent = 'Identidad';
        boton.addEventListener('click', () => abrirModal(personaje, boton));

        card.append(cajaImagen, nombre, boton);
        return card;
    }

    function renderizar() {
        const fragmento = document.createDocumentFragment();

        for (const categoria of CATEGORIAS) {
            const lista = personajes.filter(
                (personaje) => normalizar(personaje.categoria) === categoria.clave
            );

            if (lista.length === 0) {
                continue;
            }

            const seccion = document.createElement('section');
            seccion.className = 'seccion-categoria ' + categoria.clave;

            const titulo = document.createElement('h2');
            titulo.className = 'titulo-categoria-personajes';
            titulo.textContent = categoria.titulo;
            seccion.appendChild(titulo);

            const grilla = document.createElement('div');
            grilla.className = 'grilla-cards';

            for (const personaje of lista) {
                grilla.appendChild(crearCard(personaje));
            }

            seccion.appendChild(grilla);
            fragmento.appendChild(seccion);
        }

        contenedor.appendChild(fragmento);
    }

    renderizar();

    const cards = Array.from(contenedor.querySelectorAll('.card-personaje'));

    // --- Búsqueda ---
    function limpiarResaltado() {
        for (const card of cards) {
            card.classList.remove('resaltado');
        }
    }

    function ocultarMensaje() {
        mensaje.hidden = true;
        mensaje.textContent = '';
        mensaje.classList.remove('mensaje-busqueda--alerta');
        mensaje.setAttribute('role', 'status');
        input.classList.remove('sin-resultados');
        input.removeAttribute('aria-invalid');
    }

    function mostrarMensajeSinResultados() {
        mensaje.textContent = 'No se encontraron personajes.';
        mensaje.hidden = false;
        mensaje.classList.add('mensaje-busqueda--alerta');
        mensaje.setAttribute('role', 'alert');
        input.classList.add('sin-resultados');
        input.setAttribute('aria-invalid', 'true');
    }

    function buscar(desplazar) {
        const palabras = palabrasDe(input.value);
        limpiarResaltado();

        if (palabras.length === 0) {
            ocultarMensaje();
            return;
        }

        // Cada palabra debe aparecer en algún lugar de la ficha buscable,
        // sin importar el orden ni los acentos.
        const coincidencias = cards.filter((card) =>
            palabras.every((palabra) =>
                card.dataset.nombre.includes(palabra) ||
                coincidePalabra(card.dataset.busqueda, palabra)
            )
        );

        for (const card of coincidencias) {
            card.classList.add('resaltado');
        }

        if (coincidencias.length === 0) {
            mostrarMensajeSinResultados();
            if (desplazar) {
                mensaje.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        ocultarMensaje();

        if (desplazar) {
            const primera = coincidencias[0];
            requestAnimationFrame(() => {
                primera.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    }

    input.addEventListener('input', () => buscar(false));

    form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        buscar(true);
    });

    // --- Modal de ficha ---
    const btnCerrar = document.getElementById('modal-ficha-cerrar');
    const modalNombre = document.getElementById('modal-ficha-nombre');
    const modalCategoria = document.getElementById('modal-ficha-categoria');
    const modalImagen = document.getElementById('modal-ficha-imagen');
    const modalAltura = document.getElementById('modal-ficha-altura');
    const modalPeso = document.getElementById('modal-ficha-peso');
    const modalEdad = document.getElementById('modal-ficha-edad');
    const modalProcedencia = document.getElementById('modal-ficha-procedencia');
    const modalArmadura = document.getElementById('modal-ficha-armadura');
    const modalTecnica = document.getElementById('modal-ficha-tecnica');
    const modalDescripcion = document.getElementById('modal-ficha-descripcion');

    let botonOrigen = null;

    // Si una foto no carga, se muestra un aviso en lugar del ícono roto.
    modalImagen.addEventListener('error', () => {
        modalImagen.classList.add('sin-imagen');
    });

    modalImagen.addEventListener('load', () => {
        modalImagen.classList.remove('sin-imagen');
    });

    function valorConUnidad(valor, unidad) {
        const limpio = String(valor || '').trim();
        return limpio ? limpio + ' ' + unidad : '—';
    }

    // La altura se guarda en centímetros y se muestra en metros: 175 → "1,75".
    function convertirAltura(valor) {
        const numero = Number(valor);
        if (!Number.isFinite(numero) || numero < 10) {
            return String(valor);
        }
        return (numero / 100).toFixed(2).replace('.', ',');
    }

    // Dohko tiene dos alturas registradas ("140-170"): se muestran como "1,40 a 1,70".
    function formatearAltura(valor) {
        const limpio = String(valor || '').trim();
        if (!limpio) {
            return '—';
        }
        return limpio.split('-').map((parte) => convertirAltura(parte.trim())).join(' a ');
    }

    function valorOTexto(valor) {
        const limpio = String(valor || '').trim();
        return limpio || '—';
    }

    function abrirModal(personaje, boton) {
        botonOrigen = boton;

        modalNombre.textContent = personaje.nombre;
        modalCategoria.textContent = 'Caballero de ' + personaje.categoria;
        modalImagen.classList.remove('sin-imagen');
        modalImagen.src = personaje.imagen;
        modalImagen.alt = personaje.nombre;
        modalAltura.textContent = formatearAltura(personaje.altura);
        modalPeso.textContent = valorConUnidad(personaje.peso, 'kgs');
        modalEdad.textContent = valorConUnidad(personaje.edad, 'años');
        modalProcedencia.textContent = valorOTexto(personaje.procedencia);
        modalArmadura.textContent = valorOTexto(personaje.armadura);
        modalTecnica.textContent = valorOTexto(personaje.tecnica);
        modalDescripcion.textContent = valorOTexto(personaje.descripcion);

        modal.classList.add('activo');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-abierto');
        btnCerrar.focus();
    }

    function cerrarModal() {
        modal.classList.remove('activo');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-abierto');

        if (botonOrigen) {
            botonOrigen.focus();
            botonOrigen = null;
        }
    }

    btnCerrar.addEventListener('click', cerrarModal);

    modal.addEventListener('click', (evento) => {
        if (evento.target === modal) {
            cerrarModal();
        }
    });

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && modal.classList.contains('activo')) {
            cerrarModal();
        }
    });
});
