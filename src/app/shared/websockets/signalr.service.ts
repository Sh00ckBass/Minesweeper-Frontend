import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { FieldSize } from '../field-size';
import { GameStateService } from '../game-state.service';
import { RevealFieldRequest } from '../request/revealFieldRequest';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  constructor(public gameState: GameStateService) {
  }

  private hubConnection!: signalR.HubConnection;
  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7078/game").build();
    this.hubConnection
      .start()
      .then(() => console.log("Connected via SignalR."))
      .catch(error => console.log('Error while starting connection: ' + error))
  }

  public isConnected(): boolean {
    return this.hubConnection.state === "Connected";
  }

  public addStartGame(): void {
    this.hubConnection.on('startGame', (data) => {
      this.gameState.gameId = data;
    });
  }

  public addRevealField(): void {
    this.hubConnection.on('revealField', (data) => {
      this.gameState.handleRevealField(data.position.x, data.position.y, data);
    });
  }

  public addRevealBombs(): void {
    this.hubConnection.on('revealBombs', (data) => {
      this.gameState.revealBombsField(data);
    })
  }

  public startGame(fieldSize: FieldSize): void {
    this.hubConnection.invoke('StartGame', fieldSize)
  }

  public revealField(request: RevealFieldRequest): void {
    this.hubConnection.invoke('RevealField', request)
      .catch(err => console.error(err));
  }

  public revealBombs(playFieldId: string): void {
    this.hubConnection.invoke('RevealBombs', playFieldId)
      .catch(err => console.error(err));
  }

}
