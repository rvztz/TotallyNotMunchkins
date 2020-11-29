import swal from 'sweetalert'

export default class Monster {
    constructor(scene, cardData) {
        this.renderedMonster = null
        this.selected = false

        this.name = cardData.name
        this.level = cardData.level
        this.strength = this.level
        this.levelsGained = cardData.levelsGained
        this.treasuresDropped = cardData.treasuresDropped
        this.image = cardData.bigImage
        
        this.render = (x, y, position) => {
            let monster = scene.add.image(x, y, this.image).setScale(0.5, 0.5).setInteractive({ cursor: 'pointer' })
            monster.setTint(0xCCCCCC)
            monster.input.dropZone = true
            monster.setData({type: 'monster', position: position})

            if(scene.gameState.isYourTurn()) {
                monster.on('pointerup', () => {
                    scene.battlefield.targetMonsterAt(position)
                    scene.socket.emit('targetMonsterAt', scene.roomName, position)
                })
            }

            monster.on('pointerover', () => {
                scene.strengthText.text = `${this.strength}`
                if (this.strength < 10) {
                    scene.strengthText.text = '0' + scene.strengthText.text
                }
                scene.strengthText.setColor("#000")
            })
            
            this.renderedMonster = monster 
            return monster
        }

        this.deselect = () => {
            this.selected = false
            this.renderedMonster.setTint(0xCCCCCC)
        }

        this.useCard = (card) => {
            if (card.type != "item" || !card.usableOnMonster) {
                swal("Oops!", "You can't use this card on a monster", "error")
                return false
            }

            if(scene.useCardEffect(card, this)) {
                scene.socket.emit('useCardOnMonster', scene.roomName, card, this.renderedMonster.data.get('position'))
                return true
            }

            return false
        }

        this.buff = (bonus) => {
            this.strength += bonus
        }
    }
}