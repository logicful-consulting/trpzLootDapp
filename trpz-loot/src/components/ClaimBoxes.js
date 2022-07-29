import "../styles/App.css";
import "../styles/stakebody.css";
import BoxIMG from './BoxTest.PNG';

const ClaimBoxes = (params) => {
  return (
    <div className="stakebody">
      <div className="stakebody__boxes">
        {params.bronzeBoxArray &&
          params.bronzeBoxArray.map((box, index) => {
            return (
              <>
                <div className="stakebody__box">
                  <img className="stakebody__boxImg" src={BoxIMG} alt="Bronze box"></img>
                  <div className="stakebody__boxText">
                    <p className="stakebody__bronzeRank">Bronze</p>
                    <p className='stakebody__boxTitle'>ID: {box}</p>
                    <div className="stakebody__boxButtons">
                      <button className="stakebody__boxButtonSingle"
                      onClick={() => params.claimLoot("bronze", box)}>
                        Claim
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )
          })}
        {params.silverBoxArray &&
          params.silverBoxArray.map((box, index) => {
            return (
              <>
                <div className="stakebody__box">
                  <img className="stakebody__boxImg" src={BoxIMG} alt="Silver box"></img>
                  <div className="stakebody__boxText">
                    <p className="stakebody__silverRank">Silver</p>
                    <p className='stakebody__boxTitle'>ID: {box}</p>
                    <div className="stakebody__boxButtons">
                      <button className="stakebody__boxButtonSingle"
                      onClick={() => params.claimLoot("silver", box)}>
                        Claim
                      </button>
                    </div>
                    <div className="stakebody__boxCheck">
                    </div>
                  </div>
                </div>
              </>
            )
          })}
        {params.goldBoxArray &&
          params.goldBoxArray.map((box, index) => {
            return (
              <>
                <div className="stakebody__box">
                  <img className="stakebody__boxImg" src={BoxIMG} alt="Gold box"></img>
                  <div className="stakebody__boxText">
                    <p className="stakebody__goldRank">Gold</p>
                    <p className='stakebody__boxTitle'>ID: {box}</p>
                    <div className="stakebody__boxButtons">
                      <button className="stakebody__boxButtonSingle"
                      onClick={() => params.claimLoot("gold", box)}>
                        Claim
                      </button>
                    </div>
                    <div className="stakebody__boxCheck">
                    </div>
                  </div>
                </div>
              </>
            );
          })}
      </div>
    </div>
  );
};

export default ClaimBoxes;
