// TODO
import { removeOnFromArray } from './JSHACKS';

type Data = any;
export type EventHandler = (data: Data) => void;
export type UnsubscribeFn = () => void;

export class EventEmitter {
  private readonly subs = new Map<string, EventHandler[]>();

  public emit(topic: string, value: Data): void {
    const listeners = this.subs.get(topic);
    const allTopicsListeners = this.subs.get('*');

    if (allTopicsListeners) {
      for (const fn of allTopicsListeners) {
        fn(value);
      }
    }

    if (listeners) {
      for (const fn of listeners) {
        fn(value);
      }
    }
  }

  public subscribe(topic: string, fn: EventHandler): UnsubscribeFn {
    if (!this.subs.get(topic)) {
      this.subs.set(topic, []);
    }

    this.subs.get(topic)!.push(fn);

    return () => {
      removeOnFromArray(this.subs.get(topic)!, f => f !== fn);
    };
  }

  public once(topic: string, fn: EventHandler): UnsubscribeFn {
    const unsubscribe = this.subscribe(topic, (data) => {
      fn(data);
      unsubscribe();
    });

    return unsubscribe;
  }
}
