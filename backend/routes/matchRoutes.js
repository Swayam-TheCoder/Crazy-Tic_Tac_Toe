import express from "express";

import Match from "../models/Match.js";

const router = express.Router();


// SAVE MATCH

router.post("/", async (req, res) => {

  try {

    const newMatch = new Match(req.body);

    await newMatch.save();

    res.status(201).json(newMatch);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
});


// GET MATCH HISTORY

router.get("/", async (req, res) => {

  try {

    const matches = await Match.find()

      .sort({ createdAt: -1 })

      .limit(20)

      .lean();

    res.json(matches);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
});


// DELETE ALL MATCHES

router.delete("/", async (req, res) => {

  try {

    await Match.deleteMany({});

    res.json({
      message:
        "All match history deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
});

export default router;