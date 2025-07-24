// lib/impactStats.ts

export const IMPACT_VALUES: Record<string, { co2: number; water: number }> = {
  'Turn Off Lights': { co2: 0.2, water: 0 },
  'Refill Water Bottle': { co2: 0.1, water: 1 },
  'Eco Tip to a Friend': { co2: 0.05, water: 0 },
  'Zero Waste Meal': { co2: 1.0, water: 15 },
  'Walk or Bike Instead': { co2: 0.9, water: 0 },
  'Cold Wash Laundry': { co2: 0.3, water: 5 },
  'Recycle Something': { co2: 0.5, water: 10 },
  'Shorter Shower Challenge': { co2: 0.2, water: 15 },
  'Public Transit Bonus': { co2: 0.8, water: 0 },
  'Pick Up 5 Pieces of Trash': { co2: 0.1, water: 0 },
  'Bring Your Own Bag': { co2: 0.15, water: 5 },
  'Use a Reusable Cup': { co2: 0.1, water: 3 },
  'No Meat Monday': { co2: 1.5, water: 50 },
  'Borrow Instead of Buy': { co2: 1.0, water: 0 },
  'Digital Cleanup': { co2: 0.3, water: 0 },
};
