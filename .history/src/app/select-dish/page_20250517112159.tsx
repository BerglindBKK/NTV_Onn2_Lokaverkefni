"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Define the shape of a Cat image object returned by the API
type Dish = {
    idMeal: string;
    strMealThumb: string;
    //   width: number;
    //   height: number;
};

const SelectDish = () => {
    const [dish, setDish] = useState<Dish | null>(null);

    const getDishData = async () => {
        try {
            const url = "https://themealdb.com/api/json/v1/1/random.php";
            const response = await fetch(url); //waits while making the API request

            //If the response is not OK (status 200), throw error
            if (response.status != 200) {
                throw new Error(`Response status: ${response.status}`);
            }

            //Parse the response JSON into an array of Dish objects
            const jsonDish: Dish = await response.json();

            const meal: Dish = {
                idMeal: json.meals[0].idMeal,
                strMealThumb: json.meals[0].strMealThumb,
            };
            // Return the list of cat images
            return jsonDish;
        } catch (error: any) {
            // If something goes wrong, log the error and return an empty array
            console.error("Error fetching dish:", error);
            return { idMeal: '', url: '' };
        }
    };

    // Function to load and store dish in state
    const getDish = async () => {
        setDish('Loading...');
        const dishResponse = await getDishData();
        setDish(dishResponse.idMeal);
    };

    useEffect(() => {
        // Run the image fetching function when the component mounts
        getDish();
    }, []); // Empty dependency array = run only once on mount

    return (
        <div className="page-container">

            <main className="grid-wrapper">
                <div className="parent">
                    <div className="div1">
                        <img src={url} alt={`cat ${index}`} />
                    </div>
                    <div className="div2">
                        <div className="left">
                            <p>
                                fd
                            </p>
                            <p>
                                sdfs
                            </p>
                        </div >
                        <div className="centered">
                            <Link href={"/select-dish"}>
                                <button className="button">Select Tiny Dish</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SelectDish;