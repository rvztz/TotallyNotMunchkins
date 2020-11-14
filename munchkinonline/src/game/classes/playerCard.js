export default class PlayerCard {
    constructor(scene, deck) {
        this.render = (x, y, card) => {
            let newCard = scene.add.image(x, y, card.smallImage).setScale(0.1, 0.1).setInteractive({ cursor: 'pointer' })
            scene.input.setDraggable(newCard);

            newCard.on('pointerover', () => {
                scene.cardView.setTexture(card.bigImage)
            })

            newCard.setData({type: 'card', deck: deck, data: card})
            return newCard
        }
    }
}