/* globals module require */

const SimpleMovie = require("./simple-movie-model");
const DetailedMovie = require("./detailed-movie-model");
const Actor = require("./actor");

module.exports = {
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
        movie.save();
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
    },
    getSimpleMoviesUrls() {
        return new Promise((resolve, reject) => {
            SimpleMovie.find({}, 'imdbId')
                .exec((err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(result[0].imdbUrl);
                        resolve(result.map(x => x.imdbUrl));
                    }
                });
        });
    },
    getAllActorUrls() {
        return new Promise((resolve, reject) => {
            DetailedMovie.find({}, 'actors')
                .exec((err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        let links = [];
                        result.forEach(x => links.push(...x.actorsUrls));
                        resolve(links);
                    }
                });
        });
    }
};
