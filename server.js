// var con = new ActiveXObject("ADODB.Connection")
// con.ConnectionString = "server=localhost;port=3306;user id=root"
// con.Open;
import * as lib from "./script/lib.js";
import * as http from "http";
import * as fs from "fs";
// import * as express from "express";
// var app = express;
// app.use('/css/style.css', express.static(__dirname + '/img'))
// app.listen(3000);


const sendRespones = (filename, statusCode, response) => {

    console.log(`sendRespones ${filename}`);
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

const server = http.createServer((request, response) => {

    const method = request.method;
    const url = request.url;
    console.log(url, method);
    if (method === "GET") {
        gethtml(url, response);
    } else if (method === "POST") {
        console.log("/process-login");
        if (url === "/process-login") {


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
                        console.log('loginhtml')
                        resolve(re)
                    })
                }
                async function getlogin() {
                    let isaLogin = await loginhtml();
                    console.log("isaLogin");
                    if (isaLogin === true) {
                        console.log('登入成功');
                        response.statusCode = 301;
                        response.setHeader("Location", "/main.html");

                    } else {
                        console.log('登入失敗');

                        response.statusCode = 301;
                        response.setHeader("Location", "/");
                    }
                    response.end();
                }

                getlogin();

            });


        }
    }
});
// 檢查url內html位置判斷 發送到 sendRespones
function gethtml(url, response) {
    console.log("url", url)
    console.log(`gethtml ${url}`);
    if (url === "/") {
        sendRespones("/html/login.html", 200, response);
        return true;
    }
    if (url === "/login.html") {
        sendRespones("/html/login.html", 200, response);
        return true;
    }
    if (url === "/main.html") {
        sendRespones("/html/main.html", 200, response);
        return true;
    }
    if (url.includes("/script/")) {
        sendRespones(url, 200, response);
        return true;
    }
    if (url.includes("/css/")) {
        sendRespones(url, 200, response);
        return true;
    }
    if (url.includes("/img/")) {
        sendRespones(url, 200, response);
        return true;
    }
    sendRespones("/404.html", 404, response);
    return true;
}




const port = 3000;
const ip = "127.0.0.1";

server.listen(port, ip, () => {
    console.log(`Server is running at http://${ip}:${port}`)
})                  