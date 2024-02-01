import mongoose from "mongoose";

const ticketsCollection = "tickets";

const ticketsSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  code: { type: String, required: true },
  purchaser: { type: String, required: true },
  purchase_datetime: { type: Date },
});

export const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);
