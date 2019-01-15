const Bpmn = require("bpmn-engine");

const fs = require("fs");
const path = require("path");

const processXml = fs.readFileSync(
  path.resolve(__dirname, "../../app/public/models/get.xml")
);

const defaultDIDUrl =
  "https://raw.githubusercontent.com/transmute-industries/github-did/master/dids/1bed11140547b8407478bdf2650db50a5a0c18ef2ae4caf20e818a9433923c2a.jsonld";

describe("execute advanced", () => {
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

          const taskKey = Object.keys(execution.variables.taskInput);

          const result = execution.variables.taskInput[taskKey].result;
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
});
