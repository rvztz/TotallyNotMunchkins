export default class Deck {
    constructor (scene, cardType) {
        this.cardType = cardType
        
        this.render = (x, y, sprite, cW, cH) => {
            let deck = scene.add.image(x+cW/2, y+cH/2, sprite).setInteractive({ cursor: 'pointer' })

            deck.on('pointerup', () => {
                if (scene.gameState.isYourTurn()) {
                    if (!scene.gameState.cardDrawn){
                        scene.socket.emit('requestCards', scene.roomName, this.cardType, 1, /* isPublic */ true)
                        scene.socket.emit('drewCard', scene.roomName)
                    } else if (scene.gameState.canLootTheRoom) {
                        scene.socket.emit('requestCards', scene.roomName, this.cardType, 1, /* isPublic */ false)
                        scene.socket.emit('disabledLoot', scene.roomName)
                    } else {
                        alert("You can't pick up a card right now.")
                    }
                } else {
                    alert("You can't pick up a card right now.")
                }
            });
        }
    }
}