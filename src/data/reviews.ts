export type Review = {
  id: number;
  name: string;
  role: string;
  rating: number;
  photo: string;
  quote: string;
};

export const reviews: Review[] = [
  {
    id: 1,
    name: "Maria Santos",
    role: "Café owner · Makati",
    rating: 5,
    photo: "/logo.png",
    quote:
      "Our takeout looks more premium since we switched to Ziyah bento boxes. Fast replies and consistent stock.",
  },
  {
    id: 2,
    name: "James Rivera",
    role: "Catering lead · Quezon City",
    rating: 5,
    photo: "/dummy-post-square-1.jpg",
    quote:
      "Reliable trays and lids for big events. Nationwide delivery made restocking simple for our team.",
  },
  {
    id: 3,
    name: "Aira Mendoza",
    role: "Sushi stall · Pasay",
    rating: 4,
    photo: "/logo.png",
    quote:
      "Clear sushi trays show the food beautifully. Great guidance when we needed the right sizes.",
  },
  {
    id: 4,
    name: "Kenji Ong",
    role: "Meal-prep brand · Cebu",
    rating: 5,
    photo: "/dummy-post-square-1.jpg",
    quote:
      "Wholesale pricing that works for our volume. Packaging quality holds up through delivery.",
  },
];
