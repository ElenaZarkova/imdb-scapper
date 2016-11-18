"use strict";

const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

let ActorMovieSchema = new Schema({
    name: { type: String, required: true },
    imdbId: { type: String, required: true },
    characterName: { type: String, required: true }
});

let ActorSchema = new Schema({
    profileImageLink: { type: String, required: true },
    name: { type: String, required: true },
    biography: { type: String, required: true },
    movies: [ActorMovieSchema]
});


mongoose.model("Actor", ActorSchema);
let Actor = mongoose.model("Actor");
module.exports = Actor;