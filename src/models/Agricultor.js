const { connection } = require('../database/connectionDB'),
    bcrypt = require('bcrypt-nodejs');

module.exports = {

    get: (req) => {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM Agricultor = ?', data, (err, agricultores) => {
                if (err) {
                    res.json(err);
                }
            })
        });
    },

    getByUser: (user, result) => {
        connection.query('SELECT * FROM Agricultor WHERE usuario_Agricultor = ?', user, (err, rows) => {
            return result(err, rows);
        });
    },

    getByEmail: (correo, result) => {
        connection.query('SELECT * FROM Agricultor WHERE correo_Agricultor = ?', correo, (err, rows) => {
            return result(err, rows);
        });
    },

    create: (data, result) => {
        connection.query('INSERT INTO Agricultor SET ? ', data, (err, rows) => {
            return result(err, rows);
        })
    },

    delete: (req, user) => {
        req.getConnection((err, conn) => {
            conn.query('DELETE FROM Agricultor WHERE usuario_Agricultor = ?', user, (err, rows) => {
                if (err) {
                    res.json(err);
                }
            })
        });
    },

    updatePassword: (user, passwords, result) => {

        connection.query('SELECT contrasena_Agricultor FROM Agricultor WHERE usuario_Agricultor = ? ', user, (err, rows) => {
            if (err)
                return result(err);

            if (rows.length <= 0) {
                return result(err);
            } else {
                if (!bcrypt.compareSync(passwords.contrasena_Agricultor, rows[0].contrasena_Agricultor.replace(/^\$2y/, "$2a"))){
                    return result(false);
                }

                const newPassword = bcrypt.hashSync(passwords.newContrasena, bcrypt.genSaltSync(8), null);

                connection.query('UPDATE Agricultor SET contrasena_Agricultor = ? WHERE usuario_Agricultor = ?', [newPassword, user], (err, rows) => {
                    if (err)
                        return result(err);
        
                    if (rows.length <= 0) {
                        return result(err);
                    } else {
                        return result(rows);
                    }
                });

            }
        });
    },

    updateData: (user, data, result) => {
        connection.query(`UPDATE Agricultor SET nombre_Agricultor = ?, depart_Agricultor = ?, 
        ciudad_Agricultor = ? WHERE usuario_Agricultor = ?`, 
            [data.nombre_Agricultor, data.depart_Agricultor, data.ciudad_Agricultor,
            user], (err, rows) => {

            if (err)
                return result(err);

            if (rows.length <= 0) {
                return result(err);
            } else {
                return result(rows);
            }
        });
    },

    updateEmail: (user, data, result) => {
        connection.query('SELECT contrasena_Agricultor FROM Agricultor WHERE usuario_Agricultor = ? ', user, (err, rows) => {
            if (err)
                return result(err);

            if (rows.length <= 0) {
                return result(err);
            } else {
                if (!bcrypt.compareSync(data.contrasena_Agricultor, rows[0].contrasena_Agricultor.replace(/^\$2y/, "$2a"))){
                    return result(false);
                }
                connection.query('UPDATE Agricultor SET correo_Agricultor = ? WHERE usuario_Agricultor = ?', [data.correo_Agricultor, user], (err, rows) => {
                    if (err)
                        return result(err);

                    if (rows.length <= 0) {
                        return result(err);
                    } else {
                        return result(rows);
                    }
                });
            }
        });
    }
}