"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { Order } from "../../types/types";

// Define the shape of a Cat image object returned by the API
type Dish = {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strArea: string;
    strCategory: string;
};

type ApiResponse = {
    meals: Dish[];
};

// const order = await api.getOrdeByEmail(email);
// await api.updateOrder(updatedOrder);

//make random price - remove? and make constant price?
const randomPrice = (min = 5, max = 100) => {
    const price = Math.random() * (max - min) + min;
    return Number(price.toFixed(2));
};

//random calories
const randomCalories = (min = 300, max = 1000) => {
    const price = Math.random() * (max - min) + min;
    return Number(price.toFixed(0));
};

const SelectDish = () => {
    const [dish, setDish] = useState<Dish | null>(null);
    const [mealPrice, setMealPrice] = useState<number>(0);
    const [mealCalories, setMealCalories] = useState<number>(0);
    const [order, setOrder] = useState<Order | null>(null);
    const router = useRouter();

    //skrifa í eigið api
    // const handleSelect = () => {
    //     if (!dish) return; -> óvirkur takki?
    //     1) vista info í api
    //     2)fara á næstu síðu
    // };
    const fetchOrderByEmail = async (email: string) => {
        try {
            const order = await api.getOrderByEmail(email);
            setOrder(order);
        }
        catch (err: any) {
            if (err.message.includes("Order not found")) {
                console.warn(`No order found for email: ${email}. You might want to create a new one.`);
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

            //Parse the response JSON into an array of Dish objects (ApiResponse)
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
        setMealPrice(randomPrice());
        setMealCalories(randomCalories());
    };

    //everything loads once per mount
    useEffect(() => {
        fetchDish();
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
            fetchOrderByEmail(storedEmail);
        } else {
            console.warn("No email found in localStorage");
        }
        fetchDish()
    }, []);

    return (
        <div className="page-container">
            <main className="grid-wrapper">
                <div className="parent-orderdish">
                    <div className="div5">
                        <div className="dish-photo">
                            {dish && (
                                <img src={dish.strMealThumb} alt={dish.strMeal} />
                            )}
                        </div>
                        <div className="dish-info">
                            <p className="title-text centered"><strong>{dish?.strMeal}</strong></p>
                            <p className="centered"> A tiny {dish?.strArea} {dish?.strMeal} meal that fits, fits right in</p>
                            <br></br>
                            <p className="centered"> Tiny calories: {mealCalories.toFixed(0)} kCal</p>
                            <p className="centered"> Tiny price: $ {mealPrice.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="div2">
                        <div className="left">


                            <p><strong>Selected Dish:</strong></p>
                            {dish?.strMeal}
                            <p>Price: ${mealPrice.toFixed(2)}</p>

                        </div >
                        <button
                            className="button"
                            onClick={() => {
                                // handleSelcet  -> bæta við store dish info in api
                                router.push(`/select-drink?dishId=${dish?.idMeal}`);
                            }}
                        >
                            Select Tiny Dish
                        </button>
                    </div>
                </div>

            </main >
        </div >
    )
}

export default SelectDish;