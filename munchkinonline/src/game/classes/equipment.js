import Slot from '../classes/slot'

export default class Equipment {
    constructor(scene, x, y, width, height, cardWidth, cardHeight) {
        this.dimensions = {x: x, y: y, width: width, height: height, cardWidth: cardWidth, cardHeight: cardHeight}
        this.slots = [
            {
                equipmentType: 'head',
                image: 'head'  
            },
            {
                equipmentType: 'hand',
                image: 'rightArm'
            },
            {
                equipmentType: 'torso',
                image: 'torso'
            },
            {
                equipmentType: 'hand',
                image: 'leftArm'
            },
            {
                equipmentType: 'legs',
                image: 'legs'
            },
            {
                equipmentType: 'feet',
                image: 'feet'
            },
        ]

        this.renderSlots = () => {
            for(let i = 0; i < this.slots.length; i++) {
                let newSlot = new Slot(scene, this.slots[i].equipmentType)
                newSlot.render(this.dimensions.x + this.dimensions.cardWidth + 7 + 1.6*i*this.dimensions.cardWidth, this.dimensions.y + this.dimensions.height/2, this.slots[i].image)
            }
        }
    }
}