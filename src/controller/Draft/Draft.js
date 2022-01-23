import axios from "axios";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useCallback, useState, useRef } from "react";
import queryString from "query-string";
import DraftView from "../../view/Draft/DarftView";

function Draft(props) {
  const { seq, id } = useParams();
  const [draft, setDraft] = useState({});
  const [champAll, setChampAll] = useState([]);
  const [searchLine, setSearchLine] = useState("");
  const [searchName, setSeachName] = useState("");
  const [gameStart, setGameStart] = useState(true);

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

  const handleSearchLine = (line) => {
    const resLine = searchLine === line ? "" : line;
    setSearchLine(resLine);
  };

  return (
    <DraftView
      draft={draft}
      champAll={champAll}
      searchLine={searchLine}
      gameStart={gameStart}
      handleSearchLine={handleSearchLine}
    />
  );
}

function StateToProps(state) {
  return {
    loginUser: state.loginUser,
  };
}

export default connect(StateToProps)(Draft);
