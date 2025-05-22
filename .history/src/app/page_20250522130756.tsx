"use client";
// https://react-bootstrap.netlify.app/docs/components/carousel/
// import api from "@/api/api";
// import type { Expense } from "@/types/types";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { Link } from 'react-router-dom';
import api from "../api/api";
import UncontrolledExample from "../components/UncontrolledExample";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Order } from "../types/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';


const Home = () => {
	const router = useRouter();
	const [userEmail, setUserEmail] = useState("");
	const [orders, setOrders] = useState<Order[] | null>(null);
	const [order, setOrder] = useState<Order | null>(null);
	const [error, setError] = useState("");
	const [noOrder, setNoOrder] = useState("");
	// const [isOrder, setIsOrder] = useState("");

	//clear local storage when going back to homescreen - start again
	// localStorage.removeItem("userEmail");
	const fetchOrderByEmail = async (email: string) => {
		try {
			const order = await api.getOrderByEmail(email);
			setOrder(order);
		}
		catch (err: any) {
			if (err.message.includes("Order not found")) {
				setNoOrder(`No order found for email: ${email}`);
				console.warn(`No order found for email: ${email}`);
				localStorage.removeItem("userEmail");
				setOrder(null);
			} else {
				console.error("Failed to fetch order:", err);
			}
		}
	}



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

			// localStorage.setItem("orderId", newOrder.id.toString());

			//fill the array. If there were values before, then add, if no values then add the new expense
			setOrders((prev) => (prev ? [...prev, newOrder] : [newOrder]));

			console.log("Navigating to select-dish");
			router.push("/select-dish");
		} catch (error) {
			console.error("API Error:", error);
			window.alert("Error creating order");
		}
	}

	// useEffect(() => {
	// 	fetchOrderByEmail(userEmail);
	// },);



	return (
		<div className="page-container">

			<main className="grid-wrapper">
				<div className="parent-homescreen">
					<div className="div1">
						{/* Carousel or any content */}
						<UncontrolledExample />
					</div>
					<div className="div2">
						<div>
							<p>Hey, listen, Is your mouth tiny and small?</p>
							<p>Why don't you order from 'Little Bits' where the food is tiny?
								it looks like regular food, but really tiny. You put it in your mouth and eat it.
								Nothing gets stuck in your lips. It's just tiny and tiny and fits, fits right in!
							</p>
							<p>
								We got tiny lasagna, tiny pizza, tiny pie. Mmh! Little tiny...fried eggs!
								Oh, s***! We got tiny people!
								Tiny people that are ready to deliver to you!
							</p>



						</div >
						<div className="centered">
							{/* <Link href={"/select-dish"}>
								<button className="button">Start Tiny Order</button>
							</Link> */}
						</div>
					</div>
					<div className="div3">

					</div>
					<div className="div4">
						To start a new tiny order or to find your existing tiny order please provide a valid tiny email (eg. tiny@tiny.com)
						<div className="div4-child">

							<input
								type="text"
								placeholder="Enter something..."
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

			</main >
		</div >

	);
};

export default Home;
