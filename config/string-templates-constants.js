const lodash = require("lodash");

module.exports = {
    movieUrl: lodash.template("http://imdb.com/title/<%= imdbId %>/?ref_=adv_li_tt"),
    actorUrl: lodash.template("http://imdb.com/name/<%= imdbId %>/?ref_=tt_cl_t14`"),
    workingWith: lodash.template("Working with <%= url %>."),
    pageUrl: lodash.template("http://www.imdb.com/search/title?genres=<%= genre %>&title_type=feature&0sort=moviemeter,asc&page=<%= page %>&view=simple&ref_=adv_nxt")

};