/* globals module require */

const SimpleMovie = require("./simple-movie-model");
const DetailedMovie = require("./detailed-movie-model");
const Actor = require("./actor");

module.exports = {
    getAllSimpleMoviesUrls(){
        return SimpleMovie.find().select("imdbId").exec();
    },
    getSimpleMovie(name, url) {
        return SimpleMovie.getSimpleMovieByNameAndUrl(name, url);
    },
    insertManySimpleMovies(movies) {
        SimpleMovie.insertMany(movies);
    },
    getDetailedMovie(detailedMovie) {
        return DetailedMovie.getDetailedMovie(detailedMovie.posterLink,
            detailedMovie.trailerLink,
            detailedMovie.title,
            detailedMovie.storyLine,
            detailedMovie.releaseDate,
            detailedMovie.genres,
            detailedMovie.actors);
    },
    insertDetailedMovie(movie) {
        console.log(movie);
        movie.save((err, entry, numAffected) => {
            console.log(err);
            console.log(entry);
            console.log(numAffected);
        });
    },
    getActor(actor) {
        return Actor.getActor(
            actor.profileImageLink,
            actor.actorName,
            actor.actorBiography,
            actor.movies
        );
    },
    insertManyActors(actors) {
        Actor.insertMany(actors);
    }
};
