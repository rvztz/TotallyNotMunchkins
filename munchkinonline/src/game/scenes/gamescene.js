import Phaser from 'phaser'
import PlayerHand from '../classes/playerHand'
import OpponentHand from '../classes/opponentHand'
import Board from '../classes/board'
import Token from '../classes/token'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        })
    }

    preload() {
        this.load.image('cardBack', 'assets/CardBack.jpg')
        this.load.image('pogmin', 'assets/Pogmin.jpg')
        this.load.image('token', 'assets/token.png')
    }

    create() {
        const cardWidth = 50
        const cardHeight = 72.5

        const hWidth = this.scale.width * (2/3)
        const hHeight = this.scale.height / 6

        const vWidth = this.scale.width / 12
        const vHeight = this.scale.height * (2/3)
        
        const offset = 10
        const numRows = 3
        const numCols = 5

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

        this.board = new Board(this, this.playerHand.dimensions.x, this.leftHand.dimensions.y, hWidth/numCols, vHeight/numRows)
        this.board.renderTiles()

        let startTile = {
            x: this.board.dimensions.x + this.board.tiles[0].col * this.board.dimensions.cellWidth,
            y: this.board.dimensions.y + this.board.tiles[0].row * this.board.dimensions.cellHeight
        }

        this.tokenOne = new Token(this)
        this.tokenOne.render(startTile.x, startTile.y, 'token')

        /*======================INPUT EVENTS=======================*/
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragstart', function (pointer, gameObject) {
            this.children.bringToTop(gameObject);
        }, this);

        this.input.on('drop', function (pointer, gameObject, dropZone) {    
            if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'hand' ||
                gameObject.data.get('type') === 'token' && dropZone.data.get('type') === 'tile') {
                // Valid move; do nothing
            } else {
                gameObject.x = gameObject.data.get('lastX')
                gameObject.y = gameObject.data.get('lastY')
            }
        });

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            if (!dropped)
            {
                gameObject.x = gameObject.data.get('lastX')
                gameObject.y = gameObject.data.get('lastY')
            }
    
        });
        
        /*
        this.input.on('dragenter', function (pointer, gameObject, dropZone) {
            
            //dropZone.setTint(0x00ff00);
    
        });
        */
    
        this.input.on('dragleave', function (pointer, gameObject, dropZone) {
            if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'hand' ||
                gameObject.data.get('type') === 'token' && dropZone.data.get('type') === 'tile') {
                gameObject.data.set('lastX', gameObject.x)
                gameObject.data.set('lastY', gameObject.y)
            } else {
                // Ignore incompatible dropzone; do nothing
            }
        });
    }

    update() {

    }
}