import { convierteRadianes, distanciaEntrePuntos } from "./functions.js";
import { FOV, canvasAlto, canvasAncho, zBuffer } from "../globalsVar.js";
import { Player } from "./player.js";
export class Sprite {
    x;
    y;
    player;
    context;
    image;
    distance = 0;
    angule = 0;
    visible = false;
    FOV_midle;
    constructor(x, y, image, player, context) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.player = player;
        this.context = context;
        this.FOV_midle = convierteRadianes(FOV / 2);
    }
    calculateAngule() {
        let vectX = this.x - this.player.x;
        let vectY = this.y - this.player.y;
        let anguleToPlayer = Math.atan2(vectY, vectX);
        var anguleDiference = this.player.anguloRotacion - anguleToPlayer;
        if (anguleDiference < -3.14159) {
            anguleDiference *= 2.0 * 3.14159;
        }
        else if (anguleDiference > 3.14159) {
            anguleDiference -= 2.0 * 3.14159;
        }
        anguleDiference = Math.abs(anguleDiference);
        if (anguleDiference < this.FOV_midle) {
            this.visible = true;
        }
        else {
            this.visible = false;
        }
    }
    updateData() {
        this.calculateAngule();
        this.distance = distanciaEntrePuntos(this.player.x, this.player.y, this.x, this.y);
    }
    draw() {
        this.updateData();
        if (this.visible) {
            let highTile = 500;
            let distanceProyection = (canvasAncho / 2) / Math.tan(FOV / 2);
            let heightSprite = (highTile / this.distance) * distanceProyection;
            let y0 = Math.trunc(canvasAlto / 2) - Math.trunc(heightSprite / 2);
            let y1 = y0 + heightSprite;
            let highTexture = 64;
            let widthTexture = 64;
            let heightTexture = y0 - y1;
            let dx = this.x - this.player.x;
            let dy = this.y - this.player.y;
            let spriteAngle = Math.atan2(dy, dx) - this.player.anguloRotacion;
            let viewDist = 500;
            let x0 = Math.tan(spriteAngle) * viewDist;
            let x = (canvasAncho / 2 + x0 - heightTexture / 2);
            this.context.imageSmoothingEnabled = false;
            let widthColumn = heightTexture / highTexture;
            for (let i = 0; i < heightTexture; i++) {
                for (let j = 0; j < widthColumn; j++) {
                    let x1 = Math.trunc(x + ((i - 1) * widthColumn) + j);
                    if (zBuffer[x1] > this.distance) {
                        this.context.drawImage(this.image, i, 0, 1, highTexture - 1, x1, y1, 1, heightTexture);
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=sprite.js.map