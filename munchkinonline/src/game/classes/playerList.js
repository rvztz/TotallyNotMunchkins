export default class PlayerList {
    constructor(scene, dimensions) {
        this.dimensions = {x: dimensions.x, y: dimensions.y, width: dimensions.width, height: dimensions.width*0.6}
        this.usernames = []

        this.addUsername = (text) => {
            let startY = 0;
            if (this.usernames.length >= 4) {
                console.log("Error: no more than 4 players allowed in the room.")
                return
            } else if (this.usernames.length == 0) {
                startY = this.dimensions.y // use the y coordinate of the container
            } else {
                startY = this.usernames[this.usernames.length - 1].username.y // use the y coordinate of the last element added
            }

            let newUsername = scene.add.text(this.dimensions.x, startY, text, {fontFamily: 'Avenir, Helvetica, Arial, sans-serif'})
            newUsername.setFontSize(24).setColor('#000').setOrigin(0.5,0.5)
            newUsername.y += newUsername.displayHeight*1.5

            let kickButton = scene.add.image(newUsername.x + 200, newUsername.y, 'kickButton').setInteractive({cursor: 'pointer'})
            kickButton.on('pointerup', () => {
                scene.socket.emit('kickPlayer', scene.roomName, text)
            })

            this.usernames.push({username: newUsername, button: kickButton})
        }

        this.deleteUsername = (text) => {
            let index = -1;
            this.usernames.forEach((user, i) => {
                if (user.username.text === text) {
                    index = i
                } 
            })

            if (index === -1) {
                console.log("Error: username not found")
                return
            }

           this.usernames[index].username.destroy()
           this.usernames[index].button.destroy()
           this.usernames.splice(index, 1)
       }

       this.highlightName = (name) => {
            let index = -1;
            this.usernames.forEach((user, i) => {
                if (user.username.text === name) {
                    index = i
                } 
            })

            if (index === -1) {
                console.log("Error: username not found")
                return
            }
            
            this.usernames[index].username.setColor("#1E8000")
       }

        this.deleteAll = () => {
            while (this.usernames.length > 0) {
                this.deleteUsername(this.usernames[0].username.text)
            }
        }
    }
}