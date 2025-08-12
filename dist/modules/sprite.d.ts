import { Player } from "./player.js";
export declare class Sprite {
    x: number;
    y: number;
    player: Player;
    context: CanvasRenderingContext2D;
    image: HTMLImageElement;
    distance: number;
    angule: number;
    visible: boolean;
    FOV_midle: number;
    constructor(x: number, y: number, image: HTMLImageElement, player: Player, context: CanvasRenderingContext2D);
    calculateAngule(): void;
    updateData(): void;
    draw(): void;
}
//# sourceMappingURL=sprite.d.ts.map