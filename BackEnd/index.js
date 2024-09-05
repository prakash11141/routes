const express = require("express");
const mongoose = require("mongoose");
const Route = require("./models/route"); // Adjust the path as needed

const app = express();

mongoose.connect(
  "mongodb+srv://prakash11141:angryme@cluster0.fbsm3wg.mongodb.net/routes?retryWrites=true&w=majority"
);

app.post("/save-route", async (req, res) => {
  try {
    const routeData = req.body; // Assuming the route data is in the request body
    const route = new Route({
      start: { type: "Point", coordinates: routeData.bbox.slice(0, 2) },
      end: { type: "Point", coordinates: routeData.bbox.slice(2) },
      bbox: routeData.bbox,
      features: routeData.features,
      metadata: routeData.metadata,
    });
    await route.save();
    res.status(201).send({ message: "Route saved successfully!" });
  } catch (error) {
    res.status(500).send({ error: "Failed to save route" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
