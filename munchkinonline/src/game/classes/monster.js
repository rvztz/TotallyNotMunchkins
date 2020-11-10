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
            

            monster.on('drop', (pointer, gameObject, dropZone) => {
                console.log(gameObject.data.get('type'))
                console.log(dropZone.data.get('type'))
            });

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
                alert("You can't use this card on a monster.")
                return false
            }
            
            return scene.useCardEffect(card, this)
        }

        this.buff = (bonus) => {
            this.strength += bonus
        }

        /*
        useCard(card, targetId) {
        if (this.gameState.inPregame || !this.gameState.cardDrawn) {
            alert("You can't use cards right now.")
            return false
        }

        if (card.type === "curse" || card.type === "item") {
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
            return false
        }

        return true
    }
    */
    }
}