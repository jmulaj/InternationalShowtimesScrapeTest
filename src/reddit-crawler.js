const {
  DefaultContext,
  DefaultRequestMaker,
  DefaultLogger,
  JsonFileWriter,
} = require("crawl-e");
const RedditResponseParser = require("./RedditResponseParser");

let context = new DefaultContext();
let logger = new DefaultLogger();
let requestMaker = new DefaultRequestMaker();
requestMaker.logger = logger;

let responseParser = new RedditResponseParser();
responseParser.logger = logger;

let outputWriter = new JsonFileWriter();
outputWriter.logger = logger;

requestMaker.get("https://old.reddit.com/top/", context, (err, res) => {
  if (err) {
    console.log(`There is a error req that url : ${err}`);
    return;
  } else {
    console.log("Connected succesfully .");

    responseParser.parseMovieList(res, context, (err, posts) => {
      console.log(`Found ${posts.length} posts.`);
      console.log(posts.map((p) => `-${p.title}`).join("\n"));

      outputWriter.saveFile(posts, context, (err) => {
        if (err) {
          console.error(`There was an error during saving files : ${err}`);
          return;
        } else {
          console.log("Saved Files Succesfully.");
        }
      });
    });
  }
});
