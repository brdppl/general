import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Random alert message
  public randomMessage(playerName: string) {
    const random = Math.floor(Math.random() * 3);
    
    switch(random) {
      case 0:
        return `Nunca duvidei de você ${this.capitalize(playerName)}!`;
      case 1:
        return `${this.capitalize(playerName)} humilhou geral!`;
      case 2:
        return `${this.capitalize(playerName)} é o nome da fera!`;
      default:
        return `Parabéns ${this.capitalize(playerName)}, você venceu!`;
    }
  }
}
