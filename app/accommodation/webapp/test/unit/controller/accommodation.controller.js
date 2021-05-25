/*global QUnit*/

sap.ui.define([
	"comlegstate./accommodation/controller/accommodation.controller"
], function (Controller) {
	"use strict";

	QUnit.module("accommodation Controller");

	QUnit.test("I should test the accommodation controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
