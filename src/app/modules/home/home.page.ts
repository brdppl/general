import { Component } from '@angular/core';
import { faDice } from '@fortawesome/free-solid-svg-icons';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ModalAddPlayerPage } from 'src/app/components/modal-add-player/modal-add-player.page';
import { ANIMATION } from 'src/app/shared/models/animation.enum';
import { IPlayer } from 'src/app/shared/models/player.model';
import { GameService } from 'src/app/shared/services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  public faDice = faDice;
  public players: IPlayer[] = [];

  constructor(
    private modalController: ModalController,
    private gameService: GameService,
    private alert: AlertController,
    private storage: Storage,
    private nav: NavController,
  ) {}

  async ionViewDidEnter() {
    this.players = await this.storage.get(this.gameService.playersToken);
  }

  public addPlayers() {
    if (this.players) {
      this.handleAlert();
    } else {
      this.createModal();
    }
  }

  private async createModal() {
    const modal = await this.modalController.create({
      component: ModalAddPlayerPage,
    });
    return await modal.present();
  }

  private async handleAlert() {
    const alert = await this.alert.create({
      header: 'Atenção',
      subHeader: 'Jogo em andamento!',
      message: 'Você já possui um jogo em andamento, deseja começar outro do zero?',
      buttons: [
        {
          text: 'Repetir participantes',
          handler: () => {
            this.storage.remove(ANIMATION.WAS_ANIMATED);
            this.gameService.ereaseGame().then(() => {
              this.nav.navigateRoot(['/game']);
            });
          },
        },
        {
          text: 'Cancelar',
        },
        {
          text: 'OK',
          handler: () => {
            this.createModal();
          },
        },
      ],
    });

    await alert.present();
  }
}
