const resultado = require("../models/Resultado"),
    solicitud = require("../models/Solicitud"),
    muestra = require("../models/Muestra"),
    agricultor1 = require("../models/Agricultor"),
    colombia = require('../public/js/colombia.json'),
    { validationResult } = require('express-validator');

const agricultor = {};

agricultor.requestAn = (req, res) => {
    req.session.muestras = [];
    res.render('agricultor/analysisRequest', { nombreUsuario: req.user.nombre_Agricultor });
};

agricultor.requestMuestra = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.send(false);
    } else {
        req.session.muestras.push(req.body);
        res.send(true);
    }
};

agricultor.requestSave = (req, res) => {

    solicitud.createS(req.user.usuario_Agricultor, (rows) => {
        if (rows.affectedRows == 1) {
            for (let index = 0; index < req.session.muestras.length; index++) {
                muestra.createM(req.session.muestras[index], rows.insertId, (rows) => {
                    console.log(rows.insertId);
                });
            }
            req.session.muestras = [];
            res.send(true);
        } else {
            res.send(false);
        }
        // var num;

        // console.log(num);
        // muestras = [];
        // res.send(num);
        // req.flash('solicMuestrasMessage', 'Se ha creado la solicitud con éxito. Debe tener en cuenta los siguientes ID de sus muestras');
        // res.render('agricultor/muestras', {
        //     muestras: cont,
        //     nombreUsuario: req.user.nombre_Agricultor,
        //     solicitud: rows1[0],
        //     message: req.flash('solicMuestrasMessage')
        // });
    });
};

agricultor.reqMuestras = (req, res) => {
    res.send(req.session.muestras);
}

agricultor.requestDelete = (req, res) => {
    if (req.session.muestras.length == 0) {
        res.send(false);
    } else {
        req.session.muestras = [];
        res.send(true);
    }
};

agricultor.getResults = (req, res) => {
    resultado.getResults(req.user.usuario_Agricultor, (rows) => {
        var res1 = rows;
        solicitud.getSolicitudes(req.user.usuario_Agricultor, (rows1) => {
            res.render('agricultor/main', {
                resultados: res1,
                solicitudes: rows1,
                nombreUsuario: req.user.nombre_Agricultor
            });
        })
    })
};

agricultor.result = (req, res) => {
    resultado.getResult(req.params.id, (rows) => {
        res.render('agricultor/result', { resultado: rows[0], usuario: req.user });
    })
};

agricultor.updateProfile = (req, res) => {
    res.render('agricultor/editarP', {
        data: colombia,
        usuario: req.user,
        message: req.flash('editarPerfilMessage')
    });
};

agricultor.updatePassword = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('editarPerfilMessage', errors.errors);
        res.redirect('back'); return;
    } else {
        agricultor1.updatePassword(req.user.usuario_Agricultor, req.body, (rows) => {
            if (rows == false) {
                req.flash('editarPerfilMessage', 'La contraseña actual no es correcta!');
            } else if (rows.affectedRows == 1) {
                req.flash('editarPerfilMessage', 'La contraseña ha sido actualizada con éxito');
            }
            res.redirect('back');
        })
        return;
    }
}

agricultor.updateData = (req, res) => {
    const body = req.body,
        user = req.user;

    if (body.nombre_Agricultor == user.nombre_Agricultor && body.depart_Agricultor == user.depart_Agricultor
        && body.ciudad_Agricultor == user.ciudad_Agricultor) {
        req.flash('editarPerfilMessage', 'No hay información por actualizar');
        res.redirect('back');
        return;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('editarPerfilMessage', errors.errors);
    } else {
        agricultor1.updateData(req.user.usuario_Agricultor, req.body, (rows) => {
            console.log(rows);
            if (rows.affectedRows == 1) {
                req.flash('editarPerfilMessage', 'Sus datos han sido actualizados con éxito');
                res.redirect('back');
            }
        })
    }
}

agricultor.updateEmail = (req, res) => {
    agricultor1.updateEmail(req.user.usuario_Agricultor, req.body, (rows) => {
        if (rows.affectedRows == 1) {
            req.flash('editarPerfilMessage', 'El correo ha sido actualizado con éxito');
        } else {
            req.flash('editarPerfilMessage', 'La contraseña ingresada es incorrecta');
        }
        res.redirect('back'); return;
    })
}

agricultor.downloadPDF = (req, res) => {
    const file = `${__dirname}/files/pdf/${req.params.file}`;
    res.download(file);
};

agricultor.downloadExcel = (req, res) => {
    const file = `${__dirname}/files/excel/${req.params.file}`;
    res.download(file);
};

agricultor.getMuestras = (req, res) => {
    var vista1 = 2;
    if (req.params.estadoS == "Esperando pago") {
        vista1 = 1;
    }
    var obj = {
        idSolicitud: req.params.id,
        estadoSolicitud: req.params.estadoS
    }
    muestra.solicMuestras(req.params.id, (rows) => {
        console.log(rows);
        res.render('agricultor/muestras', {
            muestras: rows,
            nombreUsuario: req.user.nombre_Agricultor,
            solicitud: obj,
            vista: vista1,
            message: req.flash('solicMuestrasMessage')
        });
    })
}

module.exports = agricultor;