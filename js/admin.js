/* =========================================================
   PATITAS FELICES — admin.js
   Lógica del panel de administración: protección de acceso,
   KPIs del dashboard, y gestión de usuarios (tabla, filtros,
   modal Ver, panel inline Editar, exportación a Excel).
   Depende de las funciones ya definidas en usuarios.js
   (obtenerUsuarios, guardarUsuarios, obtenerSesion,
   guardarSesion, cerrarSesion, validarRequerido, validarCorreo,
   validarPassword, marcarCampo, REGIONES).
========================================================= */

function protegerRutaAdmin() {
    const sesion = obtenerSesion();

    if (!sesion || sesion.rol !== 'admin') {
        window.location.href = '../html/login.html';
        return null;
    }

    return sesion;
}

/* ================= DASHBOARD ================= */

function initDashboardAdmin() {
    const sesion = protegerRutaAdmin();
    if (!sesion) return;

    const nombreDisplay = document.getElementById('admin-nombre-display');
    if (nombreDisplay) nombreDisplay.textContent = sesion.nombre || 'Admin';

    const usuarios = obtenerUsuarios();

    const kpiTotal = document.getElementById('kpi-total-usuarios');
    if (kpiTotal) kpiTotal.textContent = usuarios.length;

    const unaSemanaMs = 7 * 24 * 60 * 60 * 1000;
    const ahora = Date.now();
    const nuevosSemana = usuarios.filter((u) => {
        if (!u.fechaRegistro) return false;
        return ahora - new Date(u.fechaRegistro).getTime() <= unaSemanaMs;
    }).length;
    const kpiNuevos = document.getElementById('kpi-nuevos-semana');
    if (kpiNuevos) kpiNuevos.textContent = nuevosSemana;

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

/* ================= GESTIÓN DE USUARIOS ================= */

let filtroTextoUsuarios = '';
let filtroRolUsuarios = '';
let ordenUsuarios = 'recientes';
let correosSeleccionados = new Set();

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

    const selectOrden = document.getElementById('admin-orden');
    if (selectOrden) {
        selectOrden.addEventListener('change', () => {
            ordenUsuarios = selectOrden.value;
            renderTablaUsuarios();
        });
    }

    const btnLimpiar = document.getElementById('admin-btn-limpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            filtroTextoUsuarios = '';
            filtroRolUsuarios = '';
            ordenUsuarios = 'recientes';
            if (buscador) buscador.value = '';
            if (filtroRol) filtroRol.value = '';
            if (selectOrden) selectOrden.value = 'recientes';
            renderTablaUsuarios();
        });
    }

    const btnExportarSeleccion = document.getElementById('admin-btn-exportar-seleccion');
    if (btnExportarSeleccion) {
        btnExportarSeleccion.addEventListener('click', () => {
            if (correosSeleccionados.size === 0) {
                alert('Selecciona al menos un usuario para exportar.');
                return;
            }
            const usuarios = obtenerUsuarios().filter((u) => correosSeleccionados.has(u.correo));
            exportarUsuariosComoExcel(usuarios, 'usuarios-seleccionados');
        });
    }

    initModalesUsuarios(sesion);
    initCheckTodos();
}

function obtenerUsuariosFiltradosYOrdenados() {
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

    if (ordenUsuarios === 'az') {
        usuarios = [...usuarios].sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
    } else if (ordenUsuarios === 'za') {
        usuarios = [...usuarios].sort((a, b) => (b.nombre || '').localeCompare(a.nombre || ''));
    } else {
        usuarios = [...usuarios].reverse();
    }

    return usuarios;
}

function renderTablaUsuarios() {
    const tbody = document.getElementById('admin-tabla-body');
    const vacia = document.getElementById('admin-tabla-vacia');
    if (!tbody) return;

    const sesion = obtenerSesion();
    const usuarios = obtenerUsuariosFiltradosYOrdenados();

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
        const marcado = correosSeleccionados.has(u.correo) ? 'checked' : '';

        return `
            <tr>
                <td><input type="checkbox" class="admin-check-fila" data-correo="${u.correo}" ${marcado}></td>
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

    tbody.querySelectorAll('.admin-check-fila').forEach((chk) => {
        chk.addEventListener('change', () => {
            if (chk.checked) {
                correosSeleccionados.add(chk.dataset.correo);
            } else {
                correosSeleccionados.delete(chk.dataset.correo);
            }
            actualizarCheckTodos();
        });
    });

    actualizarCheckTodos();
}

function actualizarCheckTodos() {
    const checkTodos = document.getElementById('admin-check-todos');
    if (!checkTodos) return;

    const filas = document.querySelectorAll('.admin-check-fila');
    if (filas.length === 0) {
        checkTodos.checked = false;
        return;
    }
    checkTodos.checked = Array.from(filas).every((f) => f.checked);
}

function initCheckTodos() {
    const checkTodos = document.getElementById('admin-check-todos');
    if (!checkTodos) return;

    checkTodos.addEventListener('change', () => {
        document.querySelectorAll('.admin-check-fila').forEach((chk) => {
            chk.checked = checkTodos.checked;
            if (checkTodos.checked) {
                correosSeleccionados.add(chk.dataset.correo);
            } else {
                correosSeleccionados.delete(chk.dataset.correo);
            }
        });
    });
}

/* ================= EXPORTAR A EXCEL ================= */

function exportarUsuariosComoExcel(usuarios, nombreArchivo) {
    const filas = usuarios.map((u) => ({
        RUN: u.run || '',
        Nombre: u.nombre || '',
        Apellidos: u.apellidos || '',
        Correo: u.correo || '',
        Telefono: u.telefono || '',
        Region: u.region || '',
        Comuna: u.comuna || '',
        Direccion: u.direccion || '',
        Rol: u.rol || 'cliente',
    }));

    const hoja = XLSX.utils.json_to_sheet(filas);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Usuarios');
    XLSX.writeFile(libro, `${nombreArchivo}.xlsx`);
}

function exportarUsuarioComoExcel(usuario) {
    exportarUsuariosComoExcel([usuario], `usuario-${usuario.correo.split('@')[0]}`);
}

/* ================= MODAL VER + PANEL EDITAR ================= */

function initModalesUsuarios(sesion) {
    const tbody = document.getElementById('admin-tabla-body');

    const modalVerFondo = document.getElementById('modal-ver-fondo');
    const modalVerContenido = document.getElementById('modal-ver-contenido');
    const modalVerCerrar = document.getElementById('modal-ver-cerrar');

    const panelEditar = document.getElementById('panel-editar');
    const btnCerrarEditar = document.getElementById('btn-cerrar-editar');
    const btnCancelarEditar = document.getElementById('btn-cancelar-editar');
    const formEditar = document.getElementById('form-editar-usuario');

    const panelCrear = document.getElementById('panel-crear');
    const btnCerrarCrear = document.getElementById('btn-cerrar-crear');
    const btnCancelarCrear = document.getElementById('btn-cancelar-crear');
    const formCrear = document.getElementById('form-crear-usuario');
    const accesoNuevo = document.getElementById('acceso-nuevo');

    if (!tbody) return;

    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-accion]');
        if (!btn) return;
        manejarAccionUsuario(btn.dataset.correo, btn.dataset.accion);
    });

    modalVerContenido.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-accion]');
        if (!btn) return;
        manejarAccionUsuario(btn.dataset.correo, btn.dataset.accion);
    });

    function manejarAccionUsuario(correo, accion) {
        const usuarios = obtenerUsuarios();
        const usuario = usuarios.find((u) => u.correo === correo);
        if (!usuario) return;

        if (accion === 'ver') {
            abrirModalVer(usuario);
        } else if (accion === 'editar') {
            modalVerFondo.style.display = 'none';
            abrirPanelEditar(usuario);
        } else if (accion === 'eliminar') {
            modalVerFondo.style.display = 'none';
            eliminarUsuarioConConfirmacion(usuario, sesion);
        } else if (accion === 'exportar') {
            exportarUsuarioComoExcel(usuario);
        }
    }

    function abrirModalVer(usuario) {
        const rol = usuario.rol || 'cliente';
        const badgeRolClase = rol === 'admin' ? 'admin-badge--admin' : 'admin-badge--cliente';
        const avatarSrc = usuario.avatar || '';
        const iniciales = `${(usuario.nombre || '?')[0]}${(usuario.apellidos || '')[0] || ''}`.toUpperCase();

        modalVerContenido.innerHTML = `
            <div class="admin-detalle-cabecera">
                <div class="admin-detalle-avatar">
                    ${avatarSrc
                        ? `<img src="${avatarSrc}" alt="Foto de ${usuario.nombre}">`
                        : `<span>${iniciales}</span>`}
                </div>

                <div class="admin-detalle-info">
                    <h3>${usuario.nombre || ''} ${usuario.apellidos || ''}</h3>
                    <p class="admin-detalle-run">RUN: ${usuario.run || '—'}</p>

                    <div class="admin-detalle-linea">
                        <strong>${usuario.correo || '—'}</strong>
                        <span class="admin-badge ${badgeRolClase}">${rol}</span>
                    </div>

                    <p class="admin-detalle-linea admin-detalle-secundaria">
                        Tel: ${usuario.telefono || 'No registrado'} · ${usuario.region || 'Sin región'}${usuario.comuna ? ' / ' + usuario.comuna : ''}
                    </p>

                    <span class="admin-badge admin-badge--activo">Activo</span>
                </div>
            </div>

            <div class="admin-detalle-acciones">
                <button type="button" class="admin-btn-accion admin-btn-accion--editar" data-correo="${usuario.correo}" data-accion="editar">✏️ Editar</button>
                <button type="button" class="admin-btn-accion admin-btn-accion--eliminar" data-correo="${usuario.correo}" data-accion="eliminar">🗑️ Eliminar</button>
                <button type="button" class="admin-btn-accion" data-correo="${usuario.correo}" data-accion="exportar">📤 Exportar</button>
            </div>
        `;
        modalVerFondo.style.display = 'flex';
    }

    function abrirPanelEditar(usuario) {
        document.getElementById('editar-correo-original').value = usuario.correo;
        document.getElementById('editar-run').value = usuario.run || '';
        document.getElementById('editar-correo').value = usuario.correo || '';
        document.getElementById('editar-nombre').value = usuario.nombre || '';
        document.getElementById('editar-apellidos').value = usuario.apellidos || '';
        document.getElementById('editar-telefono').value = usuario.telefono || '';
        document.getElementById('editar-direccion').value = usuario.direccion || '';
        document.getElementById('editar-password').value = '';
        document.getElementById('editar-password2').value = '';
        document.getElementById('editar-rol').value = usuario.rol || 'cliente';
        document.getElementById('editar-activo').checked = usuario.activo !== false;

        poblarRegionComuna('editar', usuario.region, usuario.comuna);

        panelEditar.style.display = 'flex';
    }

    function abrirPanelCrear() {
        formCrear.reset();
        document.getElementById('crear-activo').checked = true;
        ['crear-run', 'crear-correo', 'crear-nombre', 'crear-apellidos', 'crear-password', 'crear-password2'].forEach((id) => {
            const campo = document.getElementById(id).closest('.campo');
            if (campo) campo.classList.remove('campo--invalido', 'campo--valido');
        });

        poblarRegionComuna('crear', '', '');

        panelCrear.style.display = 'flex';
    }

    function poblarRegionComuna(prefijo, regionGuardada, comunaGuardada) {
        const selectRegion = document.getElementById(`${prefijo}-region`);
        const selectComuna = document.getElementById(`${prefijo}-comuna`);
        if (!selectRegion || !selectComuna) return;

        selectRegion.innerHTML = '<option value="">Selecciona la región</option>';
        REGIONES.forEach((r) => {
            const opt = document.createElement('option');
            opt.value = r.nombre;
            opt.textContent = r.nombre;
            selectRegion.appendChild(opt);
        });

        function llenarComunas(nombreRegion, comunaSeleccionada) {
            const region = REGIONES.find((r) => r.nombre === nombreRegion);
            selectComuna.innerHTML = '<option value="">Selecciona la comuna</option>';
            if (region) {
                region.comunas.forEach((c) => {
                    const opt = document.createElement('option');
                    opt.value = c;
                    opt.textContent = c;
                    if (c === comunaSeleccionada) opt.selected = true;
                    selectComuna.appendChild(opt);
                });
            }
        }

        selectRegion.value = regionGuardada || '';
        llenarComunas(regionGuardada, comunaGuardada);

        selectRegion.onchange = () => llenarComunas(selectRegion.value, null);
    }

    modalVerCerrar.addEventListener('click', () => modalVerFondo.style.display = 'none');
    modalVerFondo.addEventListener('click', (e) => {
        if (e.target === modalVerFondo) modalVerFondo.style.display = 'none';
    });

    btnCerrarEditar.addEventListener('click', () => {
        panelEditar.style.display = 'none';
    });
    panelEditar.addEventListener('click', (e) => {
        if (e.target === panelEditar) panelEditar.style.display = 'none';
    });

    btnCancelarEditar.addEventListener('click', () => {
        panelEditar.style.display = 'none';
    });

    formEditar.addEventListener('submit', (e) => {
        e.preventDefault();

        const correoOriginal = document.getElementById('editar-correo-original').value;
        const nuevoNombre = document.getElementById('editar-nombre').value.trim();
        const nuevosApellidos = document.getElementById('editar-apellidos').value.trim();
        const nuevoCorreo = document.getElementById('editar-correo').value.trim();
        const nuevoTelefono = document.getElementById('editar-telefono').value.trim();
        const nuevaRegion = document.getElementById('editar-region').value;
        const nuevaComuna = document.getElementById('editar-comuna').value;
        const nuevaDireccion = document.getElementById('editar-direccion').value.trim();
        const nuevaPassword = document.getElementById('editar-password').value;
        const nuevaPassword2 = document.getElementById('editar-password2').value;
        const nuevoRol = document.getElementById('editar-rol').value;
        const nuevoActivo = document.getElementById('editar-activo').checked;

        const errores = {
            'campo-editar-nombre': validarRequerido(nuevoNombre, 50, 'El nombre'),
            'campo-editar-correo': validarCorreo(nuevoCorreo),
            'campo-editar-password': nuevaPassword.length > 0 ? validarPassword(nuevaPassword) : null,
            'campo-editar-password2': nuevaPassword.length > 0 && nuevaPassword !== nuevaPassword2 ? 'Las contraseñas no coinciden.' : null,
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
                telefono: nuevoTelefono,
                region: nuevaRegion,
                comuna: nuevaComuna,
                direccion: nuevaDireccion,
                rol: nuevoRol,
                activo: nuevoActivo,
                password: nuevaPassword.length > 0 ? nuevaPassword : usuarios[indice].password,
            };
            guardarUsuarios(usuarios);

            const sesionActual = obtenerSesion();
            if (sesionActual && sesionActual.correo.toLowerCase() === correoOriginal.toLowerCase()) {
                guardarSesion(usuarios[indice]);
            }
        }

        panelEditar.style.display = 'none';
        renderTablaUsuarios();
    });

    accesoNuevo.addEventListener('click', (e) => {
        e.preventDefault();
        abrirPanelCrear();
    });

    btnCerrarCrear.addEventListener('click', () => {
        panelCrear.style.display = 'none';
    });
    panelCrear.addEventListener('click', (e) => {
        if (e.target === panelCrear) panelCrear.style.display = 'none';
    });

    btnCancelarCrear.addEventListener('click', () => {
        panelCrear.style.display = 'none';
    });

    formCrear.addEventListener('submit', (e) => {
        e.preventDefault();

        const nuevoRun = document.getElementById('crear-run').value.trim();
        const nuevoCorreo = document.getElementById('crear-correo').value.trim();
        const nuevoNombre = document.getElementById('crear-nombre').value.trim();
        const nuevosApellidos = document.getElementById('crear-apellidos').value.trim();
        const nuevoTelefono = document.getElementById('crear-telefono').value.trim();
        const nuevaRegion = document.getElementById('crear-region').value;
        const nuevaComuna = document.getElementById('crear-comuna').value;
        const nuevaDireccion = document.getElementById('crear-direccion').value.trim();
        const nuevaPassword = document.getElementById('crear-password').value;
        const nuevaPassword2 = document.getElementById('crear-password2').value;
        const nuevoRol = document.getElementById('crear-rol').value;
        const nuevoActivo = document.getElementById('crear-activo').checked;

        const errores = {
            'campo-crear-run': validarRun(nuevoRun),
            'campo-crear-correo': validarCorreo(nuevoCorreo),
            'campo-crear-nombre': validarRequerido(nuevoNombre, 50, 'El nombre'),
            'campo-crear-apellidos': validarRequerido(nuevosApellidos, 100, 'Los apellidos'),
            'campo-crear-password': validarPassword(nuevaPassword),
            'campo-crear-password2': nuevaPassword !== nuevaPassword2 ? 'Las contraseñas no coinciden.' : null,
        };

        Object.entries(errores).forEach(([id, msg]) => marcarCampo(id, msg));
        const hayErrores = Object.values(errores).some((e) => e !== null);
        if (hayErrores) return;

        const usuarios = obtenerUsuarios();

        const correoDuplicado = usuarios.some((u) => u.correo.toLowerCase() === nuevoCorreo.toLowerCase());
        if (correoDuplicado) {
            marcarCampo('campo-crear-correo', 'Ese correo ya está en uso por otra cuenta.');
            return;
        }

        const runLimpio = nuevoRun.replace(/\./g, '').replace(/-/g, '').toUpperCase();
        const runDuplicado = usuarios.some(
            (u) => (u.run || '').replace(/\./g, '').replace(/-/g, '').toUpperCase() === runLimpio
        );
        if (runDuplicado) {
            marcarCampo('campo-crear-run', 'Ese RUN ya está en uso por otra cuenta.');
            return;
        }

        usuarios.push({
            run: nuevoRun,
            correo: nuevoCorreo,
            nombre: nuevoNombre,
            apellidos: nuevosApellidos,
            telefono: nuevoTelefono,
            region: nuevaRegion,
            comuna: nuevaComuna,
            direccion: nuevaDireccion,
            rol: nuevoRol,
            activo: nuevoActivo,
            password: nuevaPassword,
            fechaRegistro: new Date().toISOString(),
        });
        guardarUsuarios(usuarios);

        panelCrear.style.display = 'none';
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