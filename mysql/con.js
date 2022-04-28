var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '0000',
    database: 'test'
});

connection.connect();

connection.query("update test.Employee set password='1234' WHERE account='sa'", function (error, results, fields) {
    if (error) {
        console.log(error);
        return;
    }
    for (var i = 0; i < results.length; i++) {
        console.log(`${results[i].account},${results[i].password}`);
    };

})
connection.end();