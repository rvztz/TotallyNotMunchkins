export default class Deck {
    constructor (scene, type) {
        this.type = type
        
        this.render = (x, y, sprite, cW, cH) => {
            let deck = scene.add.image(x+cW/2, y+cH/2, sprite).setScale(0.7, 0.7).setInteractive({ cursor: 'pointer' })

            deck.on('pointerup', function (pointer) {
                // Add a card to player's hand
                console.log(pointer)
                scene.playerHand.addCards(1)
            });
        }
    }
}