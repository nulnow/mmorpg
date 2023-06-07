class ServerPlayer {
  private socket = null;
  private playerEntity = null;

  private init(): void {
    this.socket
  }
}

class Location {
  private players: ServerPlayer[] = [];
}

class GameWorld {
  private locations: Location[] = [];
}

class Server {

}

// socket connected and authorized

// attach player to socket

//

class TimerBuilder {
  private _millisecond = false;
  private _second = false;
  private _minute = false;

  public constructor(private clock: Clock) {}

  public millisecond(): TimerBuilder {
    this._millisecond = true;
    return this;
  }

  public second(): TimerBuilder {
    this._second = true;
    return this;
  }

  public minute(): TimerBuilder {
    this._minute = true;
    return this;
  }

  public run(handler: () => void) {
    const preparedHandler = (millisecond: number, second: number, minute: number) => {
      if (this._millisecond) {
        for (let i = 0; i < millisecond; i++) {
          handler();
        }
      }

      if (this._second) {
        for (let i = 0; i < second; i++) {
          handler();
        }
      }

      if (this._minute) {
        for (let i = 0; i < minute; i++) {
          handler();
        }
      }
    };

    return new Timer(this.clock, preparedHandler);
  }
}

class Timer {
  public constructor(
    private clock: Clock,
    private handler:
  ) {}

  public run(millisecond: number, second: number, minute: number): void {

  }

  public destroy(): void {

  }
}

class Clock {
  private timePassed = {
    minute: 0,
    second: 0,
    millisecond: 0,
  };
  private timers: Timer[] = [];

  public each(): TimerBuilder {
    return new TimerBuilder(this);
  }

  public addTimer(timer: Timer): () => void {
    this.timers.push(timer);
    return () => {
      this.removeTimer(timer);
    };
  }

  public removeTimer(timer: Timer): void {
    this.timers = this.timers.filter(t => t !== timer);
    timer.destroy();
  }

  public update(timeElapsed: number): void {
    let millisecond = 0;
    let seconds = 0;
    let minutes = 0;

    this.timePassed.millisecond += timeElapsed;

    const currentSeconds = Math.floor(this.timePassed.millisecond / 1000);

    this.timePassed.millisecond -= currentSeconds * 1000;

    this.timePassed.second += currentSeconds;

    const currentMinutes = Math.floor(this.timePassed.second / 60);

    this.timePassed.second -= currentMinutes * 60;

    const minutesDiff = Math.abs(this.timePassed.minute - currentMinutes);
    this.timePassed.minute += currentMinutes

    millisecond = timeElapsed;
    seconds = currentSeconds;
    minutes = minutesDiff;

    this.timers.forEach(timer => {
      timer.run(millisecond, seconds, minutes);
    });
  }
}

const unsubscribeFromTimer = this
  .getEntityManager()
  .getClock()
  .each()
  .minute()
  .run(() => {

  });
