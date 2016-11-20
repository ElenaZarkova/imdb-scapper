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
    const releaseDateEndIndex = releaseDateContainer.indexOf("\n", releaseDateStartIndex);

    const releaseDate = releaseDateContainer.substring(releaseDateStartIndex, releaseDateEndIndex);

    const actors = [];

    $(detailedMovieSelector.actorSelector).each((index, actor) => {
        if (index !== 0) {
            const $actor = $(actor);

            const actorName = $actor.find(actorSelector.actorNameSelector).html();
            const characterName = $actor.find(actorSelector.characterNameSelector).text().trim();
            const profileImageLink = $actor.find(actorSelector.imageSelector).attr("src");
            const imdbLink = $actor.find(actorSelector.imdbIdSelector).attr("href");

            actors.push({ actorName, characterName, profileImageLink, imdbLink });
        }
    });

    const movie = {
        posterLink,
        trailerLink,
        title,
        storyLine,
        releaseDate,
        genres,
        actors
    };

    return Promise.resolve()
        .then(() => {
            return movie;
        });
};

module.exports.parseActor = (selector, html) => {
    $("body").html(html);

    const actorSelector = selector.actorSelector;
    const actorMovieSelector = selector.actorMovieSelector;

    const profileImageLink = $(actorSelector.profileImageSelector).attr("src");
    const actorName = $(actorSelector.actorNameSelector).html();
    const actorBiographyContainer = $(actorSelector.actorBiographySelector).html();

    const actorBiographyStartIndex = 1;
    const actorBiographyEndIndex = actorBiographyContainer.indexOf(" <");

    const actorBiography = actorBiographyContainer.substr(actorBiographyStartIndex, actorBiographyEndIndex);

    const movies = [];
    const actorMovies = $(actorSelector.actorMovieSelector).first().children('div');
    actorMovies.each((index, movie) => {

        const $movie = $(movie);

        const movieName = $movie.find(actorMovieSelector.movieNameAndIdSelector).html();
        const movieLink = $movie.find(actorMovieSelector.movieNameAndIdSelector).attr("href");
        const characterName = $movie.find(actorMovieSelector.characterNameSelector).last().html();

        movies.push({ movieName, movieLink, characterName });
    });

    const actor = {
        profileImageLink,
        actorName,
        actorBiography,
        movies
    };

    return Promise.resolve()
        .then(() => {
            return actor;
        });
}
