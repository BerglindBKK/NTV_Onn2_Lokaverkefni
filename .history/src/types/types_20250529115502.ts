export type Provision = {
	id: string;
	name: string;
	description: string;
	imageSource: string;
	price: number;
	category: string;
};

export type Dish = {
	idMeal: string;
	strMeal: string;
	strMealThumb: string;
	strArea: string;
	strCategory: string;
	strTags: string;
	price: number;
	calories: number;
};
// export type Drink = Provision & {
// 	brewer: string;
// };

// export type Drink = Provision & {
// 	idDrink: string;
// 	strDrink: string;
// 	strDrinkThumb: string;
// }

export type Drink = {
	idDrink: string;
	strDrink: string;
	strDrinkThumb: string;
	strGlass: string;
	strCategory: string;
	strAlcoholic: string;
	strIngredient1: string;
	strIngredient2: string;
	strIngredient3: string;
	strIngredient4: string;
	strIngredient5: string;
	strIngredient6: string;
	count: number;
	price: number;
};

// // Matches API shape
// export type ApiDrink = {
// 	idDrink: string;
// 	strDrink: string;
// 	strDrinkThumb: string;
// 	// other API fields if needed
// };

// // Your internal drink, with price etc
// export type Drink = Provision & {
// 	idDrink: string;
// 	strDrink: string;
// 	strDrinkThumb: string;
// 	price: number; // e.g. you add a price manually
// };

export type Order = {
	id: number;
	email: string;
	dish: Dish;
	drinks: Drink[];
	count: number;
	date: string | Date | null;
	time: string;
	price: number;
	calories: number;
};

// export type Date = {
// 	date: string;
// 	time: string;
// }
