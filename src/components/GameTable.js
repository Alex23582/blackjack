import React, { useEffect, useRef, useState } from 'react'
import Card from './Card';
import TextCard from './TextCard';
import BetSelector from './BetSelector';
import styles from './GameTable.module.css'
import ActionSelector from './ActionSelector';

function getRandomCard() {
    const types = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

    return {
        text: types[Math.floor(Math.random() * types.length)],
        type: Math.floor(Math.random() * 4)
    }
}

/*
PLAYER = 0
DEALER = 1
 */

function GameTable() {
    const [bet, setbet] = useState(0)
    const [balance, setbalance] = useState(1000)
    const [gameStarted, setgameStarted] = useState(false)
    const [playerCards, setplayerCards] = useState([])
    const [dealerCards, setdealerCards] = useState([])
    const [lastWinner, setlastWinner] = useState()
    const [deckLocation, setdeckLocation] = useState()
    const playerStands = useRef(false)
    const [actionsBlocked, setactionsBlocked] = useState(false)
    const [playerCardsLocation, setplayerCardsLocation] = useState()
    const [dealerCardsLocation, setdealerCardsLocation] = useState()
    const [currentMovingCard, setcurrentMovingCard] = useState()
    const [hiddenMovingCardActive, sethiddenMovingCardActive] = useState(false)
    const [currentMovingReceiver, setcurrentMovingReceiver] = useState(0)
    const [movingCardCounterTEMP, setmovingCardCounterTEMP] = useState(0)
    const deckCard = useRef()
    const dealerCardsContainer = useRef()
    const playerCardsContainer = useRef()

    function startGame() {
        setlastWinner(null)
        setgameStarted(true)
        setcurrentMovingReceiver(0)
        setcurrentMovingCard(getRandomCard())
    }

    function updateLocations() {
        setdeckLocation(deckCard.current.getBoundingClientRect())
        setplayerCardsLocation(playerCardsContainer.current.getBoundingClientRect())
        setdealerCardsLocation(dealerCardsContainer.current.getBoundingClientRect())
    }

    function animationFinish() {
        if (currentMovingReceiver == 0) {
            setplayerCards([currentMovingCard, ...playerCards])
        }
        if (currentMovingReceiver == 1) {
            setdealerCards([currentMovingCard, ...dealerCards])
        }
        setmovingCardCounterTEMP((old) => old + 1)
        setcurrentMovingCard(null)
    }

    function addCard(receiver, hidden = false) {
        if (receiver == 1 && playerStands.current) {
            let hiddenCardFlipped = false
            let newCards = dealerCards.map((card) => {
                if (card.hidden) {
                    card.hidden = false
                    hiddenCardFlipped = true
                }
                return card
            })
            if (hiddenCardFlipped) {
                setTimeout(() => {
                    setdealerCards(newCards)
                }, 500);
                return
            }
        }
        setcurrentMovingReceiver(receiver)
        let newCard = getRandomCard()
        newCard.hidden = hidden
        setcurrentMovingCard(newCard)
    }

    function gameLoop() {
        if (!gameStarted) {
            return
        }
        if (playerCards.length == 1 && dealerCards.length == 0) {
            addCard(1)
            return
        }
        if (playerCards.length == 1 && dealerCards.length == 1) {
            addCard(0)
            return
        }
        if (playerCards.length == 2 && dealerCards.length == 1) {
            sethiddenMovingCardActive(true)
            return
        }
        if(getValueOfCards(playerCards) > 21){
            dealerWon()
            return
        }
        if(getValueOfCards(playerCards) == 21 && !playerStands.current){
            stand()
            return
        }
        if(getValueOfCards(dealerCards) > 21){
            playerWon()
            return
        }
        if (playerStands.current && getValueOfCards(dealerCards) < 17) {
            addCard(1)
        }
        if (playerStands.current && getValueOfCards(dealerCards) > 16) {
            let playerValue = getValueOfCards(playerCards)
            let dealerValue = getValueOfCards(dealerCards)
            if (playerValue > dealerValue) {
                playerWon()
            }
            if (playerValue < dealerValue) {
                dealerWon()
            }
            if (playerValue == dealerValue) {
                setlastWinner("Push")
                endGame()
            }
            
        }
    }

    function playerWon(){
        setlastWinner("Player won")
        setbalance(balance + bet)
        endGame()
    }

    function dealerWon(){
        setactionsBlocked(true)
        setlastWinner("Dealer won")
        setbalance(balance - bet)
        endGame()
    }

    function endGame(){
        setTimeout(() => {
            setbet(0)
            setgameStarted(false)
            setdealerCards([])
            setplayerCards([])
            setactionsBlocked(false)
            playerStands.current = false
        }, 1700);
    }

    function hiddenCardAnimationFinish() {
        sethiddenMovingCardActive(false)
        let card = getRandomCard()
        card.hidden = true;
        setdealerCards([...dealerCards, card])
    }

    useEffect(() => {
        gameLoop()
    }, [playerCards, dealerCards])


    useEffect(() => {
        updateLocations()
    }, [currentMovingCard])

    function getValueOfCards(cards) {
        let value = 0;
        let aces = 0;
        for (let card of cards) {
            if (card.hidden) {
                continue
            }
            if (card.text === "A") {
                aces++
                continue
            }
            let parsedInt = parseInt(card.text)
            if (parsedInt) {
                value += parsedInt
                continue
            }
            value += 10
        }
        for (let i = aces; i > 0; i--) {
            if (value <= 10) {
                value += 11
            } else {
                value += 1
            }
        }
        return value
    }

    function hit() {
        addCard(0)
    }

    function stand() {
        playerStands.current = true
        setactionsBlocked(true)
        gameLoop()
    }


    return (
        <>
            {currentMovingCard && <Card key={movingCardCounterTEMP} topAlign={currentMovingReceiver == 1} onAnimationFinish={animationFinish} animateFrom={deckLocation} animateTo={currentMovingReceiver == 0 ? playerCardsLocation : dealerCardsLocation} text={currentMovingCard.text} type={currentMovingCard.type} />}
            {hiddenMovingCardActive && <TextCard text="CARD" onAnimationFinish={hiddenCardAnimationFinish} animateFrom={deckLocation} animateTo={dealerCardsLocation} />}
            <div className={styles.toprowcontainer}>
                <div className={styles.toprow}>
                    <div ref={dealerCardsContainer} style={currentMovingCard && currentMovingReceiver == 1 && playerCards.length > 0 ? {
                        transform: `translateX(${(deckLocation.width / 2) + 10}px)`
                    } : hiddenMovingCardActive ? {
                        transform: `translateX(${-(deckLocation.width / 2) - 10}px)`
                    } : {
                        transition: "0s"
                    }} className={styles.dealercards}>
                        {gameStarted && dealerCards.map((card, i) => {
                            if (card.hidden) {
                                return <TextCard key={i} text="CARD" />
                            }
                            return <Card key={i} text={card.text} type={card.type} />
                        })}
                    </div>
                    <TextCard className={styles.deckcard} ref={deckCard} text="DECK" />
                </div>
                {dealerCards.length > 0 && <p className={styles.cardsValue}>{getValueOfCards(dealerCards)}</p>}
            </div>
            <div className={styles.bottomrow}>
                {lastWinner && <p style={{userSelect: "none"}}>{lastWinner}</p>}
                {playerCards.length > 0 && <p className={styles.cardsValue}>{getValueOfCards(playerCards)}</p>}
                <div ref={playerCardsContainer} key={movingCardCounterTEMP + "a"} style={currentMovingCard && currentMovingReceiver == 0 && playerCards.length > 0 ? {
                    transform: `translateX(${(deckLocation.width / 2) + 10}px)`
                } : {}} className={styles.dealercards}>
                    {gameStarted && playerCards.map((card, i) => {
                        return <Card key={i} text={card.text} type={card.type} />
                    })}
                </div>
                {!gameStarted && <BetSelector bet={bet} setbet={setbet} startGame={startGame} />}
                {!gameStarted && <p style={{userSelect: "none"}}>Balance: {balance}</p>}
                {gameStarted && !actionsBlocked && <ActionSelector hit={hit} stand={stand} />}
                
            </div>
        </>
    )
}

export default GameTable