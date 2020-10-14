export default class Slot {
    constructor(scene, type) {
        this.render = (x, y, sprite) => {
            let slot = scene.add.image(x, y, sprite).setScale(0.6, 0.6).setInteractive()
            slot.input.dropZone = true
            slot.setData({type: 'slot', equipmentType: type})
        }
    }
}