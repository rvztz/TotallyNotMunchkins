import Monster from './monster'

export default class Battlefield {
    constructor(scene) {
        this.center = null
        this.left = null
        this.right = null

        this.fightButton = null
        this.runButton = null
        this.askForHelpButton = null
        this.offerHelpButton = null

        this.addMonster = (cardData) => {
            if (this.center == null) {
                this.center = new Monster(scene, cardData)
                this.center.render(640, 300, 'center')
                this.targetMonster(this.center)
            } else if (this.left == null) {
                this.left = new Monster(scene, cardData)
                this.left.render(380, 300, 'left')
            } else if (this.right == null) {
                this.right = new Monster(scene, cardData)
                this.right.render(900, 300, 'right')
            } else {
                console.log("Error: monster limit exceeded")
            }
        }

        this.renderButtons = () => {
            this.fightButton = scene.add.image(640, 520, 'fightBtn').setInteractive({ cursor: 'pointer' })
            this.fightButton.on('pointerup', () => {
                this.fight()
            })

            this.runButton = scene.add.image(488, 520, 'runBtn').setInteractive({ cursor: 'pointer' })
            this.runButton.on('pointerup', () => {
                this.run()
            })

            this.askForHelpButton = scene.add.image(792, 520, 'askHelpBtn').setInteractive({ cursor: 'pointer' })
        }

        this.fight = () => {
            let playerPower = scene.player.getFullStrength()
            let targettedMonster = this.getTargettedMonster()

            if (playerPower > targettedMonster.strength) {
                scene.player.levelUp(targettedMonster.levelsGained)
                scene.socket.emit('requestCards', scene.roomName, 'treasure', targettedMonster.treasuresDropped, /* isPublic */ false)

                this.removeTargettedMonster()
            } else {
                scene.player.die()
                this.removeAllMonsters()
                scene.socket.emit('endCombat', scene.roomName)
            }
        }

        this.run = () => {
            let rng = Math.floor(Math.random() * 6 + 1) 
            
            if(rng >= 5) {
                //YOU ESCAPED
                this.removeTargettedMonster()
                this.targetFirstMonster()
            } else {
                // YOU DIE
                scene.player.die()
                this.removeAllMonsters()
                scene.socket.emit('endCombat', scene.roomName)
            }
        }

        this.targetMonster = (monster) => {
            if (this.center != null) {
                this.center.deselect()
            }

            if (this.left != null) {
                this.left.deselect()
            }

            if (this.right != null) {
                this.right.deselect()
            }

            monster.selected = true
            monster.renderedMonster.clearTint()
        }

        this.getTargettedMonster = () => {
            if (this.center != null && this.center.selected) {
                return this.center
            } else if (this.left != null && this.left.selected) {
                return this.left
            } else if (this.right != null && this.right.selected) {
                return this.right
            } else {
                console.log("Error: unexpected targetted monster")
            }
        }

        this.removeAllMonsters = () => {
            if (this.center != null) {
                scene.socket.emit('returnCard', scene.roomName, this.center.name, 'door')
                scene.socket.emit('removeMonsterAt', scene.roomName, 'center')
            }
            
            if (this.left != null) {
                scene.socket.emit('returnCard', scene.roomName, this.left.name, 'door')
                scene.socket.emit('removeMonsterAt', scene.roomName, 'left')
            } 
            
            if (this.right != null) {
                scene.socket.emit('returnCard', scene.roomName, this.right.name, 'door')
                scene.socket.emit('removeMonsterAt', scene.roomName, 'right')
            }
        }

        this.removeTargettedMonster = () => {
            if (this.center != null && this.center.selected) {
                scene.socket.emit('returnCard', scene.roomName, this.center.name, 'door')
                scene.socket.emit('removeMonsterAt', scene.roomName, 'center')
            } else if (this.left != null && this.left.selected) {
                scene.socket.emit('returnCard', scene.roomName, this.left.name, 'door')
                scene.socket.emit('removeMonsterAt', scene.roomName, 'left')
            } else if (this.right != null && this.right.selected) {
                scene.socket.emit('returnCard', scene.roomName, this.right.name, 'door')
                scene.socket.emit('removeMonsterAt', scene.roomName, 'right')
            } else {
                console.log("Error: unexpected targetted monster")
            }
        }

        this.removeMonsterAt = (position) => {
            switch (position) {
                case 'center':
                    this.center.renderedMonster.destroy()
                    this.center = null
                    console.log("After remove monster at")
                    console.log(this.center)
                    break
                case 'left':
                    this.left.renderedMonster.destroy()
                    this.left = null
                    break
                case 'right':
                    this.right.renderedMonster.destroy()
                    this.right = null
                    break
                default: console.log("Error: unexpected position")
            }

            this.targetFirstMonster()
        }

        this.removeButtons = () => {
            this.fightButton.destroy()
            this.runButton.destroy()
            this.askForHelpButton.destroy()
            //this.offerHelpButton.destroy()
        }

        this.beginCombat = (card) => {
            scene.gameState.startCombat()
            scene.socket.emit('disabledLoot', scene.roomName)

            scene.combatBackground = scene.add.rectangle(212, 109, 855, 482, 0x999999).setAlpha(0.6).setOrigin(0, 0)
            if (scene.gameState.isYourTurn()) {
                this.renderButtons()
            }
            this.addMonster(card)
            this.addMonster(card)
            this.addMonster(card)
        }

        this.endCombat = () => {
            scene.gameState.endCombat()
            if (scene.gameState.isYourTurn()) {
                this.removeButtons()
            }
            scene.combatBackground.destroy()
        }

        this.targetFirstMonster = () => {
            if (this.center != null) {
                console.log('First target center: ')
                console.log(this.center)
                this.targetMonster(this.center)
            } else if (this.left != null) {
                console.log('First target left: ')
                console.log(this.left)
                this.targetMonster(this.left)
            } else if (this.right != null) {
                console.log('First target right: ')
                console.log(this.right)
                this.targetMonster(this.right)
            } else {
                scene.socket.emit('endCombat', scene.roomName)
            }
        }
    }
}