const { BaseHtmlParser, ValueGrabber } = require("crawl-e");

class RedditResponseParser extends BaseHtmlParser {
  constructor() {
    super();

    this.postTitleGrabber = new ValueGrabber(
      "a.title",
      this.logger,
      "post:title"
    );
    this.postImageUrlGrabber = new ValueGrabber(
      "a.thumbnail img @src",
      this.logger,
      "post:imageUrl"
    );
    this.postScoreGrabber = new ValueGrabber(
      {
        selector: "div.score.unvoted",
        attribute: "title",
        mapper: parseInt,
      },
      this.logger,
      "post:score"
    );
    this.postAuthorGrabber = new ValueGrabber(
      (box, context) => {
        let authorTag = box.find("a.author");
        return {
          name: authorTag.text(),
          profileUrl: authorTag.attr("href"),
        };
      },
      this.logger,
      "post:author"
    );
  }

  parsePostsList(response, context, callback) {
    let { container, parsingContext } = this.prepareHtmlParsing(
      response.text,
      context
    );

    this.parseList(
      container,
      parsingContext,
      "posts",
      { box: "div.thing" },
      (box, context, cb) => {
        cb(null, this.parsePostBox(box, context));
      },
      callback
    );
  }

  parsePostBox(box, context) {
    return {
      title: this.postTitleGrabber.grabFirst(box, context),
      imageUrl: this.postImageUrlGrabber.grabFirst(box, context),
      score: this.postScoreGrabber.grabFirst(box, context),
      author: this.postAuthorGrabber.grabFirst(box, context),
    };
  }
}

module.exports = RedditResponseParser;
