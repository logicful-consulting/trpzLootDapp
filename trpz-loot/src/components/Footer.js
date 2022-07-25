import '../styles/App.css';
import '../styles/footer.css';
import Troopz from './Troopz.svg'



function Footer() {
    return (
        <div className="footer">
		<div className="footer__logo">
            <img className='footer__img' src={Troopz} alt=""></img>
		</div>
		</div>
    )
}

export default Footer;