import '../styles/App.css';
import '../styles/header.css';
import Troopz from './Troopz.svg'

const Header = params => {
    return (
        <div className="header">
		
		<div className="header__left">
            <img className='header__logo' src={Troopz} alt=""></img>
		</div>
        <div className="header__center">
            <p>STAKING</p>
            <p>LOOT</p>
		</div>
		<div className="header__button">
            {!params.walletAddress && 
            <button 
            className='button'
            onClick={async function () {
                params.connectWallet()
            }} >Connect</button>            
            }
            {params.walletAddress && 
            <button 
            className='button'
            >{params.walletAddress.substring(0,8) + "..."}</button>            
            }
		</div>
		</div>
    )
}

export default Header;