import { Room } from "./rooms-schema";

export async function createRoom(room) {
    const dbRoom = new Room(room);
    await dbRoom.save();
    return dbRoom;
}

export async function retrieveRoom(id) {
    return await Room.findById(id);
}

export async function updateRoom(room) {
    const result = await Room.findByIdAndUpdate(room._id, room, {
        new: true,
        useFindAndModify: false,
    });
    return result ? true : false;
}

export async function deleteRoom(id) {
    await Room.deleteOne({ _id: id });
}

export async function retrieveStaleRooms(time) {
    return await Room.find({ lastActive: { $lte: time } });
}
