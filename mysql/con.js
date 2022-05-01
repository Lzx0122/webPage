
import * as mysql from 'mysql';

var connection
function createCon() {

    return new Promise((resolve, reject) => {
        connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            port: '3306',
            password: '0000',
            database: 'test'
        });
        resolve(returnIsSQL = false);
    })
}

function open() {
    return new Promise(async (resolve, reject) => {
        await createCon();
        resolve(connection.connect());
    })
}
let returnIsSQL = false;
function runSQL(strSQL) {

    return new Promise(async (resolve, reject) => {
        await open();
        await new Promise((resolve, reject) => {

            connection.query(strSQL, (error, results, fields) => {
                if (error) {
                    console.log(error);
                }
                for (var i = 0; i < results.length; i++) {

                    console.log(`${results[i].account},${results[i].password}`);
                    returnIsSQL = true;

                };
                a();
            })
            function a() {
                connection.end();
                resolve();
            }

        })

        console.log('consql');
        resolve(returnIsSQL);
    })


}





export { open };

export { runSQL };