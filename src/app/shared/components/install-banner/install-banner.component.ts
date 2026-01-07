import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { ModalInstallIosComponent } from '../modal-install-ios/modal-install-ios.component';
import { Storage } from '@ionic/storage';
import { BannerEnum } from 'src/app/shared/models/banner.enum';

@Component({
  selector: 'app-install-banner',
  templateUrl: './install-banner.component.html',
  styleUrls: ['./install-banner.component.scss'],
})
export class InstallBannerComponent implements OnInit {
  public deferredPrompt: any = null;
  public showInstallBanner = false;
  public showIosInstallModal = false;

  constructor(private platform: Platform, private modalController: ModalController, private storage: Storage) {}

  public ngOnInit(): void {
    this.checkPwaInstall();
  }

  public handleClose(): void {
    this.showInstallBanner = false;
    this.storage.set(BannerEnum.DOWNLOAD_BANNER, false);
  }

  public installPWA() {
    if (this.platform.is('ios')) {
      this.createModal();
    } else {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            this.showInstallBanner = false;
            this.deferredPrompt = null;
          }
        });
      }
    }
  }

  private async checkPwaInstall() {
    if (!this.platform.is('pwa') && !this.platform.is('hybrid')) {
      if (this.platform.is('ios')) {
        this.showInstallBanner = (await this.storage.get(BannerEnum.DOWNLOAD_BANNER)) ?? true;
      } else {
        this.showInstallBanner = (await this.storage.get(BannerEnum.DOWNLOAD_BANNER)) ?? true;
        window.addEventListener('beforeinstallprompt', e => {
          e.preventDefault();
          this.deferredPrompt = e;
        });
      }
    }
  }

  private async createModal() {
    const modal = await this.modalController.create({
      component: ModalInstallIosComponent,
    });
    return await modal.present();
  }
}
