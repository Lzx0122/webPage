import * as con from "../mysql/con.js";

function getlogin(username, password) {


    // console.log("登入驗證")
    // let isSQLcmd = false;
    // isSQLcmd = con.startSQL(`select * from Employee where account='${username}' and password='${password}'`);
    // const p = new Promise((resolve, reject) => {
    //     setTimeout(() => resolve(), 1000)
    // })

    // let isLogin = p.then(() => {
    //     console.log(isSQLcmd)
    //     if (isSQLcmd) {
    //         console.log("登入成功");
    //         return true;
    //     } else {
    //         console.log("登入失敗");
    //         return false;
    //     }

    // })

    return new Promise(async (resolve, reject) => {
        let re = await con.runSQL(`select account,password,Name,permission from Employee inner join permission on Employee.permissionID = permission.permissionID where account='${username}' and password='${password}'`)
        //console.log("vlogin");
        //console.log('consql', re);
        resolve(re)
    })
}
async function vlogin(username, password) {
    let isLogin = await getlogin(username, password);
    return isLogin;
}




export { vlogin }


