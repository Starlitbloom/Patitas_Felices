/* =========================================================
   PATITAS FELICES
   MIS CITAS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const contenedorCitas =
        document.getElementById("contenedorCitas");

    const sinCitas =
        document.getElementById("sinCitas");

    const totalCitas =
        document.getElementById("totalCitas");


    /* =====================================================
       OBTENER CITAS
    ===================================================== */

    function obtenerCitas() {

        return JSON.parse(
            localStorage.getItem(
                "patitasFelicesCitas"
            )
        ) || [];
    }


    /* =====================================================
       GUARDAR CITAS
    ===================================================== */

    function guardarCitas(citas) {

        localStorage.setItem(
            "patitasFelicesCitas",
            JSON.stringify(citas)
        );
    }


    /* =====================================================
       FORMATEAR FECHA
    ===================================================== */

    function formatearFecha(fecha) {

        if (!fecha) {
            return "Sin fecha";
        }


        const partes =
            fecha.split("-");


        if (partes.length !== 3) {
            return fecha;
        }


        const nuevaFecha =
            new Date(
                Number(partes[0]),
                Number(partes[1]) - 1,
                Number(partes[2])
            );


        return nuevaFecha.toLocaleDateString(
            "es-CL",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );
    }


    /* =====================================================
       CLASE DEL ESTADO
    ===================================================== */

    function obtenerClaseEstado(estado) {

        const valor =
            estado.toLowerCase();


        if (valor === "confirmada") {
            return "estado-confirmada";
        }


        if (valor === "cancelada") {
            return "estado-cancelada";
        }


        return "estado-pendiente";
    }


    /* =====================================================
       ICONO DE MASCOTA
    ===================================================== */

    function obtenerIconoMascota(tipo) {

        if (tipo === "Perro") {
            return "🐶";
        }


        if (tipo === "Gato") {
            return "🐱";
        }


        return "♡";
    }


    /* =====================================================
       MOSTRAR CITAS
    ===================================================== */

    function mostrarCitas() {

        const citas =
            obtenerCitas();


        contenedorCitas.innerHTML = "";


        totalCitas.textContent =
            citas.length;


        /* -------------------------------------------------
           NO HAY CITAS
        ------------------------------------------------- */

        if (citas.length === 0) {

            sinCitas.style.display =
                "block";

            contenedorCitas.style.display =
                "none";

            return;
        }


        sinCitas.style.display =
            "none";

        contenedorCitas.style.display =
            "grid";


        /* -------------------------------------------------
           ORDENAR MÁS RECIENTES PRIMERO
        ------------------------------------------------- */

        const citasOrdenadas =
            [...citas].sort(
                (a, b) =>
                    b.id - a.id
            );


        /* -------------------------------------------------
           CREAR TARJETAS
        ------------------------------------------------- */

        citasOrdenadas.forEach(
            (cita) => {

                const tarjeta =
                    document.createElement("article");


                tarjeta.classList.add(
                    "tarjeta-cita"
                );


                const claseEstado =
                    obtenerClaseEstado(
                        cita.estado || "Pendiente"
                    );


                const iconoMascota =
                    obtenerIconoMascota(
                        cita.tipoMascota
                    );


                const motivo =
                    cita.motivo &&
                    cita.motivo.trim() !== ""
                        ? cita.motivo
                        : "Sin información adicional.";


                tarjeta.innerHTML = `

                    <div class="cita-superior">

                        <div class="cita-mascota">

                            <div class="icono-mascota-cita">
                                ${iconoMascota}
                            </div>

                            <div>

                                <h3>
                                    ${cita.mascota}
                                </h3>

                                <span>
                                    ${cita.tipoMascota}
                                </span>

                            </div>

                        </div>


                        <span
                            class="
                                estado-cita
                                ${claseEstado}
                            "
                        >
                            ${cita.estado || "Pendiente"}
                        </span>

                    </div>


                    <div class="datos-cita">


                        <div class="dato-cita">

                            <span>
                                Servicio
                            </span>

                            <strong>
                                ${cita.servicio}
                            </strong>

                        </div>


                        <div class="dato-cita">

                            <span>
                                Fecha
                            </span>

                            <strong>
                                ${formatearFecha(cita.fecha)}
                            </strong>

                        </div>


                        <div class="dato-cita">

                            <span>
                                Hora
                            </span>

                            <strong>
                                ${cita.hora}
                            </strong>

                        </div>


                        <div class="dato-cita">

                            <span>
                                Dueño
                            </span>

                            <strong>
                                ${cita.dueno}
                            </strong>

                        </div>


                    </div>


                    <div class="motivo-cita">

                        <span>
                            Motivo o información adicional
                        </span>

                        <p>
                            ${motivo}
                        </p>

                    </div>


                    ${
                        cita.estado === "Pendiente"

                            ? `

                            <div class="acciones-cita">

                                <button
                                    type="button"
                                    class="boton-cancelar-cita"
                                    data-id="${cita.id}"
                                >
                                    Cancelar cita
                                </button>

                            </div>

                            `

                            : ""
                    }

                `;


                contenedorCitas.appendChild(
                    tarjeta
                );
            }
        );


        agregarEventosCancelar();
    }


    /* =====================================================
       CANCELAR CITA
    ===================================================== */

    function cancelarCita(id) {

        const citas =
            obtenerCitas();


        const citasActualizadas =
            citas.map(
                (cita) => {

                    if (
                        Number(cita.id) ===
                        Number(id)
                    ) {

                        return {
                            ...cita,
                            estado:
                                "Cancelada"
                        };
                    }


                    return cita;
                }
            );


        guardarCitas(
            citasActualizadas
        );


        mostrarCitas();
    }


    /* =====================================================
       EVENTOS BOTONES CANCELAR
    ===================================================== */

    function agregarEventosCancelar() {

        const botones =
            document.querySelectorAll(
                ".boton-cancelar-cita"
            );


        botones.forEach(
            (boton) => {

                boton.addEventListener(
                    "click",
                    () => {

                        const id =
                            boton.dataset.id;


                        const confirmar =
                            window.confirm(
                                "¿Seguro que deseas cancelar esta cita?"
                            );


                        if (!confirmar) {
                            return;
                        }


                        cancelarCita(id);
                    }
                );
            }
        );
    }


    /* =====================================================
       INICIAR
    ===================================================== */

    mostrarCitas();

});