const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: 'root',
    database: 'employees_db',
});

connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id'+ connection.threadId);
});

module.exports = connection;