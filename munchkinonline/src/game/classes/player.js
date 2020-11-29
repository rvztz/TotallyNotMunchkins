import PlayerHand from '../classes/playerHand'
import Token from '../classes/token'
import swal from 'sweetalert'

export default class Player {
    constructor(scene) {
        // UI Elements
        this.playerHand = new PlayerHand(scene)
        this.token = new Token(scene)
        this.color = null
        this.colorString = null

        this.userName = null

        // Data
        this.cards = []
        this.level = 1
        this.equipment = []
        this.gender = ""
        this.effects = 0
        this.helper = null
        this.isDead = false

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

        this.levelUp = (n) => {
            this.level += n
            this.level = Math.min(this.level, 10)
            this.level = Math.max(this.level, 1)
            this.token.renderedToken.data.set('level', this.level)
            scene.socket.emit('addToLog', scene.roomName, `${this.userName}'s level is now ${this.level}.`)
            scene.socket.emit('updateLevel', scene.roomName, this.level)
            scene.socket.emit('updateStrength', scene.roomName, this.getFullStrength())
        }

        this.resetLevel = () => {
            this.level = 1
            this.token.renderedToken.data.set('level', this.level)
            scene.socket.emit('updateLevel', scene.roomName, this.level)
            scene.socket.emit('updateStrength', scene.roomName, this.getFullStrength())
        }

        this.resetHand = () => {
            this.playerHand.renderedCards.forEach(renderedCard => {
                renderedCard.destroy()
            })
            this.playerHand.renderedCards = []

            while (this.cards.length > 0) {
                scene.socket.emit('removeCard', scene.roomName, 0)
                scene.socket.emit('returnCard', scene.roomName, this.cards[0].name, this.cards[0].deck)
                this.removeCardAt(0)
            }
        }

        this.resetEquipment = () => {
            this.playerHand.equipment.renderedSlots.forEach(renderedSlot => {
                renderedSlot.data.set("available", true)
            })

            while (this.equipment.length > 0) {
                scene.socket.emit('returnCard', scene.roomName, this.equipment[0].name, this.equipment[0].deck)
                this.removeFromEquipmentAt(0)
            }
        }

        this.updateLevel = (level) => {
            this.level = level
            this.token.renderedToken.data.set('level', this.level)
        }

        this.buff = (amount) => {
            this.effects += amount
            scene.socket.emit('updateStrength', scene.roomName, this.getFullStrength())
        }

        this.resetBuffs = () => {
            this.effects = 0
            scene.socket.emit('updateStrength', scene.roomName, this.getFullStrength())
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

        this.getHelperStrength = () => {
            let strength = 0

            if (this.helper) {
                scene.opponents.forEach(opponent => {
                    if (opponent.socketId == this.helper) {
                        strength = opponent.strength
                    }
                })
            } 

            return strength
        } 

        this.die = () => {
            this.resetLevel()
            this.buff(this.effects * -1)
            this.resetHand()
            this.resetEquipment()
            this.isDead = true
        }

        this.resurrect = () => {
            this.isDead = false
            scene.socket.emit('addToLog', scene.roomName, `${this.userName} resurrected.`)
        }

        this.equipCard = (card, placedOn, slotType, available) => {
            if (card.type != 'equipment') {
                swal("Oops!", "You can't equip that card.", "error")
                return false
            }

            if (card.slotType != slotType) {
                swal("Oops!", "This is the wrong slot for that card.", "error")
                return false
            }

            if(placedOn === "equipment") {
                swal("Oops!", "That card was already on your equipment", "error")
                return false
            }

            if(!available) {
                swal("Oops!", "That slot isn't available.", "error")
                return false
            }

            this.equipment.push(card)
            scene.socket.emit('updateStrength', scene.roomName, this.getFullStrength())
            
            return true
        }

        this.findCardInEquipment = (card) => {
            for (let i = 0; i < this.equipment.length; i++) {
                if (card == this.equipment[i]) {
                    return i
                }
            }
            return -1
        }

        this.removeFromEquipmentAt = (index) => {
            this.equipment.splice(index, 1)
            scene.socket.emit('updateStrength', scene.roomName, this.getFullStrength())
        }

        this.returnEquipmentToHand = (cardData) => {
            let equipmentIndex = this.findCardInEquipment(cardData)
            if(equipmentIndex === -1) {
                console.log("Error: card not found in equipment")
                return
            }

            this.removeFromEquipmentAt(equipmentIndex)
            this.cards.push(cardData)
            scene.socket.emit('updatePlayerHand', scene.roomName, cardData.deck)
        }
    }
}