import { createContext, useState, ReactNode, useEffect } from 'react'
import Cookie from 'js-cookie'
import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/LevelUpModal';

interface Challange {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}


interface ChallengesContextData {
    level: number; 
    currentExperience: number; 
    challengesCompleted: number;
    levelUp: () => void;
    startNewChallenge: () =>void;
    activeChallenge: Challange;
    resetChallenge: () => void;
    experienceToNextLevel: number;
    completeChallenge: () => void;
    closeLevelUpModal: () => void;
}

interface ChallengesProviderProps {
    children: ReactNode;
    level: number;
    currentExperience: number
    challengesCompleted: number
}


export const ChallegesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children, ...rest }:ChallengesProviderProps) {
    // se não existir valor na variável "rest" use 1
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0)
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0)

    const [ activeChallenge, setActiveChallenge ] = useState(null)
    const [ isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)

    const experienceToNextLevel = Math.pow((level +1) * 4, 2)

    // array vazio como segundo parâmetro significa que esse efeito será executado uma unica vez quando for exebido em tela
    useEffect(()=>{
       // essa função é do próprio brownser e é usada para pedir permissão ao usuário 
       Notification.requestPermission() 
    }, [])

    // salvando aplicações no cookie
    useEffect(()=>{
        Cookie.set('level', String(level));
        Cookie.set('currentExperience', String(currentExperience));
        Cookie.set('challengesCompleted', String(challengesCompleted));
    },[level, currentExperience, challengesCompleted])


    function levelUp(){
        setLevel(level + 1)
        setIsLevelUpModalOpen(true)
    }

    function closeLevelUpModal(){
        setIsLevelUpModalOpen(false)
    }

    function startNewChallenge(){
        // aqui insiro na car random um valor aleatório entre 0 e o tamanho do rarray de challenges. Uso o floor para arredondar para baixo
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex]

        setActiveChallenge(challenge)

        new Audio('/notification.mp3').play()

        // se permissão tiver sido aceita
        if(Notification.permission === 'granted'){
            new Notification('Novo Desafio!!!', {
                body: `Valendo ${challenge.amount}xp`
            })
        }

    }

    function resetChallenge(){
        setActiveChallenge(null)
    }

    function completeChallenge() {
        if(!activeChallenge) {
            return;
        }

        const { amount } = activeChallenge

        let finalExperience = currentExperience + amount

        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel
            levelUp();
        }

        setCurrentExperience(finalExperience)
        setActiveChallenge(null)
        setChallengesCompleted(challengesCompleted + 1)
    }


    return (
        <ChallegesContext.Provider 
            value={{ 
                level, 
                currentExperience, 
                challengesCompleted,
                levelUp,
                startNewChallenge,
                activeChallenge,
                resetChallenge,
                experienceToNextLevel,
                completeChallenge,
                closeLevelUpModal 
        }}>
            {children}
            {/* Se o isLevelUpModalOpen for true o modal se abrirá */}
            { isLevelUpModalOpen && <LevelUpModal />}
        </ChallegesContext.Provider>
    )
}
