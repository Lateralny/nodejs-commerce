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

const USER_VARIABLE = 300;

const { Charge } = resources;
Client.init(COINBASE_API_KEY);

const app = express();

app.use(cors());
app.use(morgan("dev"));

// add verify in order to process rawBody

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

//app.use(express.json());
app.post('/api', (req,res) => {
  console.log(req.body);

});
/*
app.post("/create-charge", async (req, res) => {
  console.log(JSON.parse(req.body.tokenAmount));
});
*/
  
app.post("/create-charge", async (req, res) => {
  const chargeData = {
    name: "Naiadcoin",
    description: "Buy Naiadcoin",
    local_price: {
      amount: JSON.parse(req.body.tokenAmount),//req.body.tokenAmount
      currency: "USD",
    },
    pricing_type: "fixed_price",
    
    redirect_url: `${DOMAIN}/success-payment`,
    cancel_url: `${DOMAIN}/cancel-payment`,
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
    // console.log(event);

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
