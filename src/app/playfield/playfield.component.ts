import { Component, OnInit } from '@angular/core';
import { Field } from '../shared/field';
import { MatDialog } from '@angular/material/dialog';
import { GameStateService } from '../shared/game-state.service';
import { GameoverComponent } from '../gameover/gameover.component';
import { FieldSize } from '../shared/field-size';

@Component({
  selector: 'app-playfield',
  templateUrl: './playfield.component.html',
  styleUrls: ['./playfield.component.scss']
})
export class PlayfieldComponent implements OnInit {

  public rowCount: number = 9;
  public columnCount: number = 9;
  public bombCount: number = 10;
  public tempCount: number = 0;

  public playField: Field[][] = [];
  public emptyFields: Field[] = [];
  public bombs: Field[] = [];

  constructor(
    private gameStateService: GameStateService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.gameStateService.restart$.subscribe(() => this.resetGame());
    this.gameStateService.setFieldSize$.subscribe((value) => this.setFieldSize(value));
    this.gameStateService.findAllFields$.subscribe((value) => this.findAllFields(value));
    this.gameStateService.gameOver$.subscribe(() => this.onGameOver());
    this.gameStateService.checkFields$.subscribe(() => this.checkClearedAllFields());
  }

  public setFieldSize(fieldSize: FieldSize): void {
    var size: number = 9;
    var bombCount: number = 10;
    switch (fieldSize) {
      case FieldSize.Small:
        bombCount = 10;
        break;
      case FieldSize.Medium:
        size = 16;
        bombCount = 40;
        break;
      case FieldSize.Large:
        size = 22;
        bombCount = 100;
        break;
    }
    this.rowCount = size;
    this.columnCount = size;
    this.bombCount = bombCount;
    this.resetGame();
  }

   public initializeField(): void {
    var playField: Field[][] = [];
    this.tempCount = 0;
    this.bombs = [];
    for (var y = 0; y < this.rowCount; y++) {
      playField[y] = [];
      for (var x = 0; x < this.columnCount; x++) {
        playField[y][x] = new Field(x, y);
      }
    }
    this.playField = playField;
  }

  public initialzeBombs(): void {
    if (this.tempCount == this.bombCount) {
      return;
    }
    var field = this.playField[Math.floor(Math.random() * this.rowCount)][Math.floor(Math.random() * this.columnCount)];
    if (!field.bomb) {
      field.bomb = true;
      this.tempCount++;
      this.bombs.push(field);
    }
    this.initialzeBombs();
  }

  public calculateFieldType(): void {
    for (var y = 0; y < this.rowCount; y++) {
      for (var x = 0; x < this.columnCount; x++) {
        var currentField = this.playField[y][x];
        if (!currentField.bomb) {
          this.findBombCount(currentField);
        }
      }
    }
  }

  public findBombCount(currentField: Field): void {
    var xCf = currentField.x;
    var yCf = currentField.y;
    for (var y = yCf - 1; y <= yCf + 1; y++) {
      for (var x = xCf - 1; x <= xCf + 1; x++) {
        if (y < 0 || x < 0 || y >= this.rowCount || x >= this.columnCount) {
          continue;
        }
        var field = this.playField[y][x];
        if (field != currentField) {
          if (field.bomb) {
            currentField.bombCount++;
          }
        }
      }
    }
  }

  public findAllFields(currentField: Field): void {
    var x = currentField.x;
    var y = currentField.y;

    if (this.emptyFields.includes(currentField) ||
      currentField.bombCount != 0 ||
      currentField.bomb ||
      x < 0 && y < 0) {
      return;
    }

    this.emptyFields.push(currentField);
    this.checkClearedAllFields();
    var topY = y - 1;
    if (topY >= 0 && topY < this.rowCount) {
      var top = this.playField[topY][x];
      if (top.bombCount == 0) {
        if (!top.bomb) {
          top.visible = true;
          this.findAllFields(top);
        }
      } else {
        top.visible = true;
      }
    }

    var bottomY = y + 1;
    if (bottomY >= 0 && bottomY < this.rowCount) {
      var bottom = this.playField[bottomY][x];
      if (bottom.bombCount == 0) {
        if (!bottom.bomb) {
          bottom.visible = true;
          this.findAllFields(bottom);
        }
      } else {
        bottom.visible = true;
      }
    }

    var leftX = x - 1;
    if (leftX >= 0 && leftX < this.columnCount) {
      var left = this.playField[y][leftX];
      if (left.bombCount == 0) {
        if (!left.bomb) {
          left.visible = true;
          this.findAllFields(left);
        }
      } else {
        left.visible = true;
      }
    }

    var rightX = x + 1;
    if (rightX >= 0 && rightX < this.columnCount) {
      var right = this.playField[y][rightX];
      if (right.bombCount == 0) {
        if (!right.bomb) {
          right.visible = true;
          this.findAllFields(right);
        }
      } else {
        right.visible = true;
      }
    }
  }

  public resetGame(): void {
    this.gameStateService.resetTimer();
    this.gameStateService.resetClicks();
    this.gameStateService.gameOverBool = false;
    this.initializeField();
    this.initialzeBombs();
    this.calculateFieldType();
  }

  public checkClearedAllFields(): void {
    var notCleared: number = 0;
    for (var y = 0; y < this.rowCount; y++) {
      for (var x = 0; x < this.columnCount; x++) {
        var field: Field = this.playField[y][x];
        if (!field.bomb) {
          if (!field.visible) {
            notCleared++;
          }
        }
      }
    }
    var isCleared: boolean = (notCleared == 0);
    this.gameStateService.clearedAllFields = isCleared;
    if (isCleared) {
      this.gameStateService.stopTimer();
      this.showAllBombs();
      this.gameStateService.gameOverBool = true;
    }
  }

  public onGameOver(): void {
    if (this.gameStateService.timeInSec == 0) {
      return;
    }
    this.gameStateService.stopTimer();
    this.dialog.open(GameoverComponent);

    this.showAllBombs();
  }

  private showAllBombs(): void {
    this.bombs.forEach((field) => {
      if (!field.visible) {
        field.visible = true;
      }
    });
  }

}
