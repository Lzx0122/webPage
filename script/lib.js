import * as con from "../mysql/con.js";

function getlogin(username, password) {
    return new Promise(async (resolve, reject) => {
        let re = await con.runSQL(`select account,password,Name,permission,Profession,onboardDate,InsuredSalary from Employee inner join permission on Employee.permissionID = permission.permissionID inner join Profession on Employee.professionID = Profession.ProfessionID where account='${username}' and password='${password}'`, "login")
        resolve(re)
    })
}
async function vlogin(username, password) {

    let isLogin = await getlogin(username, password);
    return isLogin;
}

async function getTable(strSQL, action) {
    return new Promise(async (resolve, reject) => {
        let re = await con.runSQL(strSQL, action);

        resolve(re)
    })
}


export { vlogin }
export { getTable }


