export interface IEntityAbleToAttack {
  getAttackSpeed(): number;
  setAttackSpeed(value: number): void;

  getAttackDamage(): number;
  setAttackDamage(value: number): void;

  getAttackRange(): number;
  setAttackRange(value: number): void;
}
