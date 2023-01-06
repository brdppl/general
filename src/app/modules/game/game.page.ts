import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/shared/services/game.service';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { IPlayer } from 'src/app/shared/models/player.model';
import * as _ from 'lodash';
import { Keyboard } from '@capacitor/keyboard';
import { UtilsService } from 'src/app/shared/services/utils.service';

enum ANIMATION {
  WAS_ANIMATED = 'winner-animation'
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
    private util: UtilsService
  ) { }

  ngOnInit() {
    this.loadPlayers();
  }

  public calcTotal(player: IPlayer) {
    const players = this.players.map((el, i) => {
      if (player.index === i) {
        const points = Object.values(el).filter(e => typeof e === 'number');
        const total = points.slice(0, points.length-2).reduce((a, b) => a + b, 0);
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

  public finish() {
    this.handleAlert();
  }

  public closeAnimation() {
    if (this.isShowingAnimation) this.isShowingAnimation = false;
  }

  private async loadPlayers() {
    this.players = await this.storage.get(this.gameService.playersToken);
  }

  private async handleAlert() {
    const alert = await this.alert.create({
      header: 'Atenção',
      message: 'Deseja realmente finalizar esta partida?',
      buttons: [
        {
          text: 'Não'
        },
        {
          text: 'Sim',
          handler: () => {
            this.nav.navigateRoot(['/home']);
            this.gameService.destroyGame();
            this.storage.remove(ANIMATION.WAS_ANIMATED);
          }
        }
      ]
    });

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
        const winner = participants.reduce((a: any, b: any) => (a.total > b.total) ? a : b);

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
          })
        } else {
          this.result = this.util.randomMessage(winner.name);
          this.score = `Com ${winner.total} pontos`;
        }

        this.storage.set(ANIMATION.WAS_ANIMATED, true);
      }
    }
  }
}