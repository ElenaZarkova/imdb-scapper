/* globals console require setTimeout Promise */
"use strict";

const queuesFactory = require("./data-structures/queue");
const modelsFactory = require("./models");
const constants = require("./config/constants");
const templates = require("./config/string-templates-constants");
const dataExtractor = require("./utils/data-extractor");

require("./config/mongoose")(constants.connectionString);

let urlsQueue = queuesFactory.getQueue();
let detailedMoviesUrlsQueue = queuesFactory.getQueue();
let actorsUrlsQueue = queuesFactory.getQueue();

constants.genres.forEach(genre => {
    for (let i = 0; i < constants.pagesCount; i += 1) {
        let url = templates.pageUrl({ genre: genre, page: i + 1 });
        urlsQueue.push(url);
    }
});


// -------------------------------------
//  Adding simple movies
// -------------------------------------
const asyncPagesCount = 15;

Array.from({ length: asyncPagesCount })
    .forEach(() => dataExtractor.getMoviesFromUrl(urlsQueue.pop(), urlsQueue));


// -------------------------------------
//  Adding detailed movies (uncomment after when there are simple movies added)
// -------------------------------------

// modelsFactory.getSimpleMoviesUrls()
//     .then((urls) => {
//         urls.forEach(movieUrl => {
//             detailedMoviesUrlsQueue.push(movieUrl);
//         });
//     })
//     .then(() => {
//         const detailedMoviesCount = 15;
//         Array.from({ length: detailedMoviesCount })
//             .forEach(() => dataExtractor.getDetailedMoviesFromUrl(detailedMoviesUrlsQueue.pop(), detailedMoviesUrlsQueue));
//     });

// -------------------------------------
//  Adding actors (uncomment when there are detailed movies are added)
// -------------------------------------
// modelsFactory.getAllActorUrls()
//     .then((urls) => {
//         urls.forEach(actorUrl => {
//             actorsUrlsQueue.push(actorUrl);
//         });
//     })
//     .then(() => {
//         const actorsCount = 15;
//         Array.from({ length: actorsCount })
//             .forEach(() => dataExtractor.getActorFromUrl(actorsUrlsQueue.pop(), actorsUrlsQueue));
//     });



// ------------------------------------
// We tried to wrap all 3 in one promise but connection timed out.
// --------------------------------------------

// Promise.resolve()
//     .then(() => {
//         return Promise.all(Array.from({ length: asyncPagesCount })
//             .map(() => dataExtractor.getMoviesFromUrl(urlsQueue.pop(), urlsQueue)));
//     })
//     .then(() => {
//         console.log('here');
//         return modelsFactory.getSimpleMoviesUrls();
//     })
//     .then((urls) => {
//         console.log(urls);
//         urls.forEach(movieUrl => {
//             detailedMoviesUrlsQueue.push(movieUrl);
//         });
//     })
//     .then(() => {
//         console.log(detailedMoviesUrlsQueue.items);
//         const detailedMoviesCount = 15;
//         return Promise.all(Array.from({ length: detailedMoviesCount })
//             .map(() => dataExtractor.getDetailedMoviesFromUrl(detailedMoviesUrlsQueue.pop(), detailedMoviesUrlsQueue)));
//     })
//     .then(() => {
//         modelsFactory.getAllActorUrls();
//     })
//     .then((urls) => {
//         urls.forEach(actorUrl => {
//             actorsUrlsQueue.push(actorUrl);
//         });
//     })
//     .then(() => {
//         const actorsCount = 15;
//         return Promise.all(Array.from({ length: actorsCount })
//             .map(() => dataExtractor.getActorFromUrl(actorsUrlsQueue.pop(), actorsUrlsQueue)));
//     });
