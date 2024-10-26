import express from "express";
import { pusher } from "../server.js";
const router = express.Router();

router.post("/draw", (req, res) => {
  const { x, y, type, color, lineWidth, roomId } = req.body;
  pusher.trigger(roomId, "draw-event", { x, y, type, color, lineWidth });
  res.status(200).send("Draw event triggered");
});

router.post("/clear", (req, res) => {
  const { roomId } = req.body
  pusher.trigger(roomId, "clear-event", {});
  res.status(200).send("Clear event triggered");
});

router.post("/fill", (req, res) => {
  const { color,roomId } = req.body;
  pusher.trigger(roomId, "fill-event", { color });
  res.status(200).send("Fill event triggered");
});

export default router;
