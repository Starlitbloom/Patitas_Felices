/* =========================================================
   PATITAS FELICES
   SOLICITAR CITA
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const formulario =
        document.getElementById("formularioCita");

    if (!formulario) {
        return;
    }


    /* =====================================================
       CAMPOS
    ===================================================== */

    const nombreDueno =
        document.getElementById("nombreDueno");

    const correoCita =
        document.getElementById("correoCita");

    const telefonoCita =
        document.getElementById("telefonoCita");

    const nombreMascota =
        document.getElementById("nombreMascota");

    const edadMascota =
        document.getElementById("edadMascota");

    const servicioCita =
        document.getElementById("servicioCita");

    const fechaCita =
        document.getElementById("fechaCita");

    const horaCita =
        document.getElementById("horaCita");

    const motivoCita =
        document.getElementById("motivoCita");

    const confirmarDatos =
        document.getElementById("confirmarDatos");

    const mensajeExitoCita =
        document.getElementById("mensajeExitoCita");

    const contadorMotivo =
        document.getElementById("contadorMotivo");


    /* =====================================================
       MENSAJES DE ERROR
    ===================================================== */

    const errorNombreDueno =
        document.getElementById("errorNombreDueno");

    const errorCorreoCita =
        document.getElementById("errorCorreoCita");

    const errorTelefonoCita =
        document.getElementById("errorTelefonoCita");

    const errorNombreMascota =
        document.getElementById("errorNombreMascota");

    const errorTipoMascota =
        document.getElementById("errorTipoMascota");

    const errorEdadMascota =
        document.getElementById("errorEdadMascota");

    const errorServicioCita =
        document.getElementById("errorServicioCita");

    const errorFechaCita =
        document.getElementById("errorFechaCita");

    const errorHoraCita =
        document.getElementById("errorHoraCita");

    const errorConfirmarDatos =
        document.getElementById("errorConfirmarDatos");


    /* =====================================================
       EXPRESIONES REGULARES
    ===================================================== */

    const expresionNombre =
        /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/;

    const expresionCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const expresionTelefono =
        /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;


    /* =====================================================
       FECHA MÍNIMA
    ===================================================== */

    const hoy = new Date();

    const anio =
        hoy.getFullYear();

    const mes =
        String(
            hoy.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            hoy.getDate()
        ).padStart(2, "0");

    const fechaMinima =
        `${anio}-${mes}-${dia}`;

    fechaCita.min =
        fechaMinima;


    /* =====================================================
       FUNCIONES AUXILIARES
    ===================================================== */

    function mostrarError(
        campo,
        elementoError,
        mensaje
    ) {

        if (campo) {
            campo.classList.add("campo-error");
        }

        elementoError.textContent =
            mensaje;

        return false;
    }


    function limpiarError(
        campo,
        elementoError
    ) {

        if (campo) {
            campo.classList.remove("campo-error");
        }

        elementoError.textContent = "";

        return true;
    }


    /* =====================================================
       OBTENER TIPO DE MASCOTA
    ===================================================== */

    function obtenerTipoMascota() {

        return document.querySelector(
            'input[name="tipoMascota"]:checked'
        );
    }


    /* =====================================================
       OBTENER SERVICIO
    ===================================================== */

    function obtenerServicio() {

        return document.getElementById(
            "servicioCita"
        );
    }


    /* =====================================================
       VALIDAR NOMBRE DEL DUEÑO
    ===================================================== */

    function validarNombreDueno() {

        const valor =
            nombreDueno.value.trim();

        if (valor === "") {

            return mostrarError(
                nombreDueno,
                errorNombreDueno,
                "Ingresa tu nombre completo."
            );
        }


        if (valor.length < 3) {

            return mostrarError(
                nombreDueno,
                errorNombreDueno,
                "El nombre debe tener al menos 3 caracteres."
            );
        }


        if (!expresionNombre.test(valor)) {

            return mostrarError(
                nombreDueno,
                errorNombreDueno,
                "El nombre solo puede contener letras."
            );
        }


        return limpiarError(
            nombreDueno,
            errorNombreDueno
        );
    }


    /* =====================================================
       VALIDAR CORREO
    ===================================================== */

    function validarCorreo() {

        const valor =
            correoCita.value.trim();

        if (valor === "") {

            return mostrarError(
                correoCita,
                errorCorreoCita,
                "Ingresa tu correo electrónico."
            );
        }


        if (!expresionCorreo.test(valor)) {

            return mostrarError(
                correoCita,
                errorCorreoCita,
                "Ingresa un correo válido."
            );
        }


        return limpiarError(
            correoCita,
            errorCorreoCita
        );
    }


    /* =====================================================
       VALIDAR TELÉFONO
    ===================================================== */

    function validarTelefono() {

        const valor =
            telefonoCita.value.trim();

        if (valor === "") {

            return mostrarError(
                telefonoCita,
                errorTelefonoCita,
                "Ingresa tu número de teléfono."
            );
        }


        if (!expresionTelefono.test(valor)) {

            return mostrarError(
                telefonoCita,
                errorTelefonoCita,
                "Usa un teléfono chileno válido. Ej: +56 9 1234 5678."
            );
        }


        return limpiarError(
            telefonoCita,
            errorTelefonoCita
        );
    }


    /* =====================================================
       VALIDAR NOMBRE DE LA MASCOTA
    ===================================================== */

    function validarNombreMascota() {

        const valor =
            nombreMascota.value.trim();

        if (valor === "") {

            return mostrarError(
                nombreMascota,
                errorNombreMascota,
                "Ingresa el nombre de tu mascota."
            );
        }


        if (valor.length < 2) {

            return mostrarError(
                nombreMascota,
                errorNombreMascota,
                "Ingresa un nombre válido."
            );
        }


        if (!expresionNombre.test(valor)) {

            return mostrarError(
                nombreMascota,
                errorNombreMascota,
                "El nombre solo puede contener letras."
            );
        }


        return limpiarError(
            nombreMascota,
            errorNombreMascota
        );
    }


    /* =====================================================
       VALIDAR TIPO DE MASCOTA
    ===================================================== */

    function validarTipoMascota() {

        const tipo =
            obtenerTipoMascota();

        if (!tipo) {

            errorTipoMascota.textContent =
                "Selecciona el tipo de mascota.";

            return false;
        }


        errorTipoMascota.textContent = "";

        return true;
    }


    /* =====================================================
       VALIDAR EDAD
    ===================================================== */

    function validarEdadMascota() {

        const valor =
            edadMascota.value.trim();

        const edad =
            Number(valor);


        if (valor === "") {

            return mostrarError(
                edadMascota,
                errorEdadMascota,
                "Ingresa la edad aproximada."
            );
        }


        if (
            Number.isNaN(edad) ||
            edad < 0 ||
            edad > 30
        ) {

            return mostrarError(
                edadMascota,
                errorEdadMascota,
                "Ingresa una edad entre 0 y 30 años."
            );
        }


        return limpiarError(
            edadMascota,
            errorEdadMascota
        );
    }


    /* =====================================================
       VALIDAR SERVICIO
    ===================================================== */

    function validarServicio() {

        const servicio =
            obtenerServicio();


        if (
            !servicio ||
            servicio.value === ""
        ) {

            return mostrarError(
                servicio,
                errorServicioCita,
                "Selecciona el servicio que quieres solicitar."
            );
        }


        return limpiarError(
            servicio,
            errorServicioCita
        );
    }


    /* =====================================================
       VALIDAR FECHA
    ===================================================== */

    function validarFecha() {

        const valor =
            fechaCita.value;


        if (valor === "") {

            return mostrarError(
                fechaCita,
                errorFechaCita,
                "Selecciona una fecha."
            );
        }


        if (valor < fechaMinima) {

            return mostrarError(
                fechaCita,
                errorFechaCita,
                "La fecha no puede ser anterior a hoy."
            );
        }


        return limpiarError(
            fechaCita,
            errorFechaCita
        );
    }


    /* =====================================================
       VALIDAR HORA
    ===================================================== */

    function validarHora() {

        if (horaCita.value === "") {

            return mostrarError(
                horaCita,
                errorHoraCita,
                "Selecciona un horario."
            );
        }


        return limpiarError(
            horaCita,
            errorHoraCita
        );
    }


    /* =====================================================
       VALIDAR CONFIRMACIÓN
    ===================================================== */

    function validarConfirmacion() {

        if (!confirmarDatos.checked) {

            errorConfirmarDatos.textContent =
                "Debes confirmar que los datos son correctos.";

            return false;
        }


        errorConfirmarDatos.textContent = "";

        return true;
    }


    /* =====================================================
       CONTADOR DEL MOTIVO
    ===================================================== */

    motivoCita.addEventListener(
        "input",
        () => {

            contadorMotivo.textContent =
                `${motivoCita.value.length} / 500`;
        }
    );


    /* =====================================================
       VALIDACIONES EN TIEMPO REAL
    ===================================================== */

    nombreDueno.addEventListener(
        "input",
        validarNombreDueno
    );


    correoCita.addEventListener(
        "input",
        validarCorreo
    );


    telefonoCita.addEventListener(
        "input",
        validarTelefono
    );


    nombreMascota.addEventListener(
        "input",
        validarNombreMascota
    );


    edadMascota.addEventListener(
        "input",
        validarEdadMascota
    );


    fechaCita.addEventListener(
        "change",
        validarFecha
    );


    horaCita.addEventListener(
        "change",
        validarHora
    );


    confirmarDatos.addEventListener(
        "change",
        validarConfirmacion
    );


    /* =====================================================
       VALIDAR TIPO DE MASCOTA AL SELECCIONAR
    ===================================================== */

    document
        .querySelectorAll(
            'input[name="tipoMascota"]'
        )
        .forEach((radio) => {

            radio.addEventListener(
                "change",
                validarTipoMascota
            );
        });


    /* =====================================================
       VALIDAR SERVICIO AL SELECCIONAR
    ===================================================== */

    servicioCita.addEventListener(
        "change",
        validarServicio
    );


    /* =====================================================
       GUARDAR CITA EN LOCALSTORAGE
    ===================================================== */

    function guardarCita() {

        const citasGuardadas =
            JSON.parse(
                localStorage.getItem(
                    "patitasFelicesCitas"
                )
            ) || [];


        const tipoMascota =
            obtenerTipoMascota();

        const servicio =
            obtenerServicio();


        const nuevaCita = {

            id:
                Date.now(),

            dueno:
                nombreDueno.value.trim(),

            correo:
                correoCita.value.trim(),

            telefono:
                telefonoCita.value.trim(),

            mascota:
                nombreMascota.value.trim(),

            tipoMascota:
                tipoMascota.value,

            edadMascota:
                Number(
                    edadMascota.value
                ),

            servicio:
                servicio.value,

            fecha:
                fechaCita.value,

            hora:
                horaCita.value,

            motivo:
                motivoCita.value.trim(),

            estado:
                "Pendiente",

            fechaRegistro:
                new Date().toISOString()
        };


        citasGuardadas.push(
            nuevaCita
        );


        localStorage.setItem(
            "patitasFelicesCitas",
            JSON.stringify(
                citasGuardadas
            )
        );
    }


    /* =====================================================
       ENVIAR FORMULARIO
    ===================================================== */

    formulario.addEventListener(
        "submit",
        (evento) => {

            evento.preventDefault();


            /* ---------------------------------------------
               EJECUTAR TODAS LAS VALIDACIONES
            --------------------------------------------- */

            const validaciones = [

                validarNombreDueno(),

                validarCorreo(),

                validarTelefono(),

                validarNombreMascota(),

                validarTipoMascota(),

                validarEdadMascota(),

                validarServicio(),

                validarFecha(),

                validarHora(),

                validarConfirmacion()
            ];


            const formularioValido =
                validaciones.every(
                    resultado =>
                        resultado === true
                );


            /* ---------------------------------------------
               SI HAY ERRORES
            --------------------------------------------- */

            if (!formularioValido) {

                const primerError =
                    formulario.querySelector(
                        ".campo-error"
                    );


                if (primerError) {

                    primerError.focus();
                }


                return;
            }


            /* ---------------------------------------------
               GUARDAR SOLICITUD
            --------------------------------------------- */

            guardarCita();


            /* ---------------------------------------------
               LIMPIAR FORMULARIO
            --------------------------------------------- */

            formulario.reset();


            contadorMotivo.textContent =
                "0 / 500";


            /* ---------------------------------------------
               MOSTRAR MENSAJE DE ÉXITO
            --------------------------------------------- */

            mensajeExitoCita.classList.add(
                "mostrar"
            );


            mensajeExitoCita.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "center"
            });


            /* ---------------------------------------------
               OCULTAR MENSAJE DESPUÉS DE 6 SEGUNDOS
            --------------------------------------------- */

            setTimeout(() => {

                mensajeExitoCita.classList.remove(
                    "mostrar"
                );

            }, 6000);
        }
    );

});