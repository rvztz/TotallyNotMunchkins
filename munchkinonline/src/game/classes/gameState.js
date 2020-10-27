export default class GameState {
    constructor() {
        this.inPregame = true
        this.currentTurn = ""
        this.cardDrawn = false
        
        this.endPregame = () => {
            this.inPregame = false
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
    }
}