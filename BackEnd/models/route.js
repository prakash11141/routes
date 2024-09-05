const mongoose = require("mongoose");

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
