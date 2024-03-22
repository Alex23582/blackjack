import styles from './Card.module.css'
import diamond from '../assets/symbols/diamond.svg'
import heart from '../assets/symbols/heart.svg'
import club from '../assets/symbols/club.svg'
import spade from '../assets/symbols/spade.svg'
import { useEffect, useRef, useState } from 'react'

function Row({ type, text, inverted = false }) {
    let symbol = diamond
    if (type === 1) {
        symbol = heart
    }
    if (type === 2) {
        symbol = club
    }
    if (type === 3) {
        symbol = spade
    }
    return <div className={`${styles.row} ${inverted ? styles.inverted : ""}`}>
        <p style={{ color: type < 2 ? "#FF5555" : "white" }}>{text}</p>
        <div style={{ backgroundImage: `url(${symbol})` }} className={styles.symbol} />
    </div>
}

function Card({ type, text, animateFrom, animateTo, onAnimationFinish, topAlign }) {
    const [thisBounds, setthisBounds] = useState()
    const thisRef = useRef()
    useEffect(() => {
        setthisBounds(thisRef.current.getBoundingClientRect())
        if (!onAnimationFinish) {
            return
        }
        const timeout = setTimeout(() => {
            onAnimationFinish()
        }, 300)
        return function () {
            clearTimeout(timeout)
        }
    }, [])
    return (
        <div style={animateFrom ? {
            left: animateFrom.left,
            top: animateFrom.top,
            transform: thisBounds && `translateX(${animateTo.left - animateFrom.left - thisBounds.width / 2 - 10}px) ${topAlign ? `translateY(${animateTo.top - animateFrom.top }px)` : `translateY(${animateTo.bottom - animateFrom.bottom }px)`}`
        } : {}}
            ref={thisRef}
            className={`${styles.main} ${animateFrom ? styles.absolute : ""}`}>
            <Row text={text} type={type} />
            <Row text={text} type={type} inverted={true} />
        </div>
    )
}

export default Card