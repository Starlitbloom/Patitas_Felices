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

document.addEventListener('DOMContentLoaded', () => {
    initDashboardAdmin();
    initBotonCerrarSesionAdmin();
});