import { Position } from "./position";

export class ClearedField {
    public position: Position;
    public bombCount: number;

    constructor(position: Position, bombCount: number) {
        this.position = position;
        this.bombCount = bombCount;
    }
}