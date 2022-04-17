const mysql = require('mysql');

const connection = mysql.createConnection({
    // host: 'db-sw2.ckt1m06uexzx.us-east-1.rds.amazonaws.com',
    // user: 'admin',
    // password: 'perrote55',
    // database: 'pruebasSW'
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pruebasSW'
});

module.exports = {connection};