// BossFight.js
import React from 'react';

const BossFight = ({ bossState, handleBossAttack }) => {
    return (
        <div className="boss-fight">
            <div className="boss" style={{ width: bossState.width, height: bossState.height }}>
                <img src="path-to-boss-image" alt="Boss" />
                <p>Boss Health: {bossState.health}</p>
            </div>
            <button onClick={handleBossAttack}>Attack Boss</button>
        </div>
    );
};

export default BossFight;