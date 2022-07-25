import '../styles/App.css';
import '../styles/lootOptions.css';
import React from "react";



const StakeOptions = params => {
    return (
        <div className="stakeOptions">
            <div className='stakeOptions__box'>
                <div className='stakeOptions__contentBox'>
                    <h3>What is Troop Loot?</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et</p>
                    <button className='button'>To FAQ</button>
                </div>
                <div className='stakeOptions__contentBox'>
                    <h3>How do I stake?</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et</p>
                    <button className='button'>To Staking</button>
                </div>
                <div className='stakeOptions__contentBox'>
                    <h3>How do I get a Troopr?</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et</p>
                    <button className='button'>To Ebisu Bay</button>
                </div>
            </div>
		</div>
    )
}

export default StakeOptions;