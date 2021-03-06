import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { GameStateService } from 'src/app/services/game-state.service';

@Component({
  selector: 'app-add-players',
  templateUrl: './add-players.page.html',
  styleUrls: ['./add-players.page.scss'],
})
export class AddPlayersPage implements OnInit {

  public players = [{
    name: '',
    total: 0,
    index: 0
  }]
  public player

  constructor(
    private modalCtrl: ModalController,
    private nav: NavController,
    private gameService: GameStateService,
    private alertController: AlertController
  ) { }

  ngOnInit() { }

  public dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  public newPlayer() {
    this.players.push({
      name: this.player,
      total: 0,
      index: this.players.length
    })
  }

  public dropPlayer(index) {
    this.players.splice(index, 1)
  }

  public begin() {
    let restriction = []
    this.players.forEach((el, i) => {
      if(!el.name) {
        restriction.push(i)
      }
    })

    if(restriction.length) {
      this.handle()
    } else {
      this.gameService.storagePlayers(this.players)
      this.nav.navigateForward(['/game'])
      this.dismiss()
    }
  }

  async handle() {
    const alert = await this.alertController.create({
      header: 'Atenção',
      subHeader: 'O jogo não pôde ser iniciado',
      message: 'Informe um nome para cada jogador na partida.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
