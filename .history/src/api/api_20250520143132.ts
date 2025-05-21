import type { Order } from "../types/types";

type RequestMethod = "POST" | "GET" | "DELETE" | "PUT";

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

	const text = await response.text();  // get raw text to see response fully
	let json: ServerResponse<T>;

	try {
		json = JSON.parse(text);
	} catch (e) {
		console.error("Failed to parse JSON response:", text);
		throw new Error("Invalid JSON response from API");
	}

	if (!response.ok) {
		console.error(`API error ${response.status}: ${text}`);
		throw new Error(`Request failed with status ${response.status}: ${text}`);
	}

	if (!json.success) {
		// If error message is missing, log full JSON to help debugging
		if (!json.error) {
			console.error("API returned error without 'error' message:", json);
			throw new Error("Unknown API error, no error message returned from server");
		} else {
			console.log("API error:", json.error);
			throw new Error(json.error);
		}
	}


	return json;
};


// We only know email when order is created
//try to do omit order id, will be generated automatically
const createOrder = async ({
	email,
	// }: Omit<Order, "id">) => {
}: Pick<Order, "email">) => {
	const response = await requestResponse<Order>(
		"/api/create-order",
		"POST",
		{
			email,
		},
	);
	return response.response;
};

//getting the order by user email
const getOrderByEmail = async (email: string) => {
	try {
		const response = await requestResponse<Order>(`/api/order/${email}`, "GET");
		console.log("Calling getOrderByEmail with:", email);
		return response.response;
	}
	catch (error) {
		console.error("getOrderByEmail error:", error);
		throw error;
	}

};

const updateOrder = async (order: Order) => {
	const response = await requestResponse<Order>(
		"/api/update-order",
		"PUT",
		order
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
	getOrderByEmail,
	updateOrder,
};

export default api;
