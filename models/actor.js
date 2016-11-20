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


//  /title/tt0067992/?ref_=adv_li_tt
function extractId(url) {
    let index = url.indexOf("/?ref");
    return url.substring("/title/".length, index);
}

let Actor;

ActorSchema.statics.getActor =
    function (profileImageLink, name, biography, movies) {
        let parsedMovies = movies.map(m => {
            return {
                name: m.movieName,
                characterName: m.characterName,
                imdbId: extractId(m.movieLink)
            };
        });
        return new Actor({ profileImageLink, name, biography, movies: parsedMovies });
    };

ActorMovieSchema.virtual.imdbUrl = function () {
    return `http://imdb.com/title/${this.imdbId}/?ref_=adv_li_tt`;
};

mongoose.model("Actor", ActorSchema);
Actor = mongoose.model("Actor");
module.exports = Actor;