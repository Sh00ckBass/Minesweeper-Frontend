import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClearedFieldsComponent } from '../cleared-fields/cleared-fields.component';
import { ClearedField } from './clearedfield';
import { Field } from './field';
import { FieldSize } from './field-size';
import { GameStateService } from './game-state.service';
import { RevealFieldRequest } from './request/revealFieldRequest';
import { RevealBombsResponse } from './response/revealBombsResponse';
import { RevealFieldResponse } from './response/revealFieldResponse';
import { SignalrService } from './websockets/signalr.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(
    private httpClient: HttpClient,
    private gameState: GameStateService,
    public dialog: MatDialog,
    private signalRService: SignalrService
  ) {
    gameState.handleRevealField$.subscribe(value => this.handleRevealFieldResponse(value.response, value.x, value.y, value.field));
  }

  public startGame(fieldSize: FieldSize): Observable<string> {
    return this.httpClient.get<string>(environment.apiUrl + `game/start/${fieldSize.valueOf()}`);
  }

  public getSavedPlayField(playFieldId: string): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + `game/playfield/${playFieldId}`);
  }

  public revealField(requestData: RevealFieldRequest): Observable<RevealFieldResponse> {
    return this.httpClient.post<RevealFieldResponse>(environment.apiUrl + "game/revealfield", requestData);
  }

  public revealBombs(playFieldId: string): Observable<RevealBombsResponse> {
    return this.httpClient.get<RevealBombsResponse>(environment.apiUrl + `game/revealBombs/${playFieldId}`);
  }

  public handleRevealFieldResponse(response: RevealFieldResponse, x: number, y: number, field?: Field) {
    if (response.bombCount == -1) {
      return;
    }
    if (field != undefined) {
      if (field.bombMark) {
        return;
      }
    }
    if (this.gameState.gameOverBool) {
      return;
    }
    this.gameState.startTimer();

    var gameState: number = response.gameState;
    var revealResult: number = response.revealResult;
    var bombCount: number = response.bombCount;
    var clearedFields: ClearedField[] = response.clearedFields;
    switch (gameState) {
      case 0:
        {
          this.gameState.click();
          if (revealResult == 0) {
            this.gameState.updateField(x, y, bombCount, false, true);
            if (clearedFields != null) {
              clearedFields.forEach((clearedField) => {
                this.gameState.revealClearedField(clearedField);
              });
            }
          }
          break;
        }
      case 1:
        {
          this.gameState.stopTimer();
          this.gameState.click();
          this.gameState.updateField(x, y, bombCount, false, true);
          this.gameState.gameOverBool = true;
          this.dialog.open(ClearedFieldsComponent);
          break;
        }
      case 2:
        {
          this.gameState.gameOverBool = true;
          this.gameState.gameOver();
          this.gameState.updateField(x, y, bombCount, true, true);
          if (!this.gameState.signalR) {
            this.revealBombs(this.gameState.gameId).subscribe((response) => {
              this.gameState.revealBombsField(response);
            });
          } else {
            this.signalRService.revealBombs(this.gameState.gameId);
          }
          break;
        }
    }
  }

}
