import Card from './card'
import Equipment from '../classes/equipment'

export default class PlayerHand {
    constructor(scene) {
        this.dimensions = {x: 0, y: 0, width: 0, height: 0, cardHeight: 0, cardWidth: 0}

        this.render = (x, y, width, height, cardWidth, cardHeight) => {
            this.dimensions.x = x 
            this.dimensions.y = y 
            this.dimensions.width = width 
            this.dimensions.height = height
            this.dimensions.cardWidth = cardWidth
            this.dimensions.cardHeight = cardHeight

            let outline = scene.add.graphics()
            outline.lineStyle(4, 0x000000)
            outline.strokeRect(x, y, width, height)
            this.dividerLine = scene.add.line(0, 0, x + width*0.4, height/2 + y, x + width*0.4, 1.5*height + y, 0x000)

            this.dropZone = scene.add.zone(x + width*0.2, y + height/2, width*0.4*0.8, height*0.8).setRectangleDropZone(width*0.4*0.8, height*0.8)
            this.dropZone.setData({type: "hand"})

            this.equipment = new Equipment(scene, x + width*0.4, y, width*0.6, height, cardWidth, cardHeight)
            this.equipment.renderSlots()
        }

        this.addCards = (n, cardType, sprite) => {
            for(let i = 0; i < n; i++) {
                let playerCard = new Card(scene, cardType)
                playerCard.render(this.dimensions.x + this.dimensions.cardWidth + 1.5*i*this.dimensions.cardWidth, this.dimensions.y + this.dimensions.height/2, sprite)
            }
        }
    }
}