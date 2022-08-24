import { Position } from "../position";

export class RevealFieldRequest {

    public playFieldId: string;
    public position: Position;

    constructor(playFieldId: string, position: Position) {
        this.playFieldId = playFieldId;
        this.position = position;
    }

}