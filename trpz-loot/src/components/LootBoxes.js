import "../styles/App.css";
import "../styles/lootboxes.css";
import React from "react";
import BoxIMG from "./BoxTest.PNG";
import Countdown from 'react-countdown';

const LootBoxes = (params) => {
  return (
    <div className="lootBoxes">
      <div className="lootBoxes__boxes">
        <div className="lootBoxes__boxContainer">
          <img
            className="lootBoxes__boxImage"
            src={BoxIMG}
            alt="bronzeBox"
          ></img>
          <div className="lootBoxes__box">
            <h1 className="lootBoxes__bronzeTitle">BRONZE</h1>
            <p>5000 $TRPZ</p>
            <p>{params.bronzeLeft}/200</p>
            <div className="lootBoxes__reward">
              <p>
                <strong>1 in 20 chance of STAR prize</strong>
              </p>
              <p>worth more than 500 CRO</p>
            </div>
            <button
              className="button"
              onClick={async function () {
                params.mintBronze();
              }}
            >
              MINT NOW
            </button>
            <div className="lootBoxes__timerBox">
              {params.bronzeTimerMinutes && (
                <h3>
                  Cooldown: {params.bronzeTimerMinutes}:{params.bronzeTimerSeconds}
                </h3>
              )}
            </div>
          </div>
        </div>
        <div className="lootBoxes__boxContainerCentre">
          <img
            className="lootBoxes__boxImage"
            src={BoxIMG}
            alt="silverBox"
          ></img>
          <div className="lootBoxes__box">
            <h1 className="lootBoxes__silverTitle">SILVER</h1>
            <p>5000 $TRPZ</p>
            <p>{params.silverLeft}/200</p>
            <div className="lootBoxes__reward">
              <p>
                <strong>1 in 10 chance of STAR prize</strong>
              </p>
              <p>worth more than 500 CRO</p>
            </div>
            <button
              className="button"
              onClick={async function () {
                params.mintSilver();
              }}
            >
              MINT NOW
            </button>
            <div className="lootBoxes__timerBox">
              {params.silverTimerMinutes && (
                <h3>
                  Cooldown: {params.silverTimerMinutes}:{params.silverTimerSeconds}
                </h3>
              )}
            </div>
          </div>
        </div>
        <div className="lootBoxes__boxContainer">
          <img className="lootBoxes__boxImage" src={BoxIMG} alt="goldBox"></img>
          <div className="lootBoxes__box">
            <h1 className="lootBoxes__goldTitle">GOLD</h1>
            <p>5000 $TRPZ</p>
            <p>{params.goldLeft}/200</p>
            <div className="lootBoxes__reward">
              <p>
                <strong>1 in 5 chance of STAR prize</strong>
              </p>
              <p>worth more than 500 CRO</p>
            </div>
            <button
              className="button"
              onClick={async function () {
                params.mintGold();
              }}
            >
              MINT NOW
            </button>
            <div className="lootBoxes__timerBox">
              {params.goldTimerMinutes && (
                <h3>
                  Cooldown: {params.goldTimerMinutes}:{params.goldTimerSeconds}
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LootBoxes;
