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

    const mascotas = leerLocalStorage('patitasFelices_mascotas');
    const solicitudesMascotas = leerLocalStorage('patitasFelices_solicitudesMascotas');
    const citas = leerLocalStorage('patitasFelices_citas');

    renderKpisMascotas(mascotas, solicitudesMascotas);
    renderGraficoMascotasEspecie(mascotas);
    renderGraficoMascotasEstado(mascotas);

    renderKpisCitas(citas);
    renderGraficoCitasEstado(citas);
    renderGraficoCitasServicio(citas);
}

function leerLocalStorage(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave)) || [];
    } catch {
        return [];
    }
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

/* =========================================================
   REPORTE DE MASCOTAS
========================================================= */

function renderKpisMascotas(mascotas, solicitudesMascotas) {
    const total = document.getElementById('rep-total-mascotas');
    if (total) total.textContent = mascotas.length;

    const incompletas = document.getElementById('rep-mascotas-incompletas');
    if (incompletas) incompletas.textContent = mascotas.filter((m) => !m.completo).length;

    const pendientesSolicitudes = document.getElementById('rep-solicitudes-pendientes');
    if (pendientesSolicitudes) {
        pendientesSolicitudes.textContent = solicitudesMascotas.filter((s) => s.estado === 'pendiente').length;
    }

    const enTratamiento = document.getElementById('rep-mascotas-tratamiento');
    if (enTratamiento) enTratamiento.textContent = mascotas.filter((m) => m.estado === 'tratamiento').length;
}

function renderGraficoMascotasEspecie(mascotas) {
    const canvas = document.getElementById('grafico-mascotas-especie');
    if (!canvas || typeof Chart === 'undefined') return;

    if (mascotas.length === 0) return;

    const conteoPorEspecie = {};
    mascotas.forEach((m) => {
        const especie = m.especie || 'Sin especificar';
        conteoPorEspecie[especie] = (conteoPorEspecie[especie] || 0) + 1;
    });

    const entradas = Object.entries(conteoPorEspecie).sort((a, b) => b[1] - a[1]);

    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: entradas.map(([especie]) => especie),
            datasets: [{
                data: entradas.map(([, cantidad]) => cantidad),
                backgroundColor: ['#D6ECFA', '#FFD6E7', '#E6D6F7', '#FFD6A5', '#C8F0D8', '#F7E6A1'],
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

function renderGraficoMascotasEstado(mascotas) {
    const canvas = document.getElementById('grafico-mascotas-estado');
    if (!canvas || typeof Chart === 'undefined') return;

    if (mascotas.length === 0) return;

    const alDia = mascotas.filter((m) => m.estado === 'al-dia').length;
    const tratamiento = mascotas.filter((m) => m.estado === 'tratamiento').length;
    const pendientes = mascotas.filter((m) => (m.estado || 'pendiente') === 'pendiente').length;

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['Control al día', 'En tratamiento', 'Vacunas pendientes'],
            datasets: [{
                label: 'Mascotas',
                data: [alDia, tratamiento, pendientes],
                backgroundColor: ['#C8F0D8', '#E6D6F7', '#FFD6A5'],
                borderRadius: 8,
            }],
        },
        options: {
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


/* =========================================================
   REPORTE DE CITAS
========================================================= */

function estadoCitaNormalizado(cita) {
    return (cita.estado || 'pendiente').toLowerCase();
}

function renderKpisCitas(citas) {
    const total = document.getElementById('rep-total-citas');
    if (total) total.textContent = citas.length;

    const pendientes = document.getElementById('rep-citas-pendientes');
    if (pendientes) pendientes.textContent = citas.filter((c) => estadoCitaNormalizado(c) === 'pendiente').length;

    const confirmadas = document.getElementById('rep-citas-confirmadas');
    if (confirmadas) confirmadas.textContent = citas.filter((c) => estadoCitaNormalizado(c).startsWith('confirmad')).length;

    const canceladas = document.getElementById('rep-citas-canceladas');
    if (canceladas) canceladas.textContent = citas.filter((c) => estadoCitaNormalizado(c).startsWith('cancelad')).length;
}

function renderGraficoCitasEstado(citas) {
    const canvas = document.getElementById('grafico-citas-estado');
    if (!canvas || typeof Chart === 'undefined') return;

    if (citas.length === 0) return;

    const pendientes = citas.filter((c) => estadoCitaNormalizado(c) === 'pendiente').length;
    const confirmadas = citas.filter((c) => estadoCitaNormalizado(c).startsWith('confirmad')).length;
    const canceladas = citas.filter((c) => estadoCitaNormalizado(c).startsWith('cancelad')).length;

    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: ['Pendientes', 'Confirmadas', 'Canceladas'],
            datasets: [{
                data: [pendientes, confirmadas, canceladas],
                backgroundColor: ['#FFD6A5', '#C8F0D8', '#F0A0A0'],
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

function renderGraficoCitasServicio(citas) {
    const canvas = document.getElementById('grafico-citas-servicio');
    if (!canvas || typeof Chart === 'undefined') return;

    if (citas.length === 0) return;

    const conteoPorServicio = {};
    citas.forEach((c) => {
        const servicio = c.servicio || 'Sin especificar';
        conteoPorServicio[servicio] = (conteoPorServicio[servicio] || 0) + 1;
    });

    const entradas = Object.entries(conteoPorServicio).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const etiquetas = entradas.map(([servicio]) => servicio.length > 24 ? servicio.slice(0, 24) + '…' : servicio);

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Citas',
                data: entradas.map(([, cantidad]) => cantidad),
                backgroundColor: '#D6ECFA',
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