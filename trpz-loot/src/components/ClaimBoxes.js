import "../styles/App.css";
import "../styles/stakebody.css";

const ClaimBoxes = (params) => {
  return (
    <div className="stakebody">
      <div className="stakebody__boxes">
        {params.bronzeBoxes && (
          <div className="stakebody__box">
            <img className="stakebody__boxImg" src="" alt=""></img>
            <div className="stakebody__boxText">
              <p className="stakebody__bronzeRank">Bronze</p>
              <div className="stakebody__boxButtons">
                <button className="stakebody__boxButtonSingle">Claim</button>
              </div>
              <div className="stakebody__boxCheck">
                <input className="stakebody__checkBox" type="checkbox"></input>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimBoxes;
