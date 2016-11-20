/* globals console require setTimeout Promise */
'use strict';

const httpRequester = require("./utils/http-requester");
const htmlParser = require("./utils/html-parser");
const queuesFactory = require("./data-structures/queue");
const modelsFactory = require("./models");
const constants = require("./config/constants");

require("./config/mongoose")(constants.connectionString);

let urlsQueue = queuesFactory.getQueue();
let detailedMoviesUrlsQueue = queuesFactory.getQueue();
let actorsUrlsQueue = queuesFactory.getQueue();

function wait(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

const asyncPagesCount = 15;


constants.genres.forEach(genre => {
    for (let i = 0; i < constants.pagesCount; i += 1) {
        let url = `http://www.imdb.com/search/title?genres=${genre}&title_type=feature&0sort=moviemeter,asc&page=${i + 1}&view=simple&ref_=adv_nxt`;
        urlsQueue.push(url);
    }
});

// This should work but for some reason it does not!
// Promise.resolve()
//     .then(() => {
//         return Promise.all(Array.from({ length: asyncPagesCount })
//             .map(() => getMoviesFromUrl(urlsQueue.pop())));
//     })
//     .then(() => {


// moviesUrls.forEach(movieUrl => {
//     detailedMoviesUrlsQueue.push(movieUrl);
// });


//  modelsFactory.getSimpleMoviesUrls()
//     .then((urls) => {
//         urls.forEach(movieUrl => {
//             detailedMoviesUrlsQueue.push(movieUrl);
//         });
//     })
//     .then(() => {
//         const detailedMoviesCount = 15;
//         return Promise.all(Array.from({ length: detailedMoviesCount })
//             .map(() => getDetailedMoviesFromUrl(detailedMoviesUrlsQueue.pop())));
//     });

modelsFactory.getAllActorUrls()
    .then((urls) => {
        urls.forEach(actorUrl => {
            actorsUrlsQueue.push(actorUrl);
        });
    })
    .then(() => {
        const actorsCount = 15;
        return Promise.all(Array.from({ length: actorsCount })
            .map(() => getActorFromUrl(actorsUrlsQueue.pop())));
    });


function getMoviesFromUrl(url) {
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

            return wait(1000);
        })
        .then(() => {
            if (urlsQueue.isEmpty()) {
                return Promise.resolve();
            }

            getMoviesFromUrl(urlsQueue.pop());
        })
        .catch((err) => {
            console.dir(err, { colors: true });
        });
}

// Some errors while inserting are possible due to diffrent html for detailed page, but most of the detailed movies are added correctly
function getDetailedMoviesFromUrl(movieUrl) {
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

            return wait(1000);
        })
        .then(() => {
            if (detailedMoviesUrlsQueue.isEmpty()) {
                return;
            }

            getDetailedMoviesFromUrl(detailedMoviesUrlsQueue.pop());
        })
        .catch((err) => {
            console.dir(err, { colors: true });
        });
}

function getActorFromUrl(actorUrl){
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

        return wait(1000);
    })
    .then(() => {
        if (actorsUrlsQueue.isEmpty()){
            return;
        }

        getActorFromUrl(actorsUrlsQueue.pop());
    })
    .catch((err) => {
            console.dir(err, { colors: true });
    });
}
