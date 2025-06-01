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

	//fetching the current path
	const response = await fetch(`http://localhost:3001${url}`, {
		method,
		headers: {
			"Content-Type": "application/json",
		},
		body: body ? JSON.stringify(body) : undefined,
	});

	//check if response ok
	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Request failed with status ${response.status}: ${errorText}`);
	}

	// returns either { success: true, response: T } or throws an error
	const json: ServerResponse<T> = await response.json();

	if (!json.success) {
		console.log("error from api !success");
		throw new Error(json.error);
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
		return response.response;
	}
	catch (error) {
		// console.error("getOrderByEmail error:", error);
		throw error;
	}

};


// For homescreen, only checking if email exists. No error if not
const checkOrderByEmail = async (email: string) => {
	try {
		const response = await requestResponse<Order>(`/api/order/${email}`, "GET");
		return response.response;
	} catch (error: any) {
		const isNotFound =
			error?.response?.status === 404 ||
			error?.message?.includes("Order not found") ||
			error?.toString()?.includes("Order not found");

		if (isNotFound) {
			// if order doesn't exist - just return
			return null;
		}

		//log unexpected errors
		console.error("checkOrderByEmail unexpected error:", error);
		return null;
	}
};

//updating the order with PUT
const updateOrder = async (order: Order) => {
	const response = await requestResponse<Order>(
		"/api/update-order",
		"PUT",
		order
	);
	return response.response;
};


const api = {
	createOrder,
	checkOrderByEmail
	getOrderByEmail,
	updateOrder,
};

export default api;
