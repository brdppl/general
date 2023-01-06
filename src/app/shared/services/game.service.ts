import { EventEmitter, Injectable, Output } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IPlayer } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  @Output() fireListPlayers: EventEmitter<any> = new EventEmitter<any>();
  public playersToken = '12345@@@PlAyErS###54321';

  constructor(private storage: Storage) { }

  public storagePlayers(players: IPlayer[]) {
    this.storage.set(this.playersToken, players);
    this.fireListPlayers.emit(players);
  }

  public getEmit = () => this.fireListPlayers;

  public destroyGame() {
    this.storage.remove(this.playersToken);
    this.fireListPlayers.emit(null);
  }
}
