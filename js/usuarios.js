/* =========================================================
   PATITAS FELICES — usuarios.js
   Validaciones de login, registro y perfil, según las reglas
   del caso (correo con dominio permitido, RUN con dígito
   verificador, contraseña 4-10 caract., región/comuna
   dependientes).
========================================================= */

const DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];

const REGIONES = [
    {
        nombre: "Región del Libertador General Bernardo O'Higgins",
        comunas: ["Rancagua", "Machalí", "Graneros", "San Fernando", "Rengo"]
    },
    {
        nombre: "Región Metropolitana de Santiago",
        comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto"]
    },
    {
        nombre: "Región de Ñuble",
        comunas: ["Chillán", "Chillán Viejo", "San Carlos"]
    }
];

/* --- Validadores --- */

function validarCorreo(correo) {
    if (!correo) return 'El correo es obligatorio.';
    if (correo.length > 100) return 'El correo no puede superar los 100 caracteres.';
    const partes = correo.split('@');
    if (partes.length !== 2) return 'Ingresa un correo válido.';
    if (!DOMINIOS_PERMITIDOS.includes(partes[1].toLowerCase())) {
        return 'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    }
    return null;
}

function validarPassword(password) {
    if (!password) return 'La contraseña es obligatoria.';
    if (password.length < 4 || password.length > 10) {
        return 'La contraseña debe tener entre 4 y 10 caracteres.';
    }
    return null;
}

function validarDigitoVerificador(runLimpio) {
    const cuerpo = runLimpio.slice(0, -1);
    const dv = runLimpio.slice(-1).toUpperCase();
    if (!/^\d+$/.test(cuerpo)) return false;

    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    const resto = 11 - (suma % 11);
    let dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
    return dv === dvEsperado;
}

function validarRun(run) {
    if (!run) return 'El RUN es obligatorio.';
    const limpio = run.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    if (limpio.length < 7 || limpio.length > 9) {
        return 'El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion.';
    }
    if (!validarDigitoVerificador(limpio)) return 'El RUN ingresado no es válido.';
    return null;
}

function validarRequerido(valor, maxLength, nombreCampo) {
    if (!valor || valor.trim().length === 0) return `${nombreCampo} es obligatorio.`;
    if (maxLength && valor.length > maxLength) return `${nombreCampo} no puede superar los ${maxLength} caracteres.`;
    return null;
}

/* --- UI --- */

function marcarCampo(id, mensajeError) {
    const campo = document.getElementById(id);
    if (!campo) return;
    const errorEl = campo.querySelector('.campo__error');
    campo.classList.remove('campo--invalido', 'campo--valido');
    if (mensajeError) {
        campo.classList.add('campo--invalido');
        if (errorEl) errorEl.textContent = mensajeError;
    } else {
        campo.classList.add('campo--valido');
    }
}

/* --- LOGIN --- */
function initFormLogin() {
    const form = document.getElementById('form-login');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const errorCorreo = validarCorreo(form.correo.value.trim());
        const errorPassword = validarPassword(form.password.value);

        marcarCampo('campo-correo', errorCorreo);
        marcarCampo('campo-password', errorPassword);

        if (!errorCorreo && !errorPassword) {
            console.log('Login OK (simulado)');
        }
    });
}

/* --- REGISTRO --- */
function initFormRegistro() {
    const form = document.getElementById('form-registro');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const errores = {
            'campo-nombre': validarRequerido(form.nombre.value, 50, 'El nombre'),
            'campo-apellidos': validarRequerido(form.apellidos.value, 100, 'Los apellidos'),
            'campo-run': validarRun(form.run.value),
            'campo-correo': validarCorreo(form.correo.value.trim()),
            'campo-password': validarPassword(form.password.value),
            'campo-password2': form.password.value !== form.password2.value ? 'Las contraseñas no coinciden.' : null,
            'campo-direccion': validarRequerido(form.direccion.value, 300, 'La dirección'),
        };

        Object.entries(errores).forEach(([id, msg]) => marcarCampo(id, msg));

        const hayErrores = Object.values(errores).some((e) => e !== null);
        if (!hayErrores) {
            console.log('Registro OK (simulado)');
        }
    });
}

/* --- PERFIL --- */
function initFormPerfil() {
    const form = document.getElementById('form-perfil');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const errores = {
            'campo-nombre': validarRequerido(form.nombre.value, 50, 'El nombre'),
            'campo-apellidos': validarRequerido(form.apellidos.value, 100, 'Los apellidos'),
            'campo-correo': validarCorreo(form.correo.value.trim()),
            'campo-direccion': validarRequerido(form.direccion.value, 300, 'La dirección'),
        };

        Object.entries(errores).forEach(([id, msg]) => marcarCampo(id, msg));

        const hayErrores = Object.values(errores).some((e) => e !== null);
        if (!hayErrores) {
            console.log('Perfil actualizado (simulado)');
        }
    });
}

/* --- REGIÓN / COMUNA --- */
function initRegionComuna() {
    const selectRegion = document.getElementById('region');
    const selectComuna = document.getElementById('comuna');
    if (!selectRegion || !selectComuna) return;

    REGIONES.forEach((r) => {
        const opt = document.createElement('option');
        opt.value = r.nombre;
        opt.textContent = r.nombre;
        selectRegion.appendChild(opt);
    });

    selectRegion.addEventListener('change', () => {
        const region = REGIONES.find((r) => r.nombre === selectRegion.value);
        selectComuna.innerHTML = '<option value="">Selecciona la comuna</option>';
        if (region) {
            region.comunas.forEach((c) => {
                const opt = document.createElement('option');
                opt.value = c;
                opt.textContent = c;
                selectComuna.appendChild(opt);
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initFormLogin();
    initFormRegistro();
    initFormPerfil();
    initRegionComuna();
});