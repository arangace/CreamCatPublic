import mongoose from "mongoose";

const Schema = mongoose.Schema;

// MongoDB song schema definition
const songSchema = new Schema(
    {
        roomID: { type: String, required: true },
        image: String,
        title: { type: String, required: true },
        description: String,
        publishTime: Date,
        content: { type: String, required: true },
        channelTitle: String,
        source: String,
    },
    {
        timestamps: {},
    }
);

const Song = mongoose.model("Song", songSchema);

export { Song };
