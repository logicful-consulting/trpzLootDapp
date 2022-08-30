import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import "../styles/App.css";
import "../styles/stakebody.css";
import BoxIMG from "./BoxTest.PNG";

// local
// export const LOOT_API_URL = "http://localhost:3001/redeem";
// stg
export const LOOT_API_URL = "https://trpz-loot-api-stg.herokuapp.com/redeem";
// prd
// export const LOOT_API_URL = "https://trpz-loot-api-prd.herokuapp.com/redeem";

export const GOOGLE_FORM_URL = "https://google.com";

const Box = ({ boxType, box, claimLoot, walletAddress }) => {
  const [loading, setLoading] = useState(true);
  const [loot, setLoot] = useState({});
  const displayBoxType = boxType[0].toUpperCase() + boxType.substring(1);

  useEffect(() => {
    setLoading(true);
    fetch(
      `${LOOT_API_URL}?tokenId=${box}&boxType=${boxType}&address=${walletAddress}`
    ).then(async (res) => {
      const body = await res.json();
      setLoading(false);
      setLoot(body);
    });
  }, []);

  const content = loot?.id ? (
    <>
      <p className="stakebody__boxContentText">
        Your loot is <strong>{loot.prize_name}</strong>.
      </p>
      {!!loot.irl ? (
        <p className="stakebody__boxContentText">
          Fill in{" "}
          <a
            className="stakebody__boxContentLink"
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noreferrer"
          >
            this form
          </a>{" "}
          to ensure you receive your loot. Your unique loot ID is{" "}
          <strong>{loot.id}</strong>.
        </p>
      ) : (
        <p className="stakebody__boxContentText">
          Please allow 72 hours to receive your loot.
        </p>
      )}
    </>
  ) : (
    <button
      disabled={loading}
      className="stakebody__boxButtonSingle"
      onClick={async () => {
        setLoading(true);
        const loot = await claimLoot(boxType, box, walletAddress);
        setLoot(loot);
        setLoading(false);
      }}
    >
      Claim
    </button>
  );

  return (
    <div className="stakebody__box">
      <img
        className="stakebody__boxImg"
        src={loot?.image_url || BoxIMG}
        alt={`${displayBoxType} box`}
      ></img>
      <div className="stakebody__boxText">
        <p className={`stakebody__${boxType}Rank`}>{displayBoxType}</p>
        <p className="stakebody__boxTitle">ID: {box}</p>
        {loading ? (
          <ClipLoader
            color={"#D0021B"}
            loading={loading}
            css={{ display: "block", margin: "10px auto" }}
            size={20}
          />
        ) : (
          <div className="stakebody__boxContent">{content}</div>
        )}
      </div>
    </div>
  );
};

const ClaimBoxes = (params) => {
  return (
    <div className="stakebody">
      <div className="stakebody__boxes">
        {params.bronzeBoxArray &&
          params.bronzeBoxArray.map((box, index) => {
            return (
              <Box
                key={index}
                walletAddress={params.walletAddress}
                claimLoot={params.claimLoot}
                box={box}
                boxType="bronze"
              />
            );
          })}
        {params.silverBoxArray &&
          params.silverBoxArray.map((box, index) => {
            return (
              <Box
                key={index}
                walletAddress={params.walletAddress}
                claimLoot={params.claimLoot}
                box={box}
                boxType="silver"
              />
            );
          })}
        {params.goldBoxArray &&
          params.goldBoxArray.map((box, index) => {
            return (
              <Box
                key={index}
                walletAddress={params.walletAddress}
                claimLoot={params.claimLoot}
                box={box}
                boxType="gold"
              />
            );
          })}
      </div>
    </div>
  );
};

export default ClaimBoxes;
