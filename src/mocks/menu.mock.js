// mocks/menu.mock.js
export const MENU_ITEMS = {
    1: [ // Restaurant ID 1 (Burger King)
        {
            categoryId: 101,
            categoryName: "Whopper",
            items: [
                {
                    id: 1001,
                    name: "Whopper Meal",
                    price: 159,
                    description: "Flame-grilled beef patty, topped with soft bun.",
                    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
                    isVeg: false,
                    rating: 4.5,
                    votes: 120
                },
                {
                    id: 1002,
                    name: "Veg Whopper",
                    price: 149,
                    description: "Veggie patty with fresh lettuce and tomatoes.",
                    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80",
                    isVeg: true,
                    rating: 4.2,
                    votes: 90
                }
            ]
        },
        {
            categoryId: 102,
            categoryName: "Sides",
            items: [
                {
                    id: 1003,
                    name: "Fries (Medium)",
                    price: 99,
                    description: "Crispy salted fries.",
                    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&q=80",
                    isVeg: true,
                    rating: 4.6,
                    votes: 200
                }
            ]
        }
    ],
    2: [ // Pizza Hut
        {
            categoryId: 201,
            categoryName: "Pizzas",
            items: [
                {
                    id: 2001,
                    name: "Margherita",
                    price: 299,
                    description: "Classic cheese and tomato base.",
                    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80",
                    isVeg: true,
                    rating: 4.1,
                    votes: 50
                }
            ]
        }
    ]
};
