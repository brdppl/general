import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/shared/services/game.service';
import { NavController, AlertController, AlertButton } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { IPlayer } from 'src/app/shared/models/player.model';
import * as _ from 'lodash';
import { Keyboard } from '@capacitor/keyboard';
import { UtilsService } from 'src/app/shared/services/utils.service';

enum ANIMATION {
  WAS_ANIMATED = 'winner-animation',
}

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  public players: IPlayer[] = [];
  public isShowingAnimation = false;
  public result = '';
  public score = '';

  constructor(
    private gameService: GameService,
    private nav: NavController,
    private alert: AlertController,
    private storage: Storage,
    private util: UtilsService,
  ) {}

  ngOnInit() {
    this.loadPlayers();
  }

  public calcTotal(player: IPlayer, field?: string): void {
    if (field === 'ponto1') {
      const value = (player as any)[field];
      if (![0, 1, 2, 3, 4, 5].includes(value)) {
        return;
      }
    } else if (field === 'ponto2') {
      const value = (player as any)[field];
      if (![0, 1, 2, 4, 6, 8, 10].includes(value)) {
        return;
      }
    } else if (field === 'ponto3') {
      const value = (player as any)[field];
      if (![0, 1, 3, 6, 9, 12, 15].includes(value)) {
        return;
      }
    } else if (field === 'ponto4') {
      const value = (player as any)[field];
      if (![0, 1, 2, 4, 8, 12, 16, 20].includes(value)) {
        return;
      }
    } else if (field === 'ponto5') {
      const value = (player as any)[field];
      if (![0, 1, 2, 5, 10, 15, 20, 25].includes(value)) {
        return;
      }
    } else if (field === 'ponto6') {
      const value = (player as any)[field];
      if (![0, 1, 2, 3, 6, 12, 18, 24, 30].includes(value)) {
        return;
      }
    } else if (field === 'pontoS') {
      const value = (player as any)[field];
      if (![0, 2, 20, 25].includes(value)) {
        return;
      }
    } else if (field === 'pontoF') {
      const value = (player as any)[field];
      if (![0, 3, 30, 35].includes(value)) {
        return;
      }
    } else if (field === 'pontoP') {
      const value = (player as any)[field];
      if (![0, 4, 40, 45].includes(value)) {
        return;
      }
    } else if (field === 'pontoG') {
      const value = (player as any)[field];
      if (![0, 5, 50, 55].includes(value)) {
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

    setTimeout(() => {
      this.runAnimation(players);
    }, 4000);
  }

  public validatePonto1(event: any, player: IPlayer, field: string): void {
    const { value } = event.target;
    let allowed = ['0', '1', '2', '3', '4', '5'];

    if (value === '') {
      player[field] = '';
      return;
    }

    if (field === 'ponto2') {
      allowed = ['0', '1', '2', '4', '6', '8', '10'];
    } else if (field === 'ponto3') {
      allowed = ['0', '1', '3', '6', '9', '12', '15'];
    } else if (field === 'ponto4') {
      allowed = ['0', '1', '2', '4', '8', '12', '16', '20'];
    } else if (field === 'ponto5') {
      allowed = ['0', '1', '2', '5', '10', '15', '20', '25'];
    } else if (field === 'ponto6') {
      allowed = ['0', '1', '2', '3', '6', '12', '18', '24', '30'];
    } else if (field === 'pontoS') {
      allowed = ['0', '2', '20', '25'];
    } else if (field === 'pontoF') {
      allowed = ['0', '3', '30', '35'];
    } else if (field === 'pontoP') {
      allowed = ['0', '4', '40', '45'];
    } else if (field === 'pontoG') {
      allowed = ['0', '5', '50', '55'];
    }

    if (!allowed.includes(value)) {
      this.handleAlert();
    }

    if (!allowed.includes(value)) {
      player[field] = '';
      event.target.value = '';
    } else {
      player[field] = Number(value);
    }
  }

  public finish() {
    this.handleAlert('Atenção', 'Deseja realmente finalizar esta partida?', [
      { text: 'Não' },
      {
        text: 'Sim',
        handler: () => {
          this.nav.navigateRoot(['/home']);
          this.gameService.destroyGame();
          this.storage.remove(ANIMATION.WAS_ANIMATED);
        },
      },
    ]);
  }

  public closeAnimation() {
    if (this.isShowingAnimation) this.isShowingAnimation = false;
  }

  private async loadPlayers() {
    this.players = await this.storage.get(this.gameService.playersToken);
  }

  private async handleAlert(
    header = 'Valor Inválido',
    message = 'O valor informado é permitido neste campo.',
    buttons: (string | AlertButton)[] | undefined = ['OK'],
  ) {
    const alert = await this.alert.create({ header, message, buttons });
    await alert.present();
  }

  private async runAnimation(players: IPlayer[]) {
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
        Keyboard.hide();
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
}
