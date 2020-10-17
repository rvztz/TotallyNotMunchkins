export default class Deck {
    constructor (scene, cardType) {
        this.cardType = cardType
        
        this.render = (x, y, sprite, cW, cH) => {
            let deck = scene.add.image(x+cW/2, y+cH/2, sprite).setScale(0.7, 0.7).setInteractive({ cursor: 'pointer' })

            deck.on('pointerup', function () {

                let chosenCards = (cardType === 'door') ? [scene.cardList.doors.monsters[0], scene.cardList.doors.monsters[1]] : [scene.cardList.treasures.equipment[0]] // Get a random card from list in server

                chosenCards.forEach((card, index) => {
                    scene.player.addToHand(card, index)
                })
            });
        }
    }
}