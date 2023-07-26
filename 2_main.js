const request = require('request');
const cheerio = require('cheerio');
const xlsx = require('xlsx');
const scorecardObj = require('./3_details');


function getAllMatchesLink(link) {
    request(link, callback);
}

function callback(error, response, html) {
    if (error) {
        console.error("error : ", error);
    }
    else {

        extractAllHtmlLink(html);

    }
}


function extractAllHtmlLink(html) {
    let $ = cheerio.load(html);
    let scorecardElem = $(" a[data-hover = Scorecard]");
    for (let i = 0; i < scorecardElem.length; i++) {
        let links = $(scorecardElem[i]).attr("href");
        let fullLink = ("https://www.espncricinfo.com" + links);
        console.log("full links :  ", fullLink);
        scorecardObj.ps(fullLink);
    }



    // for (let i = 0; i < scorecardElem.length; i++) {
    //     // AllMatchObj.getAllMatch(fullLink);
    //     scorecardObj.ps(fullLink);

    // }
}


module.exports = {
    getAllMatch: getAllMatchesLink
}