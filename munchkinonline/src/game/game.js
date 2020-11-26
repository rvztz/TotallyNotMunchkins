import Phaser from 'phaser'
import GameScene from './scenes/gamescene.js'
import Lobby from './scenes/lobby.js'

function launch(containerId) {
    return new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerId,
        backgroundColor: 0xffffff,
        physics: {
            default: 'arcade',
            arcade: { debug: false }
        },
        scene: [
            Lobby,
            GameScene
        ],
        scale: {
            mode: Phaser.Scale.FIT,
            width: 1280,
            height: 720
        }
    })
}

export default launch
export { launch }