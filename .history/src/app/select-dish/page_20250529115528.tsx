"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { Order, Dish } from "../../types/types";

//meals is an array of Dish
type ApiResponse = {
    meals: Dish[];
};

//make random price - remove? and make constant price 
const randomPrice = (min = 5, max = 100) => {
    const price = Math.random() * (max - min) + min;
    return Number(price.toFixed(0));
};

//random calories
const randomCalories = (min = 300, max = 1000) => {
    const price = Math.random() * (max - min) + min;
    return Number(price.toFixed(0));
};

//reacht hooks
const SelectDish = () => {
    const [dish, setDish] = useState<Dish | null>(null);
    const [mealPrice, setMealPrice] = useState<number>(0);
    const [mealCalories, setMealCalories] = useState<number>(0);
    const [order, setOrder] = useState<Order | null>(null);
    const router = useRouter();
    const [dishAmount, setDishAmount] = useState<number>(1);

    let isEditMode;
    if (order && order.dish) {
        isEditMode = true;
    } else {
        isEditMode = false;
    }
    console.log(`hæ, ég er pöntun fyrir: ${order?.email}`)


    // fetching the order by users email provided in input on home screen and store it in state. Count comes from user input (button)
    // - kannski betra að refactora setOrder og geyma í sér file?
    const fetchOrderByEmail = async (email: string) => {
        try {
            const order = await api.getOrderByEmail(email);
            order.count = order.count ?? 1; // Troubleshooting, Ensure 'count' is defined
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

    //fetching dish from url and storing it in a json file
    const getDishData = async () => {
        try {
            const url = "https://themealdb.com/api/json/v1/1/random.php";
            const response = await fetch(url); //waits while making the API request

            //If the response is not OK (status 200), throw error
            if (response.status != 200) {
                throw new Error(`Response status: ${response.status}`);
            }

            //Parse the response JSON into an array of Dish objects (ApiResponse), 
            //svo það sé hægt að nota jsonDish.meals[0], þó það sé bara einn diskur, samt array
            const jsonDish: ApiResponse = await response.json();
            // picks first (and only) element of the meal array and returns it
            const meal = jsonDish.meals[0];
            return meal;
        } catch (error: any) {
            // If something goes wrong, log the error and return an empty array
            console.error("Error fetching dish:", error);
            return null;
        }
    };
    // Function to load and store dish, price and calories in state
    const fetchDish = async () => {
        const dish = await getDishData();
        setDish(dish);
        setMealPrice(randomPrice()); //ofaukið - eyða?
        setMealCalories(randomCalories()); // ofaukið - eyða?
    };

    //everything loads once per mount, stores email in local storage for next pages to look the order up
    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
            fetchOrderByEmail(storedEmail);
        } else {
            console.warn("No email found in localStorage");
        }
    }, []);

    useEffect(() => {
        if (order) {
            if (order.dish) {
                // Edit mode
                setDish(order.dish);
                setMealPrice(order.price ?? randomPrice());
                setMealCalories(order.calories)
                setDishAmount(order.count ?? 1);

            } else {
                // New dish
                fetchDish();
            }
        }
    }, [order]);

    // commenta út troubleshooting kóðann, - eyða? ofaukið
    // checks if the order or dish is missing, if exists updates order with the known info from dish
    const handleSelectDish = async () => {
        if (!dish || !order) {
            console.warn("Missing dish or order, cannot proceed");
            return;
        }

        console.log("Order drinks:", order.drinks);
        const updatedOrder: Order = {
            ...order,
            dish: dish,
            price: mealPrice,
            calories: mealCalories,
            count: dishAmount,
            drinks: order.drinks || [],
        };
        console.log(order)

        //in case of errors
        try {
            console.log("Order to update:", order);
            await api.updateOrder(updatedOrder);
            router.push(`/select-drink`);
        } catch (error) {
            console.error("Failed to update order:", error);
            alert("Could not save dish selection. Please try again.");
        }
    };

    //setja gaur sem snýst frekar?
    if (!order) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <main className="grid-wrapper">
                <div className="parent-orderdish">
                    <div className="div5">
                        {/* dish info */}
                        <div className="dish-info">
                            <div className="dish-photo">
                                {dish && (
                                    <img src={dish.strMealThumb} alt={dish.strMeal} />
                                )}
                            </div>
                            <div >
                                <p className="title centered"><strong>{dish?.strMeal}</strong></p>
                                <p className="centered"> A tiny {dish?.strArea} {dish?.strMeal} meal that fits, fits right in</p>
                                <p className="centered"> Category: {dish?.strCategory}l</p>
                                <p className="centered"> Tags: {dish?.strTags}</p>
                                <p className="centered"> Tiny calories: {mealCalories} kCal</p>
                                <p className="centered"> Tiny price: $ {mealPrice.toFixed(0)}</p>
                            </div>
                        </div>
                        {/* reloads dish */}
                        <button
                            className="button"
                            onClick={() => {
                                fetchDish();
                            }}
                        >
                            Generate new tiny dish
                        </button>
                    </div>
                    {/* right side summary */}
                    <div className="div2">
                        <div className="left">
                            <p className="title"><strong>Your Tiny Receipt:</strong></p>

                            <p><strong>Tiny Order Email:</strong></p>
                            <p>{order?.email}</p><br></br>

                            <p><strong>Tiny Selected Dish:</strong></p>
                            <p>{dish?.strMeal}</p>
                            <p>Total Meal Price  =  ${Number(mealPrice.toFixed(0)) * Number(dishAmount)}</p><br></br>

                        </div >

                        {/* lower part, should be positioned at the bottom of the div */}
                        <div className="lower">
                            <p className="centered">How many Tiny Mouths will we be serving? (max 10 mouths)</p><br></br>
                            <div className="amount">
                                <button
                                    className="minus-one-lg"
                                    onClick={() => {
                                        setDishAmount(prev => (prev - 1 >= 1 ? prev - 1 : 1));
                                    }}>-</button>
                                {dishAmount}
                                <button
                                    className="plus-one-lg"
                                    onClick={() => {
                                        setDishAmount(prev => (prev + 1 > 10 ? 10 : prev + 1));
                                    }}>+</button>
                            </div>
                            {/* select dish and continue to drinks */}
                            <button
                                className="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSelectDish();
                                }}
                            >
                                Select Tiny Dish
                            </button>
                        </div>
                    </div>
                </div>

            </main >
        </div >
    )
}

export default SelectDish;

