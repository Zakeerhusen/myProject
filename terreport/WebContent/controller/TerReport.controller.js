jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("sap.m.MessageBox");
sap.ui.controller("kaust.ui.kitsterreport.controller.TerReport", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf kaust.ui.kitsterreport.controller.TerReport
*/
	onInit: function() {
		if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		var oRoomModel = new sap.ui.model.json.JSONModel();
		var url = "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/TerProcessReportSet?$filter=subServiceCode eq '0052'";
		oRoomModel.loadData(url, null, false);
		oRoomModel.iSizeLimit = oRoomModel.getData().d.results.length; 
		this.getView().setModel(oRoomModel);
		if(oRoomModel.iSizeLimit > 0){
			this.byId("idRequestCount").setText("Request Count ("+oRoomModel.iSizeLimit+")");
			this.byId("idRequestCount").setVisible(true);
		}else{
			this.byId("idRequestCount").setVisible(false);
		}
		this.initializeControlsReadOnly();
	},
	
	/**
	 * initializeControlsReadOnly to not allowing to input from keys 
	 */
	initializeControlsReadOnly : function(){
		var oCombo = this.getView().byId("dateRange");
		oCombo.addEventDelegate( {
			onAfterRendering : function() {
				var oComboInner = this.$().find('.sapMInputBaseInner');
				var oID = oComboInner[0].id;
				$('#' + oID).attr("readOnly", true);
				this.$().find("input").attr("readonly", true);
			}
		}, oCombo);
	},
	
	/**
	 * onReportSort to open the fragment for sorting paramenters
	 */
	_oDialog1 : "",
	onReportSort : function(){
		if (!this._oDialog1) {
			this._oDialog1 = sap.ui.xmlfragment("kaust.ui.kitsterreport.fragments.ReportSorting", this);
		}
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog1);
		this.getView().addDependent(this._oDialog1);
		this._oDialog1.open();
	},
	
	/**
	 * to show request data with all fields
	 */
	_oDialog2 : "",
	openDialog : function(oEvent){
		if (!this._oDialog2) {
			this._oDialog2 = sap.ui.xmlfragment("kaust.ui.kitsterreport.fragments.RequestDetails", this);
		}
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog2);
		this.getView().addDependent(this._oDialog2);
		var bindingInfo = oEvent.getSource().getBindingContext();
		var requestData = bindingInfo.getModel().getProperty(bindingInfo.sPath);
		var oRequestDataModel = new sap.ui.model.json.JSONModel();
		oRequestDataModel.setData(requestData);
		sap.ui.getCore().byId("requestForm").setModel(oRequestDataModel,"oRequestDataModel");
		this._oDialog2.open();
	},
	
	/**
	 * reportSort to sort the table elements
	 */
	reportSort : function(oEvent) {
		var oView = this.getView();
		var oTable = oView.byId("idTERReportTable");
		var mParams = oEvent.getParameters();
		var oBinding = oTable.getBinding("items");
		var aSorters = [];
		if (mParams.groupItem) {
			var sPath = mParams.groupItem.getKey();
			var bDescending = mParams.groupDescending;
			var vGroup = this.mGroupFunctions[sPath];
			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));
		}
		var sPath = mParams.sortItem.getKey();
		var bDescending = mParams.sortDescending;
		aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
		oBinding.sort(aSorters);
	},
	
	/**
	 * searchOrdDetails to filter the data
	 */
	searchDetails : function(oEvt){
		var searchValue = oEvt.getSource().getValue();
		searchValue = searchValue.toLowerCase();
	    var items = this.getView().byId("idTERReportTable").getItems();
	    var v;
	    var count = 0;
	    var g = null;
	    var C = 0;
	    for (var i = 0; i < items.length; i++) {
	        if (items[i] instanceof sap.m.GroupHeaderListItem) {
	            if (g) {
	                if (C == 0) {
	                    g.setVisible(false);
	                } else {
	                    g.setVisible(true);
	                    g.setCount(C);
	                }
	            }
	            g = items[i];
	            C = 0;
	        } else {
	            v = this.applySearchPatternToListItem(items[i], searchValue);
	            items[i].setVisible(v);
	            if (v) {
	                count++;
	                C++;
	            }
	        }
	    }
	    if (g) {
	        if (C == 0) {
	            g.setVisible(false);
	        } else {
	            g.setVisible(true);
	            g.setCount(C);
	        }
	    }
	    return count;
	},
	
	applySearchPatternToListItem: function(i, searchValue) {
	    if (searchValue == "") {
	        return true;
	    }
	    var property = this.getView().getModel().getData().d.results[i.getBindingContextPath().split("/")[3]];
	    for (var k in property) {
	        var v = property[k];
	    	if (typeof v == "string") {
	            if (v.toLowerCase().indexOf(searchValue) != -1) {
	                return true;
	            }
	        }
	    }
	    return false;
	},
	
	/**
	 * onReportSearch to search based on creation date range
	 */
	onReportSearch : function(){
		var fromDate = this.getView().byId("dateRange").getDateValue();
		var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            pattern : "yyyy-MM-ddTHH:mm:ss"
		});
		if(fromDate){
			var utc= fromDate.getTime() - (fromDate.getTimezoneOffset() * 60000);
			fromDate= new Date(utc + (3600000));
			fromDate= oDateFormat.format(fromDate,true); 
		}
		var toDate = this.getView().byId("dateRange").getSecondDateValue();
		if(toDate){
			var utc= toDate.getTime() - (toDate.getTimezoneOffset() * 60000);
			toDate= new Date(utc + (3600000));
			toDate= oDateFormat.format(toDate,true); 
		}
		if(fromDate !=null && toDate !=null){
			var currentDate =  Date.parse(new Date());
			if(Date.parse(this.getView().byId("dateRange").getDateValue()) > currentDate ||Date.parse(this.getView().byId("dateRange").getSecondDateValue()) > currentDate){
				sap.m.MessageBox.show("Date should not be greater than Today's date", {
          	        icon: sap.m.MessageBox.Icon.WARNING,
          	        title: "Warning",
          	        actions: [sap.m.MessageBox.Action.OK],
          	      }
          	    );
				return ;
			}
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			jQuery.sap.delayedCall(100, this , function () {
			var oRoomModel = new sap.ui.model.json.JSONModel();
			var url = "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/TerProcessReportSet?$filter=subServiceCode eq '0052' and requestDateFrom eq datetime'"+fromDate+"' and requestDateTo eq datetime'"+toDate+"'";
			oRoomModel.loadData(url, null, false);
			oRoomModel.iSizeLimit = oRoomModel.getData().d.results.length; 
			this.getView().setModel(oRoomModel);
			if(oRoomModel.iSizeLimit > 0){
				this.getView().byId("idRequestCount").setText("Request Count ("+oRoomModel.iSizeLimit+")");
				this.getView().byId("idRequestCount").setVisible(true);
			}else{
				this.getView().byId("idRequestCount").setVisible(false);
			}
			busyDialog.close();
			});
		}else{
			sap.m.MessageBox.show("Please select from Date and to Date in Date Range", {
	          	        icon: sap.m.MessageBox.Icon.WARNING,
	          	        title: "Warning",
	          	        actions: [sap.m.MessageBox.Action.OK],
	          	      }
	          	    );
		}
		
	},
	
	/**
	 * onReportSearchAll to retrive all data
	 */
	onReportSearchAll : function(){
		this.getView().byId("dateRange").setValue("");
		var busyDialog = new sap.m.BusyDialog();
		busyDialog.open();
		jQuery.sap.delayedCall(100, this , function () {
		var oRoomModel = new sap.ui.model.json.JSONModel();
		var url = "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/TerProcessReportSet?$filter=subServiceCode eq '0052'";
		oRoomModel.loadData(url, null, false);
		oRoomModel.iSizeLimit = oRoomModel.getData().d.results.length; 
		this.getView().setModel(oRoomModel);
		if(oRoomModel.iSizeLimit > 0){
			this.getView().byId("idRequestCount").setText("Request Count ("+oRoomModel.iSizeLimit+")");
			this.getView().byId("idRequestCount").setVisible(true);
		}else{
			this.getView().byId("idRequestCount").setVisible(false);
		}
		busyDialog.close();
		});
	},
	
	/**
	 * onExcelDownload to export as CSV file
	 */
	onExcelDownload : function(){
		var oExport = new sap.ui.core.util.Export({
		exportType : new sap.ui.core.util.ExportTypeCSV({
			separatorChar : ","
		}),
		models : this.getView().getModel(),
		rows : {
			path : "/d/results"
		},
		columns : [{
			name : "Request ID",
			template : {
				content : "{RequestId}"
			}
		},{
			name : "Requester Name",
			template : {
				content : {
				parts: ["FirstName","MiddleName","LastName"],
				formatter : function(fn,mn,ln){
					if(fn!=""&& fn!=null && fn!=undefined){
						return fn+" "+mn+" "+ln;
					}
					else{
						return "";
					}
				}
		}
			}
		},{
			name : "Username",
			template : {
				content : "{userId}"
			}
		},
		{
			name : "User Mobile Phone",
			template : {
				content : {	
				parts: ["Mobile"],
					formatter : function(mobile){
						if(mobile !=""){
							return "'"+mobile+"'";
						}else{
							return "";
						}
					}
				}
			}
		},
		{
			name : "Ticket Number",
			template : {
				content : "{RequestIdTic}"
			}
		},{
			name : "ITNC Operation Team",
			template : {
				content : "{itncTeamApprover}"
			}
		},
		{
			name : "Start Date and Time",
			template : {
				content : {
					parts: ["StartDate","StartTime"],
					formatter : function(date, time){
						if(date !=""){
							var dateTime = new Date(parseInt(time)).toString();
							return date+" "+dateTime.split(" ")[4];
						}else{
							return date;
						}
					}
				}
			}
		},{
			name : "Creation Date",
			template : {
				content : "{createDate}"
				}
		},{
			name : "End Date and Time",
			template : {
				//content : "{EndDate}"
					content : {
						parts: ["EndDate","EndTime"],
						formatter : function(date, time){
							if(date !=""){
								var dateTime = new Date(parseInt(time)).toString();
								return date+" "+dateTime.split(" ")[4];
							}else{
								return date;
							}
						}
					}
			}
		},/*{
			name : "End Time",
			template : {
				content : "{EndTime}"
			}
		},*/{
			name : "Actual End Time",
			template : {
				content : "{actualEndTime}"
					}
		},{
			name : "Time Efficiency with 20% flexibility",
			template : {
				content : "{venActivityExten}"
			}
		},{
			name : "No Show-up",
			template : {
				content : "{ven_presence}"
			}
		},{
			name : "Missing tools",
			template : {
				content : "{toolMissingVen}"
			}
		},{
			name : "I am part of team accessing TER/ MTER",
			template : {
				content : "{IsReqtAccReq}"
			}
		},{
			name : "Other team members also require access?",
			template : {
				content : "{IsOtherTeamAccReq}"
			}
		},{
			name : "Location (Building)",
			template : {
				content : "{Building}"
			}
		},{
			name : "Location (Level)", 
			template : {
				content : "{Level}"
			}
		},{
			name : "Location (TER Room Number)",
			template : {
				content : "{Room}"
			}
		},{
			name : "SOW (Power Activity)",
			template : {
				content : "{sowPowerActivity}"
			}
		},{
			name : "SOW (A/C Maintenance)",
			template : {
				content : "{sowAcMaint}"
			}
		},{
			name : "SOW (TER Cleaning)",
			template : {
				content : "{sowTerClean}"
			}
		},{
			name : "SOW (Cable Pulling and Testing)",
			template : {
				content : "{sowCablePullingTest}"
			}
		},{
			name : "I hereby agree to submit test results for this activity",
			template : {
				content : "{iAgrSubTestRes}"
			}
		},{
			name : "SOW (HSE Inspection)",
			template : {
				content : "{sowHseInspection}"
			}
		},{
			name : "SOW (Others)",
			template : {
				content : "{sowOthers}"
			}
		},{
			name : "Specify Others",
			template : {
				content : "{specifyOthers}"
			}
		},{
			name : "Power Interruption",
			template : {
				content : "{PowerInterrupt}"
			}
		},{
			name : "Primary Circuit (PR)",
			template : {
				content : "{eqpPrimary}"
			}
		},{
			name : "Back-up Circuit (BPR)",
			template : {
				content : "{eqpBackup}"
			}
		},{
			name : "Emergency Circuit (EPR)",
			template : {
				content : "{eqpEmergency}"
			}
		},{
			name : "A/C Interruption (Answer No)",
			template : {
				content : "{AcInterruption}"
			}
		},{
			name : "A/C Interruption(Answer Yes, less than 30 minutes)",
			template : {
				content : "{acInterLtTy}"
			}
		},{
			name : "A/C Interruption (Answer yes, more than 30 minutes)",
			template : {
				content : "{acIntGtTy}"
			}
		},{
			name : "I hereby agree to provide back-up cooling system inside TER for the ITNC Equipment",
			template : {
				content : "{iAgrToProBckClng}"
			}
		},{
			name : "ITNC Equipment Affecting Primary Circuit",
			template : {
				content : "{primaryCircuit}"
			}
		},{
			name : "ITNC Equipment Affecting Back-up Circuit",
			template : {
				content : "{backupCircuit}"
			}
		},{
			name : "ITNC Equipment Affecting Emergency Circuit",
			template : {
				content : "{emergencyCircuit}"
			}
		},{
			name : "Work Permit Number",
			template : {
				content : "{WorkPermit}"
			}
		},{
			name : "VS Control Number",
			template : {
				content : "{vsControlNumber}"
			}
		},{
			name : "Backup power will be provided",
			template : {
				content : "{backPower}"
			}
		},{
			name : "SOW (Survey)",
			template : {
				content : "{sowSurvey}"
			}
		}]
	});
	// download exported file 
		oExport.saveFile("KITS_TER_Report");
	},
	
	onCancelPress: function() {
		this._oDialog2.close();
	},
	
	/**
	 * Formatter for date 
	 */
	getDateTime : function(date, time){
		if(date !=""){
		var dateTime = new Date(parseInt(time)).toString();
		return date+" "+dateTime.split(" ")[4];
		}else{
		return date;
		}
	},
	
	/**
	 * getFulName to concatenate first Name, middle name and last name
	 */
	getFulName : function(fn,mn,ln){
		if(fn!=""&& fn!=null && fn!=undefined){
			return fn+" "+mn+" "+ln;
		}
	},
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf kaust.ui.kitsterreport.controller.TerReport
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf kaust.ui.kitsterreport.controller.TerReport
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf kaust.ui.kitsterreport.controller.TerReport
*/
//	onExit: function() {
//
//	}

});