export default class Deck {
    constructor (scene, cardType) {
        
        this.render = (x, y, sprite, cW, cH) => {
            let deck = scene.add.image(x+cW/2, y+cH/2, sprite).setScale(0.7, 0.7).setInteractive({ cursor: 'pointer' })

            deck.on('pointerup', function () {
                // Add a card to player's hand
                let sprite = (cardType === 'door') ? 'doorCard' : 'treasureCard'
                scene.playerHand.addCards(1, cardType, sprite)
            });
        }
    }
}