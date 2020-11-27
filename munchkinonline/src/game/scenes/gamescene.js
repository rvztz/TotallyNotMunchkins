// import io from 'socket.io-client'
import Phaser from 'phaser'

import Board from '../classes/board'
import EndTurnButton from '../classes/endTurnButton'
import Opponent from '../classes/opponent'
import Player from '../classes/player'
import GameState from '../classes/gameState'
import Battlefield from '../classes/battlefield'
import Log from '../classes/log'
import { gameCollection } from '../../main.js';
import router from '../../router/index'

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
        this.loadEquipmentSlots()
        this.loadMonsters()     
        this.loadItems()   
        this.loadTiles()

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
                this.opponents.push(new Opponent(this, positions.shift(), player.socketId, player.gender, player.userName))
            } else {
                this.player.userName = player.userName
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

        // Render current turn text
        this.currentTurnText = this.add.text(10, 36, "Pregame", {fontFamily: 'Avenir, Helvetica, Arial, sans-serif'}).setFontSize(24).setColor('#000')

        // Render strength text
        this.add.text(1106, 426, "Strength", {fontFamily: 'Avenir, Helvetica, Arial, sans-serif'}).setFontSize(20).setColor('#000')
        this.strengthText = this.add.text(1127, 456, "", {fontFamily: 'Avenir, Helvetica, Arial, sans-serif'}).setFontSize(28).setColor('#000')
  
        // Render endTurnBUtton
        this.endTurnButton = new EndTurnButton(this)
        this.endTurnButton.render(1280, 680)

        // Render space to view bigger card 
        this.cardView = this.add.image(10, 436, 'blankCard').setScale(0.38, 0.38).setOrigin(0, 0)

        // Create spaces for monsters in combat
        this.battlefield = new Battlefield(this)

        // Request initial cards 
        this.socket.emit('distributeCards', this.roomName)

        /*====================== TEMP =======================*/
        this.log = new Log(this)

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
                if (gameObject.data.get('placedOn') === 'equipment') {
                    this.scene.player.playerHand.equipment.makeAvailable(gameObject.data.get('equipmentSlot'))
                    this.scene.player.returnEquipmentToHand(gameObject.data.get('data'))
                    gameObject.data.set("placedOn", "hand")
                    gameObject.data.set("equipmentSlot", "")
                }
                
                updateLastPosition(gameObject)
            
            // Token on Tile
            } else if (gameObject.data.get('type') === 'token' && dropZone.data.get('type') === 'tile') {

                if (gameObject.data.get('level') == dropZone.data.get('level')) {
                    updateLastPosition(gameObject)
                    this.scene.socket.emit('moveToken', this.scene.roomName, gameObject.x, gameObject.y)

                    if (gameObject.data.get('level') == 10) {
                        this.scene.socket.emit('winGame', this.scene.roomName)
                        this.scene.socket.emit('addToLog', this.scene.roomName, `${this.scene.player.userName} won!`)
                    }
                } else {
                    returnToLastPosition(gameObject)
                }
            
            // Card on Discard
            } else if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'discard') {
                if (gameObject.data.get('deck') === dropZone.data.get('deck')) {
                    if(gameObject.data.get("placedOn") === "equipment") {
                        this.scene.discardFromEquipment(gameObject)
                    } else {
                        this.scene.removeAndReturnCardFromPlayer(gameObject)
                    }                    

                } else {
                    returnToLastPosition(gameObject)
                }
            
            // Card on Equipment Slot
            } else if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'slot') {
                if (this.scene.player.equipCard(gameObject.data.get('data'), gameObject.data.get('placedOn'), dropZone.data.get('equipmentType'), dropZone.data.get('available'))) {
                    this.scene.removeCardFromPlayer(gameObject, /* destroy */ false)
                    dropZone.data.set("available", false)
                    gameObject.data.set("placedOn", "equipment")
                    gameObject.data.set("equipmentSlot",  dropZone.data.get("image"))
                    gameObject.x = dropZone.x
                    gameObject.y = dropZone.y
                    updateLastPosition(gameObject)
                } else {
                    returnToLastPosition(gameObject)
                }                

            // Card on Tile (use card on self)
            } else if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'tile') {

                if (this.scene.useCard(gameObject.data.get('data'), this.scene.socket.id)) {
                    if (gameObject.data.get('data').type === "monster") {
                        this.scene.removeCardFromPlayer(gameObject, /* destroy */ true)
                    } else {
                        this.scene.socket.emit('addToLog', this.scene.roomName, `${this.scene.player.userName} used ${gameObject.data.get('data').name} on themselves.`)
                        this.scene.removeAndReturnCardFromPlayer(gameObject)
                    }
                } else {
                    returnToLastPosition(gameObject)
                }
            
            // Card on Opponent Hand (use card on opponent)
            } else if (gameObject.data.get('type') === 'card' && dropZone.data.get('type') === 'opponentHand') {

                if (this.scene.useCard(gameObject.data.get('data'), dropZone.data.get('ownerId'))) {
                    let opponentName = this.scene.getUserName(dropZone.data.get('ownerId'))
                    this.scene.socket.emit('addToLog', this.scene.roomName, `${this.scene.player.userName} used ${gameObject.data.get('data').name} on ${opponentName}.`)
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
                    this.scene.socket.emit('addToLog', this.scene.roomName, `${this.scene.player.userName} used ${gameObject.data.get('data').name} on ${monster.name}.`)
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
            if (gameObject.data.get('type') === 'card' && gameObject.data.get('placedOn') !== 'equipment' && dropZone.data.get('type') === 'hand') {
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

        /*======================WINDOW EVENTS=======================*/
        const scene = this
        window.onpopstate = () => {
            this.socket.emit('endPregame', this.roomName)
            scene.socket.emit('kickPlayer', scene.roomName, this.player.userName)
        }
 
        window.addEventListener('beforeunload', () => {
            this.socket.emit('endPregame', this.roomName)
            scene.socket.emit('kickPlayer', scene.roomName, this.player.userName)
        })

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
                        this.socket.emit('addToLog', this.roomName, `${this.player.userName} drew ${card.name}.`)
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

        this.socket.on('resetEffects', () => {
            this.player.buff(this.player.effects * -1) 
        })

        /*======================GAMESTATE EVENTS=======================*/
        this.socket.on('endPregame', () => {
            this.gameState.endPregame()
        })

        this.socket.on('changeTurn', (socketId, userName) => {
            this.gameState.changeTurn(socketId)

            let color = null
            if (socketId == this.socket.id) {
                color = this.player.colorString
                if (this.player.isDead) {
                    this.player.resurrect()
                    this.gameState.drewCard()
                    this.socket.emit('distributeCards', this.roomName)
                }
            } else {
                this.opponents.forEach(opponent => {
                    if (opponent.socketId == socketId) {
                        color = opponent.colorString
                    }
                })
            }

            this.currentTurnText.text = `${userName}'s turn`
            this.currentTurnText.setColor(color)

            if (this.gameState.isYourTurn()) {
                this.socket.emit('addToLog', this.roomName, `${userName}'s turn.`)
            }
            
        })

        this.socket.on('drewCard', () => {
            this.gameState.drewCard()
        })

        this.socket.on('displayExitButton', () => {
            // Render new game image and add click event
            this.exitButton = this.add.image(10, 80, 'exitBtn').setOrigin(0, 0).setInteractive({ cursor: 'pointer' })

            this.exitButton.on('pointerup', () => {
                this.socket.emit('closeRoom', this.roomName)
            })
        })

        this.socket.on('disconnectPlayer', () => {
            this.socket.emit('disconnectPlayer')
            router.push("/play")
            this.sys.game.destroy(true)
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
                this.player.helper = socketId
            } else {
                this.battlefield.offerHelpButton.destroy()
            }
        })

        this.socket.on('killHelper', () => {
            this.player.die()
        })

        this.socket.on('useCardOnMonster', (card, position) => {
            let monster = null
            switch (position) {
                case 'center': monster = this.battlefield.center
                break
                case 'left': monster = this.battlefield.left
                break
                case 'right': monster = this.battlefield.right
                break
                default: console.log("Error: unexpected position")
                return
            }

            this.useCardEffect(card, monster)
        })

        this.socket.on('sendTreasuresToHelper', (n) => {
            this.socket.emit('requestCards', this.roomName, 'treasure', n, /* isPublic */ false)
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

        this.socket.on('endGame', (socketId, userName) => {
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

            this.currentTurnText.text = `${userName} WINS`
            this.currentTurnText.setColor(color)
            this.gameState.finishGame()
        })

        this.socket.on('addToLog', (text) => {
            this.log.push(text)
        })

        this.socket.on('saveGameToFirebase', (room) => {
            saveGameToFirebase(room)
        })

    }

    update() {

    }

    /*======================UI CREATION FUNCTIONS=======================*/
    createBoard() {
        const numRows = 3
        const numCols = 5 /*  284.33 * 96  */

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
    getUserName(socketId) {
        if (this.socket.id == socketId) {
            return this.player.userName
        }
        let result = ""
        this.opponents.forEach(opponent => {
            if (opponent.socketId == socketId) {
                result = opponent.userName
            }
        })

        return result
    }

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

    discardFromEquipment(cardGameObject) {
        this.player.playerHand.equipment.makeAvailable(cardGameObject.data.get("equipmentSlot"))

        let equipmentIndex = this.player.findCardInEquipment(cardGameObject.data.get('data'))
        this.player.removeFromEquipmentAt(equipmentIndex)

        this.socket.emit('returnCard', this.roomName, cardGameObject.data.get('data').name, cardGameObject.data.get('deck'))

        cardGameObject.destroy()
    }

    removeCardFromPlayer(cardGameObject, destroy) {
        let index = this.findCard(cardGameObject.data.get('data'))
        this.player.removeCardAt(index)

        this.socket.emit('removeCard', this.roomName, index)

        if(destroy) {
            cardGameObject.destroy()
        }
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
        this.load.image('doorCard', 'assets/door.png')
        this.load.image('treasureCard', 'assets/treasure.png')
        this.load.image('doorDeck', 'assets/doorDeck.png')
        this.load.image('treasureDeck', 'assets/treasureDeck.png')
        this.load.image('doorDiscard', 'assets/doorDiscard.png')
        this.load.image('treasureDiscard', 'assets/treasureDiscard.png') 
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
        this.load.image('runBtn', 'assets/buttons/runBtn.png')
        this.load.image('logBtn', 'assets/buttons/logBtn.png')
        this.load.image('askHelpBtn', 'assets/buttons/askHelpBtn.png')
        this.load.image('offerHelpBtn', 'assets/buttons/offerHelpBtn.png')
        this.load.image('exitBtn', 'assets/buttons/exitButton.png')
    }

    loadMonsters() {
        this.load.image('blankCard', 'assets/monsters/blankCard.png')
        this.load.image('pogminMonster', 'assets/monsters/pogminMonster.png')
        this.load.image('unpogminMonster', 'assets/monsters/unpogminMonster.png')
        this.load.image('mikeWazowski', 'assets/monsters/mikeWazowski.png')
    }

    loadEquipmentSlots() {
        this.load.image('head', 'assets/equipment/helmetSlot.png')
        this.load.image('leftArm', 'assets/equipment/leftHandSlot.png')
        this.load.image('rightArm', 'assets/equipment/rightHandSlot.png')
        this.load.image('feet', 'assets/equipment/feetSlot.png')
        this.load.image('legs', 'assets/equipment/legsSlot.png')
        this.load.image('torso', 'assets/equipment/torsoSlot.png')
    }

    loadItems() {
        this.load.image('goUpALevel', 'assets/items/goUpALevel.png')
        this.load.image('standArrow', 'assets/items/standArrow.png')
        this.load.image('diamondSword', 'assets/items/diamondSword.png')
        this.load.image('dkTie', 'assets/items/dkTie.png')
        this.load.image('samusHelmet', 'assets/items/samusHelmet.png')
        this.load.image('dekuShield', 'assets/items/dekuShield.png')
        this.load.image('sonicShoes', 'assets/items/sonicShoes.png')
        this.load.image('squarepants', 'assets/items/squarepants.png')
    }

    loadTiles() {
        this.load.image('tile1', 'assets/tiles/tile1.png')
        this.load.image('tile2', 'assets/tiles/tile2.png')
        this.load.image('tile3', 'assets/tiles/tile3.png')
        this.load.image('tile4', 'assets/tiles/tile4.png')
        this.load.image('tile5', 'assets/tiles/tile5.png')
        this.load.image('tile6', 'assets/tiles/tile6.png')
        this.load.image('tile7', 'assets/tiles/tile7.png')
        this.load.image('tile8', 'assets/tiles/tile8.png')
        this.load.image('tile9', 'assets/tiles/tile9.png')
        this.load.image('tile10', 'assets/tiles/tile10.png') 
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

function saveGameToFirebase(room) {
    gameCollection.add(room)
        .catch(function(error) {
            console.error("Error adding document: ", error);
        })
}