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

    const fullTitle = $(detailedMovieSelector.titleSelector).html();
    const titleIndex = fullTitle.indexOf("&nbsp;");
    const title = fullTitle.substring(0, titleIndex);

    const storyLine = $(detailedMovieSelector.storyLineSelector).text().replace(/\s\s+/g, " ");

    const genres = [];

    $(detailedMovieSelector.genresSelector).each((index, genre) => {
        const $genre = $(genre);

        genres.push($genre.html());
    });

    const releaseDateContainer = $(detailedMovieSelector.releaseDateSelector).html(); // see what prints

    const releaseDateStartIndex = releaseDateContainer.indexOf("Release Date:") + "Release Date:</h4> ".length;
    const releaseDateEndIndex = releaseDateContainer.indexOf("<span", releaseDateStartIndex);

    const releaseDate = releaseDateContainer.substr(releaseDateStartIndex, releaseDateEndIndex);

    const actors = [];

    $(detailedMovieSelector.actorSelector).each((index, actor) => {
        if(index !== 0){

        const $actor = $(actor);

        const actorName = $actor.find(actorSelector.actorNameSelector).html();
        const characterName = $actor.find(actorSelector.characterNameSelector).html();
        const imageLink = $actor.find(actorSelector.imageSelector).attr("src");
        const imdbLink = $actor.find(actorSelector.imdbIdSelector).attr("href");

        actors.push({ actorName, characterName, imageLink, imdbLink });
        }
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
