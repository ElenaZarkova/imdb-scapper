/* globals console require setTimeout Promise */
'use strict';

const httpRequester = require("./utils/http-requester");
const htmlParser = require("./utils/html-parser");
const queuesFactory = require("./data-structures/queue");
const modelsFactory = require("./models");
const constants = require("./config/constants");

// require("./config/mongoose")(constants.connectionString);
//
// let urlsQueue = queuesFactory.getQueue();
//
// function wait(time) {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve();
//         }, time);
//     });
// }

// constants.genres.forEach(genre => {
//     for (let i = 0; i < constants.pagesCount; i += 1) {
//         let url = `http://www.imdb.com/search/title?genres=${genre}&title_type=feature&0sort=moviemeter,asc&page=${i+1}&view=simple&ref_=adv_nxt`;
//         urlsQueue.push(url);
//     }
// });



// const movieUrl = "http://www.imdb.com/title/tt1211837/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=2495768522&pf_rd_r=1CS87QBS7W60MRC6JFS0&pf_rd_s=right-7&pf_rd_t=15061&pf_rd_i=homepage&ref_=hm_cht_t0";

// httpRequester.get(movieUrl)
//     .then((result) => {
//         const selector = {
//             detailedMovieSelector : {
//                 posterSelector: ".slate_wrapper .poster img",
//                 trailerSelector: ".slate_wrapper .slate a",
//                 titleSelector: ".title_wrapper h1", // remove span
//                 storyLineSelector: "#titleStoryLine div[itemprop=\"description\"] p",
//                 genresSelector: "#titleStoryLine div[itemprop=\"genre\"] a",
//                 releaseDateSelector: "#titleDetails", // html indexOf ReleaseDate
//                 actorSelector: "#titleCast .cast_list tr"
//             },
//             actorSelector : {
//                 imageSelector: ".primary_photo img",
//                 actorNameSelector: "td[itemprop=\"actor\"] a span",
//                 imdbIdSelector: "td[itemprop=\"actor\"] a",
//                 characterNameSelector: ".character a"
//             }
//         }

//         const html = result.body;
//         return htmlParser.parseDetailedMovie(selector, html);
//     })
//     .then(movie => {
//         console.log(movie);
//     });
//

    const actorUrl = "http://www.imdb.com/name/nm0000375/?ref_=nv_sr_2";
    httpRequester.get(actorUrl)
        .then((result) => {
            const selector = {
                actorSelector: {
                    profileImageSelector: "#img_primary a img",
                    actorNameSelector: "span[itemprop=\"name\"]",
                    actorBiographySelector: "#name-bio-text div[itemprop=\"description\"]",
                    actorMovieSelector: "#filmography .filmo-category-section"
                },
                actorMovieSelector: {
                    movieNameAndIdSelector: "b a",
                    characterNameSelector: "a:last-child"
                }
            }

            const html = result.body;
            return htmlParser.parseActor(selector, html);
        })
        .then(actor => {
            console.log(actor);
        });

// function getMoviesFromUrl(url) {
//     console.log(`Working with ${url}`);
//     httpRequester.get(url)
//         .then((result) => {
//             const selector = ".col-title span[title] a";
//             const html = result.body;
//             return htmlParser.parseSimpleMovie(selector, html);
//         })
//         .then(movies => {
//             let dbMovies = movies.map(movie => {
//                 return modelsFactory.getSimpleMovie(movie.title, movie.url);
//             });
//
//             modelsFactory.insertManySimpleMovies(dbMovies);
//
//             return wait(1000);
//         })
//         .then(() => {
//             if (urlsQueue.isEmpty()) {
//                 return;
//             }
//
//             getMoviesFromUrl(urlsQueue.pop());
//         })
//         .catch((err) => {
//             console.dir(err, { colors: true });
//         });
// }
//
// const asyncPagesCount = 15;
//
// Array.from({ length: asyncPagesCount })
//     .forEach(() => getMoviesFromUrl(urlsQueue.pop()));
