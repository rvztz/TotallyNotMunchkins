import Card from './card'

export default class PlayerHand {
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
            this.dividerLine = scene.add.line(0, 0, x + width*0.4, height/2 + y, x + width*0.4, 1.5*height + y, 0x000)
        }

        this.addCards = (n, cardWidth, cardHeight) => {
            for(let i = 0; i < n; i++) {
                let playerCard = new Card(scene)
                console.log(playerCard.width)
                playerCard.render(this.dimensions.x + cardWidth/2 + i*75 + 30, this.dimensions.y + cardHeight/2 + 18, 'cardBack')
            }
        }
    }    
}