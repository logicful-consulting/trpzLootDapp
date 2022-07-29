import '../styles/App.css';
import '../styles/stakestats.css';

const LootStats = params => {
    return (
        <div className="stakestats">
            <div className='stakestats__boxes'>
                <div className='stakestats__box'>
                <h2 className='stakestats__boxStat'>{!params.bronzeBoxes ? 0 : params.bronzeBoxes}</h2>
                    <p className='stakestats__boxTitle'>Bronze Boxes</p>
                </div>
                <div className='stakestats__box'>
                    <h2 className='stakestats__boxStat'>{params.silverBoxes >= 1 ? params.silverBoxes : 0}</h2>
                    <p className='stakestats__boxTitle'>Silver Boxes</p>
                </div>
                <div className='stakestats__box'>
                    <h2 className='stakestats__boxStat'>{!params.goldBoxes ? 0 : params.goldBoxes}</h2>
                    <p className='stakestats__boxTitle'>Gold Boxes</p>
                </div>
            </div>
		</div>
    )
}

export default LootStats;