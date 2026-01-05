import { Component, OnInit } from '@angular/core';
import { DBEnum } from 'src/app/shared/models/db.enum';
import { IndexedDBService } from 'src/app/shared/services/indexeddb.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {
  public ranking: { name: string; wins: number }[] = [];
  public isLoading = true;

  constructor(private idbService: IndexedDBService) {}

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

  private async loadRanking() {
    try {
      const rankingData = await this.idbService.getAllData(DBEnum.RANKING_STORE);
      console.log('Ranking Data:', rankingData);
      this.ranking = rankingData.sort((a, b) => b.wins - a.wins);
    } catch (error) {
      console.error('Error loading ranking data:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
