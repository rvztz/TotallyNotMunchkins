import io from 'socket.io-client'
import Phaser from 'phaser'

export default class Lobby extends Phaser.Scene {
    constructor() {
        super({
            key: 'Lobby'
        })
    }

    init(data) {
        if (data.socket == null) {
            this.socket = io('http://localhost:3000')
            this.socket.emit(localStorage.getItem('roomEvent'), localStorage.getItem('roomName'))
        } else {
            this.socket = data.socket   
        }
    }
    
    preload() {
        this.load.image('pogmin', 'assets/Pogmin.jpg')
        this.load.image('playButton', 'assets/playButton.png')
    }

    create() {
        const hWidth = this.scale.width
        const vHeight = this.scale.height

        this.roomName = localStorage.getItem('roomName')

        let playButton = this.add.image(hWidth/2, vHeight/2, 'playButton').setInteractive({ cursor: 'pointer' })

        playButton.on('pointerup', () => {
            this.socket.emit('startGame', this.roomName)
        })

        this.socket.on('startGame', (socketList) => {
            this.scene.start('GameScene', {socket: this.socket, roomName: this.roomName, socketList: socketList})
        })
    }

    update() {

    }
}