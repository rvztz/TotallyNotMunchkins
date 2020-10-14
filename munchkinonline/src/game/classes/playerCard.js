export default class PlayerCard {
    constructor(scene, cardType) {
        this.render = (x, y, card) => {
            let newCard = scene.add.image(x, y, card.image).setScale(0.1, 0.1).setInteractive({ cursor: 'pointer' })
            scene.input.setDraggable(newCard);

            newCard.setData({type: 'card', cardType: cardType, data: card})
            return card
        }
    }
}