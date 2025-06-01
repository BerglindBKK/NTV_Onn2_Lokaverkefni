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
	const [isExistingOrder, setIsExistingOrder] = useState<string | null>(null);
	const [isChecked, setIsChecked] = useState(false);


	const fetchOrderByEmail = async (email: string) => {
		try {
			const order = await api.getOrderByEmail(email);
			order.count = order.count ?? 1; // Troubleshooting, Ensure 'count' is defined
			setOrder(order);
			setIsExistingOrder("yes");
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

	useEffect(() => {
		console.log("Previous local storage:", { ...localStorage });
		localStorage.removeItem("userEmail");
		console.log("Local storage after removeItem:", { ...localStorage });

		if (userEmail) {
			fetchOrderByEmail(userEmail);
		}
		console.log("Local storage after fetchOrderbyEmail", { ...localStorage });
	}, [userEmail]);

	//create order, checks if email is ok, if yes: creates new order
	const handleCreateOrder = async () => {
		try {
			const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // email validation regex
			// catching empty field or not a number
			if (!userEmail) {
				window.alert("Please enter a valid email address");
				return;
			}

			function validateEmail(email: string): boolean {
				return EMAIL_REGEX.test(email);
			}
			if (!validateEmail(userEmail)) {
				setError("Email must be in the form tiny@tiny.com");
				return;
			}

			console.log("Creating order with email:", userEmail);
			const newOrder = await api.createOrder({
				email: userEmail,
			});

			//use local storage to remember the user to next page
			localStorage.setItem("userEmail", userEmail);
			console.log("Order created:", newOrder);

			//fill the array. If there were values before, then add, if no values then add the new expense
			setOrders((prev) => (prev ? [...prev, newOrder] : [newOrder]));

			console.log("Navigating to select-dish");
			router.push("/select-dish");
		} catch (error) {
			console.error("API Error:", error);
			window.alert("Error creating order");
		}
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
								Start Tiny Order
							</button>
						</div>
						<div className="div4-child-error" >
							{userEmail}
							{error && (
								<p>{error}</p>
							)}
							{noOrder && (
								<p>{noOrder}</p>
							)}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Home;
