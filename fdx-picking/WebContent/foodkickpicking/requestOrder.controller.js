sap.ui.controller("foodkickpicking.requestOrder", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf foodkickpicking.requestOrder
*/
	onInit: function() {
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that = this;
		
		var reqOrderTile = that.getView().byId("reqOrderTile");
		setTimeout(function(){
			reqOrderTile.focus();
		      }, 1200);
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "requestOrder") {
				that.getView().byId("welcomeL").setModel(oLoginJsonModel);
				that.getView().byId("welcomeL").bindContext("/");
				
				
			}
		});
	},


/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf foodkickpicking.requestOrder
*

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf foodkickpicking.requestOrder
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf foodkickpicking.requestOrder
*/
//	onExit : function () {
//		
//	},

	navToScanTote : function (){

		//getting details from loginModel
		
		var empId =  oLoginJsonModel.getData().Zempid;
		var plant = oLoginJsonModel.getData().Werks;
		
	
	var delDate = new Date().toSqlFormat();
	console.log(delDate);
		
		var oDialog = this.getView().byId("BusyDialog");
		oDialog.open();
		var that = this;
		var oModel= that.getView().getModel();
		oModel.read("OrdHeaderToteSet(Zempid='"+empId+"',IpAddr='1.1.1.1',DelDate=datetime'"+delDate+"',Plant='"+plant+"')", null, null, true, function(oData){
			oOrderJsonModel.setData(oData);
			oOrderJsonModel.getData().DelDate=oOrderJsonModel.getData().DelDate.toMmDdYyyy();
			orderNum = oData.SalesOrder;
			that.oRouter.myNavBack("scanTote");
			oDialog.close();
		}, function(oError){
			oDialog.close();
			sound.play();
			jQuery.sap.require("sap.m.MessageBox");
			 if(oError.response.statusCode=="500"){
				sap.m.MessageBox.error("Internal System Error");
			}else{
				sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value);
			}
		});
//		this.getView().setModel(oModel);
	},
	performLogout : function(){
		var empId =  oLoginJsonModel.getData().Zempid;
		var that =this;
		var strUrl = server+"sap/opu/odata/SAP/ZFK_ORD_HEADERDETAILS_SRV/";
	    var oModel = new sap.ui.model.odata.ODataModel(strUrl,false);
	    var dataObj = {};
	    dataObj.Zempid=empId;
	    dataObj.IpAddr="1.1.1.1";
		oModel.update("EmployeeSet(Zempid='"+empId+"',IpAddr='1.1.1.1')", dataObj, null,
		          function(oData){
		         	console.log("update success");
		         	that.oRouter.myNavBack("login");
		},
		         function(oError){
					jQuery.sap.require("sap.m.MessageBox");
					 if(oError.response.statusCode=="500"){
						sap.m.MessageBox.error("Internal System Error");
					}else{
						sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value);
					}
			});
	},
	
	logout:function(router){
		var empId =  oLoginJsonModel.getData().Zempid;
		var that =this;
		var strUrl = server+"sap/opu/odata/SAP/ZFK_ORD_HEADERDETAILS_SRV/";
	    var oModel = new sap.ui.model.odata.ODataModel(strUrl,false);
	    var dataObj = {};
	    dataObj.Zempid=empId;
	    dataObj.IpAddr="1.1.1.1";
	    var thisRouter = router;
		oModel.update("EmployeeSet(Zempid='"+empId+"',IpAddr='1.1.1.1')", dataObj, null,
		          function(oData){
		         	console.log("update success");
		         	thisRouter.myNavBack("login");
		},
		         function(oError){
					jQuery.sap.require("sap.m.MessageBox");
					 if(oError.response.statusCode=="500"){
						sap.m.MessageBox.error("Internal System Error");
					}else{
						sap.m.MessageBox.error(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML);
					}
			});
	}
	
});