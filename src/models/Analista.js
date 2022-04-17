const { connection } = require('../database/connectionDB');

module.exports = {

    getByUser: (user, result) => {
        connection.query('SELECT * FROM Analista WHERE usuario_Analista = ?', user, (err, rows) => {
            return result(err, rows);
        });
    },

    updateEmail: (user, data, result) => {
        connection.query('UPDATE Analista SET correo_Analista = ? WHERE usuario_Analista = ? AND contraseña_Analista = ?', [data.correo_Analista, user, data.contrasena_Analista], (err, rows) => {
            if (err)
                return result(err);

            if (rows.length <= 0) {
                return result(err);
            } else {
                return result(rows);
            }
        });
    },

    updatePassword: (user, passwords, result) => {

        connection.query('SELECT contraseña_Analista FROM Analista WHERE usuario_Analista = ? ', user, (err, rows) => {
            if (err)
                return result(err);

            if (rows.length <= 0) {
                return result(err);
            } else {

                if (passwords.contrasena_Analista != rows[0].contraseña_Analista) {
                    return result(false);
                }

                connection.query('UPDATE Analista SET contraseña_Analista = ? WHERE usuario_Analista = ?', [passwords.newContrasena, user], (err, rows) => {
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

    getAnalistaAsign: (result) => {
        connection.query(`select usuario_Analista1, count(idMuestra) as numMuestras from Muestra where usuario_Analista1 in (select usuario_Analista from Analista) and estadoMuestra <> "realizada" group by usuario_Analista1`, (err, rows) => {
            if (err)
                return result(err);

            if (rows.length <= 0) {
                connection.query(`select usuario_Analista from Analista order by rand() limit 1`, (err, rows) => {
                    return result(rows[0].usuario_Analista);
                });
            } else {
                var menor = rows[0].numMuestras, p = 0; 
                for (let i = 1; i < rows.length; i++) {
                    if (rows[i].numMuestras < menor) {
                        menor = rows[i].numMuestras;
                        p = i;
                    }
                }

                return result(rows[p].usuario_Analista1);
            }
        });
    }
    
}