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

function wait(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

modelsFactory.getAllSimpleMoviesUrls()
    .then((urls) => {
        urls.forEach(movieUrl => {
            detailedMoviesUrlsQueue.push(`http://imdb.com/title/${movieUrl.imdbId}/?ref_=adv_li_tt`);
        })
    })
    .then(() => {
        const asyncPagesCount = 15;
        Array.from({ length: asyncPagesCount })
            .forEach(() => getDetailedMoviesFromUrl(detailedMoviesUrlsQueue.pop()));
    });

// moviesUrls.forEach(movieUrl => {
//     detailedMoviesUrlsQueue.push(movieUrl);
// });

constants.genres.forEach(genre => {
    for (let i = 0; i < constants.pagesCount; i += 1) {
        let url = `http://www.imdb.com/search/title?genres=${genre}&title_type=feature&0sort=moviemeter,asc&page=${i + 1}&view=simple&ref_=adv_nxt`;
        urlsQueue.push(url);
    }
});

// Some errors while inserting are possible due to diffrent html for detailed page, but most of the detailed movies are added correctly
function getDetailedMoviesFromUrl(movieUrl){
    console.log(`Working with ${movieUrl}`);

    httpRequester.get(movieUrl)
        .then((result) => {
            const selector = {
                detailedMovieSelector: {
                    posterSelector: ".poster img",
                    trailerSelector: ".slate a",
                    titleSelector: ".title_wrapper h1", // remove span
                    storyLineSelector: "#titleStoryLine div[itemprop=\"description\"] p",
                    genresSelector: "#titleStoryLine div[itemprop=\"genre\"] a",
                    releaseDateSelector: "#titleDetails", // html indexOf ReleaseDate
                    actorSelector: "#titleCast .cast_list tr"
                },
                actorSelector: {
                    imageSelector: ".primary_photo img",
                    actorNameSelector: "td[itemprop=\"actor\"] a span",
                    imdbIdSelector: "td[itemprop=\"actor\"] a",
                    characterNameSelector: ".character"
                }
            };

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
};

//
//
// const actorUrl = "http://www.imdb.com/name/nm0000375/?ref_=nv_sr_2";
// httpRequester.get(actorUrl)
//     .then((result) => {
//         const selector = {
//             actorSelector: {
//                 profileImageSelector: "#img_primary a img",
//                 actorNameSelector: "span[itemprop=\"name\"]",
//                 actorBiographySelector: "#name-bio-text div[itemprop=\"description\"]",
//                 actorMovieSelector: "#filmography .filmo-category-section"
//             },
//             actorMovieSelector: {
//                 movieNameAndIdSelector: "b a",
//                 characterNameSelector: "a:last-child"
//             }
//         }
//
//         const html = result.body;
//         return htmlParser.parseActor(selector, html);
//     })
//     .then(actor => {
//         let dbActor = modelsFactory.getActor(actor);
//         // console.log(dbActor);
//         modelsFactory.insertManyActors([dbActor]);
//     });

function getMoviesFromUrl(url) {
    console.log(`Working with ${url}`);
    httpRequester.get(url)
        .then((result) => {
            const selector = ".col-title span[title] a";
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
                return;
            }

            getMoviesFromUrl(urlsQueue.pop());
        })
        .catch((err) => {
            console.dir(err, { colors: true });
        });
}

// const asyncPagesCount = 15;

 // Array.from({ length: asyncPagesCount })
 //     .forEach(() => getMoviesFromUrl(urlsQueue.pop()));
