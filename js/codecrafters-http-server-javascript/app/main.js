import { createServer } from "net";
import { readFileSync, writeFileSync } from "fs";

const STATUS_OK = "200 OK";
const STATUS_NOT_FOUND = "404 Not Found";
const CONTENT_PLAIN_TEXT = "Content-Type: text/plain";
const CRLF = "\r\n";

const server = createServer();

const handleEndErrorCloseEvent = (socket) => {
  socket.on("end", () => {
    console.log("disconnected");
  });
  socket.on("error", (err) => {
    console.log(err);
  });
  socket.on("close", () => {
    socket.end();
  });
};

const handleFileRequest = (fn) => {
  //filename
  try {
    const data = readFileSync(fn, "utf8");
    const res = `Content-Type: application/octet-stream${CRLF}Content-Length: ${data.length}${CRLF}${CRLF}${data}`;
    return { status: STATUS_OK, res };
  } catch (err) {
    return { status: STATUS_NOT_FOUND, res: "" };
  }
};

const handleFilePost = (fn, content) => {
  try {
    writeFileSync(fn, content);
    return { status: STATUS_OK, res: "created" };
  } catch (err) {
    return { status: STATUS_NOT_FOUND, res: "" };
  }
};
const parseRequest = (req) => {
  if (req.startsWith("POST /files/")) {
    const args = process.argv;
    if (args.includes("--directory")) {
      const dir = args[args.indexOf("--directory") + 1];
      const fn = req.match(/POST \/files\/([^ ]+)/)[1];
      let content = req.split("\n");
      content = content[content.length - 1];
      if (fn !== null) return handleFilePost(`${dir}${fn}`, `${content}\r\n`);
      return { status: STATUS_NOT_FOUND, res: "" };
    }
    return { status: STATUS_NOT_FOUND, res: "" };
  }
  if (req.startsWith("GET / ")) return { status: STATUS_OK, res: "index.html" };
  if (req.startsWith("GET /echo/")) {
    const str = req.match(/GET \/echo\/([^ ]+)/)[1];
    const res = `${CONTENT_PLAIN_TEXT}${CRLF}Content-Length: ${str.length}${CRLF}${CRLF}${str}`;
    return { status: STATUS_OK, res };
  }
  if (req.startsWith("GET /user-agent")) {
    const userAgent = req.match(/User-Agent: ([^ ]+)/)[1];
    return { status: STATUS_OK, res: userAgent };
  }
  if (req.startsWith("GET /files/")) {
    const args = process.argv;
    // console.log(req);
    if (args.includes("--directory")) {
      const dir = args[args.indexOf("--directory") + 1];
      const fn = req.match(/GET \/files\/([^ ]+)/)[1];
      if (fn !== null) return handleFileRequest(`${dir}${fn}`);
      return { status: STATUS_NOT_FOUND, res: "" };
    }
    return { status: STATUS_NOT_FOUND, res: "" };
  }
  return { status: STATUS_NOT_FOUND, res: "" };
};

server.on("connection", (socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    const { status, res } = parseRequest(request);
    const response = `HTTP/1.1 ${status}${CRLF}${CRLF}${res}${CRLF}${CRLF}`;
    socket.write(response);
  });
  handleEndErrorCloseEvent(socket);
});

server.listen(4221, "localhost", () => {
  console.log("Server listening on localhost:4221");
});
