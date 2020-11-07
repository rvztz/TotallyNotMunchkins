import Monster from './monster'

export default class Battlefield {
    constructor(scene) {
        this.center = null
        this.left = null
        this.right = null

        this.addMonster = (cardData) => {
            if (this.center == null) {
                this.center = new Monster(scene, cardData)
                this.center.render(640, 300)
            } else if (this.left == null) {
                this.left = new Monster(scene, cardData)
            } else if (this.right == null) {
                this.right = new Monster(scene, cardData)
            } else {
                console.log("Error: monster limit exceeded")
            }
        }

    }
}