/* globals console require Promise */
'use strict';

const httpRequester = require("./http-requester");
const htmlParser = require("./html-parser");
const modelsFactory = require("../models");
const constants = require("../config/constants");
const pauser = require("./pauser");

function getMoviesFromUrl(url, urlsQueue) {
    console.log(`Working with ${url}`);
    return httpRequester.get(url)
        .then((result) => {
            const selector = constants.simpleMovieSelector;
            const html = result.body;
            return htmlParser.parseSimpleMovie(selector, html);
        })
        .then(movies => {
            let dbMovies = movies.map(movie => {
                return modelsFactory.getSimpleMovie(movie.title, movie.url);
            });

            modelsFactory.insertManySimpleMovies(dbMovies);

            return pauser.wait(1000);
        })
        .then(() => {
            if (urlsQueue.isEmpty()) {
                return Promise.resolve();
            }

            getMoviesFromUrl(urlsQueue.pop(), urlsQueue);
        })
        .catch((err) => {
            console.dir(err, { colors: true });
        });
}

// Some errors while inserting are possible due to diffrent html for detailed page, but most of the detailed movies are added correctly
 function getDetailedMoviesFromUrl(movieUrl, detailedMoviesUrlsQueue) {
    console.log(`Working with ${movieUrl}`);

    return httpRequester.get(movieUrl)
        .then((result) => {
            const selector = constants.gettingDetailedMovieSelector;

            const html = result.body;
            return htmlParser.parseDetailedMovie(selector, html);
        })
        .then(movie => {
            let dbMovie = modelsFactory.getDetailedMovie(movie);
            modelsFactory.insertDetailedMovie(dbMovie); // n + 1 problem for now

            return pauser.wait(1000);
        })
        .then(() => {
            if (detailedMoviesUrlsQueue.isEmpty()) {
                return;
            }

            getDetailedMoviesFromUrl(detailedMoviesUrlsQueue.pop(), detailedMoviesUrlsQueue);
        })
        .catch((err) => {
            console.dir(err, { colors: true });
        });
    }
function getActorFromUrl(actorUrl, actorsUrlsQueue){
    console.log(`Working with ${actorUrl}`);

    httpRequester.get(actorUrl)
    .then((result) => {
        const selector = constants.gettingActorSelector;

        const html = result.body;
        return htmlParser.parseActor(selector, html);
    })
    .then(actor => {
        let dbActor = modelsFactory.getActor(actor);
        modelsFactory.insertManyActors([dbActor]);

        return pauser.wait(1000);
    })
    .then(() => {
        if (actorsUrlsQueue.isEmpty()){
            return;
        }

        getActorFromUrl(actorsUrlsQueue.pop(), actorsUrlsQueue);
    })
    .catch((err) => {
            console.dir(err, { colors: true });
    });
}

module.exports = {
    getMoviesFromUrl,
    getDetailedMoviesFromUrl,
    getActorFromUrl
}
    