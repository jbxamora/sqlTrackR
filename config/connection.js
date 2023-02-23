const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'FakePassword',
    database: 'company_db'
});
connection.connect(function (err) {
    if (err) throw err;
});

module.exports = connection;