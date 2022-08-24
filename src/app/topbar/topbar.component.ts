import { Component, OnInit } from '@angular/core';
import { GameStateService } from '../shared/game-state.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  constructor(public gameState: GameStateService) { }

  ngOnInit(): void {
  }

}
