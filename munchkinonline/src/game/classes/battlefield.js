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
                this.center.render(640, 300)
                this.targetMonster(this.center)
            } else if (this.left == null) {
                this.left = new Monster(scene, cardData)
                this.left.render(380, 300)
            } else if (this.right == null) {
                this.right = new Monster(scene, cardData)
                this.right.render(900, 300)
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
            this.askForHelpButton = scene.add.image(792, 520, 'askHelpBtn').setInteractive({ cursor: 'pointer' })
        }

        this.fight = () => {
            let playerPower = scene.player.getFullStrength()
            let monsterPower = this.getTargettedMonsterPower()

            if (playerPower > monsterPower) {
                console.log("YOU WIN")
            } else {
                console.log("YOU DIE")
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

        this.getTargettedMonsterPower = () => {
            if (this.center.selected) {
                return this.center.strength
            } else if (this.left.selected) {
                return this.left.strength
            } else if (this.right.selected) {
                return this.right.strength
            } else {
                console.log("Error: unexpected targetted monster")
            }
        }
    }
}