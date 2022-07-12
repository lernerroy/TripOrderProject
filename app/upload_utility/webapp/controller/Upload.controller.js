sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter"],
  function (BaseController, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("UpdUtility.uploadutility.controller.Upload", {
      formatter: formatter,

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the worklist controller is instantiated.
       * @public
       */
      onInit: function () {
        // Model used to manipulate control states
        var oViewModel = new JSONModel({});
        this.setModel(oViewModel, "worklistView");
      },
      onUpload: function () {},
      onFileChange: function (oEvent) {
        // read the selected file
        var oFile = oEvent.getParameter("files")[0];

        if (!oFile) {
          return;
        }

        // use file reader to read the file contetn
        var reader = new FileReader();
        reader.readAsText(oFile, "UTF-8");

        var self = this;

        reader.onload = function (event) {
          var csvJSON = self._csvToJSON(event.target.result);
          debugger;
          var jsonObj = JSON.parse(csvJSON);
          debugger;
        };
      },
      _csvToJSON: function (csv) {
        var lines = csv.split("\n");

        var result = [];

        // NOTE: If your columns contain commas in their values, you'll need
        // to deal with those before doing the next step
        // (you might convert them to &&& or something, then covert them back later)
        // jsfiddle showing the issue https://jsfiddle.net/
        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {
          var obj = {};
          var currentline = lines[i].split(",");

          for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
          }

          result.push(obj);
        }

        //return result; //JavaScript object
        return JSON.stringify(result); //JSON
      },
    });
  }
);
