export default class Deck {
    constructor (scene, cardType) {
        this.cardType = cardType
        
        this.render = (x, y, sprite, cW, cH) => {
            let deck = scene.add.image(x+cW/2, y+cH/2, sprite).setScale(0.7, 0.7).setInteractive({ cursor: 'pointer' })

            deck.on('pointerup', () => {
                scene.socket.emit('requestCards', scene.roomName, this.cardType, 1)
            });
        }
    }
}