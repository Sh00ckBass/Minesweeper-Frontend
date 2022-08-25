import { Component, OnInit } from '@angular/core';
import { Field } from '../shared/field';
import { MatDialog } from '@angular/material/dialog';
import { GameStateService } from '../shared/game-state.service';
import { GameoverComponent } from '../gameover/gameover.component';
import { GameService } from '../shared/game.service';
import { FieldSize } from '../shared/field-size';
import { ClearedField } from '../shared/clearedfield';
import { RevealBombsResponse } from '../shared/response/revealBombsResponse';
import { SignalrService } from '../shared/websockets/signalr.service';

@Component({
  selector: 'app-playfield',
  templateUrl: './playfield.component.html',
  styleUrls: ['./playfield.component.scss']
})
export class PlayfieldComponent implements OnInit {

  public playField: Field[][] = [];
  private size: number = 9;

  constructor(
    private gameState: GameStateService,
    private gameService: GameService,
    public dialog: MatDialog,
    public signalR: SignalrService,
    public signalRService: SignalrService
  ) {
    this.signalRService.startConnection();
    this.signalRService.addStartGame();
    this.signalRService.addRevealField();
    this.signalRService.addRevealBombs();
  }

  ngOnInit(): void {
    setTimeout(() => this.register(), 1000);
  }

  private register(): void {
    this.gameState.updateField$.subscribe((value) => this.updateField(value.x, value.y, value.bombCount, value.bomb, value.visible));
    this.gameState.restart$.subscribe(() => this.resetGame());
    this.gameState.gameOver$.subscribe(() => this.onGameOver());
    this.gameState.revealClearedField$.subscribe((clearedField) => this.revealClearedField(clearedField));
    this.gameState.revealBombs$.subscribe((bombsResponse) => this.revealBombs(bombsResponse));
  }

  public updateField(x: number, y: number, bombCount: number, bomb: boolean, visible: boolean): void {
    if (x < 0 || y < 0 || x > this.size || y > this.size) {
      return;
    }
    var field = this.playField[y][x];
    field.bombCount = bombCount;
    field.bomb = bomb;
    field.visible = visible;
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
    this.gameState.resetTimer();
    this.gameState.resetClicks();
    this.gameState.gameOverBool = false;

    if (!this.gameState.signalR) {
      this.gameService.startGame(this.gameState.fieldSize).subscribe((response) => {
        this.gameState.gameId = response;
      });
    } else {
      this.signalR.startGame(this.gameState.fieldSize);
    }
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
    if (!this.gameState.gameOverBool) {
      return;
    }
    this.dialog.open(GameoverComponent);
    this.gameState.stopTimer();
    this.gameState.gameOverBool = true;
  }

  private changeFieldSize(): void {
    switch (this.gameState.fieldSize) {
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
