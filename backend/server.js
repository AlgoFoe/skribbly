import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import Pusher from "pusher";
import path from "path"; 
import { fileURLToPath } from 'url'; // Import fileURLToPath to create __dirname

import authRoutes from "./routes/auth.routes.js";
import drawRoutes from "./routes/draw.routes.js";
import messageRoutes from "./routes/message.routes.js";
import roomRoutes from "./routes/room.routes.js";
import connectToMongoDB from "./db/connect.js";

dotenv.config();

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); 

const PORT = process.env.PORT || 4000;

// init pusher
const pusher = new Pusher({
  appId: process.env.VITE_PUSHER_APP_ID,
  key: process.env.VITE_PUSHER_APP_KEY,
  secret: process.env.VITE_PUSHER_APP_SECRET,
  cluster: process.env.VITE_PUSHER_CLUSTER,
});

// Middleware
app.use(express.json()); 
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/draw", drawRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/room", roomRoutes);

// app.get("/", (req, res) => {
//   res.send('Hello World!');
// });

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Serve the HTML file for any request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// serving build files through express

// Start the server
app.listen(PORT, () => { 
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});

export { pusher };
