import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { DBEnum } from 'src/app/shared/models/db.enum';
import { IRanking } from 'src/app/shared/models/ranking.model';
import { IndexedDBService } from 'src/app/shared/services/indexeddb.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {
  public ranking: IRanking[] = [];
  public isLoading = true;
  public sortType: 'wins' | 'total' = 'wins';

  constructor(
    private idbService: IndexedDBService,
    private alert: AlertController,
    private gaService: GoogleAnalyticsService,
  ) {}

  public ngOnInit(): void {
    this.gaService.pageView('/ranking', 'Página Ranking');
    this.loadRanking();
  }

  public imagePath(player: IRanking): string {
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

  public sortRanking(): void {
    this.gaService.event('click_sort_button', 'ranking_actions', 'Ranking');
    if (this.sortType === 'wins') {
      this.sortType = 'total';
      this.ranking.sort((a, b) => b.total - a.total);
    } else {
      this.sortType = 'wins';
      this.ranking.sort((a, b) => b.wins - a.wins);
    }
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
    this.gaService.event('click_clear_button', 'ranking_actions', 'Ranking');
    const alert = await this.alert.create({
      header: 'Limpar ranking',
      message: 'Deseja mesmo limpar o ranking?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            this.gaService.event('click_cancel_button', 'ranking_actions', 'Ranking');
          },
        },
        {
          text: 'Sim',
          handler: () => {
            this.gaService.event('click_ok_button', 'ranking_actions', 'Ranking');
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
