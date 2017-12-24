jQuery.sap.declare("kaust.ui.kitsteraccess.controller.MyTimePickerSlider");
jQuery.sap.require("kaust.ui.kitsteraccess.controller.MyVisibleItem");
jQuery.sap.require("sap.m.TimePickerSlider");
jQuery.sap.require("sap.m.TimePickerSliderRenderer");

var MyTimePickerSlider= sap.m.TimePickerSlider.extend("kaust.ui.kitsteraccess.controller.MyTimePickerSlider",{
	renderer: "sap.m.TimePickerSliderRenderer",
	metadata:{
		  aggregations: {
              items: {
                  type: 'kaust.ui.kitsteraccess.controller.MyVisibleItem',
                  multiple: true,
                  singularName: 'item'
              },
              _arrowUp: {
                  type: 'sap.m.Button',
                  multiple: false,
                  visibility: 'hidden'
              },
              _arrowDown: {
                  type: 'sap.m.Button',
                  multiple: false,
                  visibility: 'hidden'
              }
          }
	}
});

MyTimePickerSlider.prototype._updateStepAndValue = function(iNewValue, iStep) {
	var	iVisibleItemsCount = 0,
		$SliderContainer,
		i;

	for (i = 0; i < this.getItems().length; i++) {
		if (i % iStep !== 0 && i !== iNewValue) {
			this.getItems()[i].setVisible(false);
			//this.getItems()[i].setText("");
		} else {
			this.getItems()[i].setVisible(true);
			iVisibleItemsCount++;
		}
	}

	if (iVisibleItemsCount > 2 && iVisibleItemsCount < 13 && this.getDomRef()) {
		$SliderContainer = this.$().find(".sapMTimePickerSlider");

		$SliderContainer.className = ""; //remove all classes
		jQuery($SliderContainer).addClass("sapMTimePickerSlider SliderValues" + iVisibleItemsCount.toString());
	}

	this.setIsCyclic(iVisibleItemsCount > 2);
	this.setSelectedValue(iNewValue.toString());
};