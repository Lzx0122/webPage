
import * as mysql from 'mysql';


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '0000',
    database: 'test'
});
function open() {

    connection.connect();
}
export let returnIsSQL = false;
function startSQL(strSQL) {

    open();
    connection.query(strSQL, function (error, results, fields) {
        if (error) {
            console.log(error);
            connection.end();
            returnIsSQL = false;
            return returnIsSQL;
        }
        console.log(strSQL);
        for (var i = 0; i < results.length; i++) {

            console.log(`${results[i].account},${results[i].password}`);
            connection.end();
            returnIsSQL = true;
            return returnIsSQL;

        };
        connection.end();
        returnIsSQL = false;
        return returnIsSQL;
    })



}

export { open };
export { startSQL };