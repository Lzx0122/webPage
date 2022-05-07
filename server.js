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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
var userdata = {};



app.use('/css', express.static(__dirname + "/css"));
app.use('/img', express.static(__dirname + "/img"));
app.use('/script', express.static(__dirname + "/script"));
app.use(session({
    secret: "mySecret",
    name: 'user',
    cookie: { maxAge: 1000 * 60 * 30 },
    saveUninitialized: false,
    resave: true
}))

app.get("/", (req, res) => {
    if (req.session.user) {
        var ejsDataArray = {
            loginFailed: "<p>Login-Failed!!</p>",
            showLoginFailed: true,
            userid: '',
            username: '',
            permission: ''
        };
    } else {
        var ejsDataArray = {
            loginFailed: "<p>Login-Failed!!</p>",
            showLoginFailed: false,
            userid: '',
            username: '',
            permission: ''
        };
    }

    sendejs(ejsDataArray, "/html/login.ejs", res, 200);
})
app.get("/main.ejs", (req, res) => {
    if (req.session.user) {

        console.log(userdata)
        sendejs(userdata[`${req.session.user}`], "/html/main.ejs", res, 200);
    } else {
        sendRespones("/404.html", 404, res);
    }

})


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
                    loginFailed: "<p>Login-Failed!!</p>",
                    showLoginFailed: false,
                    userid: '',
                    username: '',
                    permission: ''
                };
                ejsDataArray.showLoginFailed = false;
                ejsDataArray.userid = request.session.user
                ejsDataArray.username = person.username
                ejsDataArray.permission = person.permission
                let dataArray = ejsDataArray
                userdata[`${ejsDataArray.userid}`] = dataArray
                //console.log(request.sessionID)
                response.setHeader("Location", "./main.ejs");
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