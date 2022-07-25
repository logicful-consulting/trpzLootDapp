import '../styles/App.css';
import '../styles/claimbanner.css';
import React from "react";



const ClaimBanner = params => {
    return (
        <div className="claimbanner">
            <div className='claimbanner__title'>
                <p>{!params.bronzeBoxes ? 0 : params.bronzeBoxes} Bronze boxes</p>
                <p>{!params.silverBoxes ? 0 : params.silverBoxes} Silver boxes</p>
                <p>{!params.goldBoxes ? 0 : params.goldBoxes} Gold boxes</p>
                <button className='button'>Claim</button>
            </div>
		</div>
    )
}

export default ClaimBanner;