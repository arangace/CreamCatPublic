import { Song } from "./songs-schema";

export async function addSong(song) {
    const dbSong = new Song(song);
    await dbSong.save();
    return dbSong;
}

export async function retrieveAllSongs(roomID) {
    return await Song.find({ roomID: `${roomID}` });
}

export async function retrieveSong(songid) {
    return await Song.findById(songid);
}

export async function updateSong(song) {
    const result = await Song.findByIdAndUpdate(song._id, song, {
        new: true,
        useFindAndModify: false,
    });
    return result ? true : false;
}

export async function deleteSong(songid) {
    return await Song.deleteOne({ _id: songid });
}

export async function deleteSongs(roomID) {
    return await Song.deleteMany({ roomID: roomID });
}
