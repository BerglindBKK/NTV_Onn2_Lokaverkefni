import type { Expense } from "@/types/types";

type RequestMethod = "POST" | "GET" | "DELETE";

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
	? [url: string, method: R, body?: undefined]
	: [url: string, method: R, body?: Record<string, unknown>];

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

	const json: ServerResponse<T> = await response.json();

	if (!json.success) {
		console.log("there");
		throw new Error(json.error);
	}

	return json;
};

const getExpenses = async () => {
	const response = await requestResponse<Expense[]>("/api/expenses", "GET");
	console.log(response.response);
	return response.response;
};

const createExpense = async ({
	name,
	cost,
}: Pick<Expense, "cost" | "name">) => {
	const response = await requestResponse<Expense>(
		"/api/create-expense",
		"POST",
		{
			name,
			cost,
		},
	);
	return response.response;
};

const getExpenseById = async (id: number) => {
	const response = await requestResponse<Expense>(`/api/expense/${id}`, "GET");
	return response.response;
};

const deleteExpenseById = async (id: number) => {
	const response = await requestResponse<Expense[]>(
		`/api/expense/${id}`,
		"DELETE",
	);
	return response.response;
};

const api = {
	getExpenses,
	createExpense,
	getExpenseById,
	deleteExpenseById,
};

export default api;
