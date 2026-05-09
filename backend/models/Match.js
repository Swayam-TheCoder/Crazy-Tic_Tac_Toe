import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({

  mode: {
    type: String,
    required: true
  },

  winner: {
    type: String,
    required: true
  },

  board: {
    type: Array,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

const Match = mongoose.model(
  "Match",
  matchSchema
);

export default Match;