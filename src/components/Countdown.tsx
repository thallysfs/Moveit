import { useState, useEffect, useContext } from 'react'
import { ChallegesContext } from '../contexts/ChallengesContext';
import { CountdownContext } from '../contexts/CountdownContext';
import styles from '../styles/components/Countdown.module.css'


export function Countdown() {
    const { 
        minutes,
        seconds, 
        hasFinished, 
        isActive,
        startCountdown,
        resetCountdown
    } = useContext(CountdownContext)

    const [minuteLeft, minuteRigth] = String(minutes).padStart(2, '0').split('')
    const [secondsLeft, secondsRigth] = String(seconds).padStart(2, '0').split('')


    return(
    <div>
        <div className={styles.countdownContainer}>
            <div>
                <span>{minuteLeft}</span>
                <span>{minuteRigth}</span>
            </div>
            <span className={styles.spanDoisPontos}>:</span>
            <div className={styles.countdownContainer}>
                <span>{secondsLeft}</span>
                <span>{secondsRigth}</span>
            </div>
        </div>

        {/* && if ternário sem else */}
        { hasFinished ? (
            <button
                disabled 
                className={styles.startCountdownButton}
            >
                Ciclo Encerrado
            </button>  
        ) : (

            <>
                { isActive ? (
                <button 
                    type="button" 
                    className={`${styles.startCountdownButton} ${styles.startCountdownButtonActive}`}
                    onClick={resetCountdown}
                >
                    Abandonar ciclo
                </button>  
                ) : (
                <button 
                    type="button" 
                    className={styles.startCountdownButton}
                    onClick={startCountdown}
                >
                    Iniciar um ciclo
                </button> 
            )}
            </>
        )
            
        }

    </div>  
    )
}
