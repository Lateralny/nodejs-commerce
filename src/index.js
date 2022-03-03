const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const { Client, resources, Webhook } = require("coinbase-commerce-node");
const {
  COINBASE_API_KEY,
  COINBASE_WEBHOOK_SECRET,
  DOMAIN,
} = require("./config");

const mongoose = require("mongoose");
const Log = require("./model");
const req = require("express/lib/request");
const { Charge } = resources;
Client.init(COINBASE_API_KEY);

const app = express();

var corsOptions = {
  origin: "http://localhost:3001",
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(morgan("dev"));

//TO DO
//
//server logs to file 


// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

mongoose
  .connect(`mongodb://localhost:27017/coinbase`, {useNewUrlParser: true,useUnifiedTopology: true})
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

var timestamp = Date.now();

async function loggingToDb(x,y){
  const _log = await Log.create({date: timestamp, tokenAmount: x, walletAddress: y, resolved: 'no'})
  console.log(_log)
}

app.get("/create-charge", async (req, res) => {

  //log do bazy danych
  loggingToDb(req.query.tokenAmount, req.query.walletAddress);

  let amountTimesPrice = req.query.tokenAmount * 0.99

  const chargeData = {
    name: "Naiadcoin",
    description: "Buy Naiadcoin",
    local_price: {
      amount: amountTimesPrice,
      currency: "USD",
    },
    pricing_type: "fixed_price",
    
    redirect_url: `http://localhost:3000/success-payment`,
    cancel_url: `http://localhost:3000/cancel-payment`,
  };

  const charge = await Charge.create(chargeData);

  console.log(charge);

  res.send(charge);
});

app.post("/payment-handler", (req, res) => {
  const rawBody = req.rawBody;
  const signature = req.headers["x-cc-webhook-signature"];
  const webhookSecret = COINBASE_WEBHOOK_SECRET;

  let event;

  try {
    event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);

    if (event.type === "charge:pending") {
      // received order
      // user paid, but transaction not confirm on blockchain yet
      console.log("pending payment");
    }

    if (event.type === "charge:confirmed") {
      // fulfill order
      // charge confirmed
      console.log("charge confirme");
    }

    if (event.type === "charge:failed") {
      // cancel order
      // charge failed or expired
      console.log("charge failed");
    }

    res.send(`success ${event.id}`);
  } catch (error) {
    console.log(error);
    res.status(400).send("failure");
  }
});

app.get("/success-payment", (req, res) => {
  res.send("success payment");
});

app.get("/cancel-payment", (req, res) => {
  res.send("cancel payment");
});

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3001;

app.listen(PORT);
console.log("Server on port", PORT);
