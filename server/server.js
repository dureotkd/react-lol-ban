const socketIo = require("socket.io");
const Http = require("http");
const cors = require("cors");
const express = require("express");
const app = express();
const http = Http.createServer(app);
const router = express.Router();
const crypto = require("crypto");

const gameModel = require("./model/Game/GameModel");
const champModel = require("./model/Champ/ChampModel");

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

router.get("/games", async (req, res) => {
  const { seq, id } = req.query;

  let where = [
    `a.seq = ${seq}`,
    `(a.blueEnName = '${id}' OR a.redEnName = '${id}')`,
  ];

  let sql = `
  SELECT 
    * ,
    CASE WHEN a.blueEnName = '${id}' THEN 'blueTeam' ELSE 'redTeam' END as myTeam
  FROM 
    ban.game a
  WHERE %s`.replace("%s", where.join(" AND "));

  const row = await gameModel.getData({
    sql: sql,
    type: "row",
  });

  res.send({
    row,
  });
});

router.get("/champs", async (req, res) => {
  const all = await champModel.getAll();

  res.send({
    all,
  });
});

router.patch("/games", async (req, res) => {
  const { blueName, redName, matchName } = req.query;

  const blueEnKey = `${blueName}_${matchName}`;
  const redEnKey = `${redName}_${matchName}`;
  const { seq } = await gameModel.getLastPk();
  const newSeq = seq + 1;

  const blueEnName = crypto
    .createHash("sha512")
    .update(blueEnKey)
    .digest("base64")
    .replaceAll("/", "");
  const redEnName = crypto
    .createHash("sha512")
    .update(redEnKey)
    .digest("base64")
    .replaceAll("/", "");

  await gameModel.save({
    blueName,
    redName,
    matchName,
    blueEnName,
    redEnName,
  });

  res.send({
    blueEnName,
    redEnName,
    seq: newSeq,
  });
});
