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
    console.log(posterLink);
    const trailerLink = $(detailedMovieSelector.trailerSelector).attr("href");
    console.log(trailerLink);
    const title = $(detailedMovieSelector.trailerSelector).html();
    console.log(title);
    
    const storyLine = $(detailedMovieSelector.storyLineSelector).html();
    console.log(storyLine);
    
    const genres = [];

    // console.log(title);

    $(detailedMovieSelector.genresSelector).each((index, genre) => {
        const $genre = $(genre);
        console.log($genre.html());

        genres.push($genre.html());
    });

    const releaseDateContainer = $(detailedMovieSelector.releaseDateSelector).html(); // see what prints
    console.log(releaseDateContainer);
    
    const actors = [];

    console.log($(detailedMovieSelector.actorSelector));
    $(detailedMovieSelector.actorSelector).each((index, actor) => {
        const $actor = $(actor);

        const actorName = $actor.find(actorSelector.actorNameSelector).html();
        console.log(actorName);
        actors.push({ name: actorName });
    });

    const movie = { 
        posterLink,
        trailerLink,
        title,
        storyLine,
        genres,
        actors };
        //console.log('here');
        //console.log(movie);

    return Promise.resolve()
        .then(() => {
            return movie;
        });
};
