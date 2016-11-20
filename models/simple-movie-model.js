/* globals require module */
"use strict";

const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const templates = require("../config/string-templates-constants");

let SimpleMovieSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imdbId: {
        type: String,
        required: true
    }
});

//  /title/tt0067992/?ref_=adv_li_tt
function extractImdbIdFromUrl(url) {
    let index = url.indexOf("/?ref");
    return url.substring("/title/".length, index);
}

let SimpleMovie;
SimpleMovieSchema.statics.getSimpleMovieByNameAndUrl =
    function(name, url) {
        let imdbId = extractImdbIdFromUrl(url);
        return new SimpleMovie({ name, imdbId });
    };

SimpleMovieSchema.virtual('imdbUrl').get(function() {
    return templates.movieUrl({ imdbId: this.imdbId });
});

mongoose.model("SimpleMovie", SimpleMovieSchema);
SimpleMovie = mongoose.model("SimpleMovie");
module.exports = SimpleMovie;
