// import io from 'socket.io-client'
import Phaser from 'phaser'

import Board from '../classes/board'
import EndTurnButton from '../classes/endTurnButton'
import Opponent from '../classes/opponent'
import Player from '../classes/player'
import GameState from '../classes/gameState'


export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        })
    }

    init(data) {
        this.socket = data.socket
        this.roomName = data.roomName
        this.playerList = data.playerList
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

        this.load.image('tokenYellow-male', 'assets/tokenYellow-male.png')
        this.load.image('tokenYellow-female', 'assets/tokenYellow-female.png')

        this.load.image('tokenBlue-male', 'assets/tokenBlue-male.png')
        this.load.image('tokenBlue-female', 'assets/tokenBlue-female.png')

        this.load.image('tokenGreen-male', 'assets/tokenGreen-male.png')
        this.load.image('tokenGreen-female', 'assets/tokenGreen-female.png')

        this.load.image('tokenRed-male', 'assets/tokenRed-male.png')
        this.load.image('tokenRed-female', 'assets/tokenRed-female.png')

        this.load.image('playButton', 'assets/playButton.png')
        this.load.image('endTurn', 'assets/endTurn.png')
        this.load.image('goUpALevel', 'assets/goUpALevel.jpg')
        /*======================OTHER DATA LOADING=======================*/
        this.load.json('cards', 'data/cards.json')
    }

    create() {
        /*======================INITIAL SOCKET SETUP=======================*/


        /*======================SCENE COMPONENTS CREATION=======================*/
        
        // Add cards object list
        this.cardList = this.cache.json.get('cards').cards

        const positions = ['left', 'top', 'right']

        const screenWidth = this.scale.width
        const screenHeight = this.scale.height

        const hWidth = screenWidth * (2/3)
        const hHeight = screenHeight / 6

        const vWidth = screenWidth / 12
        const vHeight = screenHeight * (2/3)

        const cardWidth = 50
        const cardHeight = 72.5

        const offset = 10

        // Create game state
        this.gameState = new GameState()

        // Create player and render its hand
        this.player = new Player(this)
        this.player.renderHand(hWidth, hHeight, cardWidth, cardHeight, offset)

        // Create opponents and render their hands
        this.opponents = []
        this.playerList.forEach(player => {
            if (player.socketId != this.socket.id) {
                this.opponents.push(new Opponent(this, positions.shift(), player.socketId, player.gender))
            }
        })

        this.opponents.forEach(opponent => { 
            opponent.renderHand(hWidth, hHeight, vWidth, vHeight, cardWidth, cardHeight, offset) 
        })
        
        // Create and render the board
        let startTile = this.createBoard(hWidth, vHeight)
        
        // Render the player's and opponents tokens
        this.playerList.forEach((player, index)=> {
            if (player.socketId == this.socket.id) {
                this.player.gender = player.gender
                this.player.renderToken(startTile, index, player.tokenImage)
            } else {
                this.opponents.forEach(opponent => {
                    if (opponent.socketId == player.socketId) {
                        opponent.renderToken(startTile, index, player.tokenImage)
                    }
                })
            }
        })
        
        // Render new game image and add click event
        let playButton = this.add.image(0, 0, 'playButton').setInteractive({ cursor: 'pointer' })

        playButton.on('pointerup', () => {
            this.scene.start('Lobby', {socket: this.socket})
        })

        // Render current turn text
        this.currentTurnText = this.add.text(screenWidth/22, screenHeight/20, "Pregame", {fontFamily: 'Avenir, Helvetica, Arial, sans-serif'}).setFontSize(24).setColor('#000')

        // Render endTurnBUtton
        this.endTurnButton = new EndTurnButton(this)
        this.endTurnButton.render(screenWidth, this.player.playerHand.dimensions.y + this.player.playerHand.dimensions.height/2)

        // Request initial cards
        this.socket.emit('distributeCards', this.roomName)

        /*======================INPUT EVENTS=======================*/
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        this.input.on('dragstart', function (pointer, gameObject) {
            this.children.bringToTop(gameObject);
        }, this)

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            
            // Card on Player Hand
            if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'hand') {
 
                updateLastPosition(gameObject)
            
            // Token on Tile
            } else if (gameObject.data.get('type') === 'token' && dropZone.data.get('type') === 'tile') {

                if (gameObject.data.get('level') == dropZone.data.get('level')) {
                    updateLastPosition(gameObject)
                    this.scene.socket.emit('moveToken', this.scene.roomName, gameObject.x, gameObject.y)
                } else {
                    returnToLastPosition(gameObject)
                }
            
            // Card on Discard
            } else if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'discard') {
                if (gameObject.data.get('deck') === dropZone.data.get('deck')) {

                    this.scene.removeCardFromPlayer(gameObject)

                } else {
                    returnToLastPosition(gameObject)
                }
            
            // Card on Equipment Slot
            } else if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'slot') {
                // Later check for equipment type compatibility
                gameObject.x = dropZone.x
                gameObject.y = dropZone.y

                updateLastPosition(gameObject)

            // Card on Tile (use card on self)
            } else if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'tile') {

                if (this.scene.useCard(gameObject.data.get('data'), this.scene.socket.id)) {
                    this.scene.removeCardFromPlayer(gameObject)
                } else {
                    returnToLastPosition(gameObject)
                }
            
            // Card on Opponent Hand (use card on opponent)
            } else if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'opponentHand') {

                if (this.scene.useCard(gameObject.data.get('data'), dropZone.data.get('ownerId'))) {
                    this.scene.removeCardFromPlayer(gameObject)
                } else {
                    returnToLastPosition(gameObject)
                }

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
            if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'hand') {
                updateLastPosition(gameObject)
            }
            else if (gameObject.data.get('type') === 'token' && dropZone.data.get('type') === 'tile') {
                if (gameObject.data.get('level') == dropZone.data.get('level')) {
                    updateLastPosition(gameObject)
                }
            } else {
                // Ignore incompatible dropzone; do nothing
            }
        });

        /*======================SOCKET EVENTS=======================*/
        this.socket.on('moveOpponentToken', (socketId, x, y) => {
            this.opponents.forEach(opponent => {
                if (opponent.socketId == socketId) {
                    opponent.moveToken(x, y)
                }
            })
        })

        this.socket.on('addCardsToPlayer', (cardNames, cardType) => {
            let cardList = this.getCards(cardNames, cardType)
            cardList.forEach((card, index) => {
                this.player.addToHand(card, index)
            })
        })

        this.socket.on('distributeCards', (treasureNames, doorNames) => {
            let treasureCards = this.getCards(treasureNames, 'treasure')
            let doorCards = this.getCards(doorNames, 'door')
            let allCards = treasureCards.concat(doorCards)
            allCards.forEach((card, index) => {
                this.player.addToHand(card, index)
            })
        })

        this.socket.on('updateOpponentCards', (socketId, cards) => {
            this.opponents.forEach(opponent => {
                if (opponent.socketId == socketId) {
                    opponent.updateCards(cards)
                }
            })
        })

        this.socket.on('updateLevel', (socketId, level) => {
            if (socketId == this.socket.id) {
                this.player.updateLevel(level)
            } else {
                this.opponents.forEach(opponent => {
                    if (opponent.socketId == socketId) {
                        opponent.updateLevel(level)
                    }
                })
            }
        })

        this.socket.on('endPregame', () => {
            this.gameState.endPregame()
        })

        this.socket.on('changeTurn', (socketId) => {
            this.gameState.changeTurn(socketId)
            this.currentTurnText.text = `${socketId}'s turn`
        })

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

    /*======================OBJECT SEARCH FUNCTIONS=======================*/
    getCards(cardNames, cardType) {
        let cards = []
        for (let i = 0; i < cardNames.length; i++) {
            if (cardType === 'door') {
                for (let j = 0; j < this.cardList.doors.length; j++) {
                    if (cardNames[i] == this.cardList.doors[j].name) {
                        cards.push(this.cardList.doors[j])
                    }
                }
            } else {
                for (let j = 0; j < this.cardList.treasures.length; j++) {
                    if (cardNames[i] == this.cardList.treasures[j].name) {
                        cards.push(this.cardList.treasures[j])
                    }
                }
            }
        }
        return cards
    }

    findCard(card) {
        for (let i = 0; i < this.player.cards.length; i++) {
            if (card == this.player.cards[i]) {
                return i
            }
        }
        return -1
    }

    removeCardFromPlayer(cardGameObject) {
        let index = this.findCard(cardGameObject.data.get('data'))
        this.player.removeCardAt(index)

        this.socket.emit('removeCard', this.roomName, cardGameObject.data.get('data').name, cardGameObject.data.get('deck'), index)

        cardGameObject.destroy()
    }

    useCard(card, targetId) {
        if (card.type === "curse" || card.type === "item") {
            if (targetId == this.socket.id) {
                this.useCardEffect(card, this.player)
            } else {
                this.opponents.forEach(opponent => { 
                    if (opponent.socketId == targetId) {
                        this.useCardEffect(card, opponent)
                    }
                })
            }
        } else {
            return false
        }

        return true
    }

    /*======================CARD EFFECTS=======================*/
    useCardEffect(card, target) {

        switch(card.name) {
            case "Go Up A Level":
                target.levelUp(1)
                break;
            default:
                console.log("Error: unexpected card name")
        }

    }

}

/*======================DRAG EVENT HELPER FUNCTIONS=======================*/
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