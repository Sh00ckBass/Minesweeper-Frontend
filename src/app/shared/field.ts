export class Field {

    public bomb: boolean = false;
    public visible: boolean = false;
    public bombMark: boolean = false;
    public bombCount: number = 0;

    public constructor(
        public x: number,
        public y: number
    ) {

    }

    public get exploded(): boolean {
        return this.bomb && this.visible;
    }

    public get empty(): boolean {
        return !this.bomb && this.visible;
    }
}