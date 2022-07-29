import '../styles/App.css';
import '../styles/lootboxes.css';
import React from "react";
import BoxIMG from './BoxTest.PNG';


const LootBoxes = params => {
    return (
        <div className="lootBoxes">
            <div className='lootBoxes__boxes'>
                <div className='lootBoxes__boxContainer'>
                <img className='lootBoxes__boxImage' src={BoxIMG} alt="bronzeBox"></img>
                    <div className='lootBoxes__box'>
                        <h1 className='lootBoxes__bronzeTitle'>BRONZE</h1>
                        <p>72/200 LEFT</p>
                        <p>5000 $ TRPZ</p>
                        <button className='button' onClick={async function () {
                            params.mintBronze()
                        }}
                        >MINT NOW</button>
                        <p>{params.remainingTime.minutes}:{params.remainingTime.seconds}</p>
                    </div>
                </div>
                <div className='lootBoxes__boxContainerCentre'>
                <img className='lootBoxes__boxImage' src={BoxIMG} alt="silverBox"></img>
                    <div className='lootBoxes__box'>
                        <h1 className='lootBoxes__silverTitle'>SILVER</h1>
                        <p>72/200 LEFT</p>
                        <p>5000 $ TRPZ</p>
                        <button className='button' onClick={async function () {
                            params.mintSilver()
                        }}>MINT NOW</button>
                    </div>
                </div>
                <div className='lootBoxes__boxContainer'>
                <img className='lootBoxes__boxImage' src={BoxIMG} alt="goldBox"></img>
                    <div className='lootBoxes__box'>
                        <h1 className='lootBoxes__goldTitle'>GOLD</h1>
                        <p>72/200 LEFT</p>
                        <p>5000 $ TRPZ</p>
                        <button className='button' onClick={async function () {
                            params.mintGold()
                        }}>MINT NOW</button>
                    </div>
                </div>
            </div>
		</div>
    )
}

export default LootBoxes;