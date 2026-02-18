import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GameService } from 'src/app/shared/services/game.service';
import { NavController, AlertController, AlertButton, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { IPlayer } from 'src/app/shared/models/player.model';
import * as _ from 'lodash';
import { Keyboard } from '@capacitor/keyboard';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ANIMATION } from 'src/app/shared/models/animation.enum';
import { Subscription } from 'rxjs';
import { IndexedDBService } from 'src/app/shared/services/indexeddb.service';
import { DBEnum } from 'src/app/shared/models/db.enum';
import { IHistory } from 'src/app/shared/models/history.model';
import { IRanking } from 'src/app/shared/models/ranking.model';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gameTpl') gameTpl!: any;

  public players: IPlayer[] = [];
  public isShowingAnimation = false;
  public result = '';
  public score = '';

  private subsription = new Subscription();

  constructor(
    private gameService: GameService,
    private nav: NavController,
    private alert: AlertController,
    private storage: Storage,
    private util: UtilsService,
    private platform: Platform,
    private idbService: IndexedDBService,
    private gaService: GoogleAnalyticsService,
  ) {
    this.subsription.add(
      this.gameService.getEmit().subscribe((players: IPlayer[] | null) => {
        const hasNull = players?.some(player => Object.values(player).some(val => val === null));

        if (!hasNull) {
          let showAnimation = true;
          this.players.forEach(player => {
            Object.entries(player).forEach(([key, value]) => {
              if (key === 'ponto2' && ![0, 2, 4, 6, 8, 10].includes(value)) {
                showAnimation = false;
                return;
              } else if (key === 'ponto3' && ![0, 3, 6, 9, 12, 15].includes(value)) {
                showAnimation = false;
                return;
              } else if (key === 'ponto4' && ![0, 4, 8, 12, 16, 20].includes(value)) {
                showAnimation = false;
                return;
              } else if (key === 'ponto5' && ![0, 5, 10, 15, 20, 25].includes(value)) {
                showAnimation = false;
                return;
              } else if (key === 'ponto6' && ![0, 6, 12, 18, 24, 30].includes(value)) {
                showAnimation = false;
                return;
              } else if (key === 'pontoS' && ![0, 20, 25].includes(value)) {
                showAnimation = false;
                return;
              } else if (key === 'pontoF' && ![0, 30, 35].includes(value)) {
                showAnimation = false;
                return;
              } else if (key === 'pontoP' && ![0, 40, 45].includes(value)) {
                showAnimation = false;
                return;
              } else if (key === 'pontoG' && ![0, 50, 55].includes(value)) {
                showAnimation = false;
                return;
              }
            });
          });

          if (showAnimation) {
            this.runAnimation(players!);
          }
        }
      }),
    );
  }

  ngOnInit() {
    this.gaService.pageView('/game', 'Página Game');
    this.loadPlayers();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const mainEl = this.gameTpl?.el?.shadowRoot?.children[1];
      if (mainEl) {
        mainEl.style = 'overflow-x: auto';
      }
    }, 0);
  }

  ngOnDestroy(): void {
    this.subsription.unsubscribe();
  }

  public calcTotal(player: IPlayer, field?: string): void {
    if (field === 'ponto1') {
      const value = (player as any)[field];
      if (![null, 0, 1, 2, 3, 4, 5].includes(value)) {
        return;
      }
    } else if (field === 'ponto2') {
      const value = (player as any)[field];
      if (![null, 0, 1, 2, 4, 6, 8, 10].includes(value)) {
        return;
      }
    } else if (field === 'ponto3') {
      const value = (player as any)[field];
      if (![null, 0, 1, 3, 6, 9, 12, 15].includes(value)) {
        return;
      }
    } else if (field === 'ponto4') {
      const value = (player as any)[field];
      if (![null, 0, 1, 2, 4, 8, 12, 16, 20].includes(value)) {
        return;
      }
    } else if (field === 'ponto5') {
      const value = (player as any)[field];
      if (![null, 0, 1, 2, 5, 10, 15, 20, 25].includes(value)) {
        return;
      }
    } else if (field === 'ponto6') {
      const value = (player as any)[field];
      if (![null, 0, 1, 2, 3, 6, 12, 18, 24, 30].includes(value)) {
        return;
      }
    } else if (field === 'pontoS') {
      const value = (player as any)[field];
      if (![null, 0, 2, 20, 25].includes(value)) {
        return;
      }
    } else if (field === 'pontoF') {
      const value = (player as any)[field];
      if (![null, 0, 3, 30, 35].includes(value)) {
        return;
      }
    } else if (field === 'pontoP') {
      const value = (player as any)[field];
      if (![null, 0, 4, 40, 45].includes(value)) {
        return;
      }
    } else if (field === 'pontoG') {
      const value = (player as any)[field];
      if (![null, 0, 5, 50, 55].includes(value)) {
        return;
      }
    }

    const players = this.players.map((el, i) => {
      if (player.index === i) {
        const points = Object.values(el).filter(e => typeof e === 'number');
        const total = points.slice(0, points.length - 2).reduce((a, b) => a + b, 0);
        player.total = total;

        return player;
      }

      return el;
    });
    this.gameService.storagePlayers(players);
  }

  public validatePoint(event: any, player: IPlayer, field: string): void {
    const { value } = event.target;
    let allowed = ['', '0', '1', '2', '3', '4', '5'];

    if (value === '') {
      player[field] = '';
    }

    if (field === 'ponto2') {
      allowed = ['', '0', '1', '2', '4', '6', '8', '10'];
    } else if (field === 'ponto3') {
      allowed = ['', '0', '1', '3', '6', '9', '12', '15'];
    } else if (field === 'ponto4') {
      allowed = ['', '0', '1', '2', '4', '8', '12', '16', '20'];
    } else if (field === 'ponto5') {
      allowed = ['', '0', '1', '2', '5', '10', '15', '20', '25'];
    } else if (field === 'ponto6') {
      allowed = ['', '0', '1', '2', '3', '6', '12', '18', '24', '30'];
    } else if (field === 'pontoS') {
      allowed = ['', '0', '2', '20', '25'];
    } else if (field === 'pontoF') {
      allowed = ['', '0', '3', '30', '35'];
    } else if (field === 'pontoP') {
      allowed = ['', '0', '4', '40', '45'];
    } else if (field === 'pontoG') {
      allowed = ['', '0', '5', '50', '55'];
    }

    if (!allowed.includes(value)) {
      player[field] = null;
      event.target.value = null;
      this.handleAlert();
    } else {
      player[field] = value === '' ? null : Number(value);
    }

    this.calcTotal(player, field);
  }

  public finish() {
    this.gaService.event('click_finish_button', 'game_actions', 'Jogo');
    this.handleAlert('Atenção', 'Deseja realmente finalizar esta partida?', [
      {
        text: 'Repetir participantes',
        handler: () => {
          this.gaService.event('click_repeatPlayers_button', 'game_actions', 'Jogo');
          const hasNull = this.players?.some(player => Object.values(player).some(val => val === null));
          if (!hasNull) {
            const winner = this.players!.reduce((a, b) => (a.total > b.total ? a : b));
            const payloadWinner: IRanking = { name: winner.name, wins: 1, total: winner.total };
            this.updateRanking(payloadWinner);
            this.saveGameHistory();
          }
          this.storage.remove(ANIMATION.WAS_ANIMATED);
          this.gameService.ereaseGame().then(() => {
            this.loadPlayers();
          });
        },
      },
      {
        text: 'Não',
        handler: () => {
          this.gaService.event('click_cancel_button', 'game_actions', 'Jogo');
        },
      },
      {
        text: 'Sim',
        handler: () => {
          this.gaService.event('click_ok_button', 'game_actions', 'Jogo');
          const hasNull = this.players?.some(player => Object.values(player).some(val => val === null));
          if (!hasNull) {
            const winner = this.players!.reduce((a, b) => (a.total > b.total ? a : b));
            const payloadWinner: IRanking = { name: winner.name, wins: 1, total: winner.total };
            this.updateRanking(payloadWinner);
            this.saveGameHistory();
          }
          this.nav.navigateRoot(['/home']);
          this.gameService.destroyGame();
          this.storage.remove(ANIMATION.WAS_ANIMATED);
        },
      },
    ]);
  }

  public closeAnimation() {
    this.gaService.event('click_close_animation', 'game_actions', 'Jogo');
    if (this.isShowingAnimation) this.isShowingAnimation = false;
  }

  private async loadPlayers() {
    this.storage.remove(ANIMATION.WAS_ANIMATED);
    this.players = await this.storage.get(this.gameService.playersToken);
  }

  private async handleAlert(
    header = 'Valor Inválido',
    message = 'O valor informado não é permitido neste campo.',
    buttons: (string | AlertButton)[] | undefined = ['OK'],
  ) {
    const alert = await this.alert.create({ header, message, buttons });
    await alert.present();
  }

  private async runAnimation(players: IPlayer[]) {
    this.gaService.event('fire_win_animation', 'game_actions', 'Jogo');
    const wasAnimated = await this.storage.get(ANIMATION.WAS_ANIMATED);

    if (!wasAnimated) {
      const values: any[] = [];
      const participants: any[] = [];

      players.forEach(el => {
        Object.values(el).forEach(val => {
          values.push(val);
        });
        participants.push({ name: el.name, total: el.total });
      });

      if (!values.includes(null)) {
        // Hide keyboard
        if (this.platform.is('hybrid')) {
          Keyboard.hide();
        } else {
          const inputs = document.getElementsByTagName('input');
          Array.from(inputs).forEach(input => input.blur());
        }

        this.isShowingAnimation = true;
        const winner = participants.reduce((a: any, b: any) => (a.total > b.total ? a : b));

        let draw = [];
        const counts = _.countBy(participants, 'total');
        draw = participants.filter(p => counts[p.total] > 1);

        if (draw.length) {
          const tmpDraw: any = [];

          draw.forEach(el => {
            if (winner.total > el.total) {
              this.result = this.util.randomMessage(winner.name);
              this.score = `Com ${winner.total} pontos`;
            } else {
              tmpDraw.push(this.util.capitalize(el.name));

              if (tmpDraw.length > 2) {
                this.result = `${tmpDraw.join(', ').replace(/, ((?:.(?!, ))+)$/, ' e $1')} empataram`;
                this.score = `Com ${winner.total} pontos`;
              } else {
                this.result = `${tmpDraw.join(' e ')} empataram`;
                this.score = `Com ${winner.total} pontos`;
              }
            }
          });
        } else {
          this.result = this.util.randomMessage(winner.name);
          this.score = `Com ${winner.total} pontos`;
        }

        this.storage.set(ANIMATION.WAS_ANIMATED, true);
      }
    }
  }

  private async updateRanking(payload: IRanking): Promise<void> {
    try {
      const rankingData = (await this.idbService.getAllData(DBEnum.RANKING_STORE)) as IRanking[];
      const playerIsAlreadyExists = rankingData.some(item => item.name === payload.name);

      if (playerIsAlreadyExists) {
        const player = rankingData.find(item => item.name === payload.name)!;
        payload.id = player.id;
        payload.wins += player.wins;
        payload.total += player.total;
      }

      return await this.idbService.updateData(DBEnum.RANKING_STORE, payload);
    } catch (error) {
      throw error;
    }
  }

  private async saveGameHistory(): Promise<void> {
    const history: IHistory = {
      game: this.players,
      gameDate: new Date(),
    };

    return await this.idbService.updateData(DBEnum.HISTORY_STORE, history);
  }
}
