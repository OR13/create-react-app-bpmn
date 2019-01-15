const Bpmn = require("bpmn-engine");

const convert = require("xml-js");
const fs = require("fs");
const path = require("path");

const processXml = fs.readFileSync(
  path.resolve(__dirname, "../../app/public/models/execute.xml")
);

const defaultDIDUrl =
  "https://raw.githubusercontent.com/transmute-industries/github-did/master/dids/1bed11140547b8407478bdf2650db50a5a0c18ef2ae4caf20e818a9433923c2a.jsonld";

describe("execute", () => {
  const testExecute = (processXml, url, done) => {
    const engine = new Bpmn.Engine({
      name: "execution example",
      source: processXml
    });

    engine.execute(
      {
        variables: {
          url,
          scriptTaskCompleted: false
        },
        services: {
          request: {
            module: "request"
          }
        }
      },
      (err, execution) => {
        if (err) throw err;

        execution.once("end", () => {
          // console.log(
          //   "Script task modification:",
          //   execution.variables.scriptTaskCompleted
          // );
          // console.log(
          //   "Script task output:",
          //   execution.variables.taskInput.scriptTask.result
          // );
          const result = execution.variables.taskInput.scriptTask.result;
          expect(JSON.parse(result).id).toBe(
            "did:ghdid:transmute-industries~github-did~1bed11140547b8407478bdf2650db50a5a0c18ef2ae4caf20e818a9433923c2a"
          );
          done();
        });
      }
    );
  };

  it("can execute", done => {
    testExecute(processXml, defaultDIDUrl, done);
  });

  it("can execute on translated from json", done => {
    const object = JSON.parse(
      convert.xml2json(processXml, { compact: true, spaces: 4 })
    );

    const xml = convert.json2xml(object, {
      compact: true,
      ignoreComment: true,
      spaces: 4
    });

    testExecute(xml, defaultDIDUrl, done);
  });
});
