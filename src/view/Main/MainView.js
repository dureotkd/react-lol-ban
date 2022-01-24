import "../../assets/default/default.css";


export default function MainView(props) {
  if (props.setting) {
    return (
      <div className="create">
        <img
          src="http://prodraft.leagueoflegends.com/static/media/L.95b4d320.svg"
          alt="로고"
        />
        <label For="blue_team_name">Blue Team Link</label>
        <input
          type="text"
          id="blue_team_name"
          readonly
          value={`localhost:3000/Draft/${props.draftSeq}/${props.blueEnName}`}
        />
        <label For="red_team_name">Red Team Link</label>
        <input
          type="text"
          id="red_team_name"
          readonly
          value={`localhost:3000/Draft/${props.draftSeq}/${props.redEnName}`}
        />
      </div>
    );
  }

  return (
    <form className="create" onSubmit={props.handleFormSubmit.bind(this)}>
      <img
        src="http://prodraft.leagueoflegends.com/static/media/L.95b4d320.svg"
        alt="로고"
      />
      <div>
        <label For="blue_team_name">Blue team name</label>
        <input
          type="text"
          id="blue_team_name"
          ref={props.firstInputRef}
          onChange={(event) => props.setBlueName(event.target.value)}
          maxLength="30"
        />
        <label For="red_team_name">Red team name</label>
        <input
          type="text"
          id="red_team_name"
          maxLength="30"
          onChange={(event) => props.setRedName(event.target.value)}
        />
        <label For="match_name">Match name</label>
        <input
          type="text"
          id="match_name"
          maxLength="30"
          onChange={(event) => props.setMatchName(event.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={props.submitDisabled ? "disabled" : ""}
        className="confirm"
      >
        Confirm
      </button>
    </form>
  );
}
