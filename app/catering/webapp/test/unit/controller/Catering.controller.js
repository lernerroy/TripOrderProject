/*global QUnit*/

sap.ui.define([
	"comlegstate./catering/controller/Catering.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Catering Controller");

	QUnit.test("I should test the Catering controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
