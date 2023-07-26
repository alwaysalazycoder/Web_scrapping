const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const AllMatchObj = require('./2_main');

const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const iplPath = path.join(__dirname, "IPL");
dirCreator(iplPath);

request(url, cb);

function cb(error, response, html) {
    if (error) {
        console.error("error : ", error);
    }
    else {
        // console.log(html);
        console.log('response :', response.statusCode);
        extractLink(html);
    }

    function extractLink(html) {
        let $ = cheerio.load(html);
        let anchorElem = $("a[data-hover ='View All Results']");
        let link = anchorElem.attr("href");
        let fullLink = "https://www.espncricinfo.com" + link;
        // console.log(fullLink);
        AllMatchObj.getAllMatch(fullLink);
    }





}

function dirCreator(filepath){
    if(fs.existsSync(filepath) == false){
        fs.mkdirSync(filepath);
    }
}
// function getAllMatchesLink(link){
//     request(link,callback);
// }

// function callback(error,response,html){
//     if(error){
//         console.error("error : ", error);
//     }
//     else{

//         extractAllHtmlLink(html);

//     }
// }


// function extractAllHtmlLink(html){
//     let $ = cheerio.load(html);
//     let scorecardElem = $(" a[data-hover = Scorecard]");
//     for(let i = 0; i< scorecardElem.length;i++){
//         let links = $(scorecardElem[i]).attr("href");
//         let fullLink = ("https://www.espncricinfo.com"+ links);
//         console.log("full links :  " , fullLink);
//     }
// }
// meraLink = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";