import '../styles/App.css';
import '../styles/stakebanner.css';
import React from "react";



const StakeBanner = params => {
    return (
        <div className="stakebanner">
            <div className='stakebanner__title'>
                <p className='stakebanner__loot'>Loot Boxes: {!params.lootBalance ? 0 : params.lootBalance}</p>
                <p>TRPZ Balance: {!params.trpzBalance ? 0 : params.trpzBalance}</p>

            </div>
		</div>
    )
}

export default StakeBanner;