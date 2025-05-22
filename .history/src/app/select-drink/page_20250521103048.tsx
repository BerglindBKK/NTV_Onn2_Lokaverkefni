"use client";

//ToDo: Setja inn leitarglugga
//ToDo: Setja inn leit fyrir nafn, innihald
//Gefa drykkjum random verð - nei, fast verð á drykk, þarf að vera hægt að slá inn fjölda fyrir hvern
//Adda saman verðið í div2 allir drykkir + matur (plús fjöldi manns í næsta skrefi!)


import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Order } from "../../types/types";
import api from "../../api/api";
import { Search } from "lucide-react";

type Drink = {
    idDrink: string;
    strDrink: string;
    strDrinkThumb: string;
}


type ApiResponse = {
    drinks: Drink[];
};

const SelectDrink = () => {
    const router = useRouter();
    const [drink, setDrink] = useState<Drink[]>([]); //list of drinks
    const [hoveredDrinkId, setHoveredDrinkId] = useState<string | null>(null); //which one is hovered
    const [selectedDrinkId, setSelectedDrinkId] = useState<string[]>([]); //list of selected drinks
    const [drinkAmount, setdrinkAmount] = useState("");
    const [order, setOrder] = useState<Order | null>(null);
    const [search, setSearch] = useState("");

    const fetchOrderByEmail = async (email: string) => {
        try {
            const order = await api.getOrderByEmail(email);
            setOrder(order);
        }
        catch (err: any) {
            if (err.message.includes("Order not found")) {
                console.warn(`No order found for email: ${email}`);
                localStorage.removeItem("userEmail");
                setOrder(null);
            } else {
                console.error("Failed to fetch order:", err);
            }
        }
    }

    //fetching all drinks with initial letter a and storing it in a json file
    const getDrinkData = async () => {
        try {
            const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a";
            const response = await fetch(url); // Make the API request

            // If the response is not OK (status code 200), throw an error
            if (response.status !== 200) {
                throw new Error(`Response status: ${response.status}`);
            }
            const json: ApiResponse = await response.json();
            console.log(json.drinks, "halló, er ég hér?");
            //returning only the "drinks" array from the api
            return json.drinks;

        } catch (error: any) {
            // If something goes wrong, log the error and return an empty array
            console.error("Error fetching drink data:", error);
            return [];
        }
    };

    const getSearchData = async () => {
        try {
            const urlName = `www.thecocktaildb.com/api/json/v1/1/search.php?s=${search}`;
            const responseName = await fetch(urlName); // Make the API request
            const urlIngredient = `www.thecocktaildb.com/api/json/v1/1/search.php?i=${search}`;
            const responseIngredient = await fetch(urlIngredient); // Make the API request

            // If the response is not OK (status code 200), throw an error
            if (responseName.status !== 200) {
                throw new Error(`Response (search by name) status: ${responseName.status}`);
            }
            if (responseIngredient.status !== 200) {
                throw new Error(`Response (search by ingredient) status: ${responseIngredient.status}`);
            }
            const jsonName: ApiResponse = await responseName.json();
            console.log(jsonName.drinks, "Jason drinks by  name");
            const jsonIngredient: ApiResponse = await responseIngredient.json();
            console.log(jsonIngredient.drinks, "Jason drinks by  name");
            //returning only the "drinks" array from the api
            return jsonName.drinks;
            return jsonIngredient.drinks;

        } catch (error: any) {
            // If something goes wrong, log the error and return an empty array
            console.error("Error fetching search data:", error);
            return [];
        }
    };

    // Function to load and store drink in state.
    const fetchDrink = async () => {
        const drink = await getDrinkData();
        setDrink(drink);
    };

    //  Loaded only on mount.
    useEffect(() => {
        fetchDrink();
        const storedEmail = localStorage.getItem("userEmail");
        console.log("storedEmail:", storedEmail);
        if (storedEmail) {
            fetchOrderByEmail(storedEmail);
        } else {
            console.warn("No email found in localStorage");
        }

    }, []);

    //filter: returns a new array for selected Drinks. Iterates over array and checks which drink d's idDrink is in selectedDrinkId
    const selectedDrinks = drink.filter(d => selectedDrinkId.includes(d.idDrink));

    return (
        <div className="page-container">
            <main className="grid-wrapper">
                <div className="parent-orderdish">
                    <div className="div5">
                        <div className="search-bar">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by cocktail name or inredient"
                                className="search-input"
                                // value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        {/* checks if there are info to display in the array, if not say loading */}
                        {drink.length === 0 ? (
                            <div className="p-20">
                                <p>Loading...</p>
                            </div>
                        ) : (
                            // For each Drink in drink, make a new div and check if it's selected, then assigns the approriate css class
                            <div className="grid-container">
                                {drink.map((im, idx) => (
                                    <div
                                        className={
                                            "grid-item" +
                                            (selectedDrinkId.includes(im.idDrink) ? " grid-item--selected" : "")
                                        }
                                        key={im.idDrink}
                                        //if hovered, set as hovered drink
                                        onMouseEnter={() => {
                                            setHoveredDrinkId(im.idDrink);
                                        }}
                                        //when not hovered anymore, unselected from hovered drinks
                                        onMouseLeave={() => setHoveredDrinkId("")}
                                        //onClick is a toggle, if idDrinks is in SelectedDrinkId, then unselect. If not: select
                                        onClick={() => {
                                            setSelectedDrinkId(ids =>
                                                ids.includes(im.idDrink)
                                                    ? ids.filter(id => id !== im.idDrink)   // unselect
                                                    : [...ids, im.idDrink]                  // select
                                            );
                                        }}
                                    >
                                        {/* display drink photo, if hovered, use grid-item-fact from css for overlay and display info */}
                                        <img
                                            key={im.idDrink}
                                            src={im.strDrinkThumb}
                                            alt={im.strDrink}
                                        />
                                        {hoveredDrinkId === im.idDrink && (
                                            <div className="grid-item-fact">
                                                {im.idDrink}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                        )}
                    </div>
                    {/* right summary div - samhæfa og uppfæra*/}
                    <div className="div2">
                        <div className="left">
                            {order && (
                                <div className="order-info">
                                    <p><strong>Order Email:</strong> {order.email}</p>
                                    <p><strong>Selected Dish:</strong> {order.dish?.strMeal}</p>
                                    {/* {order.dish?.strMealThumb && (
                                        <img
                                            src={order.dish.strMealThumb}
                                            alt={order.dish.strMeal}
                                            style={{ maxWidth: "200px", borderRadius: "8px", marginTop: "10px" }}
                                        />
                                    )} */}
                                </div>
                            )}

                            <p><strong>Selected Drinks:</strong></p>
                            {selectedDrinks.length === 0 ? (
                                <p>(none)</p>
                            ) : (
                                selectedDrinks.map(d => (
                                    <p key={d.idDrink}>
                                        <input className="input-amount"
                                            id="amount"
                                            type="text"
                                            value={drinkAmount}
                                            onChange={e => setdrinkAmount(e.target.value)}
                                            placeholder="1"
                                        />
                                        {d.strDrink}
                                    </p>
                                ))
                            )}

                        </div >
                        <div className="centered">
                            <button
                                className="button"
                                onClick={() => {
                                    // handleSelcet  -> store dish info in api - bæta við
                                    router.push("/order-screen");
                                }}
                            >
                                Select Tiny Drinks
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SelectDrink;

