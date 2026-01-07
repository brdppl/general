import { IPlayer } from './player.model';

export interface IHistory {
  game: IPlayer[];
  gameDate: Date;
  id?: number;
}
