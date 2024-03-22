import { forwardRef } from 'react'
import styles from './BetField.module.css'
import Chip from './Chip'

const BetField = forwardRef(({ chipvalue }, ref) => {
    return <div ref={ref} className={styles.main}>
        {chipvalue <= 0 &&
            <div>
                PLACE<br />YOUR<br />BET
            </div>
        }
        {chipvalue > 0 && <Chip value={chipvalue} />}
    </div>
})

export default BetField