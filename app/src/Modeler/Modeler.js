import React, { Component } from "react";

const BpmnJS = window.BpmnJS;
const $ = window.$;

class Modeler extends Component {
  componentWillMount() {
    setTimeout(() => {
      const bpmnModeler = new BpmnJS({
        container: "#canvas",
        keyboard: {
          bindTo: window
        }
      });

      this.bpmnModeler = bpmnModeler;

      $.get("/models/get.xml", openDiagram, "text");

      function openDiagram(bpmnXML) {
        // import diagram
        bpmnModeler.importXML(bpmnXML, function(err) {
          if (err) {
            return console.error("could not import BPMN 2.0 diagram", err);
          }
          // access modeler components
          var canvas = bpmnModeler.get("canvas");
          var overlays = bpmnModeler.get("overlays");
          // zoom to fit full viewport
          canvas.zoom("fit-viewport");
          // attach an overlay to a node
          // overlays.add("Process_1", "note", {
          //   position: {
          //     bottom: 0,
          //     right: 0
          //   },
          //   html: '<div class="diagram-note">Mixed up the labels?</div>'
          // });
          // // add marker
          // canvas.addMarker("Process_1", "needs-discussion");
        });
      }
    }, 1 * 1000);
  }

  exportDiagram = () => {
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      if (err) {
        return console.error("could not save BPMN 2.0 diagram", err);
      }
      alert("Diagram exported. Check the developer tools!");
      console.log(xml);
    });
  };
  render() {
    return (
      <div id="modeler">
        <div id="canvas" />
        <button
          id="save-button"
          onClick={() => {
            this.exportDiagram();
          }}
        >
          print to console
        </button>
      </div>
    );
  }
}

export default Modeler;
