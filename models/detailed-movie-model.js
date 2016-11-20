// t least one cover image (its link)
// Optional trailer (its link), if one is available
// Title
// Description/Storyline
// Categories (Genres)
// Release date
// List of actors

//     Nested documents
//     Have name of the role in the movie, name, id in IMDB and profile image (its link)

// Use this page for reference

"use strict";

const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

let ActorMovieSchema = new Schema({
    characterName: { type: String, required: true },
    name: { type: String, required: true },
    imdbId: { type: String, required: true },
    profileImageLink: { type: String, required: true }
});

let DetailedMovieSchema = new Schema({
    posterLink: { type: String, required: true },
    trailerLink: { type: String, required: true },
    title: { type: String, required: true },
    storyLine: { type: String, required: true },
    genres: [String],
    releaseDate: { type: Date, required: true },
    actor: [ActorMovieSchema]
});

mongoose.model("DetailedMovie", DetailedMovieSchema);
let DetailerMovie = mongoose.model("DetailedMovie");
module.exports = DetailerMovie;