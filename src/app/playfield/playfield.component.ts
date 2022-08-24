import { Component, OnInit } from '@angular/core';
import { Field } from '../shared/field';
import { MatDialog } from '@angular/material/dialog';
import { GameStateService } from '../shared/game-state.service';
import { GameoverComponent } from '../gameover/gameover.component';
import { GameService } from '../shared/game.service';
import { FieldSize } from '../shared/field-size';
import { ClearedField } from '../shared/clearedfield';
import { RevealBombsResponse } from '../shared/response/revealBombsResponse';

@Component({
  selector: 'app-playfield',
  templateUrl: './playfield.component.html',
  styleUrls: ['./playfield.component.scss']
})
export class PlayfieldComponent implements OnInit {

  public playField: Field[][] = [];
  private size: number = 9;

  constructor(
    private gameStateService: GameStateService,
    private gameService: GameService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.gameStateService.restart$.subscribe(() => this.resetGame());
    this.gameStateService.gameOver$.subscribe(() => this.onGameOver());
    this.gameStateService.revealClearedField$.subscribe((clearedField) => this.revealClearedField(clearedField));
    this.gameStateService.revealBombs$.subscribe((bombsResponse) => this.revealBombs(bombsResponse));
  }

  public initializeField(): void {
    var playField: Field[][] = [];
    this.changeFieldSize();
    for (var y = 0; y < this.size; y++) {
      playField[y] = [];
      for (var x = 0; x < this.size; x++) {
        playField[y][x] = new Field(x, y);
      }
    }
    this.playField = playField;
  }

  public resetGame(): void {
    this.gameStateService.resetTimer();
    this.gameStateService.resetClicks();
    this.gameStateService.gameOverBool = false;

    this.gameService.startGame(this.gameStateService.fieldSize).subscribe((response) => {
      this.gameStateService.gameId = response;
    });
    this.initializeField();
  }

  public revealClearedField(clearedField: ClearedField): void {
    var x: number = clearedField.position.x;
    var y: number = clearedField.position.y;
    var bombCount: number = clearedField.bombCount;
    if (bombCount < 0) {
      return;
    }
    var field: Field = this.playField[y][x];
    field.bombCount = bombCount;
    field.visible = true;
  }

  public revealBombs(bombsResponse: RevealBombsResponse): void {
    bombsResponse.bombs.forEach((pos) => {
      var x: number = pos.x;
      var y: number = pos.y;
      var bombField: Field = this.playField[y][x];
      
      bombField.bomb = true;
      bombField.visible = true;
    })
  }

  public onGameOver(): void {
    if (this.gameStateService.timeInSec == 0) {
      return;
    }
    this.gameStateService.stopTimer();
    this.gameStateService.gameOverBool = true;
    this.dialog.open(GameoverComponent);
  }

  private changeFieldSize(): void {
    switch (this.gameStateService.fieldSize) {
      case FieldSize.Small:
        {
          this.size = 9;
          break;
        }
      case FieldSize.Medium:
        {
          this.size = 16;
          break;
        }
      case FieldSize.Large:
        {
          this.size = 22;
          break;
        }
    }
  }

}
