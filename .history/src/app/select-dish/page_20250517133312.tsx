"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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



const randomPrice = (min = 5, max = 100) => {
    const price = Math.random() * (max - min) + min;
    return Number(price.toFixed(2));
};

const randomCalories = (min = 300, max = 1000) => {
    const price = Math.random() * (max - min) + min;
    return Number(price.toFixed(0));
};

const SelectDish = () => {
    const [dish, setDish] = useState<Dish | null>(null);
    const [mealPrice, setMealPrice] = useState<number>(0);
    const [mealCalories, setMealCalories] = useState<number>(0);

    const getDishData = async () => {
        try {
            const url = "https://themealdb.com/api/json/v1/1/random.php";
            const response = await fetch(url); //waits while making the API request

            //If the response is not OK (status 200), throw error
            if (response.status != 200) {
                throw new Error(`Response status: ${response.status}`);
            }

            //Parse the response JSON into an array of Dish objects
            const jsonDish: ApiResponse = await response.json();
            const meal = jsonDish.meals[0];
            return meal;
        } catch (error: any) {
            // If something goes wrong, log the error and return an empty array
            console.error("Error fetching dish:", error);
            return null;
        }
    };

    useEffect(() => {
        // Function to load and store dish in state
        const fetchDish = async () => {
            const dish = await getDishData();
            setDish(dish);
            setMealPrice(randomPrice());
            setMealCalories(randomCalories());
        };
        fetchDish();
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
                            <p><strong>Selected Drink:</strong></p>

                            <p><strong>Selected Date:</strong></p>
                            <br></br>

                            <p><strong>Total price:</strong> ${mealPrice.toFixed(2)}</p>


                        </div >
                        <div className="centered">
                            <Link href={"/select-dish"}>
                                <button className="button">Select This Tiny Dish</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SelectDish;