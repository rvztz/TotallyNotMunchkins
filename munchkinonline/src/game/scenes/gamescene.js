import Phaser from 'phaser'

import Board from '../classes/board'
import OpponentHand from '../classes/opponentHand'
import Player from '../classes/player'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        })
    }

    preload() {
        /*======================IMAGE LOADING=======================*/
        this.load.image('cardBack', 'assets/cardBack.jpg')
        this.load.image('doorCard', 'assets/door.jpg')
        this.load.image('treasureCard', 'assets/treasure.jpg')
        this.load.image('pogmin', 'assets/Pogmin.jpg')
        this.load.image('token', 'assets/token.png')
        this.load.image('doorDeck', 'assets/deck.png')
        this.load.image('treasureDeck', 'assets/deck.png')
        this.load.image('doorDiscard', 'assets/discard.png')
        this.load.image('treasureDiscard', 'assets/discard.png')
        this.load.image('slotBG', 'assets/slotBG.png')

        /*======================OTHER DATA LOADING=======================*/
        this.load.json('cards', 'data/cards.json')
    }

    create() {
        this.cardList = this.cache.json.get('cards').cards

        const hWidth = this.scale.width * (2/3)
        const hHeight = this.scale.height / 6

        const vWidth = this.scale.width / 12
        const vHeight = this.scale.height * (2/3)

        const cardWidth = 50
        const cardHeight = 72.5

        const offset = 10

        this.player = new Player(this)
        this.player.renderHand(hWidth, hHeight, cardWidth, cardHeight, offset)

        this.createHands(hWidth, hHeight, vWidth, vHeight, cardWidth, cardHeight, offset)
        let startTile = this.createBoard(hWidth, vHeight)

        this.player.renderToken(startTile)

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
                
                updateLastPosition(gameObject)
                
            } else if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'discard') {
                if (gameObject.data.get('deck') === dropZone.data.get('deck')) {
                    gameObject.destroy()
                } else {
                    returnToLastPosition(gameObject)
                }
            } else if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'slot') {
                // Later check for equipment type compatibility
                gameObject.x = dropZone.x
                gameObject.y = dropZone.y

                updateLastPosition(gameObject)
            } else {
                returnToLastPosition(gameObject)
            }
        });

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            if (!dropped) {
                returnToLastPosition(gameObject)
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
                updateLastPosition(gameObject)
            } else {
                // Ignore incompatible dropzone; do nothing
            }
        });
    }

    update() {

    }

    /*======================UI CREATION FUNCTIONS=======================*/
    createHands(hWidth, hHeight, vWidth, vHeight, cardWidth, cardHeight, offset) {
        this.leftHand = new OpponentHand(this)
        this.leftHand.render(vWidth/2, this.scale.height/2 - vHeight/2 - offset, vWidth, vHeight, cardWidth, cardHeight)
        this.leftHand.addCards(5, 'left', 'cardBack')

        this.rightHand = new OpponentHand(this)
        this.rightHand.render(this.scale.width - 1.5*vWidth, this.scale.height/2 - vHeight/2 - offset, vWidth, vHeight, cardWidth, cardHeight)
        this.rightHand.addCards(5, 'right', 'cardBack')
        
        this.topHand = new OpponentHand(this)
        this.topHand.render(this.scale.width/2 - hWidth/4, 2, vHeight, hHeight*0.9, cardWidth, cardHeight)
        this.topHand.addCards(5, 'top', 'cardBack')
    }

    createBoard(hWidth, vHeight) {
        const numRows = 3
        const numCols = 5

        this.board = new Board(this, this.player.playerHand.dimensions.x, this.leftHand.dimensions.y, hWidth/numCols, vHeight/numRows)
        this.board.renderTiles()
        this.board.renderDecks()
        this.board.renderDiscards()

        return {
            x: this.board.dimensions.x + this.board.tiles[0].col * this.board.dimensions.cellWidth,
            y: this.board.dimensions.y + this.board.tiles[0].row * this.board.dimensions.cellHeight
        }
    }

    /*======================DRAG EVENT HELPER FUNCTIONS=======================*/
}

function updateLastPosition(gameObject) {
    gameObject.data.set('lastX', gameObject.x)
    gameObject.data.set('lastY', gameObject.y)
}

function returnToLastPosition(gameObject) {
    if (gameObject.data.get('lastX') == null && gameObject.data.get('lastY') == null) {
        gameObject.x = gameObject.input.dragStartX
        gameObject.y = gameObject.input.dragStartY
    } else {
        gameObject.x = gameObject.data.get('lastX')
        gameObject.y = gameObject.data.get('lastY')
    }
}

