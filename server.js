// var con = new ActiveXObject("ADODB.Connection")
// con.ConnectionString = "server=localhost;port=3306;user id=root"
// con.Open;
import * as lib from "./script/lib.js";

import * as http from "http";
import * as fs from "fs";


const sendRespones = (filename, statusCode, response) => {

    console.log(`sendRespones ${filename}`);
    fs.readFile(`.${filename}`, (error, data) => {
        if (error) {
            response.statusCode = 500;
            response.setHeader("Content-Type", "text/plain")
            response.end("Sorry, internal error");
        } else {
            response.statusCode = statusCode;
            response.setHeader("Content-Type", "text/html")
            response.end(data);
        }
    })
}

const server = http.createServer((request, response) => {

    const method = request.method;
    const url = request.url;
    console.log(url, method);
    if (method === "GET") {
        gethtml(url, response);
    } else {
        console.log("/process-login");
        if (url === "/process-login") {

            login(request);
            ``
        }
    }
});
// 檢查url內html位置判斷 發送到 sendRespones
function gethtml(url, response) {

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
    if (url === "/script/JavaScript.js") {
        sendRespones("/script/JavaScript.js", 200, response);
        return true;
    }
    sendRespones("/404.html", 404, response);
    return true;
}

function login(request) {

    let body = [];
    request.on("data", (chunk) => {
        body.push(chunk);

    });
    request.on("end", () => {
        body = Buffer.concat(body).toString();
        let params;
        params = new URLSearchParams(body);
        console.log(params.get('username'), params.get('password'));
        lib.vlogin(params.get('username'), params.get('password'));



    });
}


const port = 3000;
const ip = "127.0.0.1";

server.listen(port, ip, () => {
    console.log(`Server is running at http://${ip}:${port}`)
})                  