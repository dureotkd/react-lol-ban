import axios from "axios";
import { connect } from "react-redux";
import { useEffect, useCallback, useState, useRef } from "react";
import MainView from "../../view/Main/MainView";

function Main() {
  const [blueName, setBlueName] = useState("");
  const [redName, setRedName] = useState("");
  const [matchName, setMatchName] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const firstInputRef = useRef();

  const changeInput = useCallback(() => {
    const lenth = blueName.length + redName.length + matchName.length;

    if (lenth > 0) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [blueName, redName, matchName]);

  useEffect(() => {
    firstInputRef.current.focus();
  }, []);

  useEffect(() => {
    changeInput();
  }, [changeInput]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    await axios({
      method: "patch",
      url: "http://localhost:8080/api/games",
      params: {
        blueName,
        redName,
        matchName,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {})
      .then(() => {
        console.log("[Main] handleFormSubmit");
      });
  };

  return (
    <MainView
      setBlueName={setBlueName}
      setRedName={setRedName}
      setMatchName={setMatchName}
      submitDisabled={submitDisabled}
      handleFormSubmit={handleFormSubmit}
      firstInputRef={firstInputRef}
    />
  );
}

function StateToProps(state) {
  return {
    loginUser: state.loginUser,
  };
}

export default connect(StateToProps)(Main);
