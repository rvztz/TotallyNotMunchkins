export default class PlayerList {
    constructor(scene, dimensions) {
        this.dimensions = {x: dimensions.x, y: dimensions.y, width: dimensions.width, height: dimensions.width*0.6}
        this.usernames = []

        this.addUsername = (text) => {
            console.log(text)
            let startY = 0;
            if (this.usernames.length >= 4) {
                console.log("Error: no more than 4 players allowed in the room.")
                return
            } else if (this.usernames.length == 0) {
                startY = this.dimensions.y // use the y coordinate of the container
            } else {
                startY = this.usernames[this.usernames.length - 1].y // use the y coordinate of the last element added
            }

            let newUsername = scene.add.text(this.dimensions.x, startY, text, {fontFamily: 'Avenir, Helvetica, Arial, sans-serif'})
            newUsername.setFontSize(24).setColor('#000').setOrigin(0.5,0.5)
            newUsername.y += newUsername.displayHeight*1.5

            this.usernames.push(newUsername)
        }

        this.deleteUsername = (text) => {
             let index;
             this.usernames.forEach((user, i) => {
                if (user.text === text) {
                    index = i
                } else {
                    console.log("Error: username not found")
                }
             })
 
            for (let i = this.usernames.length - 1; i > index; i--) {
                this.usernames[i].x = this.usernames[i - 1].x
                this.usernames[i].y = this.usernames[i - 1].y
            }

            this.usernames[index].destroy()
            this.usernames.splice(index, 1)
        }

        this.deleteAll = () => {
            while (this.usernames.length > 0) {
                this.deleteUsername(this.usernames[0].text)
            }
        }
    }
}