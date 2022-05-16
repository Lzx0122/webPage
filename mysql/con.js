import * as mysql from 'mysql';

var connection
var person = {
    userid: "",
    username: "",
    permission: "",
    division: "",
    profession: "",
    onboardDate: "",
    InsuredSalary: ""
}
var getValue = "";
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
function runSQL(strSQL, action) {

    return new Promise(async (resolve, reject) => {
        try {
            await open();
            let re = await new Promise((resolve, reject) => {

                try {
                    connection.query(strSQL, async (error, results, fields) => {
                        try {
                            if (error) {
                                console.log(error);
                            }
                            if (action === 'login') {
                                for (var i = 0; i < results.length; i++) {
                                    person.userid = results[i].account;
                                    person.username = results[i].Name;
                                    person.permission = results[i].permission;
                                    person.profession = results[i].Profession;
                                    await runSQL(`select Profession from Profession where ProfessionID=(select UpLayer from Profession where Profession='${person.profession}')`, 'getValue')
                                    person.division = getValue.Profession;
                                    person.onboardDate = results[i].onboardDate;
                                    person.InsuredSalary = results[i].InsuredSalary;

                                    returnIsSQL = true;

                                };
                                a();
                            }
                            if (action === 'getValue') {
                                try {
                                    getValue = results[0]
                                } catch {
                                    console.log("dddwefwfwedfwfw")
                                }


                                resolve();

                            }
                            if (action === 'getTable') {

                                resolve(results)

                            }
                            if (action === 'runSQL') {
                                resolve()
                            }
                        } catch (e) {
                            connection.end();
                        }
                    })
                } catch (e) {
                    connection.end();
                    resolve();
                    console.log('1111')
                }
                function a() {
                    connection.end();
                    resolve();
                }
            })
            //console.log('consql');
            if (action === 'login') {
                resolve(returnIsSQL);
            }
            if (action === 'getValue') {
                resolve(getValue);
            }
            if (action == 'getTable') {

                resolve(re);
            }
        } catch (e) {
            connection.end();
            resolve();
            console.log('1111')
        }
    })

}

export { open };
export { runSQL };
export { person }