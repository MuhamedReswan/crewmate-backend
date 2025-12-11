export function calculateTotalEventBill(
  boys: number,
  wagePerBoy: number,
  bonusPerBoy: number,
  overtimePerBoy: number,
  travelPerBoy: number
): number {
  const wage = boys * wagePerBoy;
  const bonus = boys * bonusPerBoy;
  const overtime = boys * overtimePerBoy;
  const travel = boys * travelPerBoy;

  return wage + bonus + overtime + travel;
}
