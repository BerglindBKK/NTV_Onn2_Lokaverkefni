import type { Order } from "../types/types";

type RequestMethod = "POST" | "GET" | "DELETE";

// models the structure of API's JSON response.
//if successful, success: true, response: actual data, annaðhvort:
//{ "success": true, "response": { ...your data... } } eða 
//{ "success": false, "error": "Something went wrong" }
type ServerResponse<T> =
	| {
		success: true;
		response: T;
	}
	| {
		success: false;
		error: string;
	};

type RequestParams<R extends RequestMethod> = R extends "GET"
	? [url: string, method: R, body?: undefined] //no body allowed
	: [url: string, method: R, body?: Record<string, unknown>]; //body is required (a Record<string, unknown>)

//core function that wraps fetch() with, url, method and body, json handling, status and success/error checking, strong tyoing for returned data
const requestResponse = async <T, R extends RequestMethod = RequestMethod>(
	...args: RequestParams<R>
) => {
	const [url, method, body] = args;

	const response = await fetch(`http://localhost:3001${url}`, {
		method,
		headers: {
			"Content-Type": "application/json",
		},
		body: body ? JSON.stringify(body) : undefined,
	});

	if (response.status !== 200) {
		console.log("here");
		throw new Error(`Response status: ${response.status}`);
	}

	// returns either { success: true, response: T } or throws an error
	const json: ServerResponse<T> = await response.json();

	if (!json.success) {
		console.log("there");
		throw new Error(json.error);
	}

	return json;
};



// const getExpenses = async () => {
// 	const response = await requestResponse<Expense[]>("/api/expenses", "GET");
// 	console.log(response.response);
// 	//fyrra response = local variable returned from requestResponse<T>()
// 	//seinna = actual data return from the api
// 	return response.response;
// };

// const createExpense = async ({
// 	name,
// 	cost,
// }: Pick<Expense, "cost" | "name">) => {
// 	const response = await requestResponse<Expense>(
// 		"/api/create-expense",
// 		"POST",
// 		{
// 			name,
// 			cost,
// 		},
// 	);
// 	return response.response;
// };

//try to do omit order id, will be generated automatically
const createOrder = async ({
	drinks,
	email,
	count,
	date,
	dish,
	// }: Omit<Order, "id">) => {
}: Pick<Expense, "cost" | "name">) => {
	const response = await requestResponse<Order>(
		"/api/create-order",
		"POST",
		{
			drinks,
			email,
			count,
			date,
			dish,
		},
	);
	return response.response;
};

// const getExpenseById = async (id: number) => {
// 	const response = await requestResponse<Expense>(`/api/expense/${id}`, "GET");
// 	return response.response;
// };

// const deleteExpenseById = async (id: number) => {
// 	const response = await requestResponse<Expense[]>(
// 		`/api/expense/${id}`,
// 		"DELETE",
// 	);

// 	return response.response;
// };

const api = {
	// getExpenses,
	// createExpense,
	// getExpenseById,
	// deleteExpenseById,
	createOrder,
};

export default api;
