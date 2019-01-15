const fs = require("fs");
const path = require("path");
const parser = require("xml2json");

const diagramXMLString = fs
  .readFileSync(path.resolve(__dirname, "../../app/public/models/get.xml"))
  .toString();

describe("xml-json", () => {
  it("can convert xml to json", () => {
    const object = JSON.parse(parser.toJson(diagramXMLString));
    // console.log(JSON.stringify(object, null, 2));
  });

  it("can convert json to xml", () => {
    const object = JSON.parse(parser.toJson(diagramXMLString));
    const xml = parser.toXml(object);
    // console.log(xml);
  });
});
