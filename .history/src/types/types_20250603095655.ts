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

