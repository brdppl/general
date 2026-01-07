import { Component, QueryList, ViewChildren } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { IPlayer } from 'src/app/shared/models/player.model';
import { GameService } from 'src/app/shared/services/game.service';

@Component({
  selector: 'app-modal-add-player',
  templateUrl: './modal-add-player.page.html',
  styleUrls: ['./modal-add-player.page.scss'],
})
export class ModalAddPlayerPage {
  @ViewChildren('playerNameInput') public playerNameInputList!: QueryList<any>;

  public players: IPlayer[] = [
    {
      name: '',
      ponto1: null,
      ponto2: null,
      ponto3: null,
      ponto4: null,
      ponto5: null,
      ponto6: null,
      pontoS: null,
      pontoF: null,
      pontoP: null,
      pontoG: null,
      total: 0,
      index: 0,
    },
  ];
  public playerName = '';

  constructor(
    private modalCtrl: ModalController,
    private nav: NavController,
    private gameService: GameService,
    private alertController: AlertController,
  ) {}

  async ionViewDidEnter() {
    this.playerNameInputList.last.el.setFocus();
  }

  public dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }

  public newPlayer() {
    this.players.push({
      name: this.playerName,
      ponto1: null,
      ponto2: null,
      ponto3: null,
      ponto4: null,
      ponto5: null,
      ponto6: null,
      pontoS: null,
      pontoF: null,
      pontoP: null,
      pontoG: null,
      total: 0,
      index: this.players.length,
    });
    this.playerNameInputList.changes.subscribe(inputs => {
      setTimeout(() => {
        inputs.last.el.setFocus();
      }, 700);
    });
  }

  public dropPlayer(index: number) {
    this.players.splice(index, 1);
  }

  public begin() {
    if (this.isPlayersValid()) {
      this.handleAlert();
    } else {
      this.gameService.storagePlayers(this.players);
      this.nav.navigateForward(['/game']);
      this.dismiss();
    }
  }

  private isPlayersValid(): boolean {
    return this.players.some(player => !player.name);
  }

  private async handleAlert() {
    const alert = await this.alertController.create({
      header: 'Atenção',
      subHeader: 'O jogo não pôde ser iniciado',
      message: 'Informe um nome para cada jogador na partida.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
