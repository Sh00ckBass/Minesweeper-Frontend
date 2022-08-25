import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GameStateService } from '../shared/game-state.service';
import { GameService } from '../shared/game.service';

@Component({
  selector: 'app-cleared-fields',
  templateUrl: './cleared-fields.component.html',
  styleUrls: ['./cleared-fields.component.scss']
})
export class ClearedFieldsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<GameService>,
    public gameState: GameStateService
  ) { }

  ngOnInit(): void {
  }

  public rawSeconds: number = this.gameState.timeInSec;
  public clicks: number = this.gameState.clicks;
  public minutes: any = this.rawSeconds >= 60 ? (this.rawSeconds / 60).toFixed() : 0;
  public seconds: any = this.rawSeconds >= 60 ? (this.rawSeconds % 60).toFixed() : this.rawSeconds;

  public timeString: string = (this.minutes > 0 ? (this.minutes > 1 ? this.minutes + " Minutes " : "1 Minute ") : "") + (this.seconds > 1 ? this.seconds + " Seconds" : " 1 Second");

  onCancel(): void {
    this.dialogRef.close();
  }

}
