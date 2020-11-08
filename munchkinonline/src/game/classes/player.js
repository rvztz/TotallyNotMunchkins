import PlayerHand from '../classes/playerHand'
import Token from '../classes/token'

export default class Player {
    constructor(scene) {
        // UI Elements
        this.playerHand = new PlayerHand(scene)
        this.token = new Token(scene)
        this.color = null
        this.colorString = null

        // Data
        this.cards = []
        this.level = 1
        this.equipment = []
        this.strength = 1
        this.gender = ""
        this.effects = 0

        // Renders
        this.renderHand = (x, y, width, height, cardWidth, cardHeight) => {
            this.playerHand.render(x, y, width, height, cardWidth, cardHeight)
        }

        this.renderToken = (startTile, index, sprite) => {
            this.token.render(startTile, index, /*isPlayerToken */ true, sprite + '-' + this.gender)
        }
        
        // Logic
        this.addToHand = (card, i) => {
            this.cards.push(card)
            this.playerHand.addCard(card, i)
            scene.socket.emit('updatePlayerHand', scene.roomName, card.deck)
        }

        this.removeCardAt = (index) => {
            this.cards.splice(index, 1)
        }

        /*
        this.getData = () => {
            return {
                cards: this.cards,
                level: this.level,
                equipment: this.equipment,
                strength: this.strength
            }
        }
        */

        this.levelUp = (n) => {
            this.level += n
            this.level = Math.min(this.level, 10)
            this.level = Math.max(this.level, 1)
            this.token.renderedToken.data.set('level', this.level)
            scene.socket.emit('updateLevel', scene.roomName, scene.socket.id, this.level)
        }

        this.resetLevel = () => {
            this.level = 1
            this.token.renderedToken.data.set('level', this.level)
            scene.socket.emit('updateLevel', scene.roomName, scene.socket.id, this.level)
        }

        this.updateLevel = (level) => {
            this.level = level
            this.token.renderedToken.data.set('level', this.level)
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
            this.playerHand.colorHand(this.color)
        }

        this.getEquipmentPower = () => {
            let total = 0
            this.equipment.forEach(equipment => {
                total += equipment.statBonus
            })
            return total
        }

        this.getFullStrength = () => {
            return this.level + this.getEquipmentPower() + this.effects
        }

        this.die = () => {
            this.resetLevel()
        }
    }
}