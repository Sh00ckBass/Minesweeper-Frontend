import { Position } from "../position";

export class RevealBombsResponse {

    public bombs: Position[];

    constructor(bombs: Position[]) {
        this.bombs = bombs;
    }
}