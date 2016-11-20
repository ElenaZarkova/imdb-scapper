"use strict";

const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const templates = require("../config/string-templates-constants");

let ActorMovieSchema = new Schema({
    characterName: { type: String, required: true },
    actorName: { type: String, required: true },
    imdbId: { type: String, required: true },
    profileImageLink: { type: String, required: true }
});

let DetailedMovieSchema = new Schema({
    posterLink: { type: String, required: true },
    trailerLink: { type: String, required: true, default: "No trailer" }, // some movies did not have trailer
    title: { type: String, required: true },
    storyLine: { type: String, required: true },
    genres: [String],
    releaseDate: { type: String, required: true },
    actors: [ActorMovieSchema]
});

// /name/nm3203072/?ref_=tt_cl_t14
function extractId(imdbLink) {
    let id = imdbLink.trim().split('/')[2];
    return id;
}

let DetailedMovie;
DetailedMovieSchema.statics.getDetailedMovie =
    function (posterLink,
        trailerLink,
        title,
        storyLine,
        releaseDate,
        genres,
        actors) {
        let parsedActors = actors.map(a => {
            return {
                characterName: a.characterName,
                actorName: a.actorName,
                imdbId: extractId(a.imdbLink),
                profileImageLink: a.profileImageLink
            };
        });

        return new DetailedMovie({
            posterLink,
            trailerLink,
            title,
            storyLine,
            releaseDate,
            genres,
            actors: parsedActors
        });
    };


DetailedMovieSchema.virtual('actorsUrls').get(function () {
    let urls = [];
    this.actors.forEach(a => urls.push(templates.actorUrl({ imdbId: a.imdbId })));
    return urls;
});

mongoose.model("DetailedMovie", DetailedMovieSchema);
DetailedMovie = mongoose.model("DetailedMovie");
module.exports = DetailedMovie;
