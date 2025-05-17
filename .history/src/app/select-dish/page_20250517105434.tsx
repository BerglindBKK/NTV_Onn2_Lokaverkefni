"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Define the shape of a Cat image object returned by the API
type Dish = {
    idMeal: string;
    url: string;
    //   width: number;
    //   height: number;
};

const SelectDish = () => {
    const [Dish, setDish] = useState('');

    const getDishData = async () => {
        try {
            const url = "https://themealdb.com/api/json/v1/1/random.php";
            const response = await fetch(url); //waits while making the API request

            //If the response is not OK (status 200), throw error
            if (response.status != 200) {
                throw new Error(`Response status: ${response.status}`);
            }

            //Parse the response JSON into an array of Dish objects
            const json: Dish = await response.json();

            //Log the result to the browser console for debugging
            console.log(json);

            // Return the list of cat images
            return json;
        } catch (error: any) {
            // If something goes wrong, log the error and return an empty array
            console.error("Error fetching cat data:", error);
            return [];
        };


        return (
            <div className="page-container">

                <main className="grid-wrapper">
                    <div className="parent">
                        <div className="div1">dgsdfg</div>
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