import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClearedField } from './clearedfield';
import { Field } from './field';
import { FieldSize } from './field-size';
import { Position } from './position';
import { RevealBombsResponse } from './response/revealBombsResponse';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  public restart$: BehaviorSubject<any> = new BehaviorSubject(null);
  public gameOver$: BehaviorSubject<any> = new BehaviorSubject(null);
  public timer$: BehaviorSubject<number> = new BehaviorSubject(0);
  public clickCount$: BehaviorSubject<number> = new BehaviorSubject(0);
  public revealBombs$: BehaviorSubject<RevealBombsResponse> = new BehaviorSubject(new RevealBombsResponse([]));
  public revealClearedField$: BehaviorSubject<ClearedField> = new BehaviorSubject(new ClearedField(new Position(-1, -1), -1));


  public timeInSec: number = 0;
  public timerInterval: any = undefined;
  public clicks: number = 0;
  public gameOverBool: boolean = false;
  public clearedAllFields: boolean = false;
  
  public gameId: string = "";
  public fieldSize: FieldSize = FieldSize.Small;

  constructor() { }

  public revealClearedField(clearedField: ClearedField): void {
    this.revealClearedField$.next(clearedField);
  }

  public revealBombsField(revealBombs: RevealBombsResponse): void {
    this.revealBombs$.next(revealBombs);
  }

  public restartGame(): void {
    this.restart$.next(null);
  }

  public gameOver(): void {
    this.gameOver$.next(null);
  }

  public setFieldSize(fieldSize: number): void {
    this.fieldSize = fieldSize;
  }

  public startTimer(): void {
    if (this.timerInterval) {
      return;
    }
    this.timerInterval = setInterval(() => {
      this.timeInSec++;
      this.timer$.next(this.timeInSec);
    }, 1000);
  }

  public stopTimer(): void {
    clearInterval(this.timerInterval);
    this.timerInterval = undefined;
  }

  public resetTimer(): void {
    this.timeInSec = 0;
    this.timer$.next(this.timeInSec);
    this.stopTimer();
  }

  public click(): void {
    this.clicks++;
    this.clickCount$.next(this.clicks);
  }

  public resetClicks(): void {
    this.clicks = 0;
    this.clickCount$.next(this.clicks);
  }

}
