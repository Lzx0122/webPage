// var con = new ActiveXObject("ADODB.Connection")
// con.ConnectionString = "server=localhost;port=3306;user id=root"
// con.Open;


const http = require("http");
const fs = require("fs");

const sendRespones = (filename, statusCode, response) => {
    console.log(`sendRespones ${filename}`);
    fs.readFile(`./html/${filename}`, (error, data) => {
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

    gethtml(method, url, response);


});

function gethtml(method, url, response) {

    console.log(`gethtml ${url}`);

    if (method !== "GET") {

        return false;
    }
    if (url === "/") {
        sendRespones("index.html", 200, response);
        return true;
    }
    if (url === "/main.html") {
        sendRespones("main.html", 200, response);
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