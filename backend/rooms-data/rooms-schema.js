import mongoose from "mongoose";

const Schema = mongoose.Schema;

// MongoDB room schema definition
const roomSchema = new Schema(
    {
        name: { type: String, required: true },
        description: String,
        password: String,
        userCount: Number,
        lastActive: Date,
        voting: {
            skip: {
                count: { type: Number, default: null },
                lastPassed: { type: Date, default: null },
            },
            play: {
                count: { type: Number, default: null },
                lastPassed: { type: Date, default: null },
            },
            pause: {
                count: { type: Number, default: null },
                lastPassed: { type: Date, default: null },
            },
        },
        startTime: Date,
        endTime: Date,
    },
    {
        timestamps: {},
    }
);

const Room = mongoose.model("Room", roomSchema);

export { Room };
