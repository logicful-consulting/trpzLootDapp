import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "./config";
import { redeemController } from "./controllers/redeem";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/redeem", redeemController.get);
app.post("/redeem", redeemController.post);

app.listen(config.port, () => {
  console.log(`\ntrpz loot api running on port ${config.port}\n `);
});
