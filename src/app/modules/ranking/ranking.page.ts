import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DBEnum } from 'src/app/shared/models/db.enum';
import { IndexedDBService } from 'src/app/shared/services/indexeddb.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {
  public ranking: { name: string; wins: number; id?: number }[] = [];
  public isLoading = true;

  constructor(private idbService: IndexedDBService, private alert: AlertController) {}

  public ngOnInit(): void {
    this.loadRanking();
  }

  public imagePath(player: { name: string; wins: number }): string {
    if (this.ranking.indexOf(player) === 0) {
      return '../../../assets/img/medal_1st.png';
    } else if (this.ranking.indexOf(player) === 1) {
      return '../../../assets/img/medal_2nd.png';
    } else if (this.ranking.indexOf(player) === 2) {
      return '../../../assets/img/medal_3rd.png';
    }

    return '';
  }

  public clear(): void {
    this.handleAlert();
  }

  private async loadRanking() {
    try {
      const rankingData = await this.idbService.getAllData(DBEnum.RANKING_STORE);
      this.ranking = rankingData.sort((a, b) => b.wins - a.wins);
    } catch (error) {
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  private async handleAlert() {
    const alert = await this.alert.create({
      header: 'Limpar ranking',
      message: 'Deseja mesmo limpar o ranking?',
      buttons: [
        { text: 'Não' },
        {
          text: 'Sim',
          handler: () => {
            this.ranking.forEach(player => {
              this.idbService.deleteData(DBEnum.RANKING_STORE, player.id!);
            });
            this.loadRanking();
          },
        },
      ],
    });
    await alert.present();
  }
}
