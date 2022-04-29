import * as con from "../mysql/con.js";

export function vlogin(username, password) {


    console.log("登入驗證")

    let isSQLcmd = con.startSQL(`select * from Employee where account='${username}' and password='${password}'`);
    const p = new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 1000)
    })

    p.then(function () {
        console.log(isSQLcmd)
        if (isSQLcmd) {
            console.log("登入成功");
        } else {
            console.log("登入失敗");
        }

    })


}



