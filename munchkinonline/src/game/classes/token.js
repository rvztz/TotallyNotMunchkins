export default class Token {
    constructor(scene) {

        this.render = (x,y,sprite) => {
            let token = scene.add.image(x, y, sprite).setScale(0.1, 0.1).setInteractive({ cursor: 'pointer' })
            token.x += token.displayWidth
            token.y += token.displayHeight

            scene.input.setDraggable(token);

            token.setData({type: 'token', level: 1})
            return token
        }
    }
}