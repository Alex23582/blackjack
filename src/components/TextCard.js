import { forwardRef, useEffect, useRef, useState } from 'react'
import styles from './TextCard.module.css'

const TextCard = forwardRef(({ text, className, animateFrom, animateTo, onAnimationFinish }, ref) => {
  const [thisBounds, setthisBounds] = useState()
  const localRef = useRef()

  useEffect(() => {
    if (!animateFrom || !localRef) {
      return
    }
    setthisBounds(localRef.current.getBoundingClientRect())
    const timeout = setTimeout(() => {
      onAnimationFinish()
    }, 300)
    return function () {
      clearTimeout(timeout)
    }
  }, [ref])

  return (
    <div
      ref={animateFrom ? localRef : ref}
      className={`${styles.main} ${className} ${animateFrom ? styles.absoultemain : ""}`}
      style={animateFrom ? {
        left: animateFrom.left,
        top: animateFrom.top,
        transform: thisBounds && `translateX(${animateTo.right - animateFrom.right + thisBounds.width / 2 + 10}px) translateY(${animateTo.top - animateFrom.top}px)`
      } : {}}
    >
      <p>{text}</p>
    </div>
  )
})

export default TextCard