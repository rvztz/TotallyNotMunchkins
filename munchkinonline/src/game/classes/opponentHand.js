export default class OppositeHand {
    constructor(scene) {
        this.render = (x,y,width,height) => {
            let outline = scene.add.graphics()
            outline.lineStyle(4, 0x000000)
            outline.strokeRect(x, y, width, height)
        }
    }
}