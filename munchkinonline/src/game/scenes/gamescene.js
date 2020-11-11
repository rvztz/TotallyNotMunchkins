// import io from 'socket.io-client'
import Phaser from 'phaser'

import Board from '../classes/board'
import EndTurnButton from '../classes/endTurnButton'
import Opponent from '../classes/opponent'
import Player from '../classes/player'
import GameState from '../classes/gameState'
import Battlefield from '../classes/battlefield'

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
        this.loadSceneComponents()
        this.loadTokens()
        this.loadButtons()
        this.loadMonsters()     
        this.loadItems()   

        /*======================OTHER DATA LOADING=======================*/
        this.load.json('cards', 'data/cards.json')
    }

    create() {
        /*======================INITIAL SOCKET SETUP=======================*/


        /*======================SCENE COMPONENTS CREATION=======================*/
        /*
        addMonster = () => {
            
        }

        monsters.center.renderedMonster.destroy();

        */
        // Add cards object list
        this.cardList = this.cache.json.get('cards').cards

        const positions = ['top', 'left', 'right']
        const cardWidth = 50
        const cardHeight = 72.5

        // Create game state
        this.gameState = new GameState(this)

        // Create player and render its hand
        this.player = new Player(this)
        this.player.renderHand(213, 590, 853, 120, cardWidth, cardHeight)

        // Create opponents and render their hands
        this.opponents = [] 
        this.playerList.forEach(player => {
            if (player.socketId != this.socket.id) {
                this.opponents.push(new Opponent(this, positions.shift(), player.socketId, player.gender))
            }
        })

        this.opponents.forEach(opponent => { 
            opponent.renderHand(cardWidth, cardHeight)
        })
        
        // Create and render the board
        let startTile = this.createBoard()
        
        // Render the player's and opponents tokens
        this.playerList.forEach((player, index)=> {
            if (player.socketId == this.socket.id) {
                this.player.gender = player.gender
                this.player.renderToken(startTile, index, player.tokenImage)
                this.player.chooseColor(player.tokenImage)

            } else {
                this.opponents.forEach(opponent => {
                    if (opponent.socketId == player.socketId) {
                        opponent.renderToken(startTile, index, player.tokenImage)
                        opponent.chooseColor(player.tokenImage)
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
        this.currentTurnText = this.add.text(58, 36, "Pregame", {fontFamily: 'Avenir, Helvetica, Arial, sans-serif'}).setFontSize(24).setColor('#000')

        // Render strength text
        this.add.text(1106, 426, "Strength", {fontFamily: 'Avenir, Helvetica, Arial, sans-serif'}).setFontSize(20).setColor('#000')
        this.strengthText = this.add.text(1127, 456, "", {fontFamily: 'Avenir, Helvetica, Arial, sans-serif'}).setFontSize(28).setColor('#000')
 
        // Render endTurnBUtton
        this.endTurnButton = new EndTurnButton(this)
        this.endTurnButton.render(1280, 650)

        // Render space to view bigger card 
        this.cardView = this.add.image(10, 436, 'blankCard').setScale(0.38, 0.38).setOrigin(0, 0)

        // Create spaces for monsters in combat
        this.battlefield = new Battlefield(this)

        // Request initial cards 
        this.socket.emit('distributeCards', this.roomName)

        /*====================== TEMP =======================*/

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

                    if (gameObject.data.get('level') == 10) {
                        this.scene.socket.emit('winGame', this.scene.roomName) 
                    }
                } else {
                    returnToLastPosition(gameObject)
                }
            
            // Card on Discard
            } else if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'discard') {
                if (gameObject.data.get('deck') === dropZone.data.get('deck')) {

                    this.scene.removeAndReturnCardFromPlayer(gameObject)

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
                    if (gameObject.data.get('data').type === "monster") {
                        this.scene.removeCardFromPlayer(gameObject)
                    } else {
                        this.scene.removeAndReturnCardFromPlayer(gameObject)
                    }
                } else {
                    returnToLastPosition(gameObject)
                }
            
            // Card on Opponent Hand (use card on opponent)
            } else if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'opponentHand') {

                if (this.scene.useCard(gameObject.data.get('data'), dropZone.data.get('ownerId'))) {
                    this.scene.removeAndReturnCardFromPlayer(gameObject)
                } else {
                    returnToLastPosition(gameObject)
                }

            // Card on Monster (use card on monster)
            } else if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'monster') {
                let position = dropZone.data.get('position')
                let monster = null
                switch (position) {
                    case 'center': monster = this.scene.battlefield.center
                        break
                    case 'left': monster = this.scene.battlefield.left
                        break
                    case 'right': monster = this.scene.battlefield.right
                        break
                    default: console.log("Error: unexpected position")
                }

                if (monster.useCard(gameObject.data.get('data'))) {
                    this.scene.removeAndReturnCardFromPlayer(gameObject)
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

        /*======================TOKEN EVENTS=======================*/
        this.socket.on('moveOpponentToken', (socketId, x, y) => {
            this.opponents.forEach(opponent => {
                if (opponent.socketId == socketId) {
                    opponent.moveToken(x, y)
                }
            })
        })

        /*======================CARD MANAGEMENT=======================*/
        this.socket.on('addCardsToPlayer', (cardNames, cardType, isPublic) => {
            let cardList = this.getCards(cardNames, cardType)
            cardList.forEach((card, index) => {

                if (card.type == "monster" && isPublic) {
                    this.socket.emit('startCombat', this.roomName, card)
                    this.socket.emit('showPublicCard', this.roomName, card.bigImage)
                } else {
                    if (isPublic) {
                        this.socket.emit('enabledLoot', this.roomName)
                        this.socket.emit('showPublicCard', this.roomName, card.bigImage)
                    }
                    this.player.addToHand(card, index)
                }
            })
        })

        this.socket.on('showPublicCard', (cardImage) => {
            this.cardView.setTexture(cardImage)
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

        /*======================PLAYER UPDATE EVENTS=======================*/
        this.socket.on('levelUpPlayer', (n) => {
            this.player.levelUp(n)
        })
        
        this.socket.on('updateLevel', (socketId, level) => {
            this.opponents.forEach(opponent => {
                if (opponent.socketId == socketId) {
                    opponent.updateLevel(level)
                }
            })
        })

        this.socket.on('buffPlayer', (amount) => {
            this.player.buff(amount)
        })

        this.socket.on('updateStrength', (socketId, strength) => {
            this.opponents.forEach(opponent => {
                if (opponent.socketId == socketId) {
                    opponent.updateStrength(strength)
                }
            })
        })

        /*======================GAMESTATE EVENTS=======================*/
        this.socket.on('endPregame', () => {
            this.gameState.endPregame()
        })

        this.socket.on('changeTurn', (socketId) => {
            this.gameState.changeTurn(socketId)

            let color = null
            if (socketId == this.socket.id) {
                color = this.player.colorString
            } else {
                this.opponents.forEach(opponent => {
                    if (opponent.socketId == socketId) {
                        color = opponent.colorString
                    }
                })
            }

            this.currentTurnText.text = `${socketId}'s turn`
            this.currentTurnText.setColor(color)
        })

        this.socket.on('drewCard', () => {
            this.gameState.drewCard()
        })

        /*======================COMBAT EVENTS=======================*/
        this.socket.on('startCombat', (card) => {
            this.battlefield.beginCombat(card)
        })

        this.socket.on('removeMonsterAt', (position) => {
            this.battlefield.removeMonsterAt(position)
        }) 

        this.socket.on('targetMonsterAt', (position) => {
            this.battlefield.targetMonsterAt(position)
        })

        this.socket.on('askForHelp', () => {
            this.battlefield.renderOfferHelpButton()
        })

        this.socket.on('offerHelp', (socketId) => {
            if (this.gameState.isYourTurn()) {
                console.log("U got help from " + socketId)
            } else {
                this.battlefield.offerHelpButton.destroy()
            }
        })

        this.socket.on('endCombat', () => {
            this.battlefield.endCombat()
        })

        this.socket.on('enabledLoot', () => {
            this.gameState.enableLootTheRoom()
        })

        this.socket.on('disabledLoot', () => {
            this.gameState.disableLootTheRoom()
        })

        this.socket.on('endGame', (socketId) => {
            let color = null
            if (socketId == this.socket.id) {
                color = this.player.colorString
            } else {
                this.opponents.forEach(opponent => {
                    if (opponent.socketId == socketId) {
                        color = opponent.colorString
                    }
                })
            }

            this.currentTurnText.text = `${socketId} WIINNSSS`
            this.currentTurnText.setColor(color)
            this.gameState.finishGame()
        })

    }

    update() {

    }

    /*======================UI CREATION FUNCTIONS=======================*/
    createBoard() {
        const numRows = 3
        const numCols = 5

        this.board = new Board(this, 213, 110, 853/numCols, 480/numRows)
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

        this.socket.emit('removeCard', this.roomName, index)

        cardGameObject.destroy()
    }

    removeAndReturnCardFromPlayer(cardGameObject) {
        let index = this.findCard(cardGameObject.data.get('data'))
        this.player.removeCardAt(index)

        this.socket.emit('removeCard', this.roomName, index)
        this.socket.emit('returnCard', this.roomName, cardGameObject.data.get('data').name, cardGameObject.data.get('deck'))

        cardGameObject.destroy()
    }

    useCard(card, targetId) {
        if (this.gameState.inPregame || !this.gameState.cardDrawn) {
            alert("You can't use cards right now.")
            return false
        }

        if (card.type === "monster" && this.gameState.isYourTurn() && this.gameState.canLootTheRoom) {
            if (targetId == this.socket.id) {
                this.socket.emit('startCombat', this.roomName, card)
                return true
            } else {
                // Not yet implemented
                return false
            }
        } else if (card.type === "curse" || card.type === "item") {
            if (targetId == this.socket.id) {
                return this.useCardEffect(card, this.player)
            } else {
                this.opponents.forEach(opponent => { 
                    if (opponent.socketId == targetId) {
                        return this.useCardEffect(card, opponent)
                    }
                })
            }
        } else {
            alert("You can't use that card right now.")
            return false
        }

        return true
    }

    /*======================CARD EFFECTS=======================*/
    useCardEffect(card, target) {

        switch(card.name) {
            case "Go Up A Level":
                target.levelUp(1)
                return true
            case "Stand Arrow":
                target.buff(card.statBonus)
                return true
            default:
                console.log("Error: unexpected card name")
                return false
        }
    }

    /*=================== IMAGE LOADING ===================*/
    loadSceneComponents() {
        this.load.image('cardBack', 'assets/cardBack.jpg')
        this.load.image('doorCard', 'assets/door.jpg')
        this.load.image('treasureCard', 'assets/treasure.jpg')
        this.load.image('pogmin', 'assets/Pogmin.jpg')
        this.load.image('doorDeck', 'assets/deck.png')
        this.load.image('treasureDeck', 'assets/deck.png')
        this.load.image('doorDiscard', 'assets/discard.png')
        this.load.image('treasureDiscard', 'assets/discard.png')
        this.load.image('slotBG', 'assets/slotBG.png')
    }

    loadTokens() {
        this.load.image('tokenYellow-male', 'assets/tokenYellow-male.png')
        this.load.image('tokenYellow-female', 'assets/tokenYellow-female.png')
        
        this.load.image('tokenBlue-male', 'assets/tokenBlue-male.png')
        this.load.image('tokenBlue-female', 'assets/tokenBlue-female.png')

        this.load.image('tokenGreen-male', 'assets/tokenGreen-male.png')
        this.load.image('tokenGreen-female', 'assets/tokenGreen-female.png')

        this.load.image('tokenRed-male', 'assets/tokenRed-male.png')
        this.load.image('tokenRed-female', 'assets/tokenRed-female.png')
    }

    loadButtons() {
        this.load.image('playButton', 'assets/buttons/playButton.png')
        this.load.image('endTurn', 'assets/buttons/endTurn.png')
        this.load.image('fightBtn', 'assets/buttons/fightBtn.png')
        this.load.image('runBtn', 'assets/buttons/runBtn.jpg')
        this.load.image('askHelpBtn', 'assets/buttons/askHelpBtn.png')
        this.load.image('offerHelpBtn', 'assets/buttons/offerHelpBtn.png')
    }

    loadMonsters() {
        this.load.image('blankCard', 'assets/monsters/blankCard.png')
        this.load.image('pogminMonster', 'assets/monsters/pogminMonster.png')
        this.load.image('unpogminMonster', 'assets/monsters/unpogminMonster.png')
    }

    loadItems() {
        this.load.image('goUpALevel', 'assets/items/goUpALevel.png')
        this.load.image('standArrow', 'assets/items/standArrow.png')
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