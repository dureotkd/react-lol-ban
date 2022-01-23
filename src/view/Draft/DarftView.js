import { ad, jg, mid, sup, top, drafMode } from "../../assets";
import * as DraftCss from "../../assets/draft/draft.css";
import { empty, wait, champKorName } from "../../helper/default";

export default function DraftView(props) {
  const searchLineVo = [
    {
      img: top,
      key: "top",
      alt: " 탑 이미지",
    },
    {
      img: jg,
      key: "jg",
      alt: " 정글 이미지",
    },
    {
      img: mid,
      key: "mid",
      alt: " 미드 이미지",
    },
    {
      img: ad,
      key: "ad",
      alt: " 원딜 이미지",
    },
    {
      img: sup,
      key: "sup",
      alt: " 서포터 이미지",
    },
  ];

  return (
    <div className="Contents">
      <div className="competion">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="team-wrap">
            <h1 style={{ fontSize: 23, marginLeft: 12 }}>
              {props.draft.blueName}
            </h1>
            <div className="team-img">
              <span id="blue-second">BLUE SECOND</span>
            </div>
          </div>
          <div className="team-wrap">
            <div className="team-img red-team">
              <span id="red-second">RED SECOND</span>
            </div>
            <h1 style={{ fontSize: 23, marginRight: 12 }}>
              {props.draft.redName}
            </h1>
          </div>
        </div>
      </div>
      <div
        style={{
          transition: "all.3s",
          opacity: props.gameStart ? 1 : 0,
          display: props.gameStart ? "block" : "none",
        }}
      >
        {/* <PickCard champPicks={picks} /> */}
        {/* <BenCard champBens={bens} /> */}
      </div>
      <div
        style={{
          opacity: props.gameStart ? 0 : 1,
          display: props.gameStart ? "none" : "flex",
          height: "464px",
          marginBottom: "20px",
          background: "#000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>잠시만 기다려주세요</p>
      </div>
      {/* <Chat handleSendMsg={handleSendMsg} chatScrollRef={chatScrollRef} /> */}
      <div className="champion-box">
        <div className="search-box">
          <div className="line-box">
            {searchLineVo.map((line, idx) => {
              return (
                <div
                  key={line.key}
                  className={`line-wrap ${
                    props.searchLine === line.key ? "active-line" : ""
                  }`}
                >
                  <img
                    key={idx}
                    onClick={props.handleSearchLine.bind(this, line.key)}
                    className={`line-icon`}
                    src={line.img}
                    alt={line.alt}
                  />
                </div>
              );
            })}
          </div>
          <input
            type="text"
            placeholder="챔피언 검색"
            // onChange={debounce(handleSearchName, 200)}
          />
        </div>

        {props.champAll
          .filter((val) => {
            // 챔피언명 검색이 없을시
            if (empty(props.searchName)) return val;
            // 챔피언명 검색시 (startsWith 앞글자 동일여부로  true : false 여부 반환)
            else if (val.korName.startsWith(props.searchName)) return val;
            else return true;
          })
          .map(({ cKey, line, seq, engName }) => {
            // 라인검색
            if (!empty(props.searchLine) && props.searchLine !== line)
              return true;

            return (
              <div
                className="champion"
                key={cKey}
                // onClick={handlePick.bind(this, { cKey, engName })}
              >
                <img
                  className="champion-icon"
                  alt="롤 챔피언 아이콘"
                  // style={{
                  //   opacity: disabled ? "0.3" : null,
                  // }}
                  src={`https://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/${engName}.png`}
                />
                <div style={{ marginBottom: 20, marginTop: 3 }}>
                  <p style={{ color: "white" }}>{champKorName(cKey)}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
