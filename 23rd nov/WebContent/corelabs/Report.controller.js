sap.ui.controller("corelabs.Report", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf corelabs.Report
*/
	onInit: function() {
	if (!jQuery.support.touch||jQuery.device.is.desktop){
		this.getView().addStyleClass("sapUiSizeCompact");
		}
	var that = this;
	this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	this.oRouter.attachRoutePatternMatched(function(oEvent) {
		if (oEvent.getParameter("name") === "Report") {
			that.initializeDateRange();
			that.initializeComboBoxForReadOnly();
			that.userId="";
			
			/** To load Organisation Type **/ 
			var orgTypeModel = new sap.ui.model.json.JSONModel(); 
			orgTypeModel.attachRequestCompleted(function(oEvent){
				var orgTypeModel= oEvent.getSource();
				orgTypeModel.getData().organizationDto.unshift({orgId:"select",orgName:""});
				orgTypeModel.refresh();
			});
			orgTypeModel.loadData("/kclrfs/rest/brm/organization",null,true);
			that.getView().setModel(orgTypeModel,"orgTypeModel");
			
			/**To load Countries **/
			that.getView().byId("aCountry").setBusy(false);
			var contoller=that;
			var oCountryJsonModel = new sap.ui.model.json.JSONModel();
			oCountryJsonModel.attachRequestCompleted(function(oEvent){
				contoller.getView().byId("aCountry").setBusy(false);
				var oCountryJsonModel= oEvent.getSource();
				oCountryJsonModel.getData().d.results.unshift({CountryKey:"select",CountryNameShort:""});
				oCountryJsonModel.refresh();
			});
			oCountryJsonModel.loadData("/utilweb/GWProxyServlet?sap/opu/odata/sap/ZGW_BPM_RFS_SERVICES_SRV/Countrys?$format=json",null,true);
			that.getView().setModel(oCountryJsonModel,"oCountryJsonModel");
			
			/**To load Labs **/
			var labListModel = new sap.ui.model.json.JSONModel(); 
			labListModel.attachRequestCompleted(function(oEvent){
				var labListModel= oEvent.getSource();
				labListModel.getData().labDto.unshift({labId:"select",labName:""});
				labListModel.refresh();
			});
			labListModel.loadData("/kclrfs/rest/brm/labs",null,true);
			that.getView().setModel(labListModel,"labListModel");
			
			/**To load Status **/
			var rfsStatusModel = new sap.ui.model.json.JSONModel(); 
			rfsStatusModel.attachRequestCompleted(function(oEvent){
				var rfsStatusModel= oEvent.getSource();
				rfsStatusModel.getData().rfsStatusMap.entry.unshift({key:""});
				rfsStatusModel.refresh();
			});
			rfsStatusModel.loadData("/kclrfs/rest/brm/rfsStatus",null,true);
			that.getView().setModel(rfsStatusModel,"rfsStatusModel");
			
			/** Get report data **/
			oModel = new sap.ui.model.json.JSONModel(); 
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			var payload={
					"isAdvanceSearch":false
				};
			var urlInc ="/kclrfs/rest/requestheader/searchRFSReport/0";
			that.getView().byId("idRFSTable").setBusy(true);
			oModel.attachRequestCompleted(function(oEvent){
				try{
				that.populateData(0,5);
				that.getView().byId("idRFSTable").setBusy(false);
				}catch(oError){
					console.log(oError);
					that.getView().byId("idRFSTable").setBusy(false);
				}
			});
			oModel.loadData(urlInc,JSON.stringify(payload),true,"POST",false,false,oHeader);
			that.getView().setModel(oModel,"oModel");
		}
	});
	},
	start : 0,
	 
	onSelectUserType: function(oEvent){
		if(oEvent.getSource().getValue()=== "INTERNAL"){
			this.getView().byId("aOrgType").setEnabled(false);
			this.getView().byId("aCountry").setEnabled(false);
		}else{
			this.getView().byId("aOrgType").setEnabled(true);
			this.getView().byId("aCountry").setEnabled(true);
		}
	},
	
	handleSuggest : function(oEvent){
		that.userId="";
		var autoUser = oEvent.getParameter("suggestValue");
		var oSearchUserModel = new sap.ui.model.json.JSONModel();
		var regex=/^[A-z]+$/;
		autoUser=autoUser.trim();
		if(autoUser !== "" && !regex.test(autoUser)){
			oEvent.getSource().setValue("");
			return;
		}
		//oEvent.getSource().setValueState("None");
		if (autoUser.length > 2) {
		var searchPayload ={
				   "userNm" : autoUser
		};
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		var that=this;
		
		oSearchUserModel.attachRequestCompleted(function(oEvent){
			that.getView().byId("aPIName").setBusy(false);
			var oSearchUserModel= oEvent.getSource();
			if(oSearchModel.getData()){
				if(!(oSearchUserModel.getData().userDtos instanceof Array)){
					oSearchUserModel.getData().userDtos=[oSearchUserModel.getData().userDtos];
				}
			}
			that.getView().setModel(oSearchUserModel,"oSearchUserModel");
			oSearchUserModel.refresh();
		});
		that.getView().byId("aPIName").setBusy(true);
		oSearchUserModel.loadData("/utilweb/rest/ume/auth/searchuser",JSON.stringify(searchPayload),true,"POST",false,false,oHeader);
		this.getView().setModel(oSearchUserModel,"oSearchUserModel");
		}
	},
	
	itemSelected: function(oEvent){
		var that=this;
		that.userId=oEvent.getParameter("selectedItem").getAdditionalText();
	},
	
	loadServiceArea: function(oEvent){
		var keyLab= oEvent.getSource().getSelectedKey();
		if(keyLab === "" || keyLab === "select"){
			this.getView().byId('aServiceArea').setEnabled(false);
		}else{
			this.getView().byId('aServiceArea').setEnabled(true);
		}
		var serviceAreaModel = new sap.ui.model.json.JSONModel();
		var that=this;
		serviceAreaModel.attachRequestCompleted(function(oEvent){
			var serviceAreaModel=oEvent.getSource();
			if(serviceAreaModel.getData().serviceAreaDto){
				serviceAreaModel.getData().serviceAreaDto.unshift({serviceAreaId:"select",serviceAreaName:""});
			}
			serviceAreaModel.refresh(true);
		});
		serviceAreaModel.loadData("/kclrfs/rest/brm/serviceArea/"+keyLab,null,true);
		this.getView().byId('aServiceArea').setModel(serviceAreaModel,"oServiceAreaModel");
	},
	prev : function(){
		  var rowCount = 5;
		  this.start =this.start - rowCount;
		  this.populateData(this.start,rowCount);
	},
	
	next : function(){
		
		  var rowCount = 5;
		  this.start =this.start + rowCount;
		  this.populateData(this.start,rowCount);
	},
		
	populateData : function(start, rowCount) {
		 var that =this;
		 that.getView().byId("Previous").setEnabled(true);
		 that.getView().byId("Next").setEnabled(true);
		 that.getView().byId("idRFSTable").destroyItems();

       for (i = start; i <start + rowCount; i++) {
          oTableRow= new sap.m.ColumnListItem({

                     type: "Active",
                     visible: true,
                     selected: true,
                     cells: [
                             new sap.m.Link({
                           	  text: that.getView().getModel("oModel").getProperty("/searchDtoList/" + i + "/reqNo"),
                           	  press : function(oEvt){
                            	 that.openRFS(oEvt);
                             		}
                             }),
                             new sap.m.Text({
                           	  text: that.getView().getModel("oModel").getProperty("/searchDtoList/" + i + "/userType")
                             }),
                             new sap.m.Text({
                           	  text: that.getView().getModel("oModel").getProperty("/searchDtoList/" + i + "/orgTypeNm")
                             }),
                             new sap.m.Text({
                           	  text: that.getView().getModel("oModel").getProperty("/searchDtoList/" + i + "/countryNm")
                             }),
                             new sap.m.Text({
                           	  text: that.getView().getModel("oModel").getProperty("/searchDtoList/" + i + "/numberOfSamples")
                             }),
                             new sap.m.Text({
                           	  text: that.getView().getModel("oModel").getProperty("/searchDtoList/" + i + "/statusDesc")
                             }),
                             new sap.m.Text({
                           	  text: that.getView().getModel("oModel").getProperty("/searchDtoList/" + i + "/subStatus")
                             }),
                             new sap.m.Text({
                           	  text: that.getView().getModel("oModel").getProperty("/searchDtoList/" + i + "/serviceCharge")
                             }),
                             new sap.m.Text({
                           	  text: that.getView().getModel("oModel").getProperty("/searchDtoList/" + i + "/serviceRating")
                             })
]
              });
              that.getView().byId("idRFSTable").addItem(oTableRow);

              if (i ==that.getView().getModel("oModel").getProperty("/searchDtoList/length") - 1) {
           	   that.getView().byId("Next").setEnabled(false);
                  break;
              }
              
              var len= that.getView().getModel("oModel").getData().searchDtoList.length;
              var s=start;
              if(s===0){
           	   s=1;
              }
              var currentPage= parseInt(s/5)+1;
              var totalPage= parseInt(len/5);
             // that.getView().byId("paginationText").setText(currentPage+"/"+totalPage);
       }

       if (start == 0) {
       	that.getView().byId("Previous").setEnabled(false);
       }
 },

	onSearch : function (oEvt) {
		var that =this;
		jQuery.sap.require("sap.ui.core.format.DateFormat");
		var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            pattern : "yyyy-MM-ddTHH:mm:ss"
		});
		var aRFSNo ="", aDepartment="", aPIName="";
		aRFSNo =  that.getView().byId("aRFSNo").getValue();
		var aUserType =that.getView().byId("aUserType").getSelectedItem()? that.getView().byId("aUserType").getSelectedItem().getText() : null;
		if(aUserType=== "select"){
			aUserType= "";
		}
		aDepartment =  that.getView().byId("aDepartment").getValue();
		var aStatus = that.getView().byId("aStatus").getSelectedItem()?that.getView().byId("aStatus").getSelectedItem().getText():null;
		if(aStatus=== "select"){
			aStatus= "";
		}
		var aOrgType = that.getView().byId("aOrgType").getSelectedItem()? that.getView().byId("aOrgType").getSelectedItem().getKey(): null;
		if(aOrgType=== "select"){
			aOrgType= "";
		}
		var aCountry = that.getView().byId("aCountry").getSelectedItem()? that.getView().byId("aCountry").getSelectedItem().getKey(): null;
		if(aCountry=== "select"){
			aCountry= "";
		}
		var aLab = that.getView().byId("aLab").getSelectedItem()? that.getView().byId("aLab").getSelectedItem().getKey(): null;
		if(aLab=== "select"){
			aLab= "";
		}
		var aServiceArea = that.getView().byId("aServiceArea").getSelectedItem()? that.getView().byId("aServiceArea").getSelectedItem().getKey(): null;
		if(aServiceArea=== "select"){
			aServiceArea= "";
		}
		aPIName = that.getView().byId("aPIName").getValue();
		if(that.userId){
			aPIName = that.userId;
		}
		var fromDate = that.getView().byId("dateRange").getDateValue();
		if(fromDate){
			var utc= fromDate.getTime() - (fromDate.getTimezoneOffset() * 60000);
			fromDate= new Date(utc + (3600000));
			fromDate= oDateFormat.format(fromDate,true); 
		}
		var toDate = that.getView().byId("dateRange").getSecondDateValue();
		if(toDate){
			var utc= toDate.getTime() - (toDate.getTimezoneOffset() * 60000);
			toDate= new Date(utc + (3600000));
			toDate= oDateFormat.format(toDate,true); 
		}
		
		
		oModel = this.getView().getModel("oModel"); 
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	
		var payload={
				"isAdvanceSearch":true,
				"reqNo":aRFSNo,
				"userType":aUserType,
				"deptNm":aDepartment,
				"status":aStatus,
				"orgTypeId":aOrgType,
				"countryId":aCountry,
				"labId":aLab,
				"serviceAreaId":aServiceArea,
				"authPerOrPiId":aPIName,
				"fromDate":fromDate,
				"toDate":toDate
			};
		var urlInc ="/kclrfs/rest/requestheader/searchRFSReport/0";
		that.getView().byId("idRFSTable").setBusy(true);
		oModel.attachRequestCompleted(function(oEvent){
			try{
				var oModel= oEvent.getSource();
				if(!oModel.getData().searchDtoList){
					oModel.setData(null);
					that.getView().byId("Previous").setEnabled(true);
					that.getView().byId("Next").setEnabled(true);
					that.getView().byId("idRFSTable").destroyItems();
				}
				if(!(oModel.getData().searchDtoList instanceof Array)){
					oModel.getData().searchDtoList=[oModel.getData().searchDtoList];
				}
				that.getView().setModel(oModel,"oModel");
				that.populateData(0,5);
				that.getView().byId("idRFSTable").setBusy(false);
			}catch(oError){
				console.log(oError);
				that.getView().byId("idRFSTable").setBusy(false);
			}
		});
		oModel.loadData(urlInc,JSON.stringify(payload),true,"POST",false,false,oHeader);
	},
	
	clearData : function(){
		var that= this;
		
		//that.getView().byId("advSrchPanel").setExpanded(false);
		that.getView().byId("aRFSNo").setValue("");
		that.getView().byId("aUserType").setSelectedKey("");
		that.getView().byId("aDepartment").setValue("");
		that.getView().byId("aStatus").setSelectedKey("");
		that.getView().byId("aOrgType").setSelectedKey("");
		that.getView().byId("aCountry").setSelectedKey("");
		that.getView().byId("aLab").setSelectedKey("");
		that.getView().byId("aServiceArea").setSelectedKey("");
		that.getView().byId("aServiceArea").setEnabled(false);
		that.getView().byId("aPIName").setValue("");
		that.userId="";
		//that.getView().byId("aPIName").setValueState("None");
		
		that.initializeDateRange();
		that.onSearch();
	},
	
	initializeDateRange: function(){
		var toDate=new Date();
		var fromDate= new Date("2016-01-01");
		this.getView().byId("dateRange").setDateValue(fromDate);
		this.getView().byId("dateRange").setSecondDateValue(toDate);
	},
	
	onExcelDownload : function(){
		var that=this;
		var payload={"rfsSearchList":[]};
		var excelData=that.getView().getModel("oModel").getData().searchDtoList;
		payload.rfsSearchList=excelData;
		/*var payload= {
		 "rfsSearchList":
		    {	     
		          "reqNo":"req111",
		          "requestType":"full",
		          "userType":"INTERNAL",
		          "requesterId":"kaust1@test.com",
		          "statusDesc":"status desctiption 1"
		       }
		  };*/
		var loggedinUserModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		that.getView().setBusy(true);
		loggedinUserModel.loadData("/kclrfs/rest/rfsExcelReport/writeExcel",JSON.stringify(payload),false,"POST",false,false,oHeader);
		that.getView().setBusy(false);
		var excelFiledata = loggedinUserModel.getData();
		if(nullCheckValue(excelFiledata))
		{
		fileName = excelFiledata.fileData.fileNm;
		$("a#linkDownloadReportAsExcel").text(fileName);
		$("a#linkDownloadReportAsExcel").prop("download", fileName);
		var ByteArray = excelFiledata.fileData.fileByteArray;
		var u8_2 = new Uint8Array(atob(ByteArray).split("").map(
		function(c) {
		return c.charCodeAt(0);
		}));
		var blob = new Blob( [ u8_2 ]);
		var excelFile_Link = window.URL.createObjectURL(blob);
		$("a#linkDownloadReportAsExcel").prop("href", excelFile_Link);
		}
		},

	nullCheckValue : function(value) {
		if ((value != null) && (typeof (value != 'undefined')) && (value !== '')) {
		return true;
		}
		return false;
		},
		
	itemDel : function(oEvent){
//		var that =this;
//		var suggetItems= that.getView().byId("aPIName").getValue();
//		var userListItem = oEvent.getSource().getParent();
//		if(userListItem.getCells()[0].getValue()){
//			that.findAndRemove(that.getView().byId('piTable').getModel().getData().userDtos, "kaustId", userListItem.getCells()[0].getValue());
//			}
//		if(suggetItems==""){
//			userListItem.getCells()[0].setValue("");
//			userListItem.getCells()[2].setValue("");
//		}
	},
	
	openRFS : function(oEvt){
		var that =this;
		var rfsNo = oEvt.getSource().getText();
		that.oRouter.navTo("RFSFormTask",{id: rfsNo});
	},
	
	initializeComboBoxForReadOnly: function(){
		var oCombo = this.getView().byId("aUserType");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		oCombo = this.getView().byId("aStatus");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		oCombo = this.getView().byId("aOrgType");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);//
		
		oCombo = this.getView().byId("aCountry");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		oCombo = this.getView().byId("aLab");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		oCombo = this.getView().byId("aServiceArea");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
	},
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf corelabs.Report
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf corelabs.Report
*/
	onAfterRendering: function() {
		var that=this;
		that.getView().byId("aUserType").$().find("input").attr("readonly", true);
		that.getView().byId("aStatus").$().find("input").attr("readonly", true);
		that.getView().byId("aOrgType").$().find("input").attr("readonly", true);
		that.getView().byId("aCountry").$().find("input").attr("readonly", true);
		that.getView().byId("aLab").$().find("input").attr("readonly", true);
		that.getView().byId("aServiceArea").$().find("input").attr("readonly", true);
	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf corelabs.Report
*/
//	onExit: function() {
//
//	}

});