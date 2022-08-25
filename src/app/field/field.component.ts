import { Component, Input, OnInit } from '@angular/core';
import { Field } from '../shared/field';
import { GameStateService } from '../shared/game-state.service';
import { GameService } from '../shared/game.service';
import { Position } from '../shared/position';
import { RevealFieldRequest } from '../shared/request/revealFieldRequest';
import { SignalrService } from '../shared/websockets/signalr.service';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {

  @Input()
  public field!: Field;
  private sR!: boolean;

  constructor(
    public gameState: GameStateService,
    public gameService: GameService,
    public signalRService: SignalrService
  ) {
    this.sR = gameState.signalR;
  }

  ngOnInit(): void {
  }

  public revealField(): void {
    var request = new RevealFieldRequest(this.gameState.gameId, new Position(this.field.x, this.field.y));
    if (!this.sR) {
      this.gameService.revealField(request).subscribe((response) => {
        this.gameService.handleRevealFieldResponse(response, this.field.x, this.field.y, this.field);
      });
    } else {
      this.signalRService.revealField(request);
    }
  }

  public markBomb(event: any, field: Field): void {
    event.preventDefault();
    field.bombMark = !field.bombMark;
  }

}
