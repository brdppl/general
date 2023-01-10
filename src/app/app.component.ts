import { Component } from '@angular/core';
import { faDice } from '@fortawesome/free-solid-svg-icons';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { IPlayer } from './shared/models/player.model';
import { GameService } from './shared/services/game.service';
import { Device } from '@capacitor/device';

enum COLOR_MODE {
  DARK = 'dark-mode',
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Regras',
      url: '/rules',
      icon: 'bookmarks'
    }
  ];

  public isIOS = false;
  public isDarkMode = false;
  public hasSupportDarkMode = false;
  public players: IPlayer[] = [];
  public faDice = faDice;
  
  constructor(
    private platform: Platform,
    private storage: Storage,
    private gameService: GameService
  ) {
    this.initializeApp();
  }

  public toggleTheme() {
    if (this.isDarkMode) {
      document.body.removeAttribute('data-theme');
      this.isDarkMode = false;
      this.storage.set('dark-mode', this.isDarkMode);
    } else {
      document.body.setAttribute('data-theme', 'dark');
      this.isDarkMode = true;
      this.storage.set('dark-mode', this.isDarkMode);
    }
  }

  private initializeApp() {
    this.platform.ready().then(async () => {
      this.isIOS = this.platform.is('ios');
      this.checkIfDarkMode();
      this.checkDeviceVersion();

      this.players = await this.storage.get(this.gameService.playersToken);
  
      this.gameService.fireListPlayers.subscribe(data => {
        this.players = data;
      });

      this.storage.get('dark-mode').then(data => {
        this.isDarkMode = data;
        if (data) {
          document.body.setAttribute('data-theme', 'dark');
        } else {
          document.body.removeAttribute('data-theme');
        }
      });
    });
  }

  private async checkIfDarkMode() {
    this.isDarkMode = await this.storage.get(COLOR_MODE.DARK);
    if (this.isDarkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }

  private async checkDeviceVersion() {
    const info = await Device.getInfo();
    let major: number;
    
    if (!this.isIOS) {
      major = Number(info.osVersion.split(' ')[1].split('.')[0]);
      this.hasSupportDarkMode = major >= 10 ? true : false;
    } else {
      major = Number(info.osVersion.split('.')[0]);
      this.hasSupportDarkMode = major >= 13 ? true : false;
    }
  }
}