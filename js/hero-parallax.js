/* =========================================================
   PATITAS FELICES — hero-parallax.js
   Parallax del fondo del hero
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const imagen = document.querySelector(".hero-corte-imagen img");

    if (!imagen) {
        console.log("NO SE ENCONTRÓ LA IMAGEN");
        return;
    }

    console.log("PARALLAX ACTIVADO");

    window.addEventListener("scroll", function () {

        const scroll = window.scrollY;

        // Movimiento MUY exagerado para comprobar que funciona
        imagen.style.transform = `translateY(${scroll * -0.5}px)`;

    });

});