import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { DBEnum } from 'src/app/shared/models/db.enum';
import { IHistory } from 'src/app/shared/models/history.model';
import { IPlayer } from 'src/app/shared/models/player.model';
import { IndexedDBService } from 'src/app/shared/services/indexeddb.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  public history: IHistory[] = [];
  public isLoading = true;
  public sortDirection: 'asc' | 'desc' = 'desc';

  constructor(private idbService: IndexedDBService, private nav: NavController, private alert: AlertController) {}

  public ngOnInit(): void {
    this.loadHistory();
  }

  public pickWinner(game: IPlayer[]): IPlayer {
    const winner = game.reduce((a, b) => (a.total > b.total ? a : b));
    return winner;
  }

  public navigate(id: number): void {
    this.nav.navigateForward([`/history/game-history/${id}`]);
  }

  public sortHistory(): void {
    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
      this.history.sort((a, b) => a.gameDate.getTime() - b.gameDate.getTime());
    } else {
      this.sortDirection = 'desc';
      this.history.sort((a, b) => b.gameDate.getTime() - a.gameDate.getTime());
    }
  }

  public clear(): void {
    this.handleAlert();
  }

  private async loadHistory() {
    try {
      const res = (await this.idbService.getAllData(DBEnum.HISTORY_STORE)) as IHistory[];
      this.history = res.sort((a, b) => b.gameDate.getTime() - a.gameDate.getTime());
    } catch (error) {
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  private async handleAlert() {
    const alert = await this.alert.create({
      header: 'Limpar histórico',
      message: 'Deseja mesmo limpar o histórico?',
      buttons: [
        { text: 'Não' },
        {
          text: 'Sim',
          handler: () => {
            this.history.forEach(history => {
              this.idbService.deleteData(DBEnum.HISTORY_STORE, history.id!);
            });
            this.loadHistory();
          },
        },
      ],
    });
    await alert.present();
  }
}
