const socketIo = require("socket.io");
const Http = require("http");
const cors = require("cors");
const express = require("express");
const app = express();
const http = Http.createServer(app);
const router = express.Router();

const io = socketIo(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

/**
 * extended 옵션의 경우,
 * true일 경우, 객체 형태로 전달된 데이터내에서 또다른 중첩된 객체를 허용한다는 말이며,
 * false인 경우에는 허용하지 않음
 */
app.use("/api", express.urlencoded({ extended: false }), router);

http.listen(8080, (req, res) => {
  console.log(`서버를 요청 받을 준비가 되었습니다 👩`);
});

router.get("/", (req, res) => {
  res.send("Hello RESTFUL API ");
});

router.get("/games", (req, res) => {
  console.log(`games`);
});

router.patch("/games", (req, res) => {
  console.log(req.query.blueName, "zzz");
});
