import axios from "axios";
import io from "socket.io-client";
import { connect } from "react-redux";
import queryString from "query-string";
import DraftView from "../../view/Draft/DarftView";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useCallback, useState, useRef } from "react";

function Draft(props) {
  const { seq, id } = useParams();
  const [draft, setDraft] = useState({});
  const [champAll, setChampAll] = useState([]);
  const [searchLine, setSearchLine] = useState("");
  const [searchName, setSearchName] = useState("");
  const [gameStart, setGameStart] = useState(true);
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
    document.addEventListener("beforeunload", () => {
      alert("?");
    });

    const myTeam = draftData.myTeam;
    const socket = io("http://localhost:8080");

    socket.emit("joinDraft", seq);

    socket.emit("watchDraftState", { seq, myTeam });

    socket.emit("startSecond", { seq, second });

    socket.on("startSecond", (changeSecond, team) => {
      const cloneSecond = { ...second };

      cloneSecond[team] = changeSecond;

      setSecond(cloneSecond);
    });

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
      console.log(cnt);
      setWatchTeamCnt(cnt);
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
      handleSearchLine={handleSearchLine}
      handleSearchName={handleSearchName}
      searchLine={searchLine}
      searchName={searchName}
      card={card}
      watchTeamCnt={watchTeamCnt}
      second={second}
    />
  );
}

function StateToProps(state) {
  return {
    loginUser: state.loginUser,
  };
}

export default connect(StateToProps)(Draft);
