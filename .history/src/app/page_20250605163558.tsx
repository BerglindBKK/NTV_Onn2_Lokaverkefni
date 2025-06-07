"use client";
import api from "../api/api";
import UncontrolledExample from "../components/UncontrolledExample";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Order } from "../types/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
	//reacht hooks
	const router = useRouter();
	const [userEmail, setUserEmail] = useState("");
	const [orders, setOrders] = useState<Order[] | null>(null);
	const [error, setError] = useState("");
	const [isExistingOrder, setIsExistingOrder] = useState<boolean | null>(false);
	const [isChecked, setIsChecked] = useState(false);

	const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const doesOrderExist = async (email: string): Promise<boolean> => {
		try {
			const order = await api.homeScreenGetOrderByEmail(email);
			setIsExistingOrder(true);
			return !!order;
		} catch (err: any) {
			// Check for the exact error message your API returns when no order is found
			if (err.message.includes("Could not find order with email")) {
				setIsExistingOrder(false);
				return false; // suppress error, treat as "order does not exist"
			}
			throw err; // re-throw unexpected errors
		}
	};

	//create order, checks if email is ok, if yes: creates new order
	const handleCreateOrder = async () => {
		// Validate email 
		if (!userEmail) {
			window.alert("Please enter a valid email address");
			return;
		}

		if (!EMAIL_REGEX.test(userEmail)) {
			setError("Email must be in the form tiny@tiny.com");
			return;
		}

		try {
			// Check if order exists for valid email
			const exists = await doesOrderExist(userEmail);

			if (exists) {
				window.alert("Order already exists for this email. Redirecting to update order...");
				localStorage.setItem("userEmail", userEmail);
				router.push("/select-dish");
				return;
			}
			// If no order exists, create new one
			const newOrder = await api.createOrder({ email: userEmail });
			localStorage.setItem("userEmail", userEmail);
			localStorage.setItem("isNewOrder", "true");
			setOrders((prev) => (prev ? [...prev, newOrder] : [newOrder]));
			router.push("/select-dish");

		} catch (error) {
			// Handle unexpected errors
			console.error("Error in handleCreateOrder:", error);
			window.alert("An unexpected error occurred. Please try again later.");
		}
	};

	useEffect(() => {
		if (userEmail) {
			doesOrderExist(userEmail);
		} else {
			console.warn("No email found in localStorage");
		}
	},);

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
							<p className="centered large"><strong>Is your mouth tiny and small?</strong></p><br></br>
							<p >Why don’t you come down to lil’bits, where the food is tiny. It looks like regular food, but really tuny. You put it in you mouth and eat it. Nothing gets stuck in your lips. It’s just tiny and tiny and fits, fits right in!</p>
							<p className="div2-homescreen-p">We got tiny lasagna, tiny pizza, tiny pie. Little tiny fried eggs! We even got tiny people!</p>
							<p className="div2-homescreen-p">Lil’bits restaurant is located in one of the infinite possible dimensions available through your interdimensional cable!</p>
						</div >
						{/* <img src="/assets/lilbits.png"></img> */}
						<p>To start a new tiny order or to find your existing tiny order please provide a valid tiny email (eg. tiny@tiny.com)</p>
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
								{(isExistingOrder) ? "Update Tiny Order" : "Start Tiny Order"}
							</button>
						</div>
						<div className="div4-child-error">
							{error && <div>{error}</div>}

							{!error && userEmail && EMAIL_REGEX.test(userEmail) && isExistingOrder === false && (
								<div>No existing order found for "{userEmail}" - click the button to start a new order</div>
							)}

							{!error && userEmail && EMAIL_REGEX.test(userEmail) && isExistingOrder === true && (
								<div>There is an existing order for: "{userEmail}" - click the button to update order</div>
							)}
						</div>
					</div>

					<div className="div3">
						<div className="div3-mobile-flex">
							<div>
								<input
									className="check"
									type="checkbox"
									checked={isChecked}
									onChange={() => setIsChecked(!isChecked)}
								/>
							</div>
							<div>
								<p>
									{isChecked ? "  Just kidding, once we have your Email we will spam you with tiny newsletters and tiny offers in every possible dimension. But thanx anyways."
										: "   Sign up for new and exciting tiny  interdimensional offers and newsletters, directly do your one dimensional inbox in your own dimension"}
								</p>
							</div>
						</div>
						<img src="/assets/newsletter.png" />
					</div>
					<div className="div4">
						<div className="reviews">
							<div className="reviewcard">
								<img src="assets/review1.png"></img>
								<div className="stars">
									<img src="assets/star.png"></img><img src="assets/star.png"></img><img src="assets/star.png"></img><img src="assets/star.png"></img><img src="assets/star.png"></img>
								</div>
								<div className="reviewtext">
									My favourite restaurant in my favorite dimension.
									Multidimensional taste for multidimensional taste buds. Recommend.
								</div>
							</div>
							<div className="reviewcard">
								<img src="assets/review1.png"></img>
								<div className="stars">
									<img src="assets/star.png"></img><img src="assets/star.png"></img><img src="assets/star.png"></img><img src="assets/star.png"></img><img src="assets/star.png"></img>
								</div>
								<div className="reviewtext">
									My favourite restaurant in my favorite dimension.
									Multidimensional taste for multidimensional taste buds. Recommend.
								</div>
							</div>
							<div className="reviewcard">
								<img src="assets/review1.png"></img>
								<div className="stars">
									<img src="assets/star.png"></img><img src="assets/star.png"></img><img src="assets/star.png"></img><img src="assets/star.png"></img><img src="assets/star.png"></img>
								</div>
								<div className="reviewtext">
									My favourite restaurant in my favorite dimension.
									Multidimensional taste for multidimensional taste buds. Recommend.
								</div>
							</div>
							<div className="reviewcard">
								<img src="assets/review1.png"></img>
								<div className="stars">
									<img src="assets/star.png"></img><img src="assets/star.png"></img><img src="assets/star.png"></img><img src="assets/star.png"></img><img src="assets/star.png"></img>
								</div>
								<div className="reviewtext">
									My favourite restaurant in my favorite dimension.
									Multidimensional taste for multidimensional taste buds. Recommend.
								</div>
							</div>

						</div>

					</div>
				</div>
			</main>
		</div>
	);
};

export default Home;
