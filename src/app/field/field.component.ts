import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClearedFieldsComponent } from '../cleared-fields/cleared-fields.component';
import { Field } from '../shared/field';
import { GameStateService } from '../shared/game-state.service';

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
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  public checkBomb(field: Field): void {
    if (field.bombMark || this.gameState.gameOverBool) {
      return;
    }
    this.gameState.startTimer();
    this.gameState.click();
    field.visible = true;
    this.gameState.findAllFields(field);
    if (field.bomb) {
      this.gameState.gameOverBool = true;
      this.gameState.gameOver();
    }
    
    this.gameState.checkFields$.next(null);
    if (!this.gameState.checkClearedAllFields()) {
      return;
    }
    this.dialog.open(ClearedFieldsComponent);
  }

  public markBomb(event: any, field: Field): void {
    event.preventDefault();
    field.bombMark = !field.bombMark;
  }

}
