const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

function processScorecard(url){

    request(url , cb);
}

function cb(error,response,html){
    if(error){
        console.error("error :" ,error);
    }
    else{
        extractMatchDetails(html);
    }
}

function extractMatchDetails(html){
    // ipl --> team --> player == runs ball four six sr  opp venue date
    let $ = cheerio.load(html);
    let desc = $(".header-info .description");
    let resultElem = $(".event .status-text");
    let strArr = desc.text().split(",");
    let venue = (strArr[1]).trim();
    let date = (strArr[2]).trim();
    let result = resultElem.text();

    let innings = $(".card.content-block.match-scorecard-table .Collapsible");
    let htmlStr = "";

    for(let i = 0; i < innings.length;i++){

         htmlStr += $(innings[i]).html();

         let teamName = $(innings[i]).find("h5").text();
         teamName = teamName.split("INNINGS");
         teamName = teamName[0].trim();

         let opponentIndex = i==0? 1:0;

         let opponentTeamName = $(innings[opponentIndex]).find("h5").text();
         opponentTeamName = opponentTeamName.split("INNINGS");
         opponentTeamName = opponentTeamName[0].trim();
        let cInning = $(innings[i]);
        let allRows = $(cInning).find(".table.batsman tbody tr");
        for(let j = 0; j < allRows.length; j++){
            let allCols =$(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("batsman-cell");
            if(isWorthy == true){
                console.log(allCols.text());
                let playerNAme = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let sr = $(allCols[7]).text().trim();

                // console.log(`PLAYER NAME : ${playerNAme}  
                //              RUNS : ${runs} 
                //              BALLS : ${ballls} 
                //              FOURS : ${fours} 
                //              SIXES : ${sixes} 
                //              STRIKE RATE OF THE PLAYER :${sr}
                
                // `);
                console.log(` ${playerNAme} ${runs} ${balls} ${fours} ${sixes} ${sr} `);
                processPlayer(teamName,playerNAme,runs,balls,fours,sixes,sr,opponentTeamName,venue,date,result);
            }
        }
        let batsmanRows = $(".table.batsman tbody tr");
 
         console.table(` VENUE ${venue} | DATE ${date}  |TEAMNAME ${teamName} |  OPPONENT TEAMNAME ${opponentTeamName} |  RESULT ${result}`);
    }
    
     

}

module.exports = {
  ps:  processScorecard
}

function dirCreator(filepath){
    if(fs.existsSync(filepath) == false){
        fs.mkdirSync(filepath);
    }
}

function excelWriter(filepath,json,sheetname){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWS, sheetname);
    xlsx.writeFile(newWB, filepath);
}

function excelReader(filepath,sheetname){
    if(fs.existsSync(filepath) == false){
        console.log("error file path not exists");
        return [];
    }
    let wb = xlsx.readFile(filepath);
    let excelData = wb.Sheets[sheetname];
    let ans = xlsx.utils.sheet_to_json(excelData);
    console.log(ans);
    return ans;
}
function processPlayer(teamName,playerNAme,runs,balls,fours,sixes,sr,opponentTeamName,venue,date,result){
    let teamPath = path.join(__dirname ,"IPL",teamName);
    dirCreator(teamPath);
    let filepath = path.join(teamPath,playerNAme + ".xlsx");
    let content = excelReader(filepath,playerNAme);
    let playerObj = {
        teamName,
        playerNAme,
        balls,
        runs,
        fours,
        sixes,
        sr,
        opponentTeamName,
        venue,
        date,
        result
        
    }
    content.push(playerObj);
    excelWriter(filepath,content,playerNAme);
}