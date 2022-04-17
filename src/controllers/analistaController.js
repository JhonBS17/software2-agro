const analistaModel = require("../models/Analista"),
    muestras1 = require("../models/Muestra"),
    resultado = require("../models/Resultado"),
    solicitud = require("../models/Solicitud"),
    { validationResult } = require('express-validator');

const analista = {};

analista.login = (req, res) => {
    res.render('analista/inicioSesion');
};

analista.getMuestras = (req, res) => {
    muestras1.muestras(req.user.usuario_Analista, (rows) => {
        res.render('analista/main', {
            muestras: rows,
            nombre: req.user.nombre_Analista,
            message: req.flash('mainMessage')
        });
    })
};

analista.getMuestra = (req, res) => {
    muestras1.muestra(req.params.id, (rows) => {
        res.render('analista/cargarAn', {
            datos: rows,
            nombre: req.user.nombre_Analista,
            message: req.flash('cargarResMessage')
        });
    })
};

analista.getResultados = (req, res) => {
    resultado.resultados(req.user.usuario_Analista, (rows) => {
        res.render('analista/resultados', { resultados: rows, nombre: req.user.nombre_Analista });
    })
};

analista.filtResultados = (req, res) => {
    if (req.query.codigo != '') {
        resultado.filterCodigo(req.query.codigo, (rows) => {
            res.json(rows);
        })
    } else {
        resultado.filterFecha(req.user.usuario_Analista, req.query, (rows) => {
            res.json(rows);
        })
    }
};

analista.cargarResultado = (req, res) => {

    resultado.createResult(req.params.id, (rows) => {
        if (rows == false) {
            req.flash('cargarResMessage', 'Esta muestra ya posee su correspondiente resultado!')
        } else if (rows.affectedRows == 1) {
            var file1 = req.files.archivoPDF;
            file1.mv(`./src/controllers/files/pdf/${'muestra_' + req.params.id.toString() + '.pdf'}`, err => {
                if (err)
                    res.status(500).send({ message: err })
            })
            file1 = req.files.archivoExcel;
            file1.mv(`./src/controllers/files/excel/${'muestra_' + req.params.id.toString() + '.xlsx'}`, err => {
                if (err)
                    res.status(500).send({ message: err })
            })
            req.flash('mainMessage', 'Se ha cargado el resultado con éxito!\nLa muestra se ha marcado como realizada');
            muestras1.solicMuestras(req.params.idSolicitud, (rows) => {
                var k = true;
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].estadoMuestra != "realizada") {
                        k = false;
                    }
                }
                if (k) {
                    solicitud.updateEstado(req.params.id, "terminada", (rows) => {
                        if (rows.affectedRows == 1) {
                            console.log('solicitud actualizada');
                        }
                    })
                }
            });
        }
        res.redirect('/analista/principal');
    })

};

analista.updateProfView = (req, res) => {
    res.render('analista/editarPerfil', {
        usuario: req.user,
        message: req.flash('editarPerfilMessage')
    });
}

analista.updatePassword = (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        req.flash('editarPerfilMessage', errors.errors);
        res.redirect('back'); return;
    } else {
        analistaModel.updatePassword(req.user.usuario_Analista, req.body, (rows) => {
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

analista.updateEmail = (req, res) => {
    analistaModel.updateEmail(req.user.usuario_Analista, req.body, (rows) => {
        if (rows.affectedRows == 1) {
            req.flash('editarPerfilMessage', 'El correo ha sido actualizado con éxito');
        } else {
            req.flash('editarPerfilMessage', 'La contraseña ingresada es incorrecta');
        }
        res.redirect('back'); return;
    })
}

analista.detenerAnalisis = (req, res) => {
    muestras1.updateEstado(req.params.id, 'pausada', (rows) => {
        if (rows.affectedRows == 1) {
            req.flash('cargarResMessage', 'El análisis se ha pausado con éxito');
        } else {
            req.flash('cargarResMessage', 'No se ha podido pausar el proceso');
        }
        res.redirect('back'); return;
    })
}

analista.iniciarAnalisis = (req, res) => {
    muestras1.updateEstado(req.params.id, 'iniciada', (rows) => {
        if (rows.affectedRows == 1) {
            req.flash('cargarResMessage', 'El análisis se ha iniciado con éxito');
            solicitud.updateEstado(req.params.id, 'Análisis en Proceso', (rows) => {
                if (rows.affectedRows == 1)
                    console.log('solicitud actualizada');
            })
        } else {
            req.flash('cargarResMessage', 'No se ha podido iniciar el proceso');
        }
        res.redirect('back'); return;
    })
}

module.exports = analista;