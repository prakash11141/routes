const axios = require("axios");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://:@cluster0.fbsm3wg.mongodb.net/routes?retryWrites=true&w=majority"
);

// Define schemas and models
const StepSchema = new mongoose.Schema({
  distance: Number,
  duration: Number,
  type: Number,
  instruction: String,
  name: String,
  way_points: [Number],
});

const SegmentSchema = new mongoose.Schema({
  distance: Number,
  duration: Number,
  steps: [StepSchema],
});

const RouteSchema = new mongoose.Schema({
  bbox: [Number],
  distance: Number,
  duration: Number,
  segments: [SegmentSchema],
  coordinates: [[Number]],
});

const Route = mongoose.model("Route", RouteSchema);

// Fetch data and save to DB
async function fetchAndSaveRoute() {
  const apiKey = "5b3ce3597851110001cf6248bfb11b0b069641f28f8ad94ac4b365e4";
  const start = "85.31880649542126, 27.6830306863436";
  const end = "85.31856480621849, 27.675807159597426";

  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start}&end=${end}`;

  try {
    const response = await axios.get(url);
    const routeData = response.data.features[0];

    // Create a new route document
    const newRoute = new Route({
      bbox: routeData.bbox,
      distance: routeData.properties.segments[0].distance,
      duration: routeData.properties.segments[0].duration,
      segments: routeData.properties.segments,
      coordinates: routeData.geometry.coordinates,
    });

    // Save to MongoDB
    await newRoute.save();
    console.log("Route data saved successfully!");
  } catch (error) {
    console.error("Error saving route data:", error);
  }
}

fetchAndSaveRoute();
