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
        
        this.render = (x, y) => {
            let monster = scene.add.image(x, y, this.image).setScale(0.5, 0.5).setInteractive({ cursor: 'pointer' })
            monster.setTint(0xCCCCCC)

            monster.on('pointerup', () => {
                scene.battlefield.targetMonster(this)
            })
            
            this.renderedMonster = monster
            return monster
        }

        this.deselect = () => {
            this.selected = false
            this.renderedMonster.setTint(0xCCCCCC)
        }
    }
}