/* globals module require Promise */
"use strict";

const jsdom = require("jsdom").jsdom,
    doc = jsdom(),
    window = doc.defaultView,
    $ = require("jquery")(window);

module.exports.parseSimpleMovie = (selector, html) => {
    $("body").html(html);
    let items = [];
    $(selector).each((index, item) => {
        const $item = $(item);

        items.push({
            title: $item.html(),
            url: $item.attr("href")
        });
    });

    return Promise.resolve()
        .then(() => {
            return items;
        });
};

module.exports.parseDetailedMovie = (selector, html) => {
    const body = $("body").html(html);
    const detailedMovieSelector = selector.detailedMovieSelector;
    const actorSelector = selector.actorSelector;

    const posterLink = $(detailedMovieSelector.posterSelector).attr("src");
    const trailerLink = $(detailedMovieSelector.trailerSelector).attr("href");
    const title = $(detailedMovieSelector.trailerSelector).html();
    const storyLine = $(detailedMovieSelector.storyLineSelector).html();
    const genres = [];

    console.log(title);

    $(detailedMovieSelector.genresSelector).each((index, genre) => {
        const $genre = $(genre);

        genres.push($genre.html());
    });

    const releaseDateContainer = $(detailedMovieSelector.releaseDateSelector).html(); // see what prints

    const actors = [];

    $(detailedMovieSelector.actorSelector).each((index, actor) => {
        const $actor = $(actor);
console.log('actor');

        const actorName = actor.find(actorSelector.actorNameSelector).html();
console.log('row 55');
        actors.push({
            name: actorName
        });
    });

    const movie = {
            posterLink: posterLink,
            trailerLink: trailerLink,
            title: title,
            storyLine: storyLine,
            genres: genres,
            actors: actors
        };
        console.log('here');
        console.log(movie);

    return Promise.resolve()
        .then(() => {
            return movie;
        });
};
