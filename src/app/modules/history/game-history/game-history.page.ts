import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DBEnum } from 'src/app/shared/models/db.enum';
import { IHistory } from 'src/app/shared/models/history.model';
import { IndexedDBService } from 'src/app/shared/services/indexeddb.service';
import { firstValueFrom } from 'rxjs';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.page.html',
  styleUrls: ['./game-history.page.scss'],
})
export class GameHistoryPage implements OnInit {
  public history: IHistory = <IHistory>{};
  public isLoading = true;

  constructor(
    private idbService: IndexedDBService,
    private route: ActivatedRoute,
    private gaService: GoogleAnalyticsService,
  ) {}

  public ngOnInit(): void {
    this.gaService.pageView('/history/game-history', 'Página Histórico do Jogo');
    this.loadHistory();
  }

  private async loadHistory() {
    try {
      const routeMap = await firstValueFrom(this.route.paramMap);
      const id = Number(routeMap.get('id'));

      this.history = (await this.idbService.getById(DBEnum.HISTORY_STORE, id)) as IHistory;
    } catch (error) {
      throw error;
    } finally {
      this.isLoading = false;
    }
  }
}
