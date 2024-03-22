import React, { useCallback, useEffect, useRef, useState } from 'react'
import BetField from './BetField'
import Chip from './Chip'
import styles from './BetSelector.module.css'
import DealButton from './DealButton'

function BetSelector({startGame, bet, setbet}) {
    const [betsFieldBounds, setbetsFieldBounds] = useState()
    const thisComponent = useRef()

    function increaseBet(value){
        setbet((oldvalue) => {
            return oldvalue + value
        })
    }

    return (
        <div onClick={()=>{setbetsFieldBounds(thisComponent.current.getBoundingClientRect());}} className={styles.container}>
            {bet > 0 && <DealButton onClick={startGame} />}
            <BetField chipvalue={bet} ref={thisComponent} />
            <div className={styles.chipscontainer}>
                <Chip increaseBet={increaseBet} clickable={true} animateTo={betsFieldBounds} value={1} />
                <Chip increaseBet={increaseBet} clickable={true} animateTo={betsFieldBounds} value={5} />
                <Chip increaseBet={increaseBet} clickable={true} animateTo={betsFieldBounds} value={25} />
                <Chip increaseBet={increaseBet} clickable={true} animateTo={betsFieldBounds} value={100} />
            </div>
        </div>
    )
}

export default BetSelector