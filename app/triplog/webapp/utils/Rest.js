sap.ui.define([], function () {
  "use strict";

  return {
    //This is a standalone controller for performing REST operations

    /**
     * Generic function to call backend service
     * @public
     * @param {String} sMethod - HTTP Method to be called. Can be POST,GET,PUT and DELETE
     * @param {String} sPath - Relative URL or URL to be called
     * @return {Object} A promise object with the request
     */
    ajaxCall: function (sMethod, sPath, requestData) {
      let pPromise = {};
      const oHeaders = {};
      switch (sMethod) {
        case "POST":
          pPromise = new Promise(function (resolve, reject) {
            $.ajax({
              url: sPath,
              type: sMethod,
              headers: oHeaders,
              data: JSON.stringify(requestData),
              contentType: "application/json",
              success: function (oData) {
                const oResponse = oData;
                resolve(oResponse);
              },
              error: function (oError) {
                reject(oError);
              },
            });
          });
          break;
        default:
          break;
      }
      //[TODO] Implement PUT, methods
      return pPromise;
    },
  };
});
