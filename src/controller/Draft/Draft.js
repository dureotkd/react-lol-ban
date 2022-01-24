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
  const [card, setCard] = useState({
    red: {
      pick: {},
      ban: {},
    },
    blue: {
      pick: {},
      ban: {},
    },
  });

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

  const setSocket = () => {
    const socket = io("http://localhost:8080");

    socket.emit("joinDraft", { seq, id });

    socket.on("joinDraft", () => {
      alert("join Here!");
    });
  };

  const getDraft = useCallback(async () => {
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

  useEffect(() => {
    getDraft();
  }, [getDraft]);

  useEffect(() => {
    setBaseDraftCard();
    setSocket();
  }, []);

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
    />
  );
}

function StateToProps(state) {
  return {
    loginUser: state.loginUser,
  };
}

export default connect(StateToProps)(Draft);
