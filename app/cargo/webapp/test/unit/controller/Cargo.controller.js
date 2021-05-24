/*global QUnit*/

sap.ui.define([
	"comlegstate./cargo/controller/Cargo.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Cargo Controller");

	QUnit.test("I should test the Cargo controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
