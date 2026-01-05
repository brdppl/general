import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'rules',
    loadChildren: () => import('./modules/rules/rules.module').then(m => m.RulesPageModule),
  },
  {
    path: 'game',
    loadChildren: () => import('./modules/game/game.module').then(m => m.GamePageModule),
  },
  {
    path: 'ranking',
    loadChildren: () => import('./modules/ranking/ranking.module').then(m => m.RankingPageModule),
  },
  {
    path: 'modal-add-player',
    loadChildren: () =>
      import('./components/modal-add-player/modal-add-player.module').then(m => m.ModalAddPlayerPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
