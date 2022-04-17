const { connection } = require('../database/connectionDB'),
    muestra = require('../models/Muestra');

module.exports = {

    createS: (user, result) => {
        connection.query('insert into Solicitud(estadoSolicitud, usuario_Agricultor1) values (?, ?)', ['Esperando pago', user], (err, rows) => {
            if (err)
                return result(err);

            if (rows.length <= 0) {
                return result(err);
            } else {
                return result(rows);
            }
        });
    },

    getById: (idSolicitud, result) => {
        connection.query('SELECT * FROM Solicitud WHERE idSolicitud = ?', idSolicitud, (err, rows) => {
            if (err)
                return result(err);

            if (rows.length <= 0) {
                return result(err);
            } else {
                return result(rows);
            }
        });
    },

    getByUser: (user, result) => {
        connection.query('select idSolicitud from Solicitud where usuario_Agricultor1 = ? order by idSolicitud desc limit 1', user, (err, rows) => {
            if (err)
                return result(err);

            if (rows.length <= 0) {
                return result(err);
            } else {
                return result(rows);
            }          
        })
    },
    
    getSolicitudes: (user, result) => {
        connection.query('SELECT * FROM Solicitud WHERE usuario_Agricultor1 = ? AND estadoSolicitud <> ?', [user, 'terminada'], (err, rows) => {
            if (err)
                return result(err);

            if (rows.length <= 0) {
                return result(err);
            } else {
                return result(rows);
            }
        });
    },

    updateEstado: (idMuestra, estado, result) => {
        muestra.muestra(idMuestra, (rows) => {
            if (rows.length > 0) {
                connection.query('UPDATE Solicitud SET estadoSolicitud = ? WHERE idSolicitud = ?', [estado, rows[0].idSolicitud1], (err, rows) => {
                    if (err)
                        return result(err);
        
                    if (rows.length <= 0) {
                        return result(err);
                    } else {
                        return result(rows);
                    }
                });
            }
        })
    },
}