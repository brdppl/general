import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAddPlayerPage } from './modal-add-player.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAddPlayerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAddPlayerPageRoutingModule {}
