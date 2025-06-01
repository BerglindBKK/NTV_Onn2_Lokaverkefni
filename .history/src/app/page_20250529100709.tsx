"use client";
// https://react-bootstrap.netlify.app/docs/components/carousel/
// import api from "@/api/api";
// import type { Expense } from "@/types/types";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { Link } from 'react-router-dom';
import api from "../api/api";
import UncontrolledExample from "../components/UncontrolledExample";
// import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Order } from "../types/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { usePathname } from 'next/navigation';


const Home = () => {
	//reacht hooks
	const router = useRouter();
	const [userEmail, setUserEmail] = useState("");
	const [orders, setOrders] = useState<Order[] | null>(null);
	const [order, setOrder] = useState<Order | null>(null);
	const [error, setError] = useState("");
	const [noOrder, setNoOrder] = useState("");
	const [isExistingOrder, setIsExistingOrder] = useState<boolean | null>(null);
	const [isChecked, setIsChecked] = useState(false);

	const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


	const doesOrderExist = async (email: string): Promise<boolean> => {
		try {
			const order = await api.homeScreenGetOrderByEmail(email);
			return !!order;
		} catch (err: any) {
			// Check for the exact error message your API returns when no order is found
			if (err.message.includes("Could not find order with email")) {
				return false; // suppress error, treat as "order does not exist"
			}
			throw err; // re-throw unexpected errors
		}
	};


	//create order, checks if email is ok, if yes: creates new order
	const handleCreateOrder = async () => {


		// 1. Validate email first
		if (!userEmail) {
			window.alert("Please enter a valid email address");
			return;
		}

		if (!EMAIL_REGEX.test(userEmail)) {
			setError("Email must be in the form tiny@tiny.com");
			return;
		}

		try {
			// 2. Check if order exists for valid email
			const exists = await doesOrderExist(userEmail);
			setIsExistingOrder(exists);

			if (exists) {
				window.alert("Order already exists for this email. Redirecting to update order...");
				router.push("/update-order");
				return;
			}

			// 3. If no order exists, create new one
			const newOrder = await api.createOrder({ email: userEmail });
			localStorage.setItem("userEmail", userEmail);
			setOrders((prev) => (prev ? [...prev, newOrder] : [newOrder]));
			router.push("/select-dish");

		} catch (error) {
			// 4. Handle unexpected errors
			console.error("Error in handleCreateOrder:", error);
			window.alert("An unexpected error occurred. Please try again later.");
		}
	};

	if (isCheckingOrder) {
		return <div>Loading...</div>; // or just nothing
	}



	return (
		<div className="page-container">
			<main className="grid-wrapper">
				<div className="parent-homescreen">
					<div className="div1">
						{/* Carousel*/}
						<UncontrolledExample />
					</div>
					<div className="div2-homescreen">
						<div>
							<p className="justified"><strong>Is your mouth tiny and small?</strong></p>
							<p>Why don’t you come down to lil’bits, where the food is tiny. It looks like regular food, but really tuny. You put it in you mouth and eat it. Nothing gets stuck in your lips. It’s just tiny and tiny and fits, fits right in!</p>
							<p>We got tiny lasagna, tiny pizza, tiny pie. Little tiny fried eggs! We even got tiny people!</p>
							<p>Lil’bits restaurant is located in one of the infinite possible dimensions available through your interdimensional cable!</p>
						</div >
						<img src="/assets/lilbits.png"></img>
						<div className="centered">
						</div>
					</div>

					<div className="div3">
						<div>
							<label>
								<input
									type="checkbox"

									checked={isChecked}
									onChange={() => setIsChecked(!isChecked)}
								/>
								<span>
									{isChecked ? "  Just kidding, once we have your Email we will spam you with tiny newsletters and tiny offers in every possible dimension. But thanx anyways."
										: "   Sign up for new and exciting tiny  interdimensional offers and newsletters, directly do your one dimensional inbox in your own dimension"}
								</span>
							</label>
						</div>
						<img src="/assets/newsletter.png" />
					</div>
					<div className="div4">
						To start a new tiny order or to find your existing tiny order please provide a valid tiny email (eg. tiny@tiny.com)
						<div className="div4-child">
							<input
								type="text"
								placeholder="Your Tiny Email here"
								className="custom-input"
								value={userEmail}
								onChange=
								{(e) => {
									setUserEmail(e.target.value);
									setError("");
								}}
							/>
							<button
								className="button"
								onClick={(e) => {
									e.preventDefault();
									handleCreateOrder();
								}}
							>
								{(isExistingOrder) ? "Start Tiny Order" : "Update Tiny Order"}
							</button>
						</div>
						<div className="div4-child-error">
							{error && <div>{error}</div>}

							{!error && userEmail && EMAIL_REGEX.test(userEmail) && isExistingOrder === false && (
								<div>No existing order found for {userEmail}</div>
							)}

							{!error && userEmail && EMAIL_REGEX.test(userEmail) && isExistingOrder === true && (
								<div>{userEmail} exists, click the button to update order</div>
							)}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Home;
