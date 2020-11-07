export default class Monster {
    constructor(scene, cardData) {
        this.renderedMonster = null

        this.name = cardData.name
        this.level = cardData.level
        this.levelsGained = cardData.levelsGained
        this.treasuresDropped = cardData.treasuresDropped
        this.image = cardData.bigImage

        this.render = (x, y) => {
            let monster = scene.add.image(x, y, this.image).setScale(0.5, 0.5)
            
            this.renderedMonster = monster
            return monster
        }
    }
}