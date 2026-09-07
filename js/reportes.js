/* =========================================================
   PATITAS FELICES — reportes.js
   Estadísticas de usuarios para admin/reportes.html.
   Depende de usuarios.js (obtenerUsuarios, REGIONES) y de
   admin.js (protegerRutaAdmin, exportarUsuariosComoExcel).
========================================================= */

function initReportes() {
    const sesion = protegerRutaAdmin();
    if (!sesion) return;

    const usuarios = obtenerUsuarios();

    renderKpisReporte(usuarios);
    renderGraficoRoles(usuarios);
    renderGraficoRegiones(usuarios);
    renderTablaComunas(usuarios);
    initExportarReporte(usuarios);
}

function renderKpisReporte(usuarios) {
    const totalUsuarios = document.getElementById('rep-total-usuarios');
    if (totalUsuarios) totalUsuarios.textContent = usuarios.length;

    const totalAdmins = document.getElementById('rep-total-admins');
    if (totalAdmins) {
        totalAdmins.textContent = usuarios.filter((u) => u.rol === 'admin').length;
    }

    const totalRegiones = document.getElementById('rep-total-regiones');
    if (totalRegiones) {
        const regionesUnicas = new Set(usuarios.filter((u) => u.region).map((u) => u.region));
        totalRegiones.textContent = regionesUnicas.size;
    }

    const conAvatar = document.getElementById('rep-con-avatar');
    if (conAvatar) {
        conAvatar.textContent = usuarios.filter((u) => u.avatar).length;
    }
}

function renderGraficoRoles(usuarios) {
    const canvas = document.getElementById('grafico-roles');
    if (!canvas || typeof Chart === 'undefined') return;

    const cantClientes = usuarios.filter((u) => (u.rol || 'cliente') === 'cliente').length;
    const cantAdmins = usuarios.filter((u) => u.rol === 'admin').length;

    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: ['Clientes', 'Administradores'],
            datasets: [{
                data: [cantClientes, cantAdmins],
                backgroundColor: ['#D6ECFA', '#FFD6E7'],
                borderColor: '#2A2440',
                borderWidth: 3,
            }],
        },
        options: {
            plugins: {
                legend: {
                    labels: { color: 'rgba(255,255,255,0.75)', font: { size: 12.5 } },
                },
            },
        },
    });
}

function renderGraficoRegiones(usuarios) {
    const canvas = document.getElementById('grafico-regiones');
    if (!canvas || typeof Chart === 'undefined') return;

    const conteoPorRegion = {};
    usuarios.forEach((u) => {
        const region = u.region || 'Sin región';
        conteoPorRegion[region] = (conteoPorRegion[region] || 0) + 1;
    });

    const entradas = Object.entries(conteoPorRegion).sort((a, b) => b[1] - a[1]);
    const etiquetas = entradas.map(([region]) => region.length > 22 ? region.slice(0, 22) + '…' : region);
    const valores = entradas.map(([, cantidad]) => cantidad);

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Usuarios',
                data: valores,
                backgroundColor: '#E6D6F7',
                borderRadius: 8,
            }],
        },
        options: {
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
            },
            scales: {
                x: {
                    ticks: { color: 'rgba(255,255,255,0.6)', precision: 0 },
                    grid: { color: 'rgba(255,255,255,0.06)' },
                },
                y: {
                    ticks: { color: 'rgba(255,255,255,0.75)', font: { size: 12 } },
                    grid: { display: false },
                },
            },
        },
    });
}

function renderTablaComunas(usuarios) {
    const tbody = document.getElementById('rep-tabla-comunas');
    const vacia = document.getElementById('rep-comunas-vacia');
    if (!tbody) return;

    const conteo = {};
    usuarios.forEach((u) => {
        if (!u.comuna) return;
        const clave = `${u.comuna}||${u.region || 'Sin región'}`;
        conteo[clave] = (conteo[clave] || 0) + 1;
    });

    const filas = Object.entries(conteo)
        .map(([clave, cantidad]) => {
            const [comuna, region] = clave.split('||');
            return { comuna, region, cantidad };
        })
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10);

    if (filas.length === 0) {
        tbody.innerHTML = '';
        if (vacia) vacia.style.display = 'block';
        return;
    }

    if (vacia) vacia.style.display = 'none';

    tbody.innerHTML = filas.map((f) => `
        <tr>
            <td>${f.comuna}</td>
            <td>${f.region}</td>
            <td>${f.cantidad}</td>
        </tr>
    `).join('');
}

function initExportarReporte(usuarios) {
    const btn = document.getElementById('btn-exportar-reporte');
    if (!btn || typeof XLSX === 'undefined') return;

    btn.addEventListener('click', () => {
        exportarUsuariosComoExcel(usuarios, 'reporte-usuarios-patitas-felices');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initReportes();
    initBotonCerrarSesionAdmin();
});