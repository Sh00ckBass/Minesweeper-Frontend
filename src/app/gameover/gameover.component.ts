import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GameStateService } from '../shared/game-state.service';

@Component({
  selector: 'app-gameover',
  templateUrl: './gameover.component.html',
  styleUrls: ['./gameover.component.scss']
})
export class GameoverComponent {

  constructor(
    public dialogRef: MatDialogRef<GameoverComponent>,
    public gameState: GameStateService
  ) { }

  public rawSeconds: number = this.gameState.timeInSec;
  public minutes: any = this.rawSeconds >= 60 ? (this.rawSeconds / 60).toFixed() : 0;
  public seconds: any = this.rawSeconds >= 60 ? (this.rawSeconds % 60).toFixed() : this.rawSeconds;

  public timeString: string = (this.minutes > 0 ? (this.minutes > 1 ? this.minutes + " Minutes " : "1 Minute ") : "") + (this.seconds > 1 ? this.seconds + " Seconds" : " 1 Second");

  onCancel(): void {
    this.dialogRef.close();
  }

}
