import OpponentHand from '../classes/opponentHand'
import Token from '../classes/token'

export default class Opponent {
    constructor (scene, position, socketId, gender) {
        this.opponentHand = new OpponentHand(scene, position, socketId)
        this.token = new Token(scene)
        this.color = null

        // Data
        this.position = position
        this.socketId = socketId
        this.gender = gender
        this.level = 1 
        this.power = 1
         
        // Renders
        this.renderHand = (cardWidth, cardHeight) => {
            if (this.position === 'right') {
                this.opponentHand.render(1090, 110, 106, 336, cardWidth, cardHeight)
            } else if (this.position === 'left') {
                this.opponentHand.render(83, 110, 106, 336, cardWidth, cardHeight)
            } else if (this.position === 'top') {
                this.opponentHand.render(426, 2, 336, 108, cardWidth, cardHeight)
            } else {
                console.log("Invalid position to render oppponent hand")
            }
        }

        this.renderToken = (startTile, index, sprite) => {
            this.token.render(startTile, index, /*isPlayerToken */ false, sprite + '-' + this.gender)
        }

        this.moveToken = (x, y) => {
            this.token.renderedToken.x = x
            this.token.renderedToken.y = y
        }
 
        this.updateCards = (cards) => {
            this.opponentHand.updateCards(cards)
        }

        this.levelUp = (n) => {
            this.level += n
            this.level = Math.min(this.level, 10)
            this.token.renderedToken.data.set('level', this.level)
            scene.socket.emit('updateLevel', scene.roomName, this.socketId, this.level)
        } 

        this.updateLevel = (level) => {
            this.level = level
        }

        this.chooseColor = (tokenImage) => {
            switch (tokenImage) {
                case "tokenYellow":
                    this.color = 0xD4AF37
                    this.colorString = "#D4AF37"
                    break;
                case "tokenRed":
                    this.color = 0xCA3013
                    this.colorString = "#CA3013"
                    break;
                case "tokenBlue":
                    this.color = 0x2D27A6
                    this.colorString = "#2D27A6"
                    break;
                case "tokenGreen":
                    this.color = 0x1E8000
                    this.colorString = "#1E8000"
                    break;
                default:
                    console.log("Error: unexpected token color")
            }
            this.opponentHand.colorHand(this.color)
        }
    }
}