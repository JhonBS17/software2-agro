var express = require('express');
var router = express.Router();

var analisis = require('../controllers/agricultorController.js');
var validations = require('../controllers/validations.js');

router.get('/principal', isLoggedIn, analisis.getResults);
router.get('/requestAnalysis', isLoggedIn, analisis.requestAn);
router.post('/requestMuestra', isLoggedIn, validations.textMuestra(), analisis.requestMuestra);
router.get('/requestSave', isLoggedIn, analisis.requestSave);
router.get('/requestDelete', isLoggedIn, analisis.requestDelete);
router.get('/reqMuestras', isLoggedIn, analisis.reqMuestras);
router.get('/resultado/:id', isLoggedIn, analisis.result);
// Actualizar perfil de agricultor
router.get('/updateProfile', isLoggedIn, analisis.updateProfile);
router.post('/updateData', isLoggedIn, validations.updateProfileDataAgric(), analisis.updateData);
router.post('/updateEmail', isLoggedIn, analisis.updateEmail);
router.post('/updatePassword', isLoggedIn, validations.updateProfilePassword(), analisis.updatePassword);
router.get('/downloadPDF/:file', isLoggedIn, analisis.downloadPDF);
router.get('/downloadExcel/:file', isLoggedIn, analisis.downloadExcel);
router.get('/muestrasAn/:id/:estadoS', isLoggedIn, analisis.getMuestras);

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

module.exports = router;