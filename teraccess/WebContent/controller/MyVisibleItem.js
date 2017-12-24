jQuery.sap.declare("kaust.ui.kitsteraccess.controller.MyVisibleItem");
jQuery.sap.require("sap.ui.core.Item");

var MyVisibleItem= sap.ui.core.Item.extend("kaust.ui.kitsteraccess.controller.MyVisibleItem",{
	metadata: {
		library: "sap.m",
		properties: {
			visible: {type: "boolean", group: "Behavior", defaultValue: true}
		}
	}
});

MyVisibleItem.prototype._getRefs = function() {
	var oParent = this.getParent(),
		$refs,
		that = this;

	if (oParent && oParent.$("content")) {
		$refs = oParent.$("content").find("li").filter(function() {
			return jQuery(this).html() === that.getText();
		});
	}

	return $refs;
};

MyVisibleItem.prototype.setVisible = function(bValue) {
	if (this.getVisible() === bValue) {
		return;
	}

	var $refs = this._getRefs();
	if ($refs) {
		if (bValue) {
			$refs.removeClass('TPSliderItemHidden');
		} else {
			$refs.addClass('TPSliderItemHidden');
		}
	}
	return this.setProperty('visible', bValue, true);
};