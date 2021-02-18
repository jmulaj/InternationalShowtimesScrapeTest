const request = require("request-promise");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const urlParser = require("url");
const puppeteer = require("puppeteer");
const fs = require("fs");
const writeStream = fs.createWriteStream("JoynMovieInfo.csv");

// For a single google movie UrL

const URL = "https://www.joyn.de/serien/the-masked-singer";

(async () => {
  const response = await request(URL);
  let $ = cheerio.load(response);
  let title = $('h1[class="eoaxdi-0 hXdaOG"]').text()
    ? $('h1[class="eoaxdi-0 hXdaOG"]').text()
    : $('img[class="artLogo"] ').attr("alt");

  let typeOf = $('div[class="sc-89hemy-0 bPBVYt"]').text();

  let description = $('div[class="sc-1sjk1zi-0 elLoCk"]')
    .text()
    .split("Mehr...")[0];

  let contentAge = $(
    'div[class="ContentDetailsDescriptionListWrapper__list___1cerk"] > dd'
  ).text()
    ? $(
        'div[class="ContentDetailsDescriptionListWrapper__list___1cerk"] > dd'
      ).text()
    : "No Age rating was found";

  const getMovieType = (link) => {
    if (link.includes("/filme")) {
      return `Type of : Movie / ${typeOf}`;
    } else if (link.includes("/serien")) {
      return `Type of : Serials / ${typeOf}`;
    }
  };

  // console.log("Title : ", title);
  // getMovieType(URL);
  // console.log("Movie Description : ", description);
  // console.log("Age Rating :", contentAge);
  // console.log("Movie URL : ", URL);

  // Write to CSV
  writeStream.write(
    `Title : ${title} \n ${getMovieType(
      URL
    )} \n Movie Description : ${description} \n Age Rating : ${contentAge} \n Movie Url : ${URL} \n`
  );

  console.log("Scraping Done.");
})();
