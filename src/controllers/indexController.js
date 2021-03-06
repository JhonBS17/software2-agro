const { validationResult } = require('express-validator'),
    agricultor = require("../models/Agricultor"),
    colombia = require('../public/js/colombia.json'),
    { connection } = require('../database/connectionDB'),
    nodemailer = require('nodemailer'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt-nodejs');

const user = {};

user.register = (req, res) => {
    res.render("agricultor/registro", {
        data: colombia,
        message: req.flash('signupMessage')
    });
};

user.inicioSesion = (req, res) => {
    res.render("inicioSesion", {
        message: req.flash('loginMessage')
    });
};

user.verificarAgr = passport.authenticate('local-login', {
    successRedirect: '/agricultor/principal',
    failureRedirect: '/index/inicioSesion',
    failureFlash: true
});

user.verificarAna = passport.authenticate('local-loginAnalista', {
    successRedirect: '/analista/principal',
    failureRedirect: '/index/inicioSesion',
    failureFlash: true
});

user.create = passport.authenticate('local-signup', {
    successRedirect: '/index/inicioSesion',
    failureRedirect: '/index/registro',
    failureFlash: true
});

user.recuperarC = (req, res) => {
    res.render("agricultor/recContra1", {
        message: req.flash('recupMessage')
    });
};

user.recuperarC2 = (req, res) => {
    res.render("agricultor/recContra2", {
        token: req.params.token
    });
};

user.forgotPassword = (req, res) => {

    const { correo_Agricultor } = req.body;

    connection.query("SELECT * FROM Agricultor WHERE correo_Agricultor = ?", correo_Agricultor, function (err, agric) {
        if (err || !agric) {
            return res.status(400).json({ error: 'El usuario con este correo no existe' });
        }

        const token = jwt.sign({ _id: agric[0].correo_Agricultor }, 'accountAgricultor12345', { expiresIn: '24h' });

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sw2.proyecto@gmail.com',
                pass: 'sw2password'
            }
        });

        const mailOptions = {
            from: 'sw2.proyecto@gmail.com',
            to: correo_Agricultor,
            subject: 'Recuperar contrase??a - AS Colombia',
            html: `<h2>Por favor dar click en el siguiente link para restablecer su contrase??a</h2>
                <p>http://localhost:3000/index/resetPassword/${token}</p>
            `
        };

        connection.query("UPDATE Agricultor SET tokenRC = ? WHERE correo_Agricultor = ?", [token, correo_Agricultor], function (err, agr) {
            if (err) {
                return res.status(400).json({ error: 'Error en el link de restablecer contrase??a' });
            } else {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.status(500).send(error.message);
                    } else {
                        req.flash('recupMessage', 'El correo ha sido enviado. No olvide revisar en bandeja de spam');
                        res.render("agricultor/recContra1", {
                            message: req.flash('recupMessage')
                        });
                    }
                });
            }
        });
    });
};

user.resetPassword = (req, res) => {

    const token = req.params.token,
        { contrasena_Agricultor } = req.body;
    if (token) {
        jwt.verify(token, 'accountAgricultor12345', (err, decodedData) => {
            if (err) {
                return res.json({ error: 'El token ya expir?? o es incorrecto' });
            }
            if (req.body.contrasena_Agricultor == req.body.repetir_Contrasena) {
                connection.query("SELECT * FROM Agricultor WHERE tokenRC = ?", token, function (err, agr) {
                    if (err || !agr) {
                        return res.status(400).json({ error: 'El usuario con este token no existe' });
                    }
                    connection.query("UPDATE Agricultor SET tokenRC = '', contrasena_Agricultor = ? WHERE tokenRC = ?", [bcrypt.hashSync(contrasena_Agricultor, bcrypt.genSaltSync(8), null), token], function (err, agr) {
                        if (err) {
                            return res.status(400).json({ error: 'Error en restablecer contrase??a' });
                        } else {
                            req.flash('loginMessage', 'La contrase??a ha sido cambiada con ??xito');
                            res.render('agricultor/inicioSesion', {
                                message: req.flash('loginMessage')
                            });
                        }
                    });
                });
            } else {
                res.send('No coinciden las contrase??as');
            }
        })
    } else {
        return res.status(401).json({ error: 'Error de autenticaci??n' });
    }

}

user.logout = (req, res) => {
    req.logout();
    res.render("inicioSesion", {
        message: req.flash('loginMessage')
    });
};

module.exports = user;