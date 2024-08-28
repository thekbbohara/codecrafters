const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.clear();
console.log("Logs from your program will appear here!");

const server = net.createServer();
// console.log(server);
server.on("connection", (socket) => {
  // console.log(socket);
  // socket.pipe(socket);

  socket.on("data", (data) => {
    const request = data.toString();
    if (request.startsWith("GET / ")) {
      socket.write(`HTTP/1.1 200 OK\r\n\r\n`);
    } else if (request.startsWith("GET /index.html")) {
      socket.write("HTTP/1.1 200 OK\r\n\r\nHomePage\r\n\r\n");
    } else if (request.startsWith("GET /echo/")) {
      const str = request.match(/GET \/echo\/([^ ]+)/)[1];
      socket.write(
        `HTTP/1.1 200 OK\r\n\r\nContent-Type: text/plain\r\nContent-Length: ${str.length}\r\n\r\n${str}\r\n\r\n`,
      );
    } else if (request.startsWith("GET /user-agent")) {
      const userAgent = request.match(/User-Agent: ([^ ]+)/)[1];
      socket.write(`HTTP/1.1 200 OK\r\n\r\n${userAgent}\r\n\r\n`);
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
  });

  socket.on("end", () => {
    console.log("disconnected ");
  });
  socket.on("error", (err) => {
    console.log(err);
  });
  socket.on("close", () => {
    socket.end();
    // server.close();
  });
});

server.listen(4221, "localhost");
