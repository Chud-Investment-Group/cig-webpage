// Default markets data - used to seed the database
export const DEFAULT_MARKETS = [
  {
    id: 10,
    title: "Most common MIG Quants destination: Optiver, IMC, Citadel?",
    category: "placement",
    description: "Which firm will have the most MIG interns in summer 2026?",
    yesPrice: 0.40,
    volume: 1230,
    endDate: "2026-06-15",
    status: "open",
    createdAt: "2025-12-18",
    isMultiple: true,
    options: [
      { name: "Optiver", price: 0.40 },
      { name: "IMC", price: 0.35 },
      { name: "Citadel", price: 0.25 }
    ]
  }
];

export const MARKETS_KEY = 'cig-markets';
