const { check } = require('express-validator');

function createAgricultor() {
    return [
        check('nombre_Agricultor').matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/).withMessage('El nombre debe contener caracteres alfabéticos y espacios'),
        check('correo_Agricultor').isEmail().withMessage('El correo ingresado no es válido'),
        check('usuario_Agricultor').isAlphanumeric().withMessage('El usuario debe contener caracteres alfanuméricos').isLength({min: 6, max:15}).withMessage('El usuario debe tener entre 6 y 15 caracteres'),
        check('contrasena_Agricultor').matches(/^(?=(.*\d){2})[a-zA-Z0-9_]+$/).withMessage('La contraseña debe tener al menos 6 caracteres alfanuméricos') .isLength({min: 6}).withMessage('La contraseña debe tener al menos 2 números'),
        check('depart_Agricultor').not().equals('0').withMessage('Debe seleccionar un departamento'),
        check('ciudad_Agricultor').not().equals('0').withMessage('Debe seleccionar una ciudad')
    ];
};

function updateProfileDataAgric() {
    return [
        check('nombre_Agricultor').matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/).withMessage('El nombre debe contener caracteres alfabéticos y espacios'),
        check('depart_Agricultor').not().equals('0').withMessage('Debe seleccionar un departamento'),
        check('ciudad_Agricultor').not().equals('0').withMessage('Debe seleccionar una ciudad')
    ];
};

function updateProfilePassword() {
    return [
        check('newContrasena', 'La nueva contraseña debe tener al menos 6 caracteres, 2 deben ser números').matches(/^(?=(.*\d){2})[a-zA-Z0-9_]+$/).isLength({min: 6}),
    ];
}

function textMuestra() {
    return [
        check('cultivosActAgricultor').matches(/^[a-zA-Z0-9\s.,]*$/),
        check('cultivosFutAgricultor').matches(/^[a-zA-Z0-9\s.,]*$/),
        check('observacionAgricultor').matches(/^[a-zA-Z0-9\s.,]*$/)
    ];
}

module.exports = {createAgricultor, updateProfileDataAgric, updateProfilePassword, textMuestra};