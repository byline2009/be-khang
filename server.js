const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Stripe = require("stripe");
dotenv.config();

const authRoutes = require("./routes/auth");

const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json()); // 👈 nhận application/json

app.get("/", async (req, res) => {
  return res.send("helll world");
});
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // amount = VND * 100
    console.log("amount", amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "vnd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

async function testStripe() {
  const pi = await stripe.paymentIntents.create({
    amount: 50000,
    currency: "vnd",
  });

  console.log(pi.id);
}

testStripe();
app.use("/api/auth", authRoutes);

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
