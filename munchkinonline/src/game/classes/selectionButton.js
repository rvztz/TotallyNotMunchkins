export default class SelectionButton {
    constructor(scene, type, value) {
        this.type = type
        this.value = value

        this.render = (x, y, sprite) => {
            let button = scene.add.image(x, y, sprite).setScale(0.1, 0.1).setInteractive({ cursor: 'pointer' })

            button.on('pointerup', () => {
                scene.selection.loadCircle(button.x, button.y, button.displayWidth, this.type)
                scene.socket.emit('selectAttribute', this.type, this.value)
            });

            return button
        }
    }
}