import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClearedFieldsComponent } from '../cleared-fields/cleared-fields.component';
import { ClearedField } from '../shared/clearedfield';
import { Field } from '../shared/field';
import { GameStateService } from '../shared/game-state.service';
import { GameService } from '../shared/game.service';
import { Position } from '../shared/position';
import { RevealFieldRequest } from '../shared/request/revealFieldRequest';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {

  @Input()
  public field!: Field;

  constructor(
    public gameState: GameStateService,
    public gameService: GameService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  public revealField(field: Field): void {
    if (field.bombMark || this.gameState.gameOverBool) {
      return;
    }
    this.gameState.startTimer();
    this.gameService.revealField(new RevealFieldRequest(this.gameState.gameId, new Position(field.x, field.y))).subscribe((response) => {
      var gameState: number = response.gameState;
      var revealResult: number = response.revealResult;
      var bombCount: number = response.bombCount;
      var clearedFields: ClearedField[] = response.clearedFields;
      switch (gameState) {
        case 0:
          {
            if (!field.visible) {
              this.gameState.click();
              if (revealResult == 0) {
                field.bombCount = bombCount;
                field.visible = true;
                if (clearedFields != null) {
                  clearedFields.forEach((clearedField) => {
                    this.gameState.revealClearedField(clearedField);
                  });
                }
              }
            }
            break;
          }
        case 1:
          {
            this.gameState.stopTimer();
            this.gameState.click();
            field.bombCount = bombCount;
            field.visible = true;
            this.gameState.gameOverBool = true;
            this.dialog.open(ClearedFieldsComponent);
            break;
          }
        case 2:
          {
            field.bomb = true;
            field.visible = true;
            this.gameState.gameOver();
            this.gameService.revealBombs(this.gameState.gameId).subscribe((response) => {
              this.gameState.revealBombsField(response);
            });
            break;
          }
      }

    });
  }

  public markBomb(event: any, field: Field): void {
    event.preventDefault();
    field.bombMark = !field.bombMark;
  }

}
