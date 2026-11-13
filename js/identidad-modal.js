document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-identidad');
    const btnCerrar = document.getElementById('cerrar-modal');
    const botonesIdentidad = document.querySelectorAll('.btn-identidad');

    const spanNombre = document.getElementById('modal-nombre');
    const spanConstelacion = document.getElementById('modal-constelacion');
    const spanOrigen = document.getElementById('modal-origen');
    const spanCategoria = document.getElementById('modal-categoria');
    const spanCaracteristicas = document.getElementById('modal-caracteristicas');

    // Datos integrados directamente para evitar errores de rutas y fetch
    const datosPersonajes = {
        "seiya": {
            "nombre": "Seiya de Pegaso",
            "constelacion": "Pegaso",
            "origen": "Japón",
            "categoria": "Santo de Bronce",
            "caracteristicas": "Valiente, impulsivo, perseverante y con un cosmos capaz de superar a los dioses."
        },
        "ikki": {
            "nombre": "Ikki de Fénix",
            "constelacion": "Fénix",
            "origen": "Japón",
            "categoria": "Santo de Bronce",
            "caracteristicas": "Solitario, implacable en combate, protector desde las sombras y el único capaz de resucitar de sus cenizas."
        },
        "shaka": {
            "nombre": "Shaka de Virgo",
            "constelacion": "Virgo",
            "origen": "India",
            "categoria": "Santo de Oro",
            "caracteristicas": "Considerado el hombre más cercano a un dios, de sabiduría infinita y un poder mental devastador."
        }
    };

    // Escuchar clics en los botones "Identidad"
    botonesIdentidad.forEach(boton => {
        boton.addEventListener('click', () => {
            const personajeKey = boton.getAttribute('data-personaje');
            const info = datosPersonajes[personajeKey];

            if (info) {
                spanNombre.textContent = info.nombre;
                spanConstelacion.textContent = info.constelacion;
                spanOrigen.textContent = info.origen;
                spanCategoria.textContent = info.categoria;
                spanCaracteristicas.textContent = info.caracteristicas;

                modal.classList.add('activo');
            }
        });
    });

    // Función para cerrar el modal
    const cerrarModalFunc = () => {
        modal.classList.remove('activo');
    };

    if (btnCerrar) {
        btnCerrar.addEventListener('click', cerrarModalFunc);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            cerrarModalFunc();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('activo')) {
            cerrarModalFunc();
        }
    });
});