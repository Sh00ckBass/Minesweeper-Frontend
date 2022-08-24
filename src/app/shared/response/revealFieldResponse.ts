import { ClearedField } from "../clearedfield";

export class RevealFieldResponse {
    public revealResult: number;
    public gameState: number;
    public bombCount: number;
    public clearedFields: ClearedField[];

    constructor(revealResult: number, gameState: number, bombCount: number, clearedFields: ClearedField[]) {
        this.revealResult = revealResult;
        this.gameState = gameState;
        this.bombCount = bombCount;
        this.clearedFields = clearedFields;
    }
}