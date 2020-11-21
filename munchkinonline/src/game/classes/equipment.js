import Slot from '../classes/slot'

export default class Equipment {
    constructor(scene, x, y, width, height, cardWidth, cardHeight) {
        this.dimensions = {x: x, y: y, width: width, height: height, cardWidth: cardWidth, cardHeight: cardHeight}
        this.slots = [
            {
                type: 'slot',
                equipmentType: 'head',
                image: 'head',
                available: true,
            },
            {
                type: 'slot',
                equipmentType: 'hand',
                image: 'rightArm',
                available: true,
            },
            {
                type: 'slot',
                equipmentType: 'torso',
                image: 'torso',
                available: true,
            },
            {
                type: 'slot',
                equipmentType: 'hand',
                image: 'leftArm',
                available: true,
            },
            {
                type: 'slot',
                equipmentType: 'legs',
                image: 'legs',
                available: true,
            },
            {
                type: 'slot',
                equipmentType: 'feet',
                image: 'feet',
                available: true,
            },
        ]

        this.renderSlots = () => {
            for(let i = 0; i < this.slots.length; i++) {
                let newSlot = new Slot(scene, this.slots[i])
                newSlot.render(this.dimensions.x + this.dimensions.cardWidth + 7 + 1.6*i*this.dimensions.cardWidth, this.dimensions.y + this.dimensions.height/2, this.slots[i].image)
            }
        }
    }
}