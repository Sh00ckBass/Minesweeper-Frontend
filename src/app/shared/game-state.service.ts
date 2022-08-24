import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Field } from './field';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  public restart$: BehaviorSubject<any> = new BehaviorSubject(null);
  public gameOver$: BehaviorSubject<any> = new BehaviorSubject(null);
  public setFieldSize$: BehaviorSubject<number> = new BehaviorSubject(9);
  public timer$: BehaviorSubject<number> = new BehaviorSubject(0);
  public clickCount$: BehaviorSubject<number> = new BehaviorSubject(0);
  public findAllFields$: BehaviorSubject<Field> = new BehaviorSubject(new Field(-1, -1));
  public checkFields$: BehaviorSubject<any> = new BehaviorSubject(null);

  public timeInSec: number = 0;
  public timerInterval: any = undefined;
  public clicks: number = 0;
  public gameOverBool: boolean = false;
  public clearedAllFields: boolean = false;

  constructor() { }

  public checkClearedAllFields(): boolean {
    return this.clearedAllFields;
  }

  public restartGame(): void {
    this.restart$.next(null);
  }

  public gameOver(): void {
    this.gameOver$.next(null);
  }

  public findAllFields(fild: Field): void {
    this.findAllFields$.next(fild);
  }

  public setFieldSize(fieldSize: number): void {
    this.setFieldSize$.next(fieldSize);
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
