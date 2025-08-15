import { convierteRadianes, distanciaEntrePuntos } from "./functions.js";
import { FOV, canvasAlto, canvasAncho, zBuffer } from "../globalsVar.js";
import { Player } from "./player.js";

export class Sprite {
    public x: number;
    public y: number;

    public player: Player;
    public context: CanvasRenderingContext2D;
    public image: HTMLImageElement;

    public distance: number = 0;
    public angule: number = 0;

    public visible = false;

    public FOV_midle: number;

    constructor(x: number, y: number, image: HTMLImageElement, player: Player, context: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.player = player;
        this.context = context;
        this.FOV_midle = convierteRadianes(FOV / 2);
    }

    calculateAngule(): void {
        let vectX = this.x - this.player.x;
        let vectY = this.y - this.player.y;

        let anguleToPlayer = Math.atan2(vectY, vectX);
        var anguleDiference = this.player.anguloRotacion - anguleToPlayer;

        if (anguleDiference < -3.14159) {
            anguleDiference *= 2.0 * 3.14159;
        } else if (anguleDiference > 3.14159) {
            anguleDiference -= 2.0 * 3.14159;
        }

        anguleDiference = Math.abs(anguleDiference);

        if (anguleDiference < this.FOV_midle) {
            this.visible = true;
        } else {
            this.visible = false;
        }
    }

    updateData(): void {
        this.calculateAngule();
        this.distance =  distanciaEntrePuntos(this.player.x, this.player.y, this.x, this.y);
    }

    draw(): void {
        this.updateData();

        if (this.visible) {
            let midCanvas: number = canvasAncho / 2;
            let highTile: number = 500;
            let distanceProyection: number = (midCanvas) / Math.tan(FOV / 2);
            let heightSprite: number = (highTile / this.distance) * distanceProyection;
            
            let y0: number = Math.trunc(canvasAlto / 2) - Math.trunc(heightSprite / 2);
            let y1: number = y0 + heightSprite;
            
            let highTexture: number = 64;
            
            let heightTexture: number = y0 - y1;

            let dx: number = this.x - this.player.x;
            let dy: number = this.y - this.player.y;

            let spriteAngle: number = Math.atan2(dy, dx) - this.player.anguloRotacion;

            let viewDist: number = 500;

            let x0: number = Math.tan(spriteAngle) * viewDist;
            let x: number = ((midCanvas) + x0 - heightTexture / 2);

            this.context.imageSmoothingEnabled = false;

            let widthColumn = heightTexture / highTexture;
            
            for (let i = 0; i < heightTexture; i++) {
                for (let j = 0; j < widthColumn; j++) {
                    let x1: number = Math.trunc(x + ((i - 1) *widthColumn) + j);

                    if (zBuffer[x1]! > this.distance) {
                        this.context.drawImage(this.image, i, 0, 1, highTexture - 1, x1, y1, 1, heightTexture);
                    }
                }
            }

        }
    }
}