/* =========================================================
   PATITAS FELICES — mascotas.js
   Datos de las mascotas/pacientes y renderizado dinámico
   del catálogo (mascotas.html) y de la vista de detalle
   (detalle-mascota.html), a partir de un arreglo en JS.
========================================================= */

const mascotas = [

    {
        id: "rocky",
        nombre: "Rocky",
        especie: "Perro",
        raza: "Golden Retriever",
        edad: "3 años",
        sexo: "Macho",
        peso: "28 kg",
        dueno: "Constanza Herrera",
        imagen: "../img/golden.jpg",
        estado: "al-dia",
        estadoTexto: "Control al día",
        descripcion: "Rocky es un perro tranquilo y juguetón. Mantiene sus controles y vacunas al día, sin antecedentes de alergias conocidas."
    },

    {
        id: "luna",
        nombre: "Luna",
        especie: "Gato",
        raza: "Común europeo",
        edad: "2 años",
        sexo: "Hembra",
        peso: "4 kg",
        dueno: "Diego Soto",
        imagen: "../img/gataeuropea.jpg",
        estado: "pendiente",
        estadoTexto: "Vacunas pendientes",
        descripcion: "Luna es una gata independiente y curiosa. Le falta aplicarse el refuerzo anual de su calendario de vacunación."
    },

    {
        id: "max",
        nombre: "Max",
        especie: "Perro",
        raza: "Labrador",
        edad: "5 años",
        sexo: "Macho",
        peso: "32 kg",
        dueno: "Javiera Muñoz",
        imagen: "../img/labrador.jpg",
        estado: "tratamiento",
        estadoTexto: "En tratamiento",
        descripcion: "Max se encuentra en tratamiento por una dermatitis leve. Requiere control de seguimiento en las próximas semanas."
    },

    {
        id: "michi",
        nombre: "Michi",
        especie: "Gato",
        raza: "Persa",
        edad: "1 año",
        sexo: "Hembra",
        peso: "3.2 kg",
        dueno: "Tomás Reyes",
        imagen: "../img/gatopersa.jpg",
        estado: "al-dia",
        estadoTexto: "Control al día",
        descripcion: "Michi es una gatita joven y sana. Al ser de raza persa, se recomienda vigilar su cuidado respiratorio y ocular."
    },

    {
        id: "bella",
        nombre: "Bella",
        especie: "Conejo",
        raza: "Toy enano",
        edad: "3 meses ",
        sexo: "Hembra",
        peso: "1.1 kg",
        dueno: "Mara Gonzalez",
        imagen: "../img/conejo.jpg",
        estado: "al-dia",
        estadoTexto: "Control al día",
        descripcion: "Bella es una coneja joven y sana. Al ser de raza toy enano, se recomienda vigilar su cuidado dental y digestivo."
    },

    {
        id: "nicanor",
        nombre: "Nicanor",
        especie: "Ave",
        raza: "Cacatua",
        edad: "1 año",
        sexo: "Macho",
        peso: "800 gr",
        dueno: "Sofía Martínez",
        imagen: "../img/Cacatua.jpg",
        estado: "al-dia",
        estadoTexto: "Control al día",
        descripcion: "Nicanor es un loro curioso y activo. No requiere vacunas dentro del protocolo actual de la clínica; se recomienda control veterinario aviar cada 6 meses."
    }

];


/* =========================================================
   HISTORIAL CLÍNICO POR MASCOTA
========================================================= */

const historiales = {

    rocky: [
        { fecha: "12 agosto 2026", motivo: "Control anual", diagnostico: "Paciente sano, sin hallazgos relevantes.", tratamiento: "Sin medicación. Se indica Condrovet forte (condroitín + glucosamina) como suplemento articular preventivo.", veterinario: "Dra. Paula Vidal" },
        { fecha: "03 marzo 2026", motivo: "Vómitos ocasionales", diagnostico: "Gastritis leve, probablemente alimentaria.", tratamiento: "Omeprazol 10mg vet cada 24h por 5 días y dieta blanda por 3 días.", veterinario: "Dr. Sebastian Jimenez" }
    ],

    luna: [
        { fecha: "20 julio 2026", motivo: "Control de rutina", diagnostico: "Paciente sana. Pendiente refuerzo de vacuna anual.", tratamiento: "Se agenda vacuna triple felina (Felocell CVR) para el próximo control.", veterinario: "Dra. Paula Vidal" }
    ],

    max: [
        { fecha: "28 agosto 2026", motivo: "Picazón y enrojecimiento en la piel", diagnostico: "Dermatitis alérgica leve.", tratamiento: "Apoquel 16mg (oclacitinib) una vez al día y shampoo Malaseb dos veces por semana durante 10 días.", veterinario: "Dr. Ignacio Rojas" },
        { fecha: "14 agosto 2026", motivo: "Chequeo previo a tratamiento", diagnostico: "Confirmación de irritación cutánea en zona abdominal.", tratamiento: "Se deriva a control dermatológico y se solicita hemograma completo.", veterinario: "Dra. Marta López" }
    ],

    michi: [
        { fecha: "02 junio 2026", motivo: "Primer control post adopción", diagnostico: "Cachorra sana, buen desarrollo.", tratamiento: "Inicio de plan de vacunación con Nobivac Rabies y desparasitación interna felina.", veterinario: "Dr. Eduardo Caceres" }
    ],

    Bella: [
        { fecha: "18 Agosto 2026", motivo: "Control dental de rutina", diagnostico: "Sin sobrecrecimiento dentario, buen estado general.", tratamiento: "Se recomienda dieta rica en fibra (heno) para desgaste natural de dientes.", veterinario: "Dra. Marta López" }
    ],

    Nicanor: [
        { fecha: "05 Agosto 2026", motivo: "Chequeo aviar general", diagnostico: "Ave activa, plumaje en buen estado, sin signos de enfermedad respiratoria.", tratamiento: "SSe indica suplemento vitamínico y control en 6 meses.", veterinario: "Dr. Sebastian Jimenez" }
    ]

};


/* =========================================================
   VACUNAS POR MASCOTA
========================================================= */

const vacunasPorMascota = {

    rocky: [
        { vacuna: "Vacuna sextuple canina (VA002)", fecha: "10 enero 2026", proximoRefuerzo: "10 enero 2027", estado: "al-dia" },
        { vacuna: "Vacuna antirrábica canina (VA001)", fecha: "15 enero 2026", proximoRefuerzo: "15 enero 2027", estado: "al-dia" }
    ],

    luna: [
        { vacuna: "Vacuna triple felina (VA004)", fecha: "05 julio 2025", proximoRefuerzo: "05 julio 2026", estado: "atrasada" }
    ],

    max: [
        { vacuna: "Vacuna sextuple canina (VA002)", fecha: "20 mayo 2026", proximoRefuerzo: "20 mayo 2027", estado: "al-dia" },
        { vacuna: "Vacuna Bordetella canina (VA005)", fecha: "18 septiembre 2026", proximoRefuerzo: "18 septiembre 2027", estado: "proxima" }
    ],

    michi: [
        { vacuna: "Vacuna bivalente felina (VA003)", fecha: "02 junio 2026", proximoRefuerzo: "02 diciembre 2026", estado: "proxima" }
    ],



};


/* =========================================================
   FAVORITOS (LocalStorage)
   Permite marcar mascotas como favoritas desde el catálogo
   o desde su ficha de detalle. La selección se guarda en el
   navegador y se mantiene aunque se recargue la página.
========================================================= */

const CLAVE_FAVORITOS = "patitas-favoritos-mascotas";

function obtenerFavoritos() {
    try {
        const guardado = localStorage.getItem(CLAVE_FAVORITOS);
        const lista = guardado ? JSON.parse(guardado) : [];
        return Array.isArray(lista) ? lista : [];
    } catch (error) {
        console.error("No se pudo leer los favoritos desde LocalStorage:", error);
        return [];
    }
}

function guardarFavoritos(idsFavoritos) {
    try {
        localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(idsFavoritos));
    } catch (error) {
        console.error("No se pudo guardar los favoritos en LocalStorage:", error);
    }
}

function esFavorito(id) {
    return obtenerFavoritos().includes(id);
}

function alternarFavorito(id) {
    const favoritos = obtenerFavoritos();
    const indice = favoritos.indexOf(id);

    if (indice === -1) {
        favoritos.push(id);
    } else {
        favoritos.splice(indice, 1);
    }

    guardarFavoritos(favoritos);
    return favoritos.includes(id);
}


/* =========================================================
   UTILIDAD: buscar mascota por id
========================================================= */

function obtenerMascotaPorId(id) {
    return mascotas.find((m) => m.id === id) || null;
}


/* =========================================================
   RENDER: CATÁLOGO (mascotas.html)
========================================================= */

function crearTarjetaMascota(mascota) {
    const claseEstado =
        mascota.estado === "al-dia" ? "estado-al-dia" :
        mascota.estado === "tratamiento" ? "estado-tratamiento" :
        "estado-pendiente";

    const favorita = esFavorito(mascota.id);

    return `
        <article class="tarjeta-mascota">
            <div class="tarjeta-mascota-imagen">
                <span class="estado-badge ${claseEstado}">${mascota.estadoTexto}</span>
                <button type="button"
                        class="boton-favorito ${favorita ? "activo" : ""}"
                        data-id="${mascota.id}"
                        aria-pressed="${favorita}"
                        aria-label="${favorita ? "Quitar de favoritos" : "Agregar a favoritos"}">
                    ${favorita ? "★" : "☆"}
                </button>
                <img src="${mascota.imagen}" alt="${mascota.nombre}, ${mascota.especie.toLowerCase()}">
            </div>
            <div class="tarjeta-mascota-contenido">
                <h3>${mascota.nombre}</h3>
                <p class="raza-especie">${mascota.especie} · ${mascota.raza}</p>
                <p class="dueno">Dueño/a: ${mascota.dueno}</p>
                <a href="detalle-mascota.html?id=${mascota.id}">Ver ficha completa →</a>
            </div>
        </article>
    `;
}

function renderizarCatalogo(especieFiltro) {
    const contenedor = document.getElementById("grid-mascotas");
    if (!contenedor) return;

    let lista = mascotas;

    if (especieFiltro === "favoritos") {
        const favoritos = obtenerFavoritos();
        lista = mascotas.filter((m) => favoritos.includes(m.id));
    } else if (especieFiltro && especieFiltro !== "todas") {
        lista = mascotas.filter((m) => m.especie === especieFiltro);
    }

    if (lista.length === 0) {
        const mensaje = especieFiltro === "favoritos"
            ? `Aún no has marcado mascotas como favoritas. Usa el ícono ☆ en cada tarjeta.`
            : `No hay mascotas registradas para este filtro.`;
        contenedor.innerHTML = `<p class="grid-mascotas-vacio">${mensaje}</p>`;
        return;
    }

    contenedor.innerHTML = lista.map(crearTarjetaMascota).join("");
}

let filtroActivoMascotas = "todas";

function initFiltrosMascotas() {
    const filtros = document.querySelectorAll(".filtro-especie");
    if (filtros.length === 0) return;

    filtros.forEach((boton) => {
        boton.addEventListener("click", () => {
            filtros.forEach((b) => b.classList.remove("activo"));
            boton.classList.add("activo");
            filtroActivoMascotas = boton.dataset.especie;
            renderizarCatalogo(filtroActivoMascotas);
        });
    });
}

function initBotonesFavorito() {
    const contenedor = document.getElementById("grid-mascotas");
    if (!contenedor) return;

    contenedor.addEventListener("click", (evento) => {
        const boton = evento.target.closest(".boton-favorito");
        if (!boton) return;

        const id = boton.dataset.id;
        const ahoraEsFavorita = alternarFavorito(id);

        boton.classList.toggle("activo", ahoraEsFavorita);
        boton.textContent = ahoraEsFavorita ? "★" : "☆";
        boton.setAttribute("aria-pressed", String(ahoraEsFavorita));
        boton.setAttribute("aria-label", ahoraEsFavorita ? "Quitar de favoritos" : "Agregar a favoritos");

        if (filtroActivoMascotas === "favoritos") {
            renderizarCatalogo("favoritos");
        }
    });
}


/* =========================================================
   RENDER: DETALLE (detalle-mascota.html)
========================================================= */

function renderizarDetalleMascota() {
    const contenedor = document.getElementById("detalle-mascota");
    if (!contenedor) return;

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");
    const mascota = obtenerMascotaPorId(id);

    if (!mascota) {
        contenedor.innerHTML = `
            <div class="mascota-no-encontrada">
                <h2>No encontramos esta mascota</h2>
                <p>Vuelve al listado para elegir un paciente registrado.</p>
                <br>
                <a href="mascotas.html" class="volver-listado">← Volver al listado de mascotas</a>
            </div>
        `;
        document.title = "Mascota no encontrada | Patitas Felices";
        return;
    }

    const claseEstado =
        mascota.estado === "al-dia" ? "estado-al-dia" :
        mascota.estado === "tratamiento" ? "estado-tratamiento" :
        "estado-pendiente";

    document.title = `${mascota.nombre} | Patitas Felices`;

    const favorita = esFavorito(mascota.id);

    contenedor.innerHTML = `
        <a href="mascotas.html" class="volver-listado">← Volver al listado de mascotas</a>

        <div class="detalle-mascota-cabecera">

            <div class="detalle-mascota-imagen">
                <img src="${mascota.imagen}" alt="${mascota.nombre}, ${mascota.especie.toLowerCase()}">
            </div>

            <div class="detalle-mascota-info">
                <div class="detalle-mascota-titulo-fila">
                    <h1>${mascota.nombre}</h1>
                    <button type="button"
                            class="boton-favorito boton-favorito-detalle ${favorita ? "activo" : ""}"
                            id="boton-favorito-detalle"
                            data-id="${mascota.id}"
                            aria-pressed="${favorita}"
                            aria-label="${favorita ? "Quitar de favoritos" : "Agregar a favoritos"}">
                        ${favorita ? "★ En favoritos" : "☆ Agregar a favoritos"}
                    </button>
                </div>
                <p class="raza-especie">${mascota.especie} · ${mascota.raza}</p>
                <span class="estado-badge ${claseEstado}">${mascota.estadoTexto}</span>

                <ul class="lista-datos">
                    <li><strong>Edad</strong>${mascota.edad}</li>
                    <li><strong>Sexo</strong>${mascota.sexo}</li>
                    <li><strong>Peso</strong>${mascota.peso}</li>
                    <li><strong>Dueño/a</strong>${mascota.dueno}</li>
                </ul>

                <p class="detalle-mascota-descripcion">${mascota.descripcion}</p>
            </div>

        </div>

        <div class="accesos-clinicos">

            <a href="ficha-clinica.html?id=${mascota.id}" class="acceso-clinico">
                <span class="icono-acceso">📋</span>
                <h3>Ficha clínica</h3>
                <p>Datos generales y registro de nuevas atenciones.</p>
                <span class="flecha">Ir a la ficha →</span>
            </a>

            <a href="historial-clinico.html?id=${mascota.id}" class="acceso-clinico">
                <span class="icono-acceso">🩺</span>
                <h3>Historial clínico</h3>
                <p>Consultas y tratamientos anteriores.</p>
                <span class="flecha">Ver historial →</span>
            </a>

            <a href="vacunas.html?id=${mascota.id}" class="acceso-clinico">
                <span class="icono-acceso">💉</span>
                <h3>Vacunas</h3>
                <p>Calendario de vacunación y refuerzos.</p>
                <span class="flecha">Ver vacunas →</span>
            </a>

        </div>
    `;

    const botonFavoritoDetalle = document.getElementById("boton-favorito-detalle");
    if (botonFavoritoDetalle) {
        botonFavoritoDetalle.addEventListener("click", () => {
            const ahoraEsFavorita = alternarFavorito(mascota.id);
            botonFavoritoDetalle.classList.toggle("activo", ahoraEsFavorita);
            botonFavoritoDetalle.textContent = ahoraEsFavorita ? "★ En favoritos" : "☆ Agregar a favoritos";
            botonFavoritoDetalle.setAttribute("aria-pressed", String(ahoraEsFavorita));
            botonFavoritoDetalle.setAttribute("aria-label", ahoraEsFavorita ? "Quitar de favoritos" : "Agregar a favoritos");
        });
    }
}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    renderizarCatalogo("todas");
    initFiltrosMascotas();
    initBotonesFavorito();
    renderizarDetalleMascota();
});