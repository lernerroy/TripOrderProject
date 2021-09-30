sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel"
], function(Object, JSONModel){
	"use strict";
	
	return Object.extend("fas.dialog.BusyDialogController",{
		
		constructor: function(sTitle,sMessage)	{
			this.sTitle = sTitle;
			this.sMessage = sMessage;
		},
		
		present: function(oHostView){
			if (!this._dialog) {
				this._dialog = sap.ui.xmlfragment("fas.dialog.BusyDialog", this);
				oHostView.addDependent(this._dialog);
			}	
			
			
			var model = new JSONModel({
				title: this.sTitle,
				message: this.sMessage
			});
			
			this._dialog.setModel(model,"busyDialog");
			
			this._dialog.open();
		},
		
		dismiss: function(){
			this._dialog.close();
			this._dialog = null;
		}
	});
});