sap.ui.controller("fdx_checkout.Checkout", {
	onInit: function() {
		var that = this;
		that.getView().byId("sysTimeId").setText(startTime());
		setInterval(function(){ that.getView().byId("sysTimeId").setText(startTime(that)); }, 1000);
		that.getView().byId("sysDayId").setText(dateTimeFormat2);
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		//this.oRouter.getRoute("Checkout").attachMatched(this._loadCategory, this);
		that = this;
		var id = that.getView().byId("loginId");
		id.onsapenter=(function(oEvent) {
			sap.m.InputBase.prototype.onsapenter.apply(id,arguments);
			var input=id.getValue();
			that.onPress(input,that); /** the on change method **/
		}).bind(that);
		
	},
	press7 : function() {
		var that = this;
		var scanId = that.getView().byId("loginId").getValue();
		scanId = scanId + 7;
		that.getView().byId("loginId").setValue(scanId);
	},
	press8 : function() {
		var that = this;
		var scanId = that.getView().byId("loginId").getValue();
		scanId = scanId + 8;
		that.getView().byId("loginId").setValue(scanId);
	},
	press9 : function() {
		var that = this;
		var scanId = that.getView().byId("loginId").getValue();
		scanId = scanId + 9;
		that.getView().byId("loginId").setValue(scanId);
	},
	press4 : function() {
		var that = this;
		var scanId = that.getView().byId("loginId").getValue();
		scanId = scanId + 4;
		that.getView().byId("loginId").setValue(scanId);
	},
	press5 : function() {
		var that = this;
		var scanId = that.getView().byId("loginId").getValue();
		scanId = scanId + 5;
		that.getView().byId("loginId").setValue(scanId);
	},
	press6 : function() {
		var that = this;
		var scanId = that.getView().byId("loginId").getValue();
		scanId = scanId + 6;
		that.getView().byId("loginId").setValue(scanId);
	},
	press1 : function() {
		var that = this;
		var scanId = that.getView().byId("loginId").getValue();
		scanId = scanId + 1;
		that.getView().byId("loginId").setValue(scanId);
	},
	press2 : function() {
		var that = this;
		var scanId = that.getView().byId("loginId").getValue();
		scanId = scanId + 2;
		that.getView().byId("loginId").setValue(scanId);
	},
	press3 : function() {
		var that = this;
		var scanId = that.getView().byId("loginId").getValue();
		scanId = scanId + 3;
		that.getView().byId("loginId").setValue(scanId);
	},
	press0 : function() {
		var that = this;
		var scanId = that.getView().byId("loginId").getValue();
		scanId = scanId + 0;
		that.getView().byId("loginId").setValue(scanId);
	},
	pressDot : function() {
		var that = this;
		var scanId = that.getView().byId("loginId").getValue();
		scanId = scanId + ".";
		that.getView().byId("loginId").setValue(scanId);
	},
	pressClr : function() {
		var that = this;
		that.getView().byId("loginId").setValue('');
		that.getView().byId("loginId").focus();
	},
	pressEnter : function() {
		var that = this;
		var id = that.getView().byId("loginId").getValue();
		that.onPress(id,that);
	},
	onPress : function(input,that){
		var id = that.getView().byId("loginId").getValue();
		that.getLoginService(id, true);
	},
	
	getLoginService : function(id, flag){
		var that = this;
		var loginId= sap.ui.getCore().byId("__xmlview0--loginId");
		var oModel = that.getView().getModel('myOdataModel');
		oModel.read("/EmployeeSet(IpAddr='1.1.1.2',Zempid='"+id+"')", null, null, false, function(oData){
			oLoginJsonModel.setData(oData);
			idleTime=oLoginJsonModel.getData().IdleTime/60;
			if(flag){
				that.oRouter.navTo("Checkout2", {loginId: id});
			}
			loginId.setValue("");
		}, function(oError){
			if(flag){
				that.oRouter.navTo("Checkout");
			}
			setTimeout(function(){
				loginId.setValue("");
				loginId.focus();
			}, 200);
			jQuery.sap.require("sap.m.MessageBox");
			if(oError.response.statusCode=="500"){
				sap.m.MessageBox.error("Internal System Error",{
					onClose: function(oAction) { 
						setTimeout(function(){
							loginId.setValue("");
							loginId.focus();
						}, 200);
					}
				});
			}else{
				snd.play();
				sap.m.MessageBox.error(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML,{
					onClose: function(oAction) { 
						setTimeout(function(){
							loginId.setValue("");
							loginId.focus();
						}, 200);
					}
				});
			}

		});
	}
});

function startTime(that){
	var currentTime = new Date();
	  var hours = currentTime.getHours();
	  var minutes = currentTime.getMinutes();
	  var sec = currentTime.getSeconds();
	  var dat = currentTime.getDate();
	  if (sec < 10){
		  sec = "0" + sec;
	  }
	  if (minutes < 10){
	      minutes = "0" + minutes;
	  }
	  var t_str = hours + ":" + minutes + ":" + sec + " ";
	  if(hours > 11){
	      t_str += "PM";
	  } else {
	      t_str += "AM";
	  }
	  return t_str;
}