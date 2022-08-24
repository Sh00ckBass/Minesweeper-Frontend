import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FieldSize } from './field-size';
import { RevealFieldRequest } from './request/revealFieldRequest';
import { RevealBombsResponse } from './response/revealBombsResponse';
import { RevealFieldResponse } from './response/revealFieldResponse';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private httpClient: HttpClient) { }

  public startGame(fieldSize: FieldSize): Observable<string> {
    return this.httpClient.get<string>(environment.apiUrl + `game/start/${fieldSize.valueOf()}`);
  }

  public revealField(request: RevealFieldRequest): Observable<RevealFieldResponse> {
    return this.httpClient.post<RevealFieldResponse>(environment.apiUrl + "game/revealfield", request);
  }

  public revealBombs(playFieldId: string): Observable<RevealBombsResponse> {
    return this.httpClient.get<RevealBombsResponse>(environment.apiUrl + `game/revealBombs/${playFieldId}`);
  }

  public checkApi() {
    return this.httpClient.get(environment.apiUrl);
  }

}
