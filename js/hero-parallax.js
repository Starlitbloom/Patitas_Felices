/* =========================================================
   PATITAS FELICES — hero-parallax.js
   Efecto parallax: la imagen del hero se mueve más lento
   que el resto de la página al hacer scroll. Solo para index.html.
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const imagenHero = document.querySelector('.hero-corte-imagen img');

    if (!imagenHero) return;

    const velocidad = 0.35;

    function moverParallax() {
        const scroll = window.scrollY;
        imagenHero.style.transform = `translateY(${scroll * velocidad}px) scale(1.15)`;
    }

    window.addEventListener('scroll', moverParallax, { passive: true });
    moverParallax();
});