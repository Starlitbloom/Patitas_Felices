/* =========================================================
   PATITAS FELICES — admin-mascotas.js
========================================================= */

let idEnEdicion = null;

function validarRequerido(valor, maxLength, nombreCampo) {
    if (!valor || valor.trim().length === 0) return `${nombreCampo} es obligatorio.`;
    if (maxLength && valor.length > maxLength) return `${nombreCampo} no puede superar los ${maxLength} caracteres.`;
    return null;
}

function marcarCampo(id, mensajeError) {
    const campo = document.getElementById(id);
    if (!campo) return;
    const errorEl = campo.querySelector(".campo__error");
    campo.classList.remove("campo--invalido", "campo--valido");
    if (mensajeError) {
        campo.classList.add("campo--invalido");
        if (errorEl) errorEl.textContent = mensajeError;
    } else {
        campo.classList.add("campo--valido");
    }
}


/* =========================================================
   TABLA
========================================================= */

function claseEstado(estado) {
    if (estado === "al-dia") return "estado-al-dia";
    if (estado === "tratamiento") return "estado-tratamiento";
    return "estado-pendiente";
}

function crearFilaMascota(mascota) {
    return `
        <tr data-id="${mascota.id}">
            <td><img src="${mascota.imagen}" alt="${mascota.nombre}">${mascota.nombre}</td>
            <td>${mascota.especie}</td>
            <td>${mascota.raza}</td>
            <td>${mascota.dueno}</td>
            <td><span class="estado-badge ${claseEstado(mascota.estado)}">${mascota.estadoTexto}</span></td>
            <td>
                <div class="acciones-fila">
                    <button type="button" class="boton-accion boton-editar" data-accion="editar" data-id="${mascota.id}">Editar</button>
                    <button type="button" class="boton-accion boton-eliminar" data-accion="eliminar" data-id="${mascota.id}">Eliminar</button>
                </div>
            </td>
        </tr>
    `;
}

function renderizarTablaMascotas() {
    const cuerpoTabla = document.getElementById("cuerpo-tabla-mascotas");
    if (!cuerpoTabla) return;

    if (mascotas.length === 0) {
        cuerpoTabla.innerHTML = `<tr class="tabla-admin-vacio"><td colspan="6">No hay mascotas registradas.</td></tr>`;
        return;
    }

    cuerpoTabla.innerHTML = mascotas.map(crearFilaMascota).join("");
}


/* =========================================================
   FORMULARIO (crear / editar)
========================================================= */

function mostrarFormulario(mascota) {
    const tarjeta = document.getElementById("tarjeta-formulario-mascota");
    const titulo = document.getElementById("titulo-formulario-mascota");
    const form = document.getElementById("form-mascota");
    if (!tarjeta || !form) return;

    form.reset();
    ["campo-nombre-m", "campo-especie-m", "campo-raza-m", "campo-edad-m", "campo-dueno-m", "campo-estado-m"]
        .forEach((id) => marcarCampo(id, null));

    if (mascota) {
        idEnEdicion = mascota.id;
        titulo.textContent = `Editar a ${mascota.nombre}`;
        form.nombre.value = mascota.nombre;
        form.especie.value = mascota.especie;
        form.raza.value = mascota.raza;
        form.edad.value = mascota.edad;
        form.dueno.value = mascota.dueno;
        form.estado.value = mascota.estado;
        form.imagen.value = mascota.imagen || "";
    } else {
        idEnEdicion = null;
        titulo.textContent = "Registrar nueva mascota";
    }

    tarjeta.classList.add("visible");
    tarjeta.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ocultarFormulario() {
    const tarjeta = document.getElementById("tarjeta-formulario-mascota");
    if (tarjeta) tarjeta.classList.remove("visible");
    idEnEdicion = null;
}

function textoEstado(valor) {
    if (valor === "al-dia") return "Control al día";
    if (valor === "tratamiento") return "En tratamiento";
    return "Vacunas pendientes";
}

function initFormularioMascota() {
    const form = document.getElementById("form-mascota");
    if (!form) return;

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const errores = {
            "campo-nombre-m": validarRequerido(form.nombre.value, 40, "El nombre"),
            "campo-especie-m": validarRequerido(form.especie.value, 30, "La especie"),
            "campo-raza-m": validarRequerido(form.raza.value, 40, "La raza"),
            "campo-edad-m": validarRequerido(form.edad.value, 20, "La edad"),
            "campo-dueno-m": validarRequerido(form.dueno.value, 60, "El nombre del dueño/a"),
            "campo-estado-m": validarRequerido(form.estado.value, null, "El estado"),
        };

        Object.entries(errores).forEach(([campoId, mensaje]) => marcarCampo(campoId, mensaje));

        const hayErrores = Object.values(errores).some((mensaje) => mensaje !== null);
        if (hayErrores) return;

        if (idEnEdicion) {
            const mascota = obtenerMascotaPorId(idEnEdicion);
            if (mascota) {
                mascota.nombre = form.nombre.value.trim();
                mascota.especie = form.especie.value.trim();
                mascota.raza = form.raza.value.trim();
                mascota.edad = form.edad.value.trim();
                mascota.dueno = form.dueno.value.trim();
                mascota.estado = form.estado.value;
                mascota.estadoTexto = textoEstado(form.estado.value);
                mascota.imagen = form.imagen.value.trim() || "../img/cuidado.png";
            }
        } else {
            const nuevoId = form.nombre.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-") + "-" + Date.now();
            mascotas.push({
                id: nuevoId,
                nombre: form.nombre.value.trim(),
                especie: form.especie.value.trim(),
                raza: form.raza.value.trim(),
                edad: form.edad.value.trim(),
                sexo: "No especificado",
                peso: "No especificado",
                dueno: form.dueno.value.trim(),
                imagen: form.imagen.value.trim() ||"../img/cuidado.png",
                estado: form.estado.value,
                estadoTexto: textoEstado(form.estado.value),
                descripcion: "Ficha creada desde el mantenedor administrativo."
            });
        }

        renderizarTablaMascotas();
        ocultarFormulario();
    });

    const botonCancelar = document.getElementById("boton-cancelar-mascota");
    if (botonCancelar) botonCancelar.addEventListener("click", ocultarFormulario);
}


/* =========================================================
   ACCIONES DE TABLA (editar / eliminar)
========================================================= */

function initAccionesTabla() {
    const cuerpoTabla = document.getElementById("cuerpo-tabla-mascotas");
    if (!cuerpoTabla) return;

    cuerpoTabla.addEventListener("click", (evento) => {
        const boton = evento.target.closest("button[data-accion]");
        if (!boton) return;

        const id = boton.dataset.id;

        if (boton.dataset.accion === "editar") {
            mostrarFormulario(obtenerMascotaPorId(id));
        }

        if (boton.dataset.accion === "eliminar") {
            const mascota = obtenerMascotaPorId(id);
            const confirmar = window.confirm(`¿Eliminar a ${mascota ? mascota.nombre : "esta mascota"} del listado?`);
            if (!confirmar) return;

            const indice = mascotas.findIndex((m) => m.id === id);
            if (indice !== -1) mascotas.splice(indice, 1);
            renderizarTablaMascotas();
        }
    });
}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("cuerpo-tabla-mascotas");
    if (!tabla) return;

    renderizarTablaMascotas();
    initFormularioMascota();
    initAccionesTabla();

    const botonNuevo = document.getElementById("boton-nueva-mascota");
    if (botonNuevo) botonNuevo.addEventListener("click", () => mostrarFormulario(null));
});