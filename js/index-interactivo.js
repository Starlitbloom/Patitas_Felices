/* =========================================================
   PATITAS FELICES — index-interactivo.js
   Contador animado de estadísticas + acordeón de FAQ.
   Solo para index.html.
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Contadores animados al entrar en pantalla --- */
    const numeros = document.querySelectorAll('.estadistica-numero');

    if (numeros.length) {
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    animarNumero(entrada.target);
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.5 });

        numeros.forEach((el) => observador.observe(el));
    }

    function animarNumero(el) {
        const hasta = parseInt(el.dataset.hasta, 10);
        const sufijo = el.dataset.sufijo || '';
        const duracion = 1200;
        const inicio = performance.now();

        function paso(ahora) {
            const progreso = Math.min((ahora - inicio) / duracion, 1);
            const valor = Math.floor(progreso * hasta);
            el.textContent = valor + sufijo;
            if (progreso < 1) requestAnimationFrame(paso);
        }

        requestAnimationFrame(paso);
    }

    /* --- Acordeón FAQ --- */
    const preguntas = document.querySelectorAll('.faq-pregunta');

    preguntas.forEach((boton) => {
        boton.addEventListener('click', () => {
            const item = boton.closest('.faq-item');
            const respuesta = item.querySelector('.faq-respuesta');
            const yaAbierto = item.classList.contains('faq-item--abierto');

            // cierra los demás (acordeón exclusivo)
            document.querySelectorAll('.faq-item--abierto').forEach((abierto) => {
                if (abierto !== item) {
                    abierto.classList.remove('faq-item--abierto');
                    abierto.querySelector('.faq-respuesta').style.maxHeight = null;
                }
            });

            if (yaAbierto) {
                item.classList.remove('faq-item--abierto');
                respuesta.style.maxHeight = null;
            } else {
                item.classList.add('faq-item--abierto');
                respuesta.style.maxHeight = respuesta.scrollHeight + 'px';
            }
        });
    });

});