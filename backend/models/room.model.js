import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			// unique: true,
		},
		colorXY: {
			type: [Number], 
			default: [],
		},
		eyesXY: {
			type: [Number], 
			default: [],
		},
		mouthXY: {
			type: [Number],
			default: [],
		},
	},
	{ timestamps: true }
);

const roomSchema = new mongoose.Schema(
	{
		roomId: {
			type: String,
			required: true,
			unique: true,
		},
        members: {
            type: [memberSchema],
			default: []
        }
	},
	{ timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;