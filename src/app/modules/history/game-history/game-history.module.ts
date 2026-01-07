import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameHistoryPageRoutingModule } from './game-history-routing.module';

import { GameHistoryPage } from './game-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameHistoryPageRoutingModule
  ],
  declarations: [GameHistoryPage]
})
export class GameHistoryPageModule {}
