const request = require("request-promise");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const urlParser = require("url");
const puppeteer = require("puppeteer");
const fs = require("fs");
const writeStream = fs.createWriteStream("PantaflixMovieInfo.csv");

// For a single google movie UrL
// REQUIRES VPN in order to work

const URL = "https://www.pantaflix.com/en/m/764569";

(async () => {
  const response = await request(URL);
  let $ = cheerio.load(response);
  let title = $(
    'div[class="DetailHeader__headerDetailContainer___2F31-"] > h1'
  ).text();

  let typeOf = $(
    'a[class="Button__button___6H8LL Button__whiteOutline___3LoSp Button__small___2k97Q Button__centered___3f3m0 DetailPage__genreBubbles___3VYKz"]'
  ).text();

  let description = $(
    'div[class="ContentDetailsDescriptionListWrapper__list___1cerk ContentDetailsDescriptionListWrapper__truncatedItem___UIH4C"] > dd'
  ).text();

  let contentAge = $(
    'div[class="ContentDetailsDescriptionListWrapper__list___1cerk"] > dd'
  ).text()
    ? $(
        'div[class="ContentDetailsDescriptionListWrapper__list___1cerk"] > dd'
      ).text()
    : "No Age rating was found";

  const getMovieType = (link) => {
    if (link.includes("/movies" || "/m")) {
      return `Type of : Movie / ${typeOf}`;
    } else if (link.includes("/tv/show")) {
      return `Type of : TV show / ${typeOf}`;
    } else if (link.includes("serial" || "serials" || "/s" || "/series")) {
      return `Type of : Serials / ${typeOf}`;
    }
  };

  // console.log("Title : ", title);
  // getMovieType(URL);
  // console.log("Movie Description : ", description);
  // console.log("Age Rating :", contentAge);
  // console.log("Movie URL : ", URL);

  writeStream.write(
    `Title : ${title} \n ${getMovieType(
      URL
    )} \n Movie Description : ${description} \n Age Rating : ${contentAge} \n Movie Url : ${URL} \n`
  );

  console.log("Scraping Done.");
})();
