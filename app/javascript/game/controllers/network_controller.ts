import GameDataController from "./game_data_controller";
import AnimationController from "./animation_controller";
import TurnTransitioner from "./turn_transitioner";
import Structure from "../models/structure";
import Square from "../models/square";
import MoveAnimation from "../models/move_animation";

declare const gameId: any;

declare module ActionCable {
  interface Channel {
    unsubscribe(): void;
    perform(action: string, data: {}): void;
  }

  interface Subscriptions {
    // create(chan_name: string, obj: CreateMixin): Channel;
    create(chan_name: any, obj: any): Channel;
  }

  interface Cable {
    subscriptions: Subscriptions;
  }

  interface CreateMixin {
    connected(): void;
    disconnected(): void;
    received(obj: Object): void;
    [key: string]: Function;
  }

  function createConsumer(): Cable;
  function createConsumer(url: string): Cable;
}

declare interface AppInterface {
  cable?: ActionCable.Cable;
  network?: ActionCable.Channel;
}

declare var App: AppInterface;

interface Payload {
  method: string;
  game?: string;
  data?: any;
  square_id?: string;
  structure_id?: string;
  production?: UnitType;
}

export default class NetworkController {
  readonly turnTransitioner: TurnTransitioner;
  readonly gameDataController: GameDataController;
  readonly animationController: AnimationController;

  constructor(turnTransitioner: TurnTransitioner, gameDataController: GameDataController, animationController: AnimationController) {
    this.turnTransitioner = turnTransitioner;
    this.gameDataController = gameDataController;
    this.animationController = animationController;

    App.cable.subscriptions.create({ channel: "GameChannel", room: gameId }, {
      received: (data: any) => {
        console.log(data);
        switch (data.type) {
          case "piece_move":
            this.gameDataController.pieceMove(data, this.animationController.pieceMove.bind(this.animationController));
            break;
          case "piece_merge":
            this.gameDataController.pieceMove(data, this.animationController.pieceMove.bind(this.animationController));
            break;          
          case "next_turn":
            this.turnTransitioner.begin();
            data.move_animations.forEach((moveAnimation: MoveAnimation) => {
              this.gameDataController.pieceMove(moveAnimation, this.animationController.pieceMove.bind(this.animationController));
            });
            this.getGameData();
            break;
          case "give_order":
            this.gameDataController.giveOrder(data.new_square);
            break;
          case "player_ready":
            this.gameDataController.updatePlayersReady(data.players_ready);
            break;
          default:
            break;
        }
      }      
    });
  };

  public pieceMove(pieceMoveData: any): void {
    const payload: Payload = { method: "piece_move" };
    payload.data = pieceMoveData;

    this.send(payload);
  };

  public pieceMerge(pieceMergeData: any): void {
    const payload: Payload = { method: "piece_move" };
    payload.data = pieceMergeData;

    this.send(payload);
  };

  public nextTurn(): void {
    const payload: Payload = { method: "next_turn" };
    this.send(payload);
    this.turnTransitioner.ready();
  };

  public giveOrder(orderData: any): void {
    const payload: Payload = { method: "give_order" };
    payload.data = orderData;
    this.send(payload)
  };

  public setProduction(structure: Structure, square: Square): void {
    const payload: Payload = { 
      method: "set_production",
      square_id: square.id,
      structure_id: structure.id,
      production: structure.production
    };
  
    this.send(payload)
  };


  public getGameData(): void {
    const payload: Payload = { method: "get_game_data" };
    this.send(payload, (data: any) => {
      this.gameDataController.newGameData(data.new_game);
      this.turnTransitioner.end();
    });  
  };
  
  public leaveGame(): void {
    fetch(`/game/${gameId}/leave`, {
      method: "POST",
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
      credentials: "same-origin"
    }).then(response => response.json())
    .then((data) => {
      console.log(data);
    });
  };

  private send(payload: Payload, callback?: Function): void {
    payload.game = gameId;
  
    const response = fetch("/game/input", {
      method: "POST",
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      credentials: "same-origin"
    }).then(response => response.json()).then((data) => {
      if (callback) { callback(data); }
    });
  };
}
