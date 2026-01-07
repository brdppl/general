import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAddPlayerPageRoutingModule } from './modal-add-player-routing.module';

import { ModalAddPlayerPage } from './modal-add-player.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAddPlayerPageRoutingModule
  ],
  declarations: [ModalAddPlayerPage]
})
export class ModalAddPlayerPageModule {}
