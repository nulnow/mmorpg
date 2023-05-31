export class Random {
  public static runChance(timeSEC: number, chanceSEC: number): boolean {
    return Math.random() < (1 - Math.pow(1- chanceSEC, timeSEC));
  }
}
