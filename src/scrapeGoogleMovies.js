const request = require("request-promise");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const urlParser = require("url");
const puppeteer = require("puppeteer");
const fs = require("fs");
const writeStream = fs.createWriteStream("GoogleMovieInfo.csv");

// For a single google movie UrL

const URL =
  "https://play.google.com/store/movies/details/Despicable_Me_3?id=8bjC0l7pKOU";

(async () => {
  const response = await request(URL);
  let $ = cheerio.load(response);
  let title = $('div[class="sIskre"] > h1').text();
  let typeOf = $('a[class="hrTbp R8zArc"]').text();
  let description = $('div[class="DWPxHb"] > span').text();
  let contentAge = $('c-wiz[class="KmO8jd"]').text()
    ? $('c-wiz[class="KmO8jd"]').text()
    : "No Age rating was found";

  const getMovieType = (link) => {
    if (link.includes("/movies" || "/m")) {
      return `Type of : Movie / ${typeOf}`;
    } else if (link.includes("/tv/show")) {
      return `Type of : TV show / ${typeOf}`;
    } else if (link.includes("serial" || "serials" || "/s")) {
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
})();

// NOT FINISHED <a href="{link}"></a> simulated clicks and Scraping

// const seenUrls = {};

// const getUrl = (link, host, protocol) => {
//   if (link.includes("https")) {
//     return link;
//   } else if (link.startsWith("/")) {
//     return `${protocol}//${host}${link}`;
//   } else {
//     return `${protocol}//${host}/${link}`;
//   }
// };

// const crawl = async ({ url, ignore }) => {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.goto(url);

//   if (seenUrls[url]) return;
//   console.log("crawling", url);
//   seenUrls[url] = true;

//   const { host, protocol } = urlParser.parse(url);

//   const response = await fetch(url);
//   const html = await response.text();
//   const $ = cheerio.load(html);
//   const links = $("a")
//     .map((i, link) => link.attribs.href)
//     .get();

//   console.log("crawling:", url);
//   console.log(links);

//   let title = $('div[class="sIskre"] > h1').text();
//   let typeOf = $('a[class="hrTbp R8zArc"]').text();
//   let description = $('div[class="DWPxHb"] > span').text();
//   let contentAge = $('c-wiz[class="KmO8jd"]').text()
//     ? $('c-wiz[class="KmO8jd"]').text()
//     : "No Age rating was found";

//   const getMovieType = (link) => {
//     if (link.includes("/movies")) {
//       console.log("Type of : Movie /", typeOf);
//     } else if (link.includes("/tv/show")) {
//       console.log("Type of : TV Show /", typeOf);
//     } else {
//       console.log("Type of movie not found.");
//     }
//   };

//   console.log("Title : ", title);
//   getMovieType(url);
//   console.log("Movie Description : ", description);
//   console.log(contentAge);
//   console.log("Movie URL : ", url);

//   links
//     .filter((link) => link.includes(host) && !link.includes(ignore))
//     .forEach((link) => {
//       crawl({
//         url: getUrl(link, host, protocol),
//         ignore,
//       });
//     });
// };

// crawl({
//   url: "https://play.google.com/store",
//   ignore: "/accounts.google.com",
// });
