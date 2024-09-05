const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  start: {
    type: { type: String, default: "Point" },
    coordinates: [Number], // [longitude, latitude]
  },
  end: {
    type: { type: String, default: "Point" },
    coordinates: [Number], // [longitude, latitude]
  },
  bbox: {
    type: [Number], // [minLongitude, minLatitude, maxLongitude, maxLatitude]
  },
  features: [
    {
      type: {
        type: String,
      },
      geometry: {
        type: {
          type: String,
          default: "LineString",
        },
        coordinates: [[Number]], // array of coordinates
      },
      properties: {
        segments: [
          {
            distance: Number,
            duration: Number,
            steps: [
              {
                distance: Number,
                duration: Number,
                instruction: String,
                name: String,
                type: String,
                way_points: [Number],
              },
            ],
          },
        ],
        summary: {
          distance: Number,
          duration: Number,
        },
        way_points: [Number],
      },
    },
  ],
  metadata: {
    attribution: String,
    service: String,
    timestamp: Number,
    query: Object,
    engine: Object,
  },
});

const Route = mongoose.model("Route", routeSchema);

module.exports = Route;
