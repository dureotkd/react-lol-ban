const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const router = express.Router();
const crypto = require("crypto");
const io = require("socket.io")(http, { cors: { origin: "*" } });

const gameModel = require("./model/Game/GameModel");
const champModel = require("./model/Champ/ChampModel");

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

const rooms = {};

io.on("connection", (socket) => {
  console.log(`소켓 서버가 연결되었습니다 👨`);

  const socketId = socket.idl;

  socket.on("joinDraft", ({ seq, id }) => {
    console.log(seq, id);

    socket.join(seq);

    if (rooms[socketId] === undefined) {
      rooms[socketId] = seq;
    }

    io.to(seq).emit("joinDraft");
  });

  socket.on("disconnect", () => {
    delete rooms[socketId];

    console.log(`소켓 서버가 종료되었습니다 👩‍🦳`);
  });
});

router.get("/", (req, res) => {
  res.send("Hello RESTFUL API ");
});

router.get("/games", async (req, res) => {
  const { seq, id } = req.query;

  let where = [
    `a.seq = ${seq}`,
    `(a.blueEnName = '${id}' OR a.redEnName = '${id}' OR a.watchEnName = '${id}')`,
  ];

  let sql = `
  SELECT 
    * ,
    CASE 
    WHEN a.blueEnName = '${id}' THEN 'blueTeam' 
    WHEN a.redEnName = '${id}' THEN 'redTeam'
    ELSE 'watchTeam' END as myTeam
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
  const watchEnKey = `watch_${matchName}`;
  const { seq } = await gameModel.getLastPk();

  if (!seq) res.status(500).send();

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

  const watchEnName = crypto
    .createHash("sha512")
    .update(watchEnKey)
    .digest("base64")
    .replaceAll("/", "");

  await gameModel.save({
    blueName,
    redName,
    matchName,
    blueEnName,
    redEnName,
    watchEnName,
  });

  res.send({
    blueEnName,
    redEnName,
    watchEnName,
    seq: newSeq,
  });
});
