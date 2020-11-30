import OpponentHand from '../classes/opponentHand'
import Token from '../classes/token'

export default class Opponent {
    constructor (scene, position, socketId, gender, userName) {
        this.opponentHand = new OpponentHand(scene, position, socketId)
        this.token = new Token(scene)
        this.color = null
        this.userName = userName

        // Data
        this.position = position
        this.socketId = socketId
        this.gender = gender
        this.level = 1 
        this.strength = 1
         
        // Renders
        this.renderHand = (cardWidth, cardHeight) => {
            if (this.position === 'right') {
                this.opponentHand.render(1090, 110, 106, 296, cardWidth, cardHeight)
            } else if (this.position === 'left') {
                this.opponentHand.render(83, 110, 106, 296, cardWidth, cardHeight)
            } else if (this.position === 'top') {
                this.opponentHand.render(472, 2, 336, 106, cardWidth, cardHeight)
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
            scene.socket.emit('levelUpPlayer', this.socketId, n)
        }

        this.updateLevel = (level) => {
            this.level = level
        }

        this.buff = (amount) => {
            scene.socket.emit('buffPlayer', this.socketId, amount)
        }

        this.resetBuffs = () => {
            scene.socket.emit('resetBuffs', this.socketId)
        }

        this.updateStrength = (strength) => {
            this.strength = strength
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