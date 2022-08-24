import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayfieldComponent } from './playfield/playfield.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { GameoverComponent } from './gameover/gameover.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { TopbarComponent } from './topbar/topbar.component';
import { FieldComponent } from './field/field.component';
import { ClearedFieldsComponent } from './cleared-fields/cleared-fields.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayfieldComponent,
    ButtonsComponent,
    GameoverComponent,
    TopbarComponent,
    FieldComponent,
    ClearedFieldsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
