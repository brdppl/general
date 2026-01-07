import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-install-ios',
  templateUrl: './modal-install-ios.component.html',
  styleUrls: ['./modal-install-ios.component.scss'],
})
export class ModalInstallIosComponent implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  public ngOnInit(): void {}

  public dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }
}
