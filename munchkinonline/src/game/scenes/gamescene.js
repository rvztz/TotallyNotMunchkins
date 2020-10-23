// import io from 'socket.io-client'
import Phaser from 'phaser'

import Board from '../classes/board'
import Opponent from '../classes/opponent'
import Player from '../classes/player'


export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        })
    }

    init(data) {
        this.socket = data.socket
        this.roomName = data.roomName
        this.socketList = data.socketList
    }

    preload() {
        /*======================IMAGE LOADING=======================*/
        this.load.image('cardBack', 'assets/cardBack.jpg')
        this.load.image('doorCard', 'assets/door.jpg')
        this.load.image('treasureCard', 'assets/treasure.jpg')
        this.load.image('pogmin', 'assets/Pogmin.jpg')
        this.load.image('doorDeck', 'assets/deck.png')
        this.load.image('treasureDeck', 'assets/deck.png')
        this.load.image('doorDiscard', 'assets/discard.png')
        this.load.image('treasureDiscard', 'assets/discard.png')
        this.load.image('slotBG', 'assets/slotBG.png')

        this.load.image('tokenYellow', 'assets/tokenYellow.png')
        this.load.image('tokenBlue', 'assets/tokenBlue.png')
        this.load.image('tokenGreen', 'assets/tokenGreen.png')
        this.load.image('tokenRed', 'assets/tokenRed.png')

        this.load.image('playButton', 'assets/playButton.png')
        /*======================OTHER DATA LOADING=======================*/
        this.load.json('cards', 'data/cards.json')
    }

    create() {
        this.cardList = this.cache.json.get('cards').cards

        const positions = ['left', 'top', 'right']

        const hWidth = this.scale.width * (2/3)
        const hHeight = this.scale.height / 6

        const vWidth = this.scale.width / 12
        const vHeight = this.scale.height * (2/3)

        const cardWidth = 50
        const cardHeight = 72.5

        const offset = 10

        // Create player and render its hand
        this.player = new Player(this)
        this.player.renderHand(hWidth, hHeight, cardWidth, cardHeight, offset)

        // Create opponents and render their hands
        this.opponents = []
        this.socketList.forEach(socketId => {
            if (socketId != this.socket.id) {
                this.opponents.push(new Opponent(this, positions.shift(), socketId))
            }
        })

        this.opponents.forEach(opponent => { 
            opponent.renderHand(hWidth, hHeight, vWidth, vHeight, cardWidth, cardHeight, offset) 
        })
        
        // Create and render the board
        let startTile = this.createBoard(hWidth, vHeight)
        
        // Render the player's and opponents tokens
        this.socketList.forEach((socketId, index)=> {
            if (socketId == this.socket.id) {
                this.player.renderToken(startTile, index)
            } else {
                this.opponents.forEach(opponent => {
                    if (opponent.socketId == socketId) {
                        opponent.renderToken(startTile, index)
                    }
                })
            }
        })
        
        // Render new game image and add click event
        let playButton = this.add.image(0, 0, 'playButton').setInteractive({ cursor: 'pointer' })

        playButton.on('pointerup', () => {
            this.scene.start('Lobby', {socket: this.socket})
        })

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
    createBoard(hWidth, vHeight) {
        const numRows = 3
        const numCols = 5

        this.board = new Board(this, this.player.playerHand.dimensions.x, this.opponents[0].opponentHand.dimensions.y, hWidth/numCols, vHeight/numRows)
        this.board.renderTiles()
        this.board.renderDecks()
        this.board.renderDiscards()

        return {
            x: this.board.dimensions.x + this.board.tiles[0].col * this.board.dimensions.cellWidth,
            y: this.board.dimensions.y + this.board.tiles[0].row * this.board.dimensions.cellHeight,
            width: this.board.dimensions.cellWidth,
            height: this.board.dimensions.cellHeight
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