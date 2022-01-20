import { connect } from "react-redux";
import { useEffect, useCallback, useState } from "react";
import TextField from "@mui/material/TextField";
function Main() {
  const [blueName, setBlueName] = useState("");
  const [redName, setRedName] = useState("");
  const [matchName, setMatchName] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const changeInput = useCallback(() => {
    const lenth = blueName.length + redName.length + matchName.length;

    if (lenth > 0) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [blueName, redName, matchName]);

  useEffect(() => {
    changeInput();
  }, [changeInput]);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    alert("?");
  };

  return (
    <form className="create" onSubmit={handleFormSubmit.bind(this)}>
      <img
        src="http://prodraft.leagueoflegends.com/static/media/L.95b4d320.svg"
        alt="로고"
      />
      <div className="">
        <label For="blue_team_name">Blue team name</label>
        <input
          type="text"
          id="blue_team_name"
          onChange={(event) => setBlueName(event.target.value)}
          maxLength="30"
        />
        <label For="red_team_name">Red team name</label>
        <input
          type="text"
          id="red_team_name"
          maxLength="30"
          onChange={(event) => setRedName(event.target.value)}
        />
        <label For="match_name">Match name</label>
        <input
          type="text"
          id="match_name"
          maxLength="30"
          onChange={(event) => setMatchName(event.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={submitDisabled ? "disabled" : ""}
        className="confirm"
      >
        Confirm
      </button>
    </form>
  );
}

function ChangeToState(state) {
  return null;
}

export default connect(ChangeToState)(Main);
