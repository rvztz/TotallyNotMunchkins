import Card from '../classes/card'

export default class OppositeHand {
    constructor(scene) {
        this.dimensions = {x: 0, y: 0, width: 0, height: 0}

        this.render = (x,y,width,height) => {
            this.dimensions.x = x 
            this.dimensions.y = y 
            this.dimensions.width = width 
            this.dimensions.height = height 
            let outline = scene.add.graphics()
            outline.lineStyle(4, 0x000000)
            outline.strokeRect(x, y, width, height)
        }

        this.addCards = (n, cardWidth, cardHeight, position) => {
            for(let i = 0; i < n; i++) {
                let opponentCard = new Card(scene)
                let renderedCard = null
                
                if (position === "right") {
                    renderedCard = opponentCard.render(this.dimensions.x + this.dimensions.width/2, (this.dimensions.y + this.dimensions.height - cardHeight) - i*cardHeight, 'cardBack')
                    renderedCard.angle = 90
                } else if (position === "left") {
                    renderedCard = opponentCard.render(this.dimensions.x + this.dimensions.width/2, (this.dimensions.y + cardHeight) + i*cardHeight, 'cardBack')
                    renderedCard.angle = -90
                } else if (position === "top") {
                    renderedCard = opponentCard.render(this.dimensions.x + this.dimensions.width - cardWidth - 1.5*i*cardWidth, this.dimensions.y + this.dimensions.height/2, 'cardBack')
                    renderedCard.angle = 180
                } else {
                    console.log("Error adding cards to hand: unknown position")
                }
                /*
                if (vertical) {
                    playerCard.render(this.dimensions.x + cardWidth/2 + 30, this.dimensions.y + cardHeight/2 + i*75 + 18 *, 'cardBack')
                } else {
                    playerCard.render((this.dimensions.x + cardWidth/2 + i*75 + 30) * dx, (this.dimensions.y + cardHeight/2 + 18) * dy, 'cardBack')
                }
                */
            }
        }
    }
}