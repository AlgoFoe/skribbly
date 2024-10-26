import express from "express";
import { createRoom, deleteRoom, findRandomRoom, gameStarted, joinRoom, leaveRoom, updateScore, userDrawing, validRoom, wordChosen } from "../controllers/room.controller.js";

const router = express.Router();

router.post("/create", createRoom);
router.post("/delete", deleteRoom);
router.post("/join", joinRoom);
router.post("/leave", leaveRoom);
router.post("/valid", validRoom);
router.post("/random", findRandomRoom);
router.post("/userDrawing", userDrawing);
router.post("/wordChosen", wordChosen);
router.post("/updateScore", updateScore);
router.post("/gameStarted", gameStarted);

export default router;
