export default class Discard {
    constructor(scene, type) {
        this.type = type

        this.render = (x, y, sprite, cW, cH) => {
            let discard = scene.add.image(x+cW/2, y+cH/2, sprite).setInteractive()
            discard.input.dropZone = true
            discard.setData({type: 'discard', cardType: this.type})

            return discard
        }
    }
}