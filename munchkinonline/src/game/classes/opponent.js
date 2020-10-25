import OpponentHand from '../classes/opponentHand'
import Token from '../classes/token'

export default class Opponent {
    constructor (scene, position, socketId, gender) {
        this.opponentHand = new OpponentHand(scene, position)
        this.token = new Token(scene)

        // Data
        this.position = position
        this.socketId = socketId
        this.gender = gender
        this.level = 1
        this.power = 1
        
        // Renders
        this.renderHand = (hWidth, hHeight, vWidth, vHeight, cardWidth, cardHeight, offset) => {
            if (this.position === 'right') {
                this.opponentHand.render(scene.scale.width - 1.5*vWidth, scene.scale.height/2 - vHeight/2 - offset, vWidth, vHeight, cardWidth, cardHeight)
            } else if (this.position === 'left') {
                this.opponentHand.render(vWidth/2, scene.scale.height/2 - vHeight/2 - offset, vWidth, vHeight, cardWidth, cardHeight)
            } else if (this.position === 'top') {
                this.opponentHand.render(scene.scale.width/2 - hWidth/4, 2, vHeight, hHeight*0.9, cardWidth, cardHeight)
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

        this.addCards = (cards) => {
            this.opponentHand.addCards(cards)
        }
    }
}