
export default class Board extends RexPlugins.Board.Board {
    constructor(scene, x, y) {
        super(scene, {
            grid: scene.rexBoard.add.quadGrid({
                x: x,
                y: y,
                cellWidth: 50,
                cellHeight: 50,
                type: 0
            }),
            width: 10,
            height: 10
        });
    }
}