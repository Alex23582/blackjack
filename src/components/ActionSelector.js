import React from 'react'
import styles from './ActionSelector.module.css'

function ActionSelector({hit, stand}) {
    return (
        <div className={styles.main}>
            <button onClick={stand}>Stand</button>
            <button onClick={hit}>Hit</button>
        </div>
    )
}

export default ActionSelector