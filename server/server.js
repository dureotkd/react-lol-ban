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
const watch = {};
const intervalControl = {
  obj: null,
  start: (seq, second, team) => {
    if (this.obj !== undefined) {
      clearInterval(this.obj);
      io.to(seq).emit("stopSecond", second, team);
    }
    this.obj = setInterval(() => {
      second--;

      io.to(seq).emit("startSecond", second, team);
    }, 1000);
  },
};

io.on("connection", (socket) => {
  console.log(`소켓 서버가 연결되었습니다 👨`);

  const socketId = socket.id;

  socket.on("joinDraft", (seq) => {
    socket.join(seq);
  });

  socket.on("watchDraftState", ({ seq, myTeam }) => {
    switch (myTeam) {
      default:
        if (rooms[socketId] === undefined) {
          rooms[socketId] = seq;
        }
        break;

      case "watchTeam":
        if (watch[socketId] === undefined) {
          watch[socketId] = seq;
        }
        break;
    }

    const nowPlayer = Object.values(rooms).reduce((before, after) => {
      return {
        ...before,
        [after]: before[after] ? (before[after] += 1) : 1,
      };
    }, {});

    const nowPlayerCnt = nowPlayer[seq] ? nowPlayer[seq] : 0;

    io.to(seq).emit("watchDraftState", nowPlayerCnt);

    const watchNow = Object.values(watch).reduce((before, after) => {
      return {
        ...before,
        [after]: before[after] ? before[after] + 1 : 1,
      };
    }, {});

    const watchNowCnt = watchNow[seq];

    io.to(seq).emit("watchNowCnt", watchNowCnt);
  });

  socket.on("startSecond", async ({ seq, second }) => {
    // intervalControl.start(seq, second["blue"], "blue");
    // await wait(10000);
    // intervalControl.start(seq, second["red"], "red");
    // await wait(10000);
  });

  socket.on("disconnect", () => {
    delete rooms[socketId];
    delete watch[socketId];

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

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));
