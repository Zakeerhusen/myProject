jQuery.sap.declare("kaust.ui.kitsteraccess.controller.MyTimePickerSliders");
jQuery.sap.require("kaust.ui.kitsteraccess.controller.MyTimePickerSlider");
jQuery.sap.require("sap.m.TimePickerSliders");
jQuery.sap.require("sap.m.TimePickerSlidersRenderer");

var MyTimePickerSliders= sap.m.TimePickerSliders.extend("kaust.ui.kitsteraccess.controller.MyTimePickerSliders",{
	renderer: "sap.m.TimePickerSlidersRenderer",
	metadata:{
		properties:{
			minutesStep: {type: "int", group: "Misc", defaultValue: 1},
			secondsStep: {type: "int", group: "Misc", defaultValue: 1}
		}
	}
});

MyTimePickerSliders.prototype.setMinutesStep = function(iValue) {
	this.setProperty("minutesStep", iValue, true);
	var aColumns = this.getAggregation("_columns");

	if (aColumns) {
		this.destroyAggregation("_columns");
	}

	this._setupLists(this.getFormat());

	return this;
};

MyTimePickerSliders.prototype._setupLists = function (sFormat) {
	var oRb = sap.ui.getCore().getLibraryResourceBundle("sap.m"),
		sLabelHours = oRb.getText("TIMEPICKER_LBL_HOURS"),
		sLabelMinutes = oRb.getText("TIMEPICKER_LBL_MINUTES"),
		sLabelSeconds = oRb.getText("TIMEPICKER_LBL_SECONDS"),
		//ToDo This value will be always "AM/PM" due to bad translation string. Consider replacing it with something like this._sAM + / + this._sPM
		sLabelAMPM = oRb.getText("TIMEPICKER_LBL_AMPM"),
		iMinutesStep = this.getMinutesStep(),
		iSecondsStep = this.getSecondsStep();

	if (sFormat === undefined) {
		return;
	}

	var bHours = false, bHoursTrailingZero = false, iFrom, iTo;

	if (sFormat.indexOf("HH") !== -1) {
		bHours = true;
		iFrom = 0;
		iTo = 23;
		bHoursTrailingZero = true;
	} else if (sFormat.indexOf("H") !== -1) {
		bHours = true;
		iFrom = 0;
		iTo = 23;
	} else if (sFormat.indexOf("hh") !== -1) {
		bHours = true;
		iFrom = 1;
		iTo = 12;
		bHoursTrailingZero = true;
	} else if (sFormat.indexOf("h") !== -1) {
		bHours = true;
		iFrom = 1;
		iTo = 12;
	}

	if (bHours) {
		this.addAggregation("_columns", new kaust.ui.kitsteraccess.controller.MyTimePickerSlider(this.getId() + "-listHours", {
			items: this._generatePickerListValues(iFrom, iTo, 1, bHoursTrailingZero),
			expanded: jQuery.proxy(onSliderExpanded, this),
			label: sLabelHours
		}));
	}

	if (sFormat.indexOf("m") !== -1) {
		var aValues = this._generatePickerListValues(0, 59, iMinutesStep, true);
		
		aValues = [aValues[0],aValues[15],aValues[30],aValues[45]];

		this.addAggregation("_columns", new kaust.ui.kitsteraccess.controller.MyTimePickerSlider(this.getId() + "-listMins", {
			items: aValues,
			expanded: jQuery.proxy(onSliderExpanded, this),
			label: sLabelMinutes
		}));
	}

	if (sFormat.indexOf("s") !== -1) {
		var aValues = this._generatePickerListValues(0, 59, iSecondsStep, true);
		var aValues = [aValues[0]];
		this.addAggregation("_columns", new kaust.ui.kitsteraccess.controller.MyTimePickerSlider(this.getId() + "-listSecs", {
			items: aValues,
			expanded: jQuery.proxy(onSliderExpanded, this),
			label: sLabelSeconds
		}));
	}

	if (sFormat.indexOf("a") !== -1) {
		this.addAggregation("_columns", new kaust.ui.kitsteraccess.controller.MyTimePickerSlider(this.getId() + "-listFormat", {
			items: [
				{ key: "am", text: this._sAM },
				{ key: "pm", text: this._sPM }
			],
			expanded: jQuery.proxy(onSliderExpanded, this),
			label: sLabelAMPM,
			isCyclic: false
		}).addStyleClass("sapMTimePickerSliderShort"));
	}

	this.getAggregation("_columns")[0].setIsExpanded(true);

	/**
	 * Default expanded handler
	 * @param oEvent {jQuery.Event} Event object
	 */
	function onSliderExpanded(oEvent) {
		var aSliders = this.getAggregation("_columns");

		for (var i = 0; i < aSliders.length; i++) {
			if (aSliders[i] !== oEvent.oSource && aSliders[i].getIsExpanded()) {
				aSliders[i].setIsExpanded(false);
			}
		}
	}
};


MyTimePickerSliders.prototype.setTimeValues = function (oDate) {
	var oCore = sap.ui.getCore(),
		oListHours = oCore.byId(this.getId() + "-listHours"),
		oListMinutes = oCore.byId(this.getId() + "-listMins"),
		oListSeconds = oCore.byId(this.getId() + "-listSecs"),
		oListAmPm = oCore.byId(this.getId() + "-listFormat"),
		iHours,
		sAmPm = null;

	oDate = oDate || new Date();
	iHours = oDate.getHours();

	if (oListAmPm) {
		//ToDo: Replace this hardcoded values with their translated text in order to have UI API value consistency
		sAmPm = iHours >= 12 ? "pm" : "am";
		iHours = (iHours > 12) ? iHours - 12 : iHours;
		iHours = (iHours === 0 ? 12 : iHours);
	}

	oListHours && oListHours.setSelectedValue(iHours.toString());
	oListMinutes && oListMinutes._updateStepAndValue(oDate.getMinutes(), this.getMinutesStep());
	oListSeconds && oListSeconds._updateStepAndValue(oDate.getSeconds(), this.getSecondsStep());
	oListAmPm && oListAmPm.setSelectedValue(sAmPm);
};