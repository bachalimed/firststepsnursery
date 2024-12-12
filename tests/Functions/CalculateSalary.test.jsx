import { calculateSalary } from '../../src/Components/lib/Utils/calculateSalary'



describe("calculateSalary", () => {
  it("calculates correctly with Saturdays as working days", () => {
    const result = calculateSalary(
      2024,
      2, // March
      ["2024-03-02", "2024-03-09"], // Two Saturdays
      1000
    );
    expect(result).toEqual({
      totalWorkingDays: 26, // March 2024 has 26 working days (Mon-Sat, excluding Sundays)
      workingDaysInArray: 2,
      remainingWorkingDays: 24,
      salary: (24 / 26) * 1000,
    });
  });

  it("excludes Sundays from working days", () => {
    const result = calculateSalary(
      2024,
      2,
      ["2024-03-03", "2024-03-10"], // Two Sundays
      1000
    );
    expect(result).toEqual({
      totalWorkingDays: 26,
      workingDaysInArray: 0, // Sundays are not counted
      remainingWorkingDays: 26,
      salary: 1000,
    });
  });
});
