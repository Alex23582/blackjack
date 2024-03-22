import React from 'react'
import styles from './DealButton.module.css'

function DealButton ({onClick}) {
  return (
    <button onClick={onClick} className={styles.main}>DEAL</button>
  )
}

export default DealButton