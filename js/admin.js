/* =========================================================
   PATITAS FELICES — admin.js
   Lógica del panel de administración: protección de acceso,
   KPIs del dashboard y tabla de últimos usuarios.
   Depende de las funciones ya definidas en usuarios.js
   (obtenerUsuarios, obtenerSesion, cerrarSesion).
========================================================= */

function protegerRutaAdmin() {
    const sesion = obtenerSesion();

    if (!sesion || sesion.rol !== 'admin') {
        window.location.href = '../html/login.html';
        return null;
    }

    return sesion;
}

function initDashboardAdmin() {
    const sesion = protegerRutaAdmin();
    if (!sesion) return;

    const nombreDisplay = document.getElementById('admin-nombre-display');
    if (nombreDisplay) nombreDisplay.textContent = sesion.nombre || 'Admin';

    const usuarios = obtenerUsuarios();

    // KPI: total de usuarios
    const kpiTotal = document.getElementById('kpi-total-usuarios');
    if (kpiTotal) kpiTotal.textContent = usuarios.length;

    // KPI: nuevos esta semana (requiere que cada usuario tenga 'fechaRegistro';
    // si aún no la guardas, este KPI queda en 0 sin romper nada)
    const unaSemanaMs = 7 * 24 * 60 * 60 * 1000;
    const ahora = Date.now();
    const nuevosSemana = usuarios.filter((u) => {
        if (!u.fechaRegistro) return false;
        return ahora - new Date(u.fechaRegistro).getTime() <= unaSemanaMs;
    }).length;
    const kpiNuevos = document.getElementById('kpi-nuevos-semana');
    if (kpiNuevos) kpiNuevos.textContent = nuevosSemana;

    // KPI: mascotas y citas (placeholders hasta que existan esas páginas)
    let mascotas = [];
    let citas = [];
    try {
        mascotas = JSON.parse(localStorage.getItem('patitasFelices_mascotas')) || [];
    } catch { mascotas = []; }
    try {
        citas = JSON.parse(localStorage.getItem('patitasFelices_citas')) || [];
    } catch { citas = []; }

    const kpiMascotas = document.getElementById('kpi-mascotas');
    if (kpiMascotas) kpiMascotas.textContent = mascotas.length;

    const kpiCitas = document.getElementById('kpi-citas');
    if (kpiCitas) {
        const pendientes = citas.filter((c) => (c.estado || '').toLowerCase() === 'pendiente').length;
        kpiCitas.textContent = pendientes;
    }

    // Tabla: últimos 5 usuarios registrados
    const tbody = document.getElementById('admin-tabla-recientes');
    const vacia = document.getElementById('admin-tabla-vacia');

    if (tbody) {
        const ultimos = usuarios.slice(-5).reverse();

        if (ultimos.length === 0) {
            if (vacia) vacia.style.display = 'block';
        } else {
            tbody.innerHTML = ultimos.map((u) => {
                const rol = u.rol || 'cliente';
                const badgeClase = rol === 'admin' ? 'admin-badge--admin' : 'admin-badge--cliente';
                return `
                    <tr>
                        <td>${u.nombre || ''} ${u.apellidos || ''}</td>
                        <td>${u.correo || ''}</td>
                        <td>${u.comuna || 'Sin comuna'}</td>
                        <td><span class="admin-badge ${badgeClase}">${rol}</span></td>
                    </tr>
                `;
            }).join('');
        }
    }
}

function initBotonCerrarSesionAdmin() {
    const btn = document.getElementById('btn-cerrar-sesion-admin');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        cerrarSesion();
        window.location.href = '../html/login.html';
    });
}

let filtroTextoUsuarios = '';
let filtroRolUsuarios = '';

function initPaginaUsuarios() {
    const sesion = protegerRutaAdmin();
    if (!sesion) return;

    renderTablaUsuarios();

    const buscador = document.getElementById('admin-buscador');
    if (buscador) {
        buscador.addEventListener('input', () => {
            filtroTextoUsuarios = buscador.value.trim().toLowerCase();
            renderTablaUsuarios();
        });
    }

    const filtroRol = document.getElementById('admin-filtro-rol');
    if (filtroRol) {
        filtroRol.addEventListener('change', () => {
            filtroRolUsuarios = filtroRol.value;
            renderTablaUsuarios();
        });
    }

    const btnLimpiar = document.getElementById('admin-btn-limpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            filtroTextoUsuarios = '';
            filtroRolUsuarios = '';
            if (buscador) buscador.value = '';
            if (filtroRol) filtroRol.value = '';
            renderTablaUsuarios();
        });
    }

    initModalesUsuarios(sesion);
}

function renderTablaUsuarios() {
    const tbody = document.getElementById('admin-tabla-body');
    const vacia = document.getElementById('admin-tabla-vacia');
    if (!tbody) return;

    const sesion = obtenerSesion();
    let usuarios = obtenerUsuarios();

    if (filtroTextoUsuarios) {
        usuarios = usuarios.filter((u) => {
            const texto = `${u.run || ''} ${u.nombre || ''} ${u.apellidos || ''} ${u.correo || ''}`.toLowerCase();
            return texto.includes(filtroTextoUsuarios);
        });
    }

    if (filtroRolUsuarios) {
        usuarios = usuarios.filter((u) => (u.rol || 'cliente') === filtroRolUsuarios);
    }

    if (usuarios.length === 0) {
        tbody.innerHTML = '';
        if (vacia) vacia.style.display = 'block';
        return;
    }

    if (vacia) vacia.style.display = 'none';

    tbody.innerHTML = usuarios.map((u) => {
        const rol = u.rol || 'cliente';
        const badgeClase = rol === 'admin' ? 'admin-badge--admin' : 'admin-badge--cliente';
        const esUnoMismo = sesion && u.correo.toLowerCase() === sesion.correo.toLowerCase();

        return `
            <tr>
                <td>${u.run || '—'}</td>
                <td>${u.nombre || ''}</td>
                <td>${u.apellidos || ''}</td>
                <td>${u.correo || ''}</td>
                <td>${u.comuna || 'Sin comuna'}</td>
                <td><span class="admin-badge ${badgeClase}">${rol}</span></td>
                <td>
                    <div class="admin-acciones-fila">
                        <button type="button" class="admin-btn-accion admin-btn-accion--ver" data-correo="${u.correo}" data-accion="ver">Ver</button>
                        <button type="button" class="admin-btn-accion admin-btn-accion--editar" data-correo="${u.correo}" data-accion="editar">Editar</button>
                        <button type="button" class="admin-btn-accion admin-btn-accion--eliminar" data-correo="${u.correo}" data-accion="eliminar" ${esUnoMismo ? 'disabled title="No puedes eliminar tu propia cuenta"' : ''}>Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function initModalesUsuarios(sesion) {
    const tbody = document.getElementById('admin-tabla-body');

    const modalVerFondo = document.getElementById('modal-ver-fondo');
    const modalVerContenido = document.getElementById('modal-ver-contenido');
    const modalVerCerrar = document.getElementById('modal-ver-cerrar');

    const modalEditarFondo = document.getElementById('modal-editar-fondo');
    const modalEditarCerrar = document.getElementById('modal-editar-cerrar');
    const formEditar = document.getElementById('form-editar-usuario');

    if (!tbody) return;

    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-accion]');
        if (!btn) return;

        const correo = btn.dataset.correo;
        const accion = btn.dataset.accion;
        const usuarios = obtenerUsuarios();
        const usuario = usuarios.find((u) => u.correo === correo);
        if (!usuario) return;

        if (accion === 'ver') {
            abrirModalVer(usuario);
        } else if (accion === 'editar') {
            abrirModalEditar(usuario);
        } else if (accion === 'eliminar') {
            eliminarUsuarioConConfirmacion(usuario, sesion);
        }
    });

    function abrirModalVer(usuario) {
        modalVerContenido.innerHTML = `
            <div class="perfil-dato-fila">
                <span class="perfil-dato-fila-label">RUN</span>
                <span class="perfil-dato-fila-valor">${usuario.run || '—'}</span>
            </div>
            <div class="perfil-dato-fila">
                <span class="perfil-dato-fila-label">Nombre</span>
                <span class="perfil-dato-fila-valor">${usuario.nombre || '—'}</span>
            </div>
            <div class="perfil-dato-fila">
                <span class="perfil-dato-fila-label">Apellidos</span>
                <span class="perfil-dato-fila-valor">${usuario.apellidos || '—'}</span>
            </div>
            <div class="perfil-dato-fila">
                <span class="perfil-dato-fila-label">Correo</span>
                <span class="perfil-dato-fila-valor">${usuario.correo || '—'}</span>
            </div>
            <div class="perfil-dato-fila">
                <span class="perfil-dato-fila-label">Teléfono</span>
                <span class="perfil-dato-fila-valor">${usuario.telefono || 'No registrado'}</span>
            </div>
            <div class="perfil-dato-fila">
                <span class="perfil-dato-fila-label">Región</span>
                <span class="perfil-dato-fila-valor">${usuario.region || '—'}</span>
            </div>
            <div class="perfil-dato-fila">
                <span class="perfil-dato-fila-label">Comuna</span>
                <span class="perfil-dato-fila-valor">${usuario.comuna || '—'}</span>
            </div>
            <div class="perfil-dato-fila">
                <span class="perfil-dato-fila-label">Dirección</span>
                <span class="perfil-dato-fila-valor">${usuario.direccion || '—'}</span>
            </div>
            <div class="perfil-dato-fila">
                <span class="perfil-dato-fila-label">Rol</span>
                <span class="perfil-dato-fila-valor">${usuario.rol || 'cliente'}</span>
            </div>
        `;
        modalVerFondo.style.display = 'flex';
    }

    function abrirModalEditar(usuario) {
        document.getElementById('editar-correo-original').value = usuario.correo;
        document.getElementById('editar-nombre').value = usuario.nombre || '';
        document.getElementById('editar-apellidos').value = usuario.apellidos || '';
        document.getElementById('editar-correo').value = usuario.correo || '';
        document.getElementById('editar-rol').value = usuario.rol || 'cliente';

        modalEditarFondo.style.display = 'flex';
    }

    modalVerCerrar.addEventListener('click', () => modalVerFondo.style.display = 'none');
    modalVerFondo.addEventListener('click', (e) => {
        if (e.target === modalVerFondo) modalVerFondo.style.display = 'none';
    });

    modalEditarCerrar.addEventListener('click', () => modalEditarFondo.style.display = 'none');
    modalEditarFondo.addEventListener('click', (e) => {
        if (e.target === modalEditarFondo) modalEditarFondo.style.display = 'none';
    });

        formEditar.addEventListener('submit', (e) => {
        e.preventDefault();

        const correoOriginal = document.getElementById('editar-correo-original').value;
        const nuevoNombre = document.getElementById('editar-nombre').value.trim();
        const nuevosApellidos = document.getElementById('editar-apellidos').value.trim();
        const nuevoCorreo = document.getElementById('editar-correo').value.trim();
        const nuevoRol = document.getElementById('editar-rol').value;

        const errores = {
            'campo-editar-nombre': validarRequerido(nuevoNombre, 50, 'El nombre'),
            'campo-editar-apellidos': validarRequerido(nuevosApellidos, 100, 'Los apellidos'),
            'campo-editar-correo': validarCorreo(nuevoCorreo),
        };

        Object.entries(errores).forEach(([id, msg]) => marcarCampo(id, msg));
        const hayErrores = Object.values(errores).some((e) => e !== null);
        if (hayErrores) return;

        const usuarios = obtenerUsuarios();

        const correoDuplicado = usuarios.some(
            (u) => u.correo.toLowerCase() === nuevoCorreo.toLowerCase() && u.correo.toLowerCase() !== correoOriginal.toLowerCase()
        );
        if (correoDuplicado) {
            marcarCampo('campo-editar-correo', 'Ese correo ya está en uso por otra cuenta.');
            return;
        }

        const indice = usuarios.findIndex((u) => u.correo === correoOriginal);
        if (indice !== -1) {
            usuarios[indice] = {
                ...usuarios[indice],
                nombre: nuevoNombre,
                apellidos: nuevosApellidos,
                correo: nuevoCorreo,
                rol: nuevoRol,
            };
            guardarUsuarios(usuarios);

            const sesionActual = obtenerSesion();
            if (sesionActual && sesionActual.correo.toLowerCase() === correoOriginal.toLowerCase()) {
                guardarSesion(usuarios[indice]);
            }
        }

        modalEditarFondo.style.display = 'none';
        renderTablaUsuarios();
    });
}

function eliminarUsuarioConConfirmacion(usuario, sesion) {
    if (sesion && usuario.correo.toLowerCase() === sesion.correo.toLowerCase()) {
        alert('No puedes eliminar tu propia cuenta mientras tienes la sesión activa.');
        return;
    }

    const confirmado = confirm(`¿Eliminar la cuenta de ${usuario.nombre} ${usuario.apellidos}? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    const usuarios = obtenerUsuarios().filter((u) => u.correo !== usuario.correo);
    guardarUsuarios(usuarios);
    renderTablaUsuarios();
}

document.addEventListener('DOMContentLoaded', () => {
    initDashboardAdmin();
    initPaginaUsuarios();
    initBotonCerrarSesionAdmin();
});
