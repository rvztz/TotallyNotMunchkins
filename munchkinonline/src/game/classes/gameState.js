export default class GameState {
    constructor(scene) {
        this.inPregame = true
        this.endGame = false
        this.currentTurn = ""
        this.cardDrawn = false
        this.inCombat = false
        this.wasInCombat = false
        
        this.endPregame = () => {
            this.inPregame = false
        }

        this.finishGame = () => {
            this.inPregame = true
            this.endGame = true
        }

        this.clearTurn = () => {
            this.cardDrawn = false
        }
        
        this.changeTurn = (socketId) => {
            this.clearTurn()
            this.currentTurn = socketId
        }

        this.drewCard = () => {
            this.cardDrawn = true
        }

        this.isYourTurn = () => {
            return this.currentTurn === scene.socket.id && !this.inPregame
        }

        this.startCombat = () => {
            this.inCombat = true
        }

        this.endCombat = () => {
            this.inCombat = false
            this.wasInCombat = true
        }
    }
}