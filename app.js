/* globals console require setTimeout Promise */
'use strict';

const queuesFactory = require("./data-structures/queue");
const modelsFactory = require("./models");
const constants = require("./config/constants");
const dataExtractor = require("./utils/data-extractor");

require("./config/mongoose")(constants.connectionString);

let urlsQueue = queuesFactory.getQueue();
let detailedMoviesUrlsQueue = queuesFactory.getQueue();
let actorsUrlsQueue = queuesFactory.getQueue();

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
//             .map(() => dataExtractor.getMoviesFromUrl(urlsQueue.pop(), urlsQueue)));
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
//             .map(() => dataExtractor.getDetailedMoviesFromUrl(detailedMoviesUrlsQueue.pop(), detailedMoviesUrlsQueue)));
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
            .map(() => dataExtractor.getActorFromUrl(actorsUrlsQueue.pop(), actorsUrlsQueue)));
    });
