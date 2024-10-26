import Room from "../models/room.model.js";
import { pusher } from "../server.js"

export const gameStarted = async (req, res) => {
    try {
        const {roomId,membersLen} = req.body
        console.log("ROOMID",roomId);
        pusher.trigger(
            roomId,
            "start-game",
            {
                msg:"game started",
                membersLen: membersLen
            }
        )
    } catch (error) {
        console.log("Error in gameStarted controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const wordChosen = async (req, res) => {
    try {
        const { roomId, chosenWord } = req.body
        startGame(roomId)
        pusher.trigger(
            roomId,
            "word-chosen",
            {
                word: chosenWord
            }
        )
        res.status(201).json({ msg: "Success" })
    } catch (error) {
        console.log("Error in wordChosen controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateScore = async (req, res) => {
    try {
        const { roomId, username, score } = req.body;
        console.log("IN UPDATESCORE CONTROLLER : ", req.body);

        updateNumMembersGuessedWord(roomId);
        const room = getRoom(roomId);
        pusher.trigger(
            roomId,
            "user-guessed",
            {
                username: username,
                score: score,
            }
        );
        pusher.trigger(
            roomId,
            "update-score",
            {
                username: username,
                score: score,
                numMembersGuessedWord: room.numMembersGuessedWord
            }
        );

        res.status(201).json({ msg: "Success" });
    } catch (error) {
        console.log("Error in updateScore controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const createRoom = async (req, res) => {
    try {
        const { roomId } = req.body
        const room = await Room.findOne({ roomId })

        if (room) {
            return res.status(400).json({ error: "Room already exists" });
        }

        //Create new room
        const newRoom = new Room({
            roomId,
        });

        // console.log("NEW ROOM",newRoom)

        if (newRoom) {
            await newRoom.save()
            addRoom(roomId)
            res.status(201).json(newRoom);
        } else {
            res.status(400).json({ error: "Invalid room data" });
        }
    } catch (error) {
        console.log("Error in createRoom controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const joinRoom = async (req, res) => {
    console.log("JOINROOM API")
    try {
        const { user, roomId } = req.body
        const room = await Room.findOne({ roomId })

        if (getRoom(roomId).started) throw new Error("Game already started")

        if (!room) {
            return res.status(400).json({ error: "Room does not exists" });
        }

        //Add user to room
        const joinedRoom = await Room.updateOne(
            { roomId },
            { $push: { members: user } }
        );

        if (joinedRoom) {

            addPlayerToRoom(roomId, user)

            res.status(201).json({
                _id: joinedRoom._id,
                roomId: joinedRoom.roomId,
                members: joinedRoom.members
            });
        } else {
            res.status(400).json({ error: "Invalid room data" });
        }
    } catch (error) {
        console.log("Error in joinRoom controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const leaveRoom = async (req, res) => {
    try {
        const { user, roomId } = req.body
        const room = await Room.findOne({ roomId })

        // console.log("/api/room/leave")
        // console.log(roomId, user)

        if (!room) {
            return res.status(400).json({ error: "Room does not exists" });
        }

        //Remove user from room
        const leftRoom = await Room.findOneAndUpdate(
            { roomId },
            { $pull: { members: { username: user.username } } },
            { returnDocument: "after" }
        );

        if (leftRoom) {
            removePlayerFromRoom(roomId, user.username)
            res.status(201).json({
                _id: leftRoom._id,
                roomId: leftRoom.roomId,
                members: leftRoom.members
            });
        } else {
            res.status(400).json({ error: "Invalid room data" });
        }
    } catch (error) {
        console.log("Error in leaveRoom controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const validRoom = async (req, res) => {
    try {
        const { roomId } = req.body
        const room = await Room.findOne({ roomId })

        if (!room) {
            return res.status(201).json({ valid: false });
        }
        res.status(201).json({
            valid: true,
            roomId: room.roomId,
            members: room.members
        });
    } catch (error) {
        console.log("Error in validRoom controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const findRandomRoom = async (req, res) => {
    try {
        // const body = req.body
        const room = await Room.aggregate([
            {
                $project: {
                    numberOfMembers: { $size: "$members" },
                    document: "$$ROOT"
                }
            },
            {
                $sort: { numberOfMembers: 1 }
            },
            {
                $limit: 1
            },
            {
                $replaceRoot: { newRoot: "$document" }
            }
        ])
        if (!room) {
            res.status(201).json({ roomFound: false })
        }
        res.status(201).json({ roomFound: true, room: room })

    } catch (error) {
        console.log("Error in findRandomRoom controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }

}

export const deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.body
        const room = await Room.deleteOne({ roomId })

        if (!room) {
            return res.status(400).json({ error: "Room does not exists" });
        }

        removeRoom(roomId)
        res.status(201).json({ error: "Room destroyed" });
    } catch (error) {
        console.log("Error in deleteRoom controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const userDrawing = async (req, res) => {

    let currentTime = new Date();
    const start=Date.now()
    console.log("userDrawing API call at : ",currentTime);

    try {
        const { roomId } = req.body
        let room = getRoom(roomId)
        // if(!room.started){
        //     res.status(201).json({ msg:"Game not started" })
        //     return
        // }
        if(start-room.lastUpdated<=1000){
            res.status(201).json({ currentUserDrawing: room.currentUserDrawing, round: room.currentRound })
            return
        }
        setCurrentUserDrawing(roomId)
        room = getRoom(roomId)
        room.lastUpdated=Date.now()
        res.status(201).json({ currentUserDrawing: room.currentUserDrawing, round: room.currentRound })
    } catch (error) {
        console.log("Error in userDrawing controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}



// Create a map to store room data
const rooms = new Map();

function updateNumMembersGuessedWord(roomId) {
    if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        room.numMembersGuessedWord++;
    } else {
        console.error(`Room with ID ${roomId} does not exist.`);
    }
}

function resetNumMembersGuessedWord(roomId) {
    if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        room.numMembersGuessedWord=0;
    } else {
        console.error(`Room with ID ${roomId} does not exist.`);
    }
}

// Function to add a room
function addRoom(roomId) {
    if (!rooms.has(roomId)) {
        rooms.set(roomId, {
            players: [],
            currentUserDrawing: 1,
            currentRound: 1,
            started: false,
            numMembersGuessedWord: 0,
            lastUpdated: 0
        });
    }
}

// Function to add a player to a room
function addPlayerToRoom(roomId, player) {
    if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        room.players.push(player);
        // console.log("Room from addPlayer : ",room)
        pusher.trigger(
            roomId,
            "set-players",
            {
                players: room.players
            }
        )
        // console.log("TRIGGERED")
    } else {
        console.error(`Room with ID ${roomId} does not exist.`);
    }
}

// Function to set the current user drawing in a room
function setCurrentUserDrawing(roomId) {
    if (rooms.has(roomId)) {
        resetNumMembersGuessedWord(roomId)
        const room = rooms.get(roomId);
        if (room.players.length < room.currentUserDrawing + 1) {
            room.currentUserDrawing = 1;
            updateRound(roomId)
        } else {
            room.currentUserDrawing = room.currentUserDrawing + 1
        }
        console.log("From setCurrentUserDrawing : ", room)
    } else {
        console.error(`Room with ID ${roomId} does not exist.`);
    }
    // console.log("FROM setCurrentUserDrawing : ",room)
}

// Function to set the current round in a room
function updateRound(roomId) {
    if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        room.currentRound = room.currentRound + 1;
    } else {
        console.error(`Room with ID ${roomId} does not exist.`);
    }
}

// Function to get room details
function getRoom(roomId) {
    return rooms.get(roomId);
}

// Function to remove a room
function removeRoom(roomId) {
    if (rooms.has(roomId)) {
        rooms.delete(roomId);
    } else {
        console.error(`Room with ID ${roomId} does not exist.`);
    }
}

// Function to remove a player from a room
function removePlayerFromRoom(roomId, username) {
    if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        console.log("ROOM", room)
        const playerIndex = room.players.findIndex(player => player.username === username);
        if (playerIndex > -1) {
            room.players.splice(playerIndex, 1);
            pusher.trigger(
                roomId,
                "set-players",
                {
                    players: room.players
                }
            )
        } else {
            console.error(`Player with username ${username} does not exist in room ${roomId}.`);
        }
    } else {
        console.error(`Room with ID ${roomId} does not exist.`);
    }
}

//start Game
function startGame(roomId) {
    if (rooms.has(roomId)) {
        const room = getRoom(roomId)
        room.started = true
    } else {
        console.error(`Room with ID ${roomId} does not exist.`);
    }
}