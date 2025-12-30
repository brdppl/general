import { EventEmitter, Injectable, Output } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IPlayer } from '../models/player.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  @Output() fireListPlayers: EventEmitter<IPlayer[] | null> = new EventEmitter<IPlayer[] | null>();
  public playersToken = '12345@@@PlAyErS###54321';

  constructor(private storage: Storage) {}

  public storagePlayers(players: IPlayer[]) {
    this.storage.set(this.playersToken, players);
    this.fireListPlayers.emit(players);
  }

  public getEmit = () => this.fireListPlayers;

  public destroyGame() {
    this.storage.remove(this.playersToken);
    this.fireListPlayers.emit(null);
  }

  public async ereaseGame() {
    const players: IPlayer[] = await this.storage.get(this.playersToken);
    const newPlayers = players.map((player: IPlayer, index: number) => ({
      name: player.name,
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
      index,
    }));
    this.storagePlayers([...newPlayers]);
  }
}
