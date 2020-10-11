import Phaser from 'phaser'
import PlayerHand from '../classes/playerHand'
import OpponentHand from '../classes/opponentHand'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        })
    }

    preload() {
        this.load.image('cardBack', 'assets/CardBack.jpg')
    }

    create() {
        const cardWidth = 50
        const cardHeight = 72.5

        const hWidth = this.scale.width * (2/3)
        const hHeight = this.scale.height / 6

        const vWidth = this.scale.width / 12
        const vHeight = this.scale.height * (2/3)
        
        const offset = 10

        this.playerHand = new PlayerHand(this)
        this.playerHand.render(this.scale.width/2 - hWidth/2, this.scale.height - hHeight - offset, hWidth, hHeight)
        this.playerHand.addCards(5, cardWidth, cardHeight)

        this.leftHand = new OpponentHand(this)
        this.leftHand.render(vWidth/2, this.scale.height/2 - vHeight/2 - offset, vWidth, vHeight)

        this.rightHand = new OpponentHand(this)
        this.rightHand.render(this.scale.width - 1.5*vWidth, this.scale.height/2 - vHeight/2 - offset, vWidth, vHeight)
        
        this.topHand = new OpponentHand(this)
        this.topHand.render(this.scale.width/2 - hWidth/2, 2, hWidth, hHeight*0.9)
    }

    update() {

    }
}