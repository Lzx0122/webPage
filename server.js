// var con = new ActiveXObject("ADODB.Connection")
// con.ConnectionString = "server=localhost;port=3306;user id=root"
// con.Open;
import * as lib from "./script/lib.js";
//import * as http from "http";
import * as fs from "fs";
import { person, runSQL } from "./mysql/con.js";
import * as ejs from "ejs";
import session from "express-session";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import * as send_email from "./script/send_email.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
var userdata = {};


// 讀資料夾內所有檔案
app.use('/css', express.static(__dirname + "/css"));
app.use('/img', express.static(__dirname + "/img"));
app.use('/script', express.static(__dirname + "/script"));
app.use('/mysql', express.static(__dirname + "/mysql"));


app.use(session({
    secret: "mySecret",
    name: 'user',
    cookie: { maxAge: 1000 * 60 * 60 },
    saveUninitialized: false,
    resave: true
}))
//登入畫面
app.get("/", (req, res) => {

    if (req.session.user) {
        var ejsDataArray = {
            loginFailed: "<p>帳號或密碼錯誤</p>",
            showLoginFailed: true,
            userid: '',
            username: '',
            permission: '',
            profession: ''
        };
    } else {
        var ejsDataArray = {
            loginFailed: "<p>帳號或密碼錯誤</p>",
            showLoginFailed: false,
            userid: '',
            username: '',
            permission: '',
            profession: ''
        };
    }

    sendejs(ejsDataArray, "/html/login.ejs", res, 200);
})
//主頁
app.get("/main", (req, res) => {
    if (req.session.user) {

        console.log(userdata)
        sendejs(userdata[`${req.session.user}`], "/html/main.ejs", res, 200);
    } else {
        sendRespones("/404.html", 404, res);
    }

})

//公告
app.get("/home", (req, res) => {
    if (req.session.user) {
        sendejs(userdata[`${req.session.user}`], "/html/home.ejs", res, 200);
    } else {
        sendRespones("/404.html", 404, res);
    }

})
//個人資料
app.get("/user", (req, res) => {
    if (req.session.user) {
        sendejs(userdata[`${req.session.user}`], "/html/user.ejs", res, 200);
    } else {
        sendRespones("/404.html", 404, res);
    }
})
//帳號管理
app.get("/account_manage", async (req, res) => {
    let Table = await lib.getTable('select account,password,Name,permission,Profession,onboardDate,InsuredSalary from Employee inner join permission on Employee.permissionID = permission.permissionID inner join Profession on Employee.professionID = Profession.ProfessionID', 'getTable');

    let ejsDataArray = {
        Table: Table
    }
    ejsDataArray = await Division(ejsDataArray);

    if (req.session.user) {
        sendejs(ejsDataArray, "/html/account_manage.ejs", res, 200);
    } else {
        sendRespones("/404.html", 404, res);
    }
})
//帳號管理-->查詢部門
function Division(ejsDataArray) {
    return new Promise(async (resolve, reject) => {
        try {


            for (let i = 0; i < ejsDataArray['Table'].length; i++) {
                let Value = await lib.getTable(`select Profession from Profession where ProfessionID=(select UpLayer from Profession where Profession='${ejsDataArray['Table'][i].Profession}')`, 'getValue')
                ejsDataArray['Table'][i]['Division'] = Value.Profession
            }
        } catch (e) {
            console.log(e)
        }
        console.log(ejsDataArray);
        resolve(ejsDataArray);
    })
}
app.post("/CRUD-employee-Form", (req, res) => {
    let body = [];


    req.on('data', (chunk) => {
        body.push(chunk);
    })
    req.on('end', () => {
        body = Buffer.concat(body).toString();
        let params;
        params = new URLSearchParams(body);
        console.log(params)
        if (params.get('account') !== 'sa') {
            if (req.session.user === 'a0908287570@gmail.com') {
                if (params.get('vote') === 'add') {
                    lib.getTable(`insert into Employee (account, Name, password, permissionID, professionID,onboardDate,InsuredSalary) 
                values ('${params.get('account')}',
                '${params.get('Name')}',
                '${params.get('password')}',
                (select permissionID from permission where permission='${params.get('permission')}'),
                (select professionID from profession where Profession='${params.get('Profession')}'),
                ${params.get('onboardDate')},
                ${params.get('InsuredSalary')})`
                        , "runSQL")
                    send_email.sendEmail('新增人員', `人員姓名:${params.get('Name')}`, 'a0908287570@gmail.com');
                    send_email.sendEmail('聯鑑工程', `歡迎 ${params.get('Name')} 先生/小姐 加入
                    \n帳號:${params.get('account')}
                    \n密碼:身分證字號`
                        , params.get('account'));
                }
                if (params.get('vote') === 'delete') {
                    lib.getTable(`delete from Employee where account='${params.get('account')}'`, "runSQL")
                }

            }
            if (params.get('vote') === 'update') {
                lib.getTable(`update Employee set 
                Name='${params.get('Name')}',
                password='${params.get('password')}',
                permissionID=(select permissionID from permission where permission='${params.get('permission')}'),
                professionID=(select professionID from profession where Profession='${params.get('Profession')}') ,
                onboardDate='${params.get('onboardDate')}',
                InsuredSalary='${params.get('InsuredSalary')}'
                where account='${params.get('account')}'`
                    , "runSQL");
            }
            if (params.get('vote') === 'req-add') {
                send_email.sendEmail('新增人員確認',
                    `員工帳號(e-mail)：${params.get('account')}\n
                密碼(身分證):${params.get('password')}\n
                員工姓名:${params.get('Name')}\n
                權限:${params.get('permission')}\n
                職業:${params.get('Profession')}\n
                到職日:${params.get('onboardDate')}\n
                投保薪資:${params.get('InsuredSalary')}\n
                備註:${params.get('note')}`, 'a0908287570@gmail.com')

            }
            if (params.get('vote') === 'req-delete') {
                send_email.sendEmail('刪除人員確認', '', 'a0908287570@gmail.com')
            }
        }
    })


})
//登入post 
app.post("/process-login", (request, response) => {
    let body = [];
    request.on("data", (chunk) => {
        body.push(chunk);
    });
    request.on("end", () => {

        body = Buffer.concat(body).toString();
        let params;
        params = new URLSearchParams(body);

        function loginhtml() {
            return new Promise(async (resolve, reject) => {
                let re = await lib.vlogin(params.get('username'), params.get('password'))

                resolve(re)
            })
        }
        async function getlogin() {

            isaLogin = await loginhtml();
            //console.log("isaLogin");
            if (isaLogin === true) {
                console.log(person.userid, '登入成功', new Date(Date.now()));
                response.statusCode = 301;
                request.session.user = person.userid;
                var ejsDataArray = {
                    loginFailed: "<p>帳號或密碼錯誤</p>",
                    showLoginFailed: false,
                    userid: '',
                    username: '',
                    permission: '',
                    division: '',
                    profession: '',
                    onboardDate: '',
                    InsuredSalary: ''
                };
                ejsDataArray.showLoginFailed = false;
                ejsDataArray.userid = request.session.user
                ejsDataArray.username = person.username
                ejsDataArray.permission = person.permission.split(",")
                ejsDataArray.profession = person.profession
                ejsDataArray.division = person.division
                ejsDataArray.onboardDate = person.onboardDate
                ejsDataArray.InsuredSalary = person.InsuredSalary
                let dataArray = ejsDataArray
                userdata[`${ejsDataArray.userid}`] = dataArray
                //console.log(request.sessionID)
                response.setHeader("Location", "./main");
                response.end();
            } else {

                console.log(params.get('username'), '嘗試登入失敗');
                response.statusCode = 301;
                request.session.user = request.sessionID;

                response.setHeader("Location", "/");
                response.end();
            }
        }
        getlogin();
    })
})
//登出post 
app.post('/logout', (req, res) => {
    console.log(`${req.session.user} 已登出`)
    delete userdata[`${req.session.user}`]
    req.session.destroy(() => {
    })
    console.log(userdata)
    res.statusCode = 301;
    res.setHeader("Location", "/");
    res.end();
})


app.listen(3000, console.log(`Server is running at http://127.0.0.1:3000`));




var isaLogin = false;

const sendRespones = (filename, statusCode, response) => {
    fs.readFile(`.${filename}`, (error, data) => {
        if (error) {
            response.statusCode = 500;
            response.setHeader("Content-Type", "text/plain")
            response.end("Sorry, internal error");
        } else if (filename.includes("/css/")) {
            response.statusCode = statusCode;
            response.setHeader("Content-Type", "text/css")
            response.write(data);
            response.end();
        } else if (filename.includes("/img/")) {
            response.statusCode = statusCode;
            response.setHeader("Content-Type", "image/jpeg")
            response.write(data);
            response.end();
        } else if (filename.includes("/script/")) {
            response.statusCode = statusCode;
            response.setHeader("Content-Type", "application/javascript")
            response.write(data);
            response.end();
        } else {
            response.statusCode = statusCode;
            response.setHeader("Content-Type", "text/html")
            response.write(data);
            response.end();
        }
    })
}
//ejs html 
const sendejs = (ejsDataArray, filename, response, statusCode) => {

    var tmp = fs.readFileSync(`.${filename}`, "utf-8");
    var ejsdata = ejs.render(tmp, ejsDataArray)

    response.statusCode = statusCode;
    response.setHeader("Content-Type", "text/html")
    response.end(ejsdata);
}

// const server = http.createServer((request, response) => {

//     const method = request.method;
//     const url = request.url;


//     //console.log(url, method);
//     if (method === "GET") {
//         console.log(request.session)
//         gethtml(url, response);
//     } else if (method === "POST") {
//         console.log("/process-login");
//         if (url === "/process-login") {
//             let body = [];
//             request.on("data", (chunk) => {
//                 body.push(chunk);
//             });
//             request.on("end", () => {

//                 body = Buffer.concat(body).toString();
//                 let params;
//                 params = new URLSearchParams(body);

//                 function loginhtml() {
//                     return new Promise(async (resolve, reject) => {
//                         let re = await lib.vlogin(params.get('username'), params.get('password'))
//                         //console.log('loginhtml')
//                         resolve(re)
//                     })
//                 }
//                 async function getlogin() {
//                     isaLogin = await loginhtml();
//                     //console.log("isaLogin");
//                     if (isaLogin === true) {
//                         // var tmp = fs.readFileSync("./html/main.ejs", 'utf-8')
//                         // var ejsdata = ejs.render(tmp, {
//                         //     userid: person.userid
//                         // })

//                         console.log(person.userid, '登入成功', new Date(Date.now()));
//                         response.statusCode = 301;
//                         response.setHeader('Set-Cookie', 'isLoggedIn=true')
//                         response.setHeader("Location", "./main.ejs");
//                         response.end();
//                     } else {
//                         // var tmp = fs.readFileSync("./html/login.ejs", 'utf-8')
//                         // var ejsdata = ejs.render(tmp, {
//                         //     loginFailed: "<p>Login-Failed!!</p>",
//                         //     show: true
//                         // })
//                         console.log(params.get('username'), '嘗試登入失敗');
//                         response.statusCode = 301;
//                         ejsDataArray = {
//                             loginFailed: "<p>Login-Failed!!</p>",
//                             show: true
//                         }
//                         response.setHeader("Location", "/");
//                         response.end();
//                     }
//                 }
//                 getlogin();
//             });


//         }
//     }
// });


// const nullArray = [];

// // 檢查url內html位置判斷 發送到 sendRespones
// function gethtml(url, response) {
//     //console.log("url", url)
//     //console.log(`gethtml ${url}`);
//     if (url === "/") {
//         console.log(session)
//         //sendRespones("/html/login.ejs", 200, response);

//         if (ejsDataArray.show === false || ejsDataArray === nullArray) {
//             ejsDataArray = {
//                 loginFailed: "<p>Login-Failed!!</p>",
//                 show: false
//             }
//         }

//         sendejs(ejsDataArray, "/html/login.ejs", response, 200);
//         return true;
//     }
//     if (url === "/login.html") {
//         // sendRespones("/html/login.ejs", 200, response);
//         ejsDataArray = {
//             loginFailed: "<p>Login-Failed!!</p>",
//             show: false
//         }
//         sendejs(ejsDataArray, "/html/login.ejs", response, 200);
//         return true;
//     }
//     if (url === "/main.ejs" && isaLogin === true) {

//         //sendRespones("/html/main.ejs", 200, response);
//         ejsDataArray = {
//             userid: person.userid
//         }
//         sendejs(ejsDataArray, "/html/main.ejs", response, 200);
//         return true;
//     }
//     if (url.includes("/script/")) {
//         sendRespones(url, 200, response);
//         return true;
//     }
//     if (url.includes("/css/")) {
//         sendRespones(url, 200, response);
//         return true;
//     }
//     if (url.includes("/img/")) {
//         sendRespones(url, 200, response);
//         return true;
//     }
//     sendRespones("/404.html", 404, response);
//     return true;
// }




// const port = 3000;
// const ip = "127.0.0.1";

// server.listen(port, ip, () => {
//     console.log(`Server is running at http://${ip}:${port}`)
// })                  