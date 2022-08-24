import { Component, OnInit } from '@angular/core';
import { FieldSize } from '../shared/field-size';
import { GameStateService } from '../shared/game-state.service';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {

  public fieldSize = FieldSize;

  constructor(private gameStateService: GameStateService) { }

  ngOnInit(): void {
  }

  resetGame(): void {
    this.gameStateService.restartGame();
  }

  setFieldSize(size: number): void {
    this.gameStateService.setFieldSize(size);
  }

}
