jQuery.sap.declare("kaust.ui.kitsteraccess.controller.MyTimePicker");
jQuery.sap.require("kaust.ui.kitsteraccess.controller.MyTimePickerSliders");
jQuery.sap.require("sap.m.TimePicker");
jQuery.sap.require("sap.m.TimePickerRenderer");

			var MyTimePicker= sap.m.TimePicker.extend("kaust.ui.kitsteraccess.controller.MyTimePicker",{
				renderer: "sap.m.TimePickerRenderer",
				metadata:{
					properties:{
						minutesStep: {type: "int", group: "Misc", defaultValue: 1},
						secondsStep: {type: "int", group: "Misc", defaultValue: 1}
					}
				}
			});
			
			MyTimePicker.prototype.setMinutesStep = function(iStep) {
				var oSliders = this._getSliders();

				if (oSliders) {
					oSliders.setMinutesStep(iStep);
				}
				return this.setProperty("minutesStep", iStep, true);
			};
			
			MyTimePicker.prototype.setSecondsStep = function(iStep) {
				var oSliders = this._getSliders();

				if (oSliders) {
					oSliders.setSecondsStep(iStep);
				}
				return this.setProperty("secondsStep", iStep, true);
			};
			
			MyTimePicker.prototype._createPicker = function(sFormat) {
				var that = this,
					oPopover,
					oPicker,
					oResourceBundle,
					sOKButtonText,
					sCancelButtonText,
					sTitle;

				oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");
				sOKButtonText = oResourceBundle.getText("TIMEPICKER_SET");
				sCancelButtonText = oResourceBundle.getText("TIMEPICKER_CANCEL");
				sTitle = this.getTitle();

				var content= null;
				var TObj= new sap.m.TimePicker();
				var valid=true;
				try{
					valid=TObj.getProperty("minutesStep");
				}catch(O){
					valid=false;
				}
				if(valid){
					content= new sap.m.TimePickerSliders(this.getId() + "-sliders", {
							format: sFormat,
							labelText: sTitle ? sTitle : "",
							invokedBy: that.getId(),
							minutesStep: this.getMinutesStep(),
							secondsStep: this.getSecondsStep()
						});
				}else{
					content=new kaust.ui.kitsteraccess.controller.MyTimePickerSliders(this.getId() + "-sliders", {
							format: sFormat,
							labelText: sTitle ? sTitle : "",
							invokedBy: that.getId(),
							minutesStep: this.getMinutesStep(),
							secondsStep: this.getSecondsStep()
						});
				}
				oPicker = new sap.m.ResponsivePopover(that.getId() + "-RP", {
					showCloseButton: false,
					showHeader: false,
					horizontalScrolling: false,
					verticalScrolling: false,
					placement: sap.m.PlacementType.VerticalPreferedBottom,
					beginButton: new sap.m.Button({ text: sOKButtonText, press: jQuery.proxy(this._handleOkPress, this) }),
					endButton: new sap.m.Button({ text: sCancelButtonText, press: jQuery.proxy(this._handleCancelPress, this) }),
					content: [
						//ToDo: This is inconsistent with the parent locale (if set). Add 'localeID' property to this control which will read its parent 'localeID' property
						content
					],
					contentHeight: MyTimePicker._PICKER_CONTENT_HEIGHT
				});

				oPopover = oPicker.getAggregation("_popup");
				// hide arrow in case of popover as dialog does not have an arrow
				if (oPopover.setShowArrow) {
					oPopover.setShowArrow(false);
				}

				oPopover.oPopup.setAutoCloseAreas([this.getDomRef("icon")]);

				oPicker.addStyleClass(this.getRenderer().CSS_CLASS + "DropDown")
					.attachBeforeOpen(this.onBeforeOpen, this)
					.attachAfterOpen(this.onAfterOpen, this)
					.attachAfterClose(this.onAfterClose, this);

				oPicker.open = function() {
					return this.openBy(that);
				};

				if (sap.ui.Device.system.desktop) {
					this._oPopoverKeydownEventDelegate = {
						onkeydown: function(oEvent) {
							var oKC = jQuery.sap.KeyCodes,
								iKC = oEvent.which || oEvent.keyCode,
								bAlt = oEvent.altKey;

							// Popover should be closed when ESCAPE key or ATL+F4 is pressed
							if ((bAlt && (iKC === oKC.ARROW_UP || iKC === oKC.ARROW_DOWN)) || iKC === oKC.F4) {
								this._handleOkPress(oEvent);
								//focus the input
								this.focus();
								oEvent.preventDefault();
							}
						}
					};

					oPopover.addEventDelegate(this._oPopoverKeydownEventDelegate, this);
					//override popover callback - the best place to update content layout
					oPopover._afterAdjustPositionAndArrowHook = function() {
						that._getSliders()._onOrientationChanged();
					};
				}

				// define a parent-child relationship between the control's and the _picker pop-up
				this.setAggregation("_picker", oPicker, true);

				return oPicker;
			};