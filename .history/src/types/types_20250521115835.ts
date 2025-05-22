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
};

// export type Drink = Provision & {
// 	brewer: string;
// };

export type Drink = {
	idDrink: string;
	strDrink: string;
	strDrinkThumb: string;
}

export type Order = {
	id: number;
	email: string;
	dish: Dish;
	drinks: Drink[];
	count: number;
	date: Date | string;
};

