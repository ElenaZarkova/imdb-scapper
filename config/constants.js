module.exports = {
    connectionString: "mongodb://localhost/moviesDb",
    genres: ["action", "sci-fi", "fantasy", "horror", "comedy"],
    pagesCount: 10,
    simpleMovieSelector: ".col-title span[title] a",
    gettingDetailedMovieSelector: {
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
            },
    gettingActorSelector: {
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
};