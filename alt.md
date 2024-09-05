<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Route Planner</title>
    <!-- leaflet css -->
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    />
    <style>
      body {
        margin: 0;
        padding: 0;
      }
      #map {
        width: 100%;
        height: 100vh;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
  </body>
</html>
<!-- leaflet js -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>

<script src="./data/point.js"></script>

<script>
  const graph = {};

  // Node coordinates
  const coordinates = {};

  pointJson.features.forEach((feature) => {
    const node = feature.properties.node;
    const coord = feature.geometry.coordinates;
    coordinates[node] = [coord[1], coord[0]]; // Leaflet uses [lat, lng] order
    console.log(coordinates);
  });
  //map initialization

  var map = L.map("map").setView(coordinates["A"], 14);
  //osm layer

  var osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });
  osm.addTo(map);
  //   google map layer

  var googleStreets = L.tileLayer(
    "http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}",
    {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
  );
  googleStreets.addTo(map);

  L.Routing.control({
    waypoints: [coordinates["A"], coordinates["H"]],
    routeWhileDragging: true,
    showAlternatives: true,
  }).addTo(map);

  // Dijkstra's Algorithm for finding the shortest path
  function dijkstra(graph, start, end) {
    let distances = {};
    let prev = {};
    let pq = new PriorityQueue();

    distances[start] = 0;
    pq.enqueue(start, 0);

    for (let vertex in graph) {
      if (vertex !== start) {
        distances[vertex] = Infinity;
      }
      prev[vertex] = null;
    }

    while (!pq.isEmpty()) {
      let minNode = pq.dequeue().element;
      if (minNode === end) break;

      for (let neighbor in graph[minNode]) {
        let alt = distances[minNode] + graph[minNode][neighbor];
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          prev[neighbor] = minNode;
          pq.enqueue(neighbor, distances[neighbor]);
        }
      }
    }

    let path = [];
    let u = end;
    while (prev[u]) {
      path.unshift(u);
      u = prev[u];
    }
    if (u === start) path.unshift(u);
    return path;
  }

  // PriorityQueue class implementation
  class PriorityQueue {
    constructor() {
      this.collection = [];
    }
    enqueue(element, priority) {
      let newItem = { element, priority };
      if (this.isEmpty()) {
        this.collection.push(newItem);
      } else {
        let added = false;
        for (let i = 0; i < this.collection.length; i++) {
          if (newItem.priority < this.collection[i].priority) {
            this.collection.splice(i, 0, newItem);
            added = true;
            break;
          }
        }
        if (!added) {
          this.collection.push(newItem);
        }
      }
    }
    dequeue() {
      return this.collection.shift();
    }
    isEmpty() {
      return this.collection.length === 0;
    }
  }

  // Visualizing the shortest path
  let startNode = "A";
  let endNode = "F";
  let shortestPath = dijkstra(graph, startNode, endNode);

  console.log("Shortest path: ", shortestPath);

  let latlngs = shortestPath.map((node) => coordinates[node]);

  let polyline = L.polyline(latlngs, { color: "red" }).addTo(map);
  map.fitBounds(polyline.getBounds());

  // Draw the full graph on the map
  drawGraph(graph, coordinates);
</script>
