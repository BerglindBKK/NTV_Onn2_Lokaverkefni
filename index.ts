import express, { type Express, type Request } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import type { Order } from "./types";

// Initialize default orders and id
let nextId = 2;
let orders: Order[] = [
  {
    id: 1,
    drinks: [
      {
        brewer: "vifilfell",
        category: "beer",
        description: "tasty beer",
        id: "some-uuid",
        imageSource:
          "https://www.themealdb.com/images/media/meals/wai9bw1619788844.jpg",
        name: "Gylltur",
        price: 2500,
      },
    ],
    email: "gunnsteinnskula@gmail.com",
    count: 10,
    date: new Date(),
    dish: {
      id: "53051",
      category: "seafood",
      cousine: "Malaysian",
      description:
        "In a medium saucepan over medium heat, stir together coconut milk, water, ground ginger, ginger root, salt, bay leaf, and rice. Cover, and bring to a boil. Reduce heat, and simmer for 20 to 30 minutes, or until done.\r\n\r\n Step 2\r\nPlace eggs in a saucepan, and cover with cold water. Bring water to a boil, and immediately remove from heat. Cover, and let eggs stand in hot water for 10 to 12 minutes. Remove eggs from hot water, cool, peel and slice in half. Slice cucumber.\r\n\r\n Step 3\r\nMeanwhile, in a large skillet or wok, heat 1 cup vegetable oil over medium-high heat. Stir in peanuts and cook briefly, until lightly browned. Remove peanuts with a slotted spoon and place on paper towels to soak up excess grease. Return skillet to stove. Stir in the contents of one package anchovies; cook briefly, turning, until crisp. Remove with a slotted spoon and place on paper towels. Discard oil. Wipe out skillet.\r\n\r\n Step 4\r\nHeat 2 tablespoons oil in the skillet. Stir in the onion, garlic, and shallots; cook until fragrant, about 1 or 2 minutes. Mix in the chile paste, and cook for 10 minutes, stirring occasionally. If the chile paste is too dry, add a small amount of water. Stir in remaining anchovies; cook for 5 minutes. Stir in salt, sugar, and tamarind juice; simmer until sauce is thick, about 5 minutes.\r\n\r\n Step 5\r\nServe the onion and garlic sauce over the warm rice, and top with peanuts, fried anchovies, cucumbers, and eggs.",
      imageSource:
        "https://www.themealdb.com/images/media/meals/wai9bw1619788844.jpg",
      name: "Nasi lemak",
      price: 2500,
    },
  },
];

// Initialize api
const api: Express = express();
api.use(cors());
api.use(express.json());
api.use(bodyParser.urlencoded({ extended: false }));
const port = 3001;

// GET endpoint to get all orders
api.get("/api/orders", (_, res) => {
  console.log("Getting orders:", orders);
  return res.json({ success: true, response: orders });
});

// Validation function for order - note that the object validation might not be entirely accurate and might need some modification
//adjusted til að láta dish pöntun virka
const isOrder = (body: any): body is Order => {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof body.email === "string" &&
    typeof body.count === "number" &&
    typeof body.date === "string" || body.date instanceof Date &&
    typeof body.dish === "object" &&
    typeof body.dish.name === "string" &&
    Array.isArray(body.drinks)
  );
};

//Added!! Creating the order with initially only email information
const isEmailOnly = (body: Record<string, unknown>): body is { email: string } => {
  return "email" in body && typeof body.email === "string";
};

// POST endpoint for creating an order
api.post("/api/create-order", (req: Request<Order>, res) => {
  const emailAlreadyTaken = () => {
    if (!req.body.email) {
      return false;
    }
    // Returns true if email exists, and the index is 0 or higher. Returns false if it cannot find the item, resulting in -1
    return orders.findIndex((order) => order.email === req.body.email) >= 0;
  };

  //CHanged!! 
  if (!isEmailOnly(req.body)) {
    res.json({
      success: false,
      error: "Must supply all properties of an order",
    });
    return;
  }

  if (emailAlreadyTaken()) {
    res.json({
      success: false,
      error: "Email already reserved",
    });
    return;
  }

  //changed!! to create initial order with only email
  const order: Order = {
    id: nextId,
    email: req.body.email,
    count: 0,
    date: new Date(),
    dish: {
      id: "",
      name: "",
      category: "",
      cousine: "",
      description: "",
      imageSource: "",
      price: 0,
    },
    drinks: [],
  };

  orders.push(order);
  nextId += 1;

  return res.json({
    success: true,
    order,
  });
});

// PUT endpoint to update orders
api.put("/api/update-order", (req: Request<Order>, res) => {
  const emailDoesNotExist = () => {
    if (!req.body.email) {
      return false;
    }
    // Returns true if email does not exist, and the index is lower than 0, resulting in -1
    return orders.findIndex((order) => order.email === req.body.email) < 0;
  };

  if (!isOrder(req.body)) {
    res.json({
      success: false,
      error: "Must supply all properties of an order",
    });
    return;
  }

  if (emailDoesNotExist()) {
    res.json({
      success: false,
      error: "Email does not exist, cannot update",
    });
    return;
  }

  // Map over each item, if the item has the same email as the email in the body, update the order with the new order changes
  //changed while trying to debug
  orders = orders.map((o) => (o.email === req.body.email ? req.body : o));

  return res.json({
    success: true,
    order: req.body,
  });
});

// GET endpoint to get order by email
api.get("/api/order/:email", (req, res) => {
  const order = orders.find((order) => order.email === req.params.email);
  if (order) {
    return res.json({
      success: true,
      response: order,
    });
  }

  res.json({
    success: false,
    error: `Could not find order with email: ${req.params.email}`,
  });
});

// DELETE endpoint to delete order by email
api.delete("/api/order/:email", (req, res) => {
  const paramEmail = decodeURIComponent(req.params.email).toLowerCase();
  console.log("Delete request for email:", paramEmail);
  const order = orders.find((e) => e.email.toLowerCase() === paramEmail);
  if (order) {
    orders = orders.filter((e) => e.email.toLowerCase() !== paramEmail);
    console.log("Deleted order:", order);
    res.json({
      success: true,
      response: order,
    });
  } else {
    console.log("Order not found for email:", paramEmail);
    res.json({

      success: false,
      error: `Could not find order with id=${paramEmail}`,
    });
  }
});

api.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
