/*global QUnit*/

sap.ui.define([
	"comlegstate./passengers/controller/passengers.controller"
], function (Controller) {
	"use strict";

	QUnit.module("passengers Controller");

	QUnit.test("I should test the passengers controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
