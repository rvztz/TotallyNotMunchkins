import OpponentCard from '../classes/opponentCard'

export default class OppositeHand {
    constructor(scene, position, socketId) {
        this.dimensions = {x: 0, y: 0, width: 0, height: 0, cardHeight: 0, cardWidth: 0}
        this.position = position
        this.cards = []
        this.renderedCards = []
        this.socketId = socketId

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

             //  A drop zone
            let zone = scene.add.zone(x + width/2, y + height/2, width, height).setRectangleDropZone(width, height)
            zone.setData({type: 'opponentHand', ownerId: this.socketId})
        }

        this.updateCards = (cards) => {
            this.cards = cards
            this.loadCards()
        }
        
        this.loadCards = () => {
            this.destroyRenderedCards()
            const maxCards = 3
            
            this.cards.forEach((cardType, i) => {
                let opponentCard = new OpponentCard(scene)
                let renderedCard = null

                let sprite = (cardType === 'door') ? 'doorCard' : 'treasureCard'

                if (this.position === 'right') {
                    renderedCard = opponentCard.render(this.dimensions.x + this.dimensions.width/2, (this.dimensions.y + this.dimensions.height - this.dimensions.cardHeight) - i*(this.dimensions.cardHeight / maxCards), sprite)
                    renderedCard.angle = 90
                } else if (this.position === 'left') {
                    renderedCard = opponentCard.render(this.dimensions.x + this.dimensions.width/2, (this.dimensions.y + this.dimensions.cardHeight) + i*(this.dimensions.cardHeight / maxCards), sprite)
                    renderedCard.angle = -90
                } else if (this.position === 'top') {
                    renderedCard = opponentCard.render(this.dimensions.x + this.dimensions.width - this.dimensions.cardWidth - 1.5*i*(this.dimensions.cardWidth/maxCards), this.dimensions.y + this.dimensions.height/2, sprite)
                    renderedCard.angle = 180
                } else {
                    console.log("Error adding cards to hand: unknown position")
                }

                this.renderedCards.push(renderedCard)
            })
        }

        this.destroyRenderedCards = () => {
            this.renderedCards.forEach(card => {
                card.destroy()
            })
        }
    }
}