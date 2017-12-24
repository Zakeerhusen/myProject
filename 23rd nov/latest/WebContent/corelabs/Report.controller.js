jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("sap.ui.commons.MessageBox");
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
	if(!this.busyDialog){
	    this.busyDialog= sap.ui.xmlfragment("corelabs.fragments.busy", this);
	    this.getView().addDependent(this.busyDialog);
	    this.busyDialog.addStyleClass("sapUiSizeCompact");
    }
	
	var that = this;
	this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	this.oRouter.attachRoutePatternMatched(function(oEvent) {
		if (oEvent.getParameter("name") === "Report") {
			that.initializeComboBoxForReadOnly();
			
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
				//-------------------------------------------------------------------------------- 
				// Edited by Darshna on 07/07/2017 - Getting all countries in the drop down 
				oCountryJsonModel.iSizeLimit = oCountryJsonModel.getData().d.results.length; 
				//-------------------------------------------------------------------------------
				oCountryJsonModel.refresh();
			});
		//	oCountryJsonModel.loadData("/utilweb/GWProxyServlet?sap/opu/odata/sap/ZGW_BPM_RFS_SERVICES_SRV/Countrys?$format=json",null,true);
			oCountryJsonModel.loadData(urlCont+"COUNTRY?$format=json&$select=LAND1,LANDX",null,true);
			that.getView().setModel(oCountryJsonModel,"oCountryJsonModel");
			that.getView().byId("aCountry").clearSelection();
			
			that.getView().byId("aOrgType").setEnabled(false);
			that.getView().byId("aCountry").setEnabled(false);
			
			/**To load Labs **/
			var labListModel = new sap.ui.model.json.JSONModel(); 
			labListModel.attachRequestCompleted(function(oEvent){
				var labListModel= oEvent.getSource();
				labListModel.getData().labDto.unshift({labId:"select",labName:""});
				labListModel.refresh();
			});
			labListModel.loadData("/kclrfs/rest/brm/labs",null,true);
			that.getView().setModel(labListModel,"labListModel");
			that.getView().byId("aLab").setTooltip("");
			
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
			that.getView().setModel(oModel,"oModel");
			that.clearData();
		}
	});
	},
	
	onSelectUserType: function(oEvent){
		this.getView().byId("aOrgType").setValue("");
		this.getView().byId("aOrgType").clearSelection();
		this.getView().byId("aCountry").setValue("");
		this.getView().byId("aCountry").clearSelection();
		if(oEvent.getSource().getValue()== "EXTERNAL" || oEvent.getSource().getValue()== "RPT"){
			this.getView().byId("aOrgType").setEnabled(true);
			this.getView().byId("aCountry").setEnabled(true);
		}else{
			this.getView().byId("aOrgType").setEnabled(false);
			this.getView().byId("aCountry").setEnabled(false);
		}
	},
	
	handleSuggest : function(oEvent){
		var that=this;
		that.userId="";
		var autoUser = oEvent.getParameter("suggestValue");
		var oSearchUserModel = new sap.ui.model.json.JSONModel();
		autoUser=autoUser.trim();
		
		if (autoUser.length > 2) {
		var searchPayload ={
				   "userNm" : autoUser
		};
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		oSearchUserModel.attachRequestCompleted(function(oEvent){
			that.getView().byId("aPIName").setBusy(false);
			var oSearchUserModel= oEvent.getSource();
			if(oSearchUserModel.getData()){
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
	
	onNameChange:function(oEvent){
		var name= oEvent.getSource().getValue();
		if(name.trim() != "" && (this.userId == undefined || this.userId == "")){
			oEvent.getSource().setValue("");
			sap.ui.commons.MessageBox.show("Please select user name from suggested options",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
		if(name.trim() == ""){
			this.userId="";
		}
	},
	
	itemSelected: function(oEvent){
		var that=this;
		that.userId=oEvent.getParameter("selectedItem").getAdditionalText();
	},
	
	rfsLiveChange: function(oEvent){
		getTrimUiInputVal(oEvent); // Edited by Darshna on 07/07/2017 - Trim the string for whitespace at the start and end
		var that=this;
		var value=oEvent.getSource().getValue();
		value= value.trim();
		var regex=/^[0-9]*$/;
		if(value !== "" && !regex.test(value)){
			value=value.substr(0,value.length-1);
			oEvent.getSource().setValue(value);
			return;
		}
	},
	
	loadServiceArea: function(oEvent){
		var that=this;
		that.getView().byId('aServiceArea').setValue("");
		that.getView().byId('aServiceArea').clearSelection();
		var keyLab= oEvent.getSource().getSelectedKey();
		
		var labControl= oEvent.getSource();
		labControl.setTooltip(labControl.getSelectedItem().getText());
		if(keyLab === "" || keyLab === "select"){
			that.getView().byId('aServiceArea').setEnabled(false);
		}else{
			that.getView().byId('aServiceArea').setEnabled(true);
		}
		
		var serviceAreaModel = new sap.ui.model.json.JSONModel();
		serviceAreaModel.attachRequestCompleted(function(oEvent){
			var serviceAreaModel=oEvent.getSource();
			if(serviceAreaModel.getData().serviceAreaDto){
				serviceAreaModel.getData().serviceAreaDto.unshift({serviceAreaId:"select",serviceAreaName:""});
			}
			serviceAreaModel.refresh();
		});
		serviceAreaModel.loadData("/kclrfs/rest/brm/serviceAreaSet/"+keyLab,null,true);
		that.getView().byId('aServiceArea').setModel(serviceAreaModel,"oServiceAreaModel");
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
	 	// $("a#linkDownloadReportAsExcel").hide();
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
					that.getView().byId("Previous").setEnabled(false);
					that.getView().byId("Next").setEnabled(false);
					that.getView().byId("idRFSTable").destroyItems();
				}
				if(!(oModel.getData().searchDtoList instanceof Array)){
					oModel.getData().searchDtoList=[oModel.getData().searchDtoList];
				}
				that.getView().setModel(oModel,"oModel");
				that.start = 0;
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
	
	/*onExcelDownload : function(){
		var that=this;
		var payload={"rfsSearchList":[]};
		var excelData=that.getView().getModel("oModel").getData().searchDtoList;
		payload.rfsSearchList=excelData;
		var payload= {
		 "rfsSearchList":
		    {	     
		          "reqNo":"req111",
		          "requestType":"full",
		          "userType":"INTERNAL",
		          "requesterId":"kaust1@test.com",
		          "statusDesc":"status desctiption 1"
		       }
		  };
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
		 $("a#linkDownloadReportAsExcel").show();
		var ByteArray = excelFiledata.fileData.fileByteArray;
		var u8_2 = new Uint8Array(atob(ByteArray).split("").map(
		function(c) {
		return c.charCodeAt(0);
		}));
		var blob = new Blob( [ u8_2 ]);
		var excelFile_Link = window.URL.createObjectURL(blob);
		$("a#linkDownloadReportAsExcel").prop("href", excelFile_Link);
		}
		},*/
		
		dwnldExcel : function(){
			var that = this;
			/*var repData = that.getView().getModel("oModel").getData();
			var quoteExst = false;
			if(repData.searchDtoList){
			for(var i=0;i<repData.searchDtoList.length;i++){
				if(repData.searchDtoList[i].aimOfStudy && repData.searchDtoList[i].aimOfStudy.indexOf("“")>-1){
					repData.searchDtoList[i].aimOfStudy.replace('“', '"');
					repData.searchDtoList[i].aimOfStudy.replace('”', '"');
					quoteExst = true;
				}
			}
			if(quoteExst){
			that.getView().getModel("oModel").setData(repData);}
			}*/
			var oExport = new  sap.ui.core.util.Export({
			// Type that will be used to generate the content. Own ExportType's can be created to support other formats
			exportType : new  sap.ui.core.util.ExportTypeCSV({
				separatorChar : ","
			}),
			// Pass in the model created above
			models : this.getView().getModel("oModel"),
			// binding information for the rows aggregation
			rows : {
				path : "/searchDtoList"
			},

			// column definitions with column name and binding info for the content
			columns : [{
				name : "RFS Number",
				template : {
					content : "{reqNo}"
				}
			} ,{
				name : "User Type",
				template : {
					content : "{userType}"
				}
			},
			{
				name : "Organization Type",
				template : {
					content : "{orgTypeNm}"
				}     
			},
			{
				name : "Country",
				template : {
					content : "{countryNm}"             
				}
			}, 
			{
				name : "Sample Received",
				template : {
					content : "{numberOfSamples}"
				}
			}, 
			{
				name : "RFS Status",
				template : {
					content : "{statusDesc}"
				}
			}, 
			{
				name : "RFS Sub Status",
				template : {
					content : "{subStatus}"
				}
			},
			{
				name : "Service Charge",
				template : {
					content : "{serviceCharge}"
				}
			},
			{
				name : "Service Rating",
				template : {
					content : "{serviceRating}"
				}
			},
			{
				name : "Start Date",
				template : {
					content : {
						parts: ["createdDate"],
						formatter : function(value){
							if(value){
								var formattedDate = value.substr(8,2)+"/"+value.substr(5,2)+"/"+value.substr(0,4);
									return formattedDate;
								/*jQuery.sap.require("sap.ui.core.format.DateFormat");
								var newValue = new Date(value);
								var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "MM/dd/yyyy"});
								var formattedDate = oDateFormat.format(newValue);
								if(formattedDate === "11/30/0002"){
									return null;
								}
								else{
									return formattedDate;
								}*/
							}
							else{
								return null;
							}
						}
					}
				}
			},
			{
				name : "Completed Date",
				template : {
					content : {
						parts: ["completedDate"],
						formatter : function(value){
							if(value){
								var formattedDate = value.substr(8,2)+"/"+value.substr(5,2)+"/"+value.substr(0,4);
								return formattedDate;
							}else{
								return null;
							}
						}
					}
				}
			},
			{
				name : "Lab Name",
				template : {
					content : "{labId}"
				}
			},
			{
				name : "Turnaround Time(Days)",
				template : {
					content : "{turnAroundTime}"
				}
			},
			{
				name : "User Name",
				template : {
					content : "{userName}"
				}
			},
			{
				name : "User KAUST ID",
				template : {
					content : "{kaustId}"
				}
			},
			{
				name : "User Email ID",
				template : {
					content : "{emailId}"
				}
			},{
				name : "User Department",
				template : {
					content : "{deptNm}"
				}
			},{
				name : "User Telephone",
				template : {
					content : "{telephone}"
				}
			},{
				name : "User Mobile",
				template : {
					content : "{mobile}"
				}
			},{
				name : "User Position",
				template : {
					content : "{position}"
				}
			},
			,
			{
				name : "Pocket ID",
				template : {
					content : "{requesterPocketId}"
				}
			},{
				name : "User Organization Name",
				template : {
					content : "{orgNm}"
				}
			},{
				name : "User Post Code",
				template : {
					content : "{postCode}"
				}
			}
			,{
				name : "User Address",
				template : {
					content : "{address}"
				}
			},{
				name : "PI Name",
				template : {
					content : "{piName}"
				}
			},{
				name : "PI KAUST ID",
				template : {
					content : "{piKaustId}"
				}
			}
			,{
				name : "PI Email ID",
				template : {
					content : "{piEmailId}"
				}
			}
			,{
				name : "PI Telephone",
				template : {
					content : "{piTelephone}"
				}
			}
			,{
				name : "PI Type of Organization",
				template : {
					content : "{piOrgTypeNm}"
				}
			}
			,{
				name : "PI Organization Name",
				template : {
					content : "{piOrgNm}"
				}
			}
			,{
				name : "PI User Type",
				template : {
					content : "{piUserType}"
				}
			},{
				name : "PI Country",
				template : {
					content : "{piCountryNm}"
				}
			},{
				name : "PI Post Code",
				template : {
					content : "{piPostCode}"
				}
			},{
				name : "PI Address",
				template : {
					content : "{piAddress}"
				}
			},
			{
				name : "Service Area",
				template : {
					content : "{serviceAreaDesc}"
				}
			},
			{
				name : "Requested Completion Date",
				template : {
					content : {
						parts: ["requestedCompletionDate"],
						formatter : function(value){
							if(value){
								var formattedDate = value.substr(8,2)+"/"+value.substr(5,2)+"/"+value.substr(0,4);
								return formattedDate;
							}else{
								return null;
							}
						}
					}
				}
			},
			{
				name : "Aim of Study",
				template : {
					content : "{aimOfStudy}"
				}
			},
			{
				name : "Expected Data/Deliverables",
				template : {
					content : "{expectedData}"
				}
			},
			{
				name : "Method",
				template : {
					content : "{method}"
				}
			},
			{
				name : "Job Type",
				template : {
					content : "{workshopDesc}"
				}
			},
			{
				name : "Design Attached",
				template : {
					content : {
						parts: ["isDesignAttached"],
						formatter : function(value){
							if(value=="true"){
								return "Yes";
							}else if (value=="false"){
								return "No";
							}else{
								return "";
							}
						}
					}
				}
			},{
				name : "Design Approved by PI",
				template : {
					content : {
						parts: ["isDesignApprovedByPI"],
						formatter : function(value){
							if(value=="true"){
								return "Yes";
							}else if (value=="false"){
								return "No";
							}else{
								return "";
							}
						}
					}
				}
			},
			{
				name : "Samples/Data Specifications",
				template : {
					content : "{sampleDataSpecifications}"
				}
			},
			{
				name : "Specific Instructions",
				template : {
					content : "{specificInstruction}"
				}
			},
			{
				name : "Sample Origin",
				template : {
					content : "{sampleOrigin}"
				}
			},
			{
				name : "Sample Name",
				template : {
					content : "{sampleNm}"
				}
			},
			{
				name : "Return Samples",
				template : {
					content : {
						parts: ["isReturnSamples"],
						formatter : function(value){
							if(value=="true"){
								return "Yes";
							}else if (value=="false"){
								return "No";
							}else{
								return "";
							}
						}
					}
				}
			},{
				name : "Delivery Mode",
				template : {
					content : "{deliveryModeDesc}"
				}
			},
			{
				name : "Report",
				template : {
					content : "{reportDesc}"
				}
			},
			{
				name : "Routine/Standard",
				template : {
					content : {
						parts: ["isRoutineStandard"],
						formatter : function(value){
							if(value=="true"){
								return "Yes";
							}else if (value=="false"){
								return "No";
							}else{
								return "";
							}
						}
					}
				}
			},
			{
				name : "Advance/Custom",
				template : {
					content : {
						parts: ["isAdvanceCustom"],
						formatter : function(value){
							if(value=="true"){
								return "Yes";
							}else if (value=="false"){
								return "No";
							}else{
								return "";
							}
						}
					}
				}
			},
			{
				name : "Sample Clarifications",
				template : {
					content : "{sampleClarification}"
				}
			},
			{
				name : "Method Applied",
				template : {
					content : "{methodApplied}"
				}
			},
			{
				name : "Deliverables",
				template : {
					content : "{deliverable}"
				}
			},
			{
				name : "Sample storage location and condition",
				template : {
					content : "{storageLocation}"
				}
			},
			{
				name : "Estimated Completion Date",
				template : {
					content : {
						parts: ["estCompletionDate"],
						formatter : function(value){
							if(value){
								var formattedDate = value.substr(8,2)+"/"+value.substr(5,2)+"/"+value.substr(0,4);
								return formattedDate;
							}else{
								return null;
							}
						}
					}
				}
			},
			{
				name : "IBEC Approval Required",
				template : {
					content : {
						parts: ["isIBECApprovalReqd"],
						formatter : function(value){
							if(value=="true"){
								return "Yes";
							}else if (value=="false"){
								return "No";
							}else{
								return "";
							}
						}
					}
				}
			},
			{
				name : "Materials Transport Agreement Required",
				template : {
					content : {
						parts: ["isMatTranAgreemntReqd"],
						formatter : function(value){
							if(value=="true"){
								return "Yes";
							}else if (value=="false"){
								return "No";
							}else{
								return "";
							}
						}
					}
				}
			},
			{
				name : "Final Scope Charge",
				template : {
					content : "{finalScopeCharge}"
				}
			},
			{
				name : "Report Number",
				template : {
					content : "{reportId}"
				}
			},
			{
				name : "Service Scope",
				template : {
					content : "{serviceScope}"
				}
			},
			{
				name : "Samples",
				template : {
					content : "{samples}"
				}
			},
			{
				name : "Summary of Analytical Methods",
				template : {
					content : "{summaryOfAnalyticalMethods}"
				}
			}
			]
		});

		// download exported file
			oExport.saveFile("KAUST_RFS_Detailed_Report");
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
		/*if(that.busyDialog){
			that.busyDialog.open();
		}*/
		var rfsNo = oEvt.getSource().getText();
		that.oRouter.navTo("RFSFormTask",{id: rfsNo});
		//that.busyDialog.close();
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
		
		oCombo = this.getView().byId("dateRange");
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
		that.getView().byId("dateRange").$().find("input").attr("readonly", true);
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf corelabs.Report
*/
//	onExit: function() {
//
//	}
	
	/** 
     *  Edited by Darshna on 07/07/2017 - Trim the string for whitespace at the start and end 
     *  onDepartmentChange event triggered on change of the Department field 
    */ 
    onDepartmentChange: function(oEvent){ 
        trimUiInputVal(oEvent); 
    }

});