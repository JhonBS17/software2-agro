var express = require('express');
var router = express.Router();

var usuario = require('../controllers/indexController.js');
var validations = require('../controllers/validations.js');

// Usuario
router.get('/registro', usuario.register);
router.post('/create', validations.createAgricultor(), usuario.create);
router.get('/inicioSesion', usuario.inicioSesion);
router.post('/inicioAgricultor', usuario.verificarAgr);
router.get('/recuperarC', usuario.recuperarC);
router.post('/createCode', usuario.forgotPassword);
router.get('/resetPassword/:token', usuario.recuperarC2);
router.post('/resetFinal/:token', usuario.resetPassword);
router.get('/logout', usuario.logout);

// Analista
router.post('/inicioAnalista', usuario.verificarAna);

module.exports = router;