import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Chip.module.css'

function Chip({ clickable, value, animateFrom, animateTo, onAnimationFinish, increaseBet }) {
    const [inAnimation, setinAnimation] = useState(false)
    const [keyCounter, setkeyCounter] = useState(0)
    const [thisBounds, setthisBounds] = useState()
    const thisRef = useRef()
    let color = "#D9D9D9"
    if (value >= 5) {
        color = "#CB6D6D"
    }
    if (value >= 25) {
        color = "#85CB6D"
    }
    if (value >= 100) {
        color = "#000000"
    }

    useEffect(() => {
        if (!onAnimationFinish) {
            return
        }
        setthisBounds(thisRef.current.getBoundingClientRect())
        const timeout = setTimeout(() => {
            onAnimationFinish()
        }, 200)
        return function () {
            clearTimeout(timeout)
        }
    }, [])


    function click() {
        if (animateFrom || !clickable) {
            return
        }
        setthisBounds(thisRef.current.getBoundingClientRect())
        if(inAnimation){
            increaseBet(value)
            setkeyCounter((old) => old+1)
        }
        setinAnimation(true)
        
    }

    function childAnimationFinished() {
        setinAnimation(false)
        increaseBet(value)
    }

    return (
        <>
            <div
                onClick={click}
                ref={thisRef}
                className={`${styles.container} ${animateFrom ? styles.absoluteContainer : ""}`}
                style={animateFrom ? {
                    left: animateFrom.left,
                    top: animateFrom.top,
                    transform: thisBounds && `translateX(${animateTo.left - animateFrom.left - thisBounds.width / 2 + animateTo.width / 2}px) translateY(${animateTo.top - animateFrom.top - thisBounds.height / 2 + animateTo.height / 2}px)`
                } : {}}
            >
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_427_29)">
                        <rect width="60" height="60" rx="30" fill="#747474" />
                        <path d="M0.396947 25H59.6082C60.1084 29 60.1183 31 59.6181 35H0.387252C-0.11268 31 -0.103053 29 0.396947 25Z" fill={color} />
                        <path d="M25.0029 59.6057L25.0029 0.394497C29.0029 -0.105728 31.0029 -0.115604 35.0029 0.384621V59.6154C31.0029 60.1154 29.0029 60.1057 25.0029 59.6057Z" fill={color} />
                        <path d="M5.53276 47.3989L47.4014 5.53021C50.5836 8.00493 52.0048 9.41216 54.4795 12.5943L12.597 54.4768C9.41504 52.0019 8.00763 50.5809 5.53276 47.3989Z" fill={color} />
                        <path d="M47.4018 54.4699L5.53314 12.6013C8.00786 9.41912 9.41509 7.99792 12.5972 5.5232L54.4797 47.4057C52.0048 50.5876 50.5838 51.9951 47.4018 54.4699Z" fill={color} />
                        <rect x="7" y="7" width="46" height="46" rx="23" fill="#747474" />
                    </g>
                    <defs>
                        <clipPath id="clip0_427_29">
                            <rect width="60" height="60" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
                <p className={styles.valuetext}>{value}</p>
            </div>
            {inAnimation && <Chip value={value} animateFrom={thisBounds} animateTo={animateTo} onAnimationFinish={childAnimationFinished} key={keyCounter} />}
        </>
    )
}

export default Chip