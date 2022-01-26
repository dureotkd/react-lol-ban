import axios from "axios";
import io from "socket.io-client";
import { connect } from "react-redux";
import queryString from "query-string";
import DraftView from "../../view/Draft/DarftView";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useCallback, useState, useRef } from "react";

function Draft(props) {
  const socket = io("http://localhost:8080");
  const { seq, id } = useParams();
  const [draft, setDraft] = useState({});
  const [champAll, setChampAll] = useState([]);
  const [searchLine, setSearchLine] = useState("");
  const [searchName, setSearchName] = useState("");
  const [gameStart, setGameStart] = useState(true);
  const [turn, setTurn] = useState(0);
  const [second, setSecond] = useState({
    blue: 60,
    red: 60,
  });
  const [card, setCard] = useState({
    blue: {
      pick: {},
      ban: {},
    },
    red: {
      pick: {},
      ban: {},
    },
  });

  let [watchTeamCnt, setWatchTeamCnt] = useState(0);

  const setBaseDraftCard = () => {
    const cloneCard = { ...card };

    for (let i = 0; i < 5; i++) {
      cloneCard.red.pick[i] = {
        tmpKey: Math.random() * 10000,
        code: null,
        name: null,
        img: null,
      };
      cloneCard.red.ban[i] = {
        tmpKey: Math.random() * 10000,
        code: null,
        name: null,
        img: null,
      };
      cloneCard.blue.pick[i] = {
        tmpKey: Math.random() * 10000,
        code: null,
        name: null,
        img: null,
      };
      cloneCard.blue.ban[i] = {
        tmpKey: Math.random() * 10000,
        code: null,
        name: null,
        img: null,
      };
    }

    setCard(cloneCard);
  };

  const getDraft = useCallback(async () => {
    setBaseDraftCard();

    await axios({
      method: "get",
      url: "http://localhost:8080/api/games",
      params: {
        seq,
        id,
      },
    })
      .then(({ status, data }) => {
        if (status === 200) {
          setDraft(data.row);
          setSocket(data.row);
        }
      })
      .catch(() => {})
      .then(() => {
        console.log(`getDraft`);
      });

    await axios({
      method: "get",
      url: "http://localhost:8080/api/champs",
      params: {},
    })
      .then(({ status, data }) => {
        if (status === 200) {
          setChampAll(data.all);
        }
      })
      .catch(() => {})
      .then(() => {
        console.log(`getChamps`);
      });
  }, [seq, id]);

  const setSocket = (draftData) => {
    const myTeam = draftData.myTeam;

    socket.emit("joinDraft", seq);

    socket.emit("watchDraftState", { seq, myTeam });

    socket.emit("startSecond", { seq, second });

    /**
     * 픽시간을 시작합니다
     */
    socket.on("startSecond", (changeSecond, team) => {
      const cloneSecond = { ...second };

      cloneSecond[team] = changeSecond;

      setSecond(cloneSecond);
    });

    /**
     * 픽시간을 제어합니다
     */
    socket.on("stopSecond", (changeSecond, team) => {
      const cloneSecond = { ...second };

      cloneSecond[team] = changeSecond;

      setSecond(cloneSecond);
    });

    /**
     * 블루,레드팀 참여자 확인
     */
    socket.on("joinDraft", () => {});

    /**
     * 게임 상태를 주기적으로 확인합니다
     */
    socket.on("watchDraftState", (cnt) => {
      // alert(cnt);
    });

    /**
     * 관전자가 몇명인지 확인합니다
     */
    socket.on("watchNowCnt", (cnt) => {
      setWatchTeamCnt(cnt);
    });

    /**
     * 밴픽 소켓통신을 제어합니다
     */
    socket.on("handlePick", (cloneCard, turnAdd) => {
      setTurn(turnAdd);
      setCard(cloneCard);
    });
  };

  const handlePick = ({ cKey, engName }) => {
    const cloneCard = { ...card };

    socket.emit("handlePick", {
      cloneCard,
      cKey,
      engName,
      turn,
      seq,
    });
  };

  useEffect(() => {
    getDraft();
  }, [getDraft]);

  /**
   * 라인 검색
   * @param {*} line
   */
  const handleSearchLine = (line) => {
    const resLine = searchLine === line ? "" : line;
    setSearchLine(resLine);
  };

  /**
   * 챔피언 텍스트 검색
   * @param {*} event
   */
  const handleSearchName = (event) => {
    setSearchName(event.target.value);
  };

  return (
    <DraftView
      draft={draft}
      champAll={champAll}
      gameStart={gameStart}
      searchLine={searchLine}
      searchName={searchName}
      card={card}
      watchTeamCnt={watchTeamCnt}
      second={second}
      handleSearchLine={handleSearchLine}
      handleSearchName={handleSearchName}
      handlePick={handlePick}
    />
  );
}

function StateToProps(state) {
  return {
    loginUser: state.loginUser,
  };
}

export default connect(StateToProps)(Draft);
