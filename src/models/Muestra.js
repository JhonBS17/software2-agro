const { connection } = require('../database/connectionDB'),
    analista = require("../models/Analista");

module.exports = {

    muestras: (user, result) => {
        connection.query(`select nombre_Agricultor, idMuestra, usuario_Analista1, idSolicitud1 from Solicitud 
            join Muestra join Agricultor on (Agricultor.usuario_Agricultor = Solicitud.usuario_Agricultor1 
            and Solicitud.idSolicitud = Muestra.idSolicitud1) where usuario_Analista1 = ? and estadoMuestra <> ?`, [user, 'realizada'], (err, rows) => {

            if (err)
                return result(err);

            if (rows.length <= 0) {
                return result(err);
            } else {
                return result(rows);
            }
        })
    },

    muestra: (idMuestra, result) => {
        connection.query('select * from Muestra where idMuestra = ?', idMuestra, (err, rows) => {
            if (err)
                return result(err);

            if (rows.length <= 0) {
                return result(err);
            } else {
                return result(rows);
            }
        })
    },

    createM: (data, idSolicitud, result) => {

        analista.getAnalistaAsign((userAn) => {
            connection.query(`insert into Muestra(cultivosActAgricultor, cultivosFutAgricultor, observacionAgricultor, estadoMuestra, usuario_Analista1, idSolicitud1) values (?, ?, ?, ?, ?, ?)`, [data.cultivosActAgricultor, data.cultivosFutAgricultor,
            data.observacionAgricultor, 'pendiente', userAn, idSolicitud], (err, rows) => {

                if (err)
                    return result(err);

                if (rows.length <= 0) {
                    return result(err);
                } else {
                    return result(rows);
                }
            })
        })
    },

    solicMuestras: (idSolicitud, result) => {
        connection.query('select * from Muestra where idSolicitud1 = ?', idSolicitud, (err, rows) => {
            console.log(rows);
            if (err)
                return result(err);

            if (rows.length <= 0) {
                return result(err);
            } else {
                return result(rows);
            }
        })
    },

    updateEstado: (idMuestra, estado,  result) => {
        connection.query('UPDATE Muestra SET estadoMuestra = ? WHERE idMuestra = ?', [estado, idMuestra], (err, rows) => {
            if (err)
                return result(err);

            if (rows.length <= 0) {
                return result(err);
            } else {
                return result(rows);
            }
        })
    }
}