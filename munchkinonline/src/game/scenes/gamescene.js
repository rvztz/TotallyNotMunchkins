import Phaser from 'phaser'
import PlayerHand from '../classes/playerHand'
import OpponentHand from '../classes/opponentHand'
import Board from '../classes/board'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        })
    }

    preload() {
        this.load.image('cardBack', 'assets/CardBack.jpg')
        this.load.scenePlugin('rexboardplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js', 'rexBoard', 'rexBoard');
    }

    create() {
        var board = new Board(this, 100, 100)

        console.log(board)

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
        this.leftHand.addCards(5, cardWidth, cardHeight, "left")

        this.rightHand = new OpponentHand(this)
        this.rightHand.render(this.scale.width - 1.5*vWidth, this.scale.height/2 - vHeight/2 - offset, vWidth, vHeight)
        this.rightHand.addCards(5, cardWidth, cardHeight, "right")
        
        this.topHand = new OpponentHand(this)
        this.topHand.render(this.scale.width/2 - hWidth/4, 2, vHeight, hHeight*0.9)
        this.topHand.addCards(5, cardWidth, cardHeight, "top")
    }

    update() {

    }
}