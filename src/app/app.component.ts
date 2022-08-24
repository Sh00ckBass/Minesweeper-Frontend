import { Component } from '@angular/core';
import { GameService } from './shared/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'minesweeper';
  apiOnline = false;
  constructor(public gameService: GameService) {
    this.checkApi();
    setInterval(() => {
      this.checkApi();
    }, 1000*20);
  }

  private checkApi(): void {
    this.gameService.checkApi().subscribe(()=>{},(error) => {
      if(error.status == 404) {
        this.apiOnline = true;
      } else {
        this.apiOnline = false;
      }
    });
  }

}
