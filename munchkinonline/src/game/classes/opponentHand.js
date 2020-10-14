import OpponentCard from '../classes/opponentCard'

export default class OppositeHand {
    constructor(scene) {
        this.dimensions = {x: 0, y: 0, width: 0, height: 0, cardHeight: 0, cardWidth: 0}

        this.render = (x, y, width, height, cardWidth, cardHeight) => {
            this.dimensions.x = x 
            this.dimensions.y = y 
            this.dimensions.width = width 
            this.dimensions.height = height
            this.dimensions.cardHeight = cardHeight
            this.dimensions.cardWidth = cardWidth
            let outline = scene.add.graphics()
            outline.lineStyle(4, 0x000000)
            outline.strokeRect(x, y, width, height)
        }

        this.addCards = (n, position, sprite) => {
            for(let i = 0; i < n; i++) {
                let opponentCard = new OpponentCard(scene)
                let renderedCard = null
                
                if (position === "right") {
                    renderedCard = opponentCard.render(this.dimensions.x + this.dimensions.width/2, (this.dimensions.y + this.dimensions.height - this.dimensions.cardHeight) - i*this.dimensions.cardHeight, sprite)
                    renderedCard.angle = 90
                } else if (position === "left") {
                    renderedCard = opponentCard.render(this.dimensions.x + this.dimensions.width/2, (this.dimensions.y + this.dimensions.cardHeight) + i*this.dimensions.cardHeight, sprite)
                    renderedCard.angle = -90
                } else if (position === "top") {
                    renderedCard = opponentCard.render(this.dimensions.x + this.dimensions.width - this.dimensions.cardWidth - 1.5*i*this.dimensions.cardWidth, this.dimensions.y + this.dimensions.height/2, sprite)
                    renderedCard.angle = 180
                } else {
                    console.log("Error adding cards to hand: unknown position")
                }
            }
        }
    }
}