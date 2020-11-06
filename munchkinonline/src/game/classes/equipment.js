import Slot from '../classes/slot'

export default class Equipment {
    constructor(scene, x, y, width, height, cardWidth, cardHeight) {
        this.dimensions = {x: x, y: y, width: width, height: height, cardWidth: cardWidth, cardHeight: cardHeight}
        this.slots = [
            {
                equipmentType: 'head',
                image: 'slotBG'  
            },
            {
                equipmentType: 'leftArm',
                image: 'slotBG'
            },
            {
                equipmentType: 'torso',
                image: 'slotBG'
            },
            {
                equipmentType: 'rigthArm',
                image: 'slotBG'
            },
            {
                equipmentType: 'legs',
                image: 'slotBG'
            },
            {
                equipmentType: 'feet',
                image: 'slotBG'
            },
            {
                equipmentType: 'class',
                image: 'slotBG'
            },
            {
                equipmentType: 'race',
                image: 'slotBG'
            },
        ]

        this.renderSlots = () => {
            for(let i = 0; i < this.slots.length; i++) {
                let newSlot = new Slot(scene, this.slots[i].equipmentType)
                newSlot.render(this.dimensions.x + this.dimensions.cardWidth + 1.5*i*this.dimensions.cardWidth, this.dimensions.y + this.dimensions.height/2, this.slots[i].image)
            }
        }
    }
}