jQuery.sap.require("sap.m.MessageBox");
sap.ui.controller("kaust.ui.kitsteraccess.controller.TerAccessRequestView", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf kaust.ui.kitsteraccess.TerAccessRequestView
*/
	onInit: function() {
		if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		var oDtTime ="startDateElement";
		var idDtTime = this.getView().byId(oDtTime);
		var requestId = this.getRequestId();
		if(requestId!=""){
			var oDtTimeInput = new sap.m.Input("readStartDateId", {
				enabled:false,
				layoutData: new sap.ui.layout.GridData({span:"L8 M8"})
			});
			idDtTime.addField(oDtTimeInput);
			this.loadTicket(requestId);
	    }else{
	    	var that = this;
			if (sap.ui.version.substr(0,4) === "1.28") {
				var oDtTimeInput = new sap.m.DateTimeInput("idPickupTime", {
					type: "Time",
					valueFormat: "HH:mm",
					displayFormat: "HH:mm",
					value:new Date().getHours()+1+":00",
					placeholder: "{i18n>PICKUP_TIME}",
					layoutData: new sap.ui.layout.GridData({span:"L4 M4"}),
					change : function(){
						that.validateStartDate();
					}
				});
				idDtTime.addField(oDtTimeInput);
				// Giving minute step to the DateTimeInput
				$.scroller.defaults.stepMinute = 15;
				// $.scroller.defaults.stepSecond = 60;
			} else {
				jQuery.sap.require("kaust.ui.kitsteraccess.controller.MyTimePicker");
				var oDtTimePicker = new kaust.ui.kitsteraccess.controller.MyTimePicker("idPickupTime", {
					minutesStep: 15,
					//secondsStep: 60,
					valueFormat: "HH:mm",
					displayFormat: "HH:mm",
					value:new Date().getHours()+1+":00",
					placeholder: "{i18n>PICKUP_TIME}",
					layoutData: new sap.ui.layout.GridData({span:"L4 M4"}),
					change : function(){
						that.validateStartDate();					
					}
				});
				idDtTime.addField(oDtTimePicker);
			}
		this.initializeControlsReadOnly();	
		// Other team members Table Model   
		var oPickUserModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(oPickUserModel, "oPickUserModel");
		
		// VMS Lookup Model
		var oVmsLookupModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(oVmsLookupModel, "oVmsLookupModel");
		
		//Building lookup Model   
		var that = this;
		var oBuildingLookupModel = new sap.ui.model.json.JSONModel();
		oBuildingLookupModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Infra_DetailSet?$format=json", null, true);
		oBuildingLookupModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				that.getView().setModel(oBuildingLookupModel, "oBuildingLookupModel");	
			}
		});
		oBuildingLookupModel.attachRequestFailed(function(oEvent) {
			sap.m.MessageBox.show(oEvent.getParameter("statusCode") + ":" + oEvent.getParameter("statusText"), {
				icon: sap.m.MessageBox.Icon.ERROR,
				title: "Failed to load Building details",
				onClose: null,
				textDirection: sap.ui.core.TextDirection.Inherit
			});
		});
		
		// Scope of Work Model
		var oScopeOfWorkModel = new sap.ui.model.json.JSONModel();
		var aSelScopeOfWork = [];
		oScopeOfWorkModel.setProperty("/aSelScopeOfWork", aSelScopeOfWork);
		this.getView().setModel(oScopeOfWorkModel, "oScopeOfWorkModel");
		
		// User Detail Model
		var oUserModel = new sap.ui.model.json.JSONModel();
		oUserModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/UserDetail?$format=json", null, true);
		oUserModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				that.getView().setModel(oUserModel, "oUserModel");
			}
		});
		oUserModel.attachRequestFailed(function(oEvent) {
			sap.m.MessageBox.show(oEvent.getParameter("statusCode") + ":" + oEvent.getParameter("statusText"), {
				icon: sap.m.MessageBox.Icon.ERROR,
				title: "Failed to load User Detail",
				onClose: null,
				textDirection: sap.ui.core.TextDirection.Inherit
			});
		});
	    }
	},
	
	/**
	 * To get request Id from URL for CRM ticket loading
	 */
	getRequestId : function(){
		var url = (window.location != window.parent.location)? document.referrer: document.location.href;
		var requestId = url.split("requestId=");
		if(requestId.length > 1){
		return requestId[1];
		}else{
			return "";	
		}
	},
	
	/**
	 * onOthers event triggered when user selects the check box for Other Team Members
	 * If selected show VMS Input field. 
	 */
	onOthers : function(oEvent){
		var checked = oEvent.getParameters().selected;
		if(checked){
			this.getView().byId('vmsLblId').setVisible(true);
			this.getView().byId('vmsInpId').setVisible(true);
		//	this.getView().byId('vmsIconId').setVisible(true);
		//	this.getView().byId('vmsInpId').setEnabled(false);       // VMS input is disabled : zakeer
		//	this.getView().byId('vmsIconId').setEnabled(true);
			this.getView().byId('kLblId').setVisible(true);
			this.getView().byId('kInpId').setVisible(true);
		//	this.getView().byId('kIconId').setVisible(true);
		//	this.getView().byId('kIconId').setEnabled(true);
		}else{
			this.getView().byId('vmsLblId').setVisible(false);
			this.getView().byId('vmsInpId').setVisible(false);
			this.getView().byId('vmsInpId').setValue("");
		//	this.getView().byId('vmsIconId').setVisible(false);
			this.getView().byId('othersTblId').setVisible(false);
			this.getView().byId('kLblId').setVisible(false);
			this.getView().byId('kInpId').setVisible(false);
			this.getView().byId('kInpId').setValue("");
		//	this.getView().byId('kIconId').setVisible(false);
		}
	},
	
	/**
	 * loadTicket to load view for CRM ticket
	 */
	loadTicket : function(requestId){
		//var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		//Ticket detail
		var oDataModel = new sap.ui.model.json.JSONModel();
		oDataModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/TERRequestSet?$filter=RequestId eq '"+requestId+"'&$expand=TERToPow,TERToTmm,TERToSow&$format=json", null, false);
		this.getView().setModel(oDataModel,"oDataModel");
		var data = oDataModel.getData().d.results[0];
		
		if(data!=null){
			this.getView().byId('workPermitId').setValue(data.WorkPermit);
			this.getView().byId('workPermitId').setTooltip(data.WorkPermit);
			if(data.IsReqtAccReq=="X"){this.getView().byId('partOfTeamId').setSelected(true);}
			if(data.IsOtherTeamAccReq=="X"){this.getView().byId('othersId').setSelected(true);}
			if(data.TERToTmm.results.length > 0){
				this.getView().byId('othersId').setSelected(true);
				this.getView().byId('othersTblId').setVisible(true);
				this.getView().byId('othersTblId').setMode("None");
				var pHistory = this.getView().byId('othersTblId');
				pHistory.unbindItems();
				var oVmsLookupModel= new sap.ui.model.json.JSONModel();
				oVmsLookupModel.setProperty("/results",data.TERToTmm.results);
				pHistory.setModel(oVmsLookupModel);
			    pHistory.bindAggregation("items", "/results", new sap.m.ColumnListItem({
			        cells:[new sap.m.Text({
			                   text:"{KaustID}"
			               }),
			               new sap.m.Text({
			                   text:"{Name}"
			               })]
			    }));
			}
			
			if(data.StartTime!=""){
				this.getView().byId('startDateId').setVisible(false);
				var startDateDisp = new Date(parseInt(data.StartTime)).toString();
				startDateDisp = startDateDisp.split(":00 ");
				sap.ui.getCore().byId('readStartDateId').setValue(startDateDisp[0]);
			}
			if(data.EndTime!=""){
				var startDate = new Date(parseInt(data.StartTime));
				var endDate = new Date(parseInt(data.EndTime));
				var diff= endDate.getDate()-startDate.getDate();
				if(diff == 0){
					this.getView().byId('endDateId').setValue('Same day');
				}else{
					this.getView().byId('endDateId').setValue('Next day');
				}
			}
			
			this.getView().byId('buildingId').setValue(data.Building);
			this.getView().byId('levelSelId').setValue(data.Level);
			this.getView().byId('terRoomId').setValue(data.Room);
			
			this.getView().byId('buildingId').setTooltip(data.Building);
			this.getView().byId('levelSelId').setTooltip(data.Level);
			this.getView().byId('terRoomId').setTooltip(data.Room);
			
			var result = this.getFields(data.TERToSow.results, "scopeOfWork");
			if(result.indexOf("Power Activity/ Survey")!=-1){
				this.getView().byId('powerActId').setSelected(true);
				var resultObject = this.search("Power Activity/ Survey", data.TERToSow.results);
				this.getView().byId('pwrLbl').setVisible(true);
				this.radioBtn = new sap.m.RadioButtonGroup("pwrRdBtn",{
					buttons:[
						new sap.m.RadioButton({text:"No"}),
						new sap.m.RadioButton({text:"Yes"})
					],
					enabled: false
				});
				var vBox = this.getView().byId("pwrActVbox").insertItem(this.radioBtn,2);
				//this.getView().byId('pwrRdBtn').setVisible(true); 
				sap.ui.getCore().byId('pwrRdBtn').setSelectedIndex(parseInt(resultObject.powerBackup));
			}
			if(result.indexOf("A/C Maintenance")!=-1){
				this.getView().byId('acMaintId').setSelected(true);
			}
			if(result.indexOf("TER Cleaning")!=-1){
				this.getView().byId('terCleanId').setSelected(true);
			}
			if(result.indexOf("Cable Pulling and Testing")!=-1){
				this.getView().byId('cblChkId').setSelected(true);
				this.getView().byId('cblAgreeId').setVisible(true);
				this.getView().byId('cblAgreeId').setSelected(true);
			}
			if(result.indexOf("HSE Inspection")!=-1){
				this.getView().byId('hseInspectId').setSelected(true);
			}
			if(result.indexOf("Others")!=-1){
				this.getView().byId('otherChkId').setSelected(true);
				var resultObject = this.search("Others", data.TERToSow.results);
				this.getView().byId('othersTextId').setVisible(true);
				this.getView().byId('othersTextId').setValue(resultObject.sowComments);
				this.getView().byId('othersTextId').setTooltip(resultObject.sowComments);
			}
			if(data.PowerInterrupt=="X"){
				this.getView().byId("PowerRadioGrpId").setSelectedIndex(1);
				this.getView().byId('pwrChkBoxId').setVisible(true);
				var powRes = data.TERToPow.results;
				if(powRes.length > 0){
					for(var i=0; i<powRes.length; i++ ){
						if(powRes[i].CircuitType=="PR"){
							this.getView().byId('prCbId').setSelected(true);
							this.getView().byId('inpPrId').setVisible(true);
							this.getView().byId('inpPrId').setValue(powRes[i].EquipmentNumber);
							this.getView().byId('inpPrId').setTooltip(powRes[i].EquipmentNumber);
						}
						if(powRes[i].CircuitType=="BPR"){
							this.getView().byId('brCbId').setSelected(true);
							this.getView().byId('inpBrId').setVisible(true);
							this.getView().byId('inpBrId').setValue(powRes[i].EquipmentNumber);
							this.getView().byId('inpBrId').setTooltip(powRes[i].EquipmentNumber);
						}
						if(powRes[i].CircuitType=="EPR"){
							this.getView().byId('eprCbId').setSelected(true);
							this.getView().byId('inpEcId').setVisible(true);
							this.getView().byId('inpEcId').setValue(powRes[i].EquipmentNumber);
							this.getView().byId('inpEcId').setTooltip(powRes[i].EquipmentNumber);
						}
					}
				}
			}else{
				this.getView().byId("PowerRadioGrpId").setSelectedIndex(parseInt(data.PowerInterrupt));
			}
			this.getView().byId("acIntRadioGrpId").setSelectedIndex(parseInt(data.AcInterruption));
			if(data.AcInterruption=="2"){
				this.getView().byId('acAgreeId').setSelected(true);
				this.getView().byId('acAgreeId').setVisible(true);
			}
			if(data.ven_presence!=""){
				if(data.venActivityExten == "X"){
					data.venActivityExten = 0;
				}else{data.venActivityExten = 1;}
				if(data.toolMissingVen == "X"){
					data.toolMissingVen = 0;
				}else{data.toolMissingVen = 1;}
				this.getView().byId('nwEngHeader').setVisible(true);
				this.getView().byId('nwFeedBack').setVisible(true);
				this.getView().byId("vendorShowUp").setSelectedIndex(parseInt(data.ven_presence));
				this.getView().byId("vendorExTime").setSelectedIndex(data.venActivityExten);
				this.getView().byId("toolbyVendor").setSelectedIndex(data.toolMissingVen);
			}
			this.disableAllTERFields();
		}
		// User Detail Model
		var oUserModel = new sap.ui.model.json.JSONModel();
		oUserModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='"+data.kaustId+"',UserId='')?$format=json", null, false);
		var userData = oUserModel.getData().d;
		if(userData){
			this.getView().byId('fName').setText(userData.FirstName);
			this.getView().byId('lName').setText(userData.LastName);
			this.getView().byId('kaustId').setText(userData.KaustID);
			this.getView().byId('email').setText(userData.Email);
			this.getView().byId('pos').setText(userData.Position);
			this.getView().byId('dept').setText(userData.Deptname);
			this.getView().byId('costCenter').setText(userData.Costcenter);
			this.getView().byId('officeId').setText(userData.Office);
			this.getView().byId('mobileId').setText(userData.Mobile);
		}
	},
	
	/**
	 * initializeControlsReadOnly to not allowing to input from keys 
	 */
	initializeControlsReadOnly : function(){
		var oCombo = this.getView().byId("startDateId");
		oCombo.addEventDelegate( {
			onAfterRendering : function() {
				var oComboInner = this.$().find('.sapMInputBaseInner');
				var oID = oComboInner[0].id;
				$('#' + oID).attr("readOnly", true);
				this.$().find("input").attr("readonly", true);
			}
		}, oCombo);

		oCombo = this.getView().byId("buildingId");
		oCombo.addEventDelegate( {
			onAfterRendering : function() {
				var oComboInner = this.$().find('.sapMInputBaseInner');
				var oID = oComboInner[0].id;
				$('#' + oID).attr("readOnly", true);
				this.$().find("input").attr("readonly", true);
			}
		}, oCombo);
		
		oCombo = this.getView().byId("levelSelId");
		oCombo.addEventDelegate( {
			onAfterRendering : function() {
				var oComboInner = this.$().find('.sapMInputBaseInner');
				var oID = oComboInner[0].id;
				$('#' + oID).attr("readOnly", true);
				this.$().find("input").attr("readonly", true);
			}
		}, oCombo);
		
		oCombo = this.getView().byId("terRoomId");
		oCombo.addEventDelegate( {
			onAfterRendering : function() {
				var oComboInner = this.$().find('.sapMInputBaseInner');
				var oID = oComboInner[0].id;
				$('#' + oID).attr("readOnly", true);
				this.$().find("input").attr("readonly", true);
			}
		}, oCombo);
		
		oCombo = this.getView().byId("endDateId");
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
	 * getFields to get scope of work fields and putting in an array to pass in submission payload
	 */
	 getFields :function(input, field) {
		    var output = [];
		    for (var i=0; i < input.length ; ++i)
		        output.push(input[i][field]);
		    return output;
		},
		
	/**
	 * searching SoW fileds
	 */	
	search: function (nameKey, myArray){
		    for (var i=0; i < myArray.length; i++) {
		        if (myArray[i].scopeOfWork === nameKey) {
		            return myArray[i];
		        }
		    }
		},
	
	/**
	 * onBuildingChange event is triggered on selection of Building name.
	 * Once building is selected the Levels will be fetched.
	 */	
	onBuildingChange : function(oEvent) {
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		this.getView().byId('levelSelId').destroyItems();
		this.getView().byId('terRoomId').destroyItems();
		this.getView().byId('levelSelId').setValue();
		this.getView().byId('terRoomId').setValue();
		this.getView().byId('levelSelId').clearSelection();
		this.getView().byId('terRoomId').clearSelection();
		
		var that = this;
		if (oEvent.getSource().getSelectedItem()) {
			var building= oEvent.getSource().getSelectedItem().getText();
			var oLevelLookupModel = new sap.ui.model.json.JSONModel();
			oLevelLookupModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Infra_DetailSet?$filter=KBuilding eq '"+building+"'&$format=json", null, true);
			
			oLevelLookupModel.attachRequestCompleted(function(oEvent) {
				if (oEvent.getParameter("success")) {
					that.getView().setModel(oLevelLookupModel, "oLevelLookupModel");
					that.getView().byId("levelSelId").setEnabled(true);
					that.getView().byId("terRoomId").setEnabled(false);
				}
			});
			
			oLevelLookupModel.attachRequestFailed(function(oEvent) {
				sap.m.MessageBox.show(oEvent.getParameter("statusCode") + ":" + oEvent.getParameter("statusText"), {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: oResourceModel.getText("ERR_LEV"),
					onClose: null,
					textDirection: sap.ui.core.TextDirection.Inherit
				});
			});
		} else {
		//	that.byId("levelSelId").setEnabled(false);
		}
		that.resetITNCFields();
	},
	
	/**
	 * onLevlChange event is triggered on selection of Level name.
	 * Once Level is selected TER Room Number will be fetched.
	 */
	onLevlChange : function(oEvent) {
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var that = this;
		that.getView().byId('terRoomId').destroyItems();
		that.getView().byId('terRoomId').setValue();
		that.getView().byId('terRoomId').clearSelection();
		
		if (oEvent.getSource().getSelectedItem()) {
			var building = that.getView().byId('buildingId').getSelectedItem().getText(); 
			var level= oEvent.getSource().getSelectedItem().getText();
			
			var oRoomLookupModel = new sap.ui.model.json.JSONModel();
			oRoomLookupModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Infra_DetailSet?$filter=KBuilding eq '"+building+"' and KLevel eq '"+level+"'&$format=json", null, true);
			oRoomLookupModel.attachRequestCompleted(function(oEvent) {
				if (oEvent.getParameter("success")) {
					that.getView().setModel(oRoomLookupModel, "oRoomLookupModel");
					that.getView().byId("terRoomId").setEnabled(true);
				}
			});
			oRoomLookupModel.attachRequestFailed(function(oEvent) {
				sap.m.MessageBox.show(oEvent.getParameter("statusCode") + ":" + oEvent.getParameter("statusText"), {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: oResourceModel.getText("ERR_ROOM"),
					onClose: null,
					textDirection: sap.ui.core.TextDirection.Inherit
				});
			});
		} else {
		//	that.byId("terRoomId").setEnabled(false);
		}
		that.resetITNCFields();
	},
	
	/**
	 * If room is changed corresponding ITNC equipments to be reset
	 */
	onRoomChange : function(){
		this.resetITNCFields();
	},
	
	/**
	 * onOtherWorkInfo event is triggered on selection of Others in Work Information.
	 * If selected the user need to specify the other text as well, so making the input field visible.
	 */
	onOtherWorkInfo : function(oEvent){
		var bChecked = oEvent.getParameter("selected");
		if (bChecked) {
			this.byId("othersTextId").setVisible(true);
		} else {
			this.byId("othersTextId").setVisible(false);
			this.byId("othersTextId").setValue("");
		}
		this.onScopeOfWork(oEvent);
	},
	
	/***
	 *  onOtherSpecify event is triggered from the Specify Other Input field for Work Information (SOW).
	 *  If the others is selected the input field value should be sent in Scope of Work Model comment
	 *  section. 
	 */
	onOtherSpecify : function(oEvent) {
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var aSelScopeOfWork = this.getView().getModel("oScopeOfWorkModel").getProperty("/aSelScopeOfWork");
		aSelScopeOfWork.forEach(function(oEle){
			if(oEle.scopeOfWork === oResourceModel.getText("OTHERS")){
				oEle.sowComments = oEvent.getParameter("value").trim();
			}
		});
	},
	
	/***
	 *  onPowerBackup event is triggered Radio button group under Power Activity.
	 */
	onPowerBackup : function(oEvent) {
		var that = this;
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var aSelScopeOfWork = this.getView().getModel("oScopeOfWorkModel").getProperty("/aSelScopeOfWork");
		aSelScopeOfWork.forEach(function(oEle){
			if(oEle.scopeOfWork === oResourceModel.getText("POW_ACT_SUR")){
			//	oEle.powerBackup = oEvent.getParameter("selectedIndex");
				oEle.powerBackup = sap.ui.getCore().byId("pwrRdBtn").getSelectedIndex();
			}
		});
	},

	/**
	 * onCablePulling event triggered when user selects the Cable Pulling and Testing check box
	 * If selected the user must select the disclaimer which is made visible via this method. 
	 */
	onCablePulling :function(oEvent){
		var checked = oEvent.getParameters().selected;
		if(checked){
			this.byId('cblAgreeId').setVisible(true);
		}else{
			this.byId('cblAgreeId').setVisible(false);
			this.byId('cblAgreeId').setSelected(false);
		}
		this.onScopeOfWork(oEvent);
	},
	
	/**
	 * onPowerActivity event triggered radio button to be shown 
	 */
	onPowerActivity : function(oEvent){
		var that = this;
		var checked = oEvent.getParameters().selected;
		if(checked){
			this.byId('pwrLbl').setVisible(true);
			//this.byId('pwrRdBtn').setVisible(true);
			 this.radioBtn = new sap.m.RadioButtonGroup("pwrRdBtn",{
				buttons:[
					new sap.m.RadioButton({text:"No"}),
					new sap.m.RadioButton({text:"Yes"})
				],
				select: function(){
					that.onPowerBackup();
				}
			});
			var vBox = this.getView().byId("pwrActVbox").insertItem(this.radioBtn,2);
		}else{
			this.byId('pwrLbl').setVisible(false);
			if(this.radioBtn)
				{
				   this.getView().byId("pwrActVbox").removeItem(2);
				   this.radioBtn.destroy();
				}
		}
		this.onScopeOfWork(oEvent);
	},
	
	
	/**
	 * onPwrIntrYes event triggered to show corresponding ITNC equipments 
	 */
	onPwrIntrYes: function(){
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var that = this;
		var oPowerITNCModel = new sap.ui.model.json.JSONModel();	
		var radioIndex = this.getView().byId("PowerRadioGrpId").getSelectedIndex();
		if(radioIndex == 1){
			var building ="", level="", room="";
			if(that.getView().byId('buildingId').getSelectedItem()!=null){building = that.getView().byId('buildingId').getSelectedItem().getText(); }
			if(that.getView().byId('levelSelId').getSelectedItem()!=null){level = that.getView().byId('levelSelId').getSelectedItem().getText(); }
			if(that.getView().byId('terRoomId').getSelectedItem()!=null){room = that.getView().byId('terRoomId').getSelectedItem().getText();}
			
			oPowerITNCModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Infra_DetailSet?$filter=KBuilding eq '"+building+"' and KLevel eq '"+level+"'and KRoom eq '"+room+"'&$format=json", null, true);
			oPowerITNCModel.attachRequestCompleted(function(oEvent) {
				if (oEvent.getParameter("success")) {
					var results = oPowerITNCModel.getData().d.results;
					if(results.length == 1){
						that.getView().byId('inpPrId').setValue(results[0].PcEquip);
						that.getView().byId('inpBrId').setValue(results[0].BpcEquip);
						that.getView().byId('inpEcId').setValue(results[0].EcEquip);
					}else if(results.length > 1){
						var PcEquip="",BpcEquip="",EcEquip="";
						for(var i=0;i<results.length;i++){
							if(PcEquip!=""){
							PcEquip = PcEquip+","+results[i].PcEquip;
							BpcEquip = BpcEquip+","+results[i].BpcEquip;
							EcEquip = EcEquip+","+results[i].EcEquip;
							}else{
								PcEquip = results[i].PcEquip;
								BpcEquip = results[i].BpcEquip;
								EcEquip = results[i].EcEquip;
							}
						}
						that.getView().byId('inpPrId').setValue(PcEquip);
						that.getView().byId('inpBrId').setValue(BpcEquip);
						that.getView().byId('inpEcId').setValue(EcEquip);
					}
				}
			});
			oPowerITNCModel.attachRequestFailed(function(oEvent) {
				sap.m.MessageBox.show(oEvent.getParameter("statusCode") + ":" + oEvent.getParameter("statusText"), {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: oResourceModel.getText("ERR_ROOM"),
					onClose: null,
					textDirection: sap.ui.core.TextDirection.Inherit
				});
			});
			this.getView().byId('pwrChkBoxId').setVisible(true);
		}else{
			this.getView().byId('pwrChkBoxId').setVisible(false);
		}
	},
	
	/**
	 * resetITNCFields to reset ITNC equipments
	 */
	resetITNCFields: function(){
		this.getView().byId('PowerRadioGrpId').setSelectedIndex(200);
		this.getView().byId('pwrChkBoxId').setVisible(false);
		this.getView().byId('inpPrId').setValue("");
		this.getView().byId('inpBrId').setValue("");
		this.getView().byId('inpEcId').setValue("");
	},
	
	/**
	 * onACIntCheck to show terms and condition subcheckbox
	 */
	onACIntCheck :function(oEvent){
		var radioIndex = this.getView().byId("acIntRadioGrpId").getSelectedIndex();
		if(radioIndex == 2){
			this.getView().byId('acAgreeId').setVisible(true);
		}else{
			this.getView().byId('acAgreeId').setVisible(false);
		}
	},
	
	/**
	 * onScopeOfWork event is created to make Scope of Work Model
	 * If any of the Scope of Work is checked it should be set into the model
	 * which will be then sent as pay-load on Submit.
	 */
	onScopeOfWork : function(oEvent) {
		var oScopeOfWorkModel = this.getView().getModel("oScopeOfWorkModel")
		var aSelScopeOfWork = oScopeOfWorkModel.getProperty("/aSelScopeOfWork");
		var sSelText = oEvent.getSource().getText();
		var oSelSow = {
			scopeOfWork : sSelText,
			sowComments : ""
		}
		if (oEvent.getParameter("selected")) {
			aSelScopeOfWork.push(oSelSow);
		} else {
			aSelScopeOfWork = aSelScopeOfWork.filter(function(oEle,index) { 
				 return oEle.scopeOfWork !== sSelText;
			});
		}
		oScopeOfWorkModel.setProperty("/aSelScopeOfWork", aSelScopeOfWork);
	},
	
	/**
	 * kaustLookUp to get KAUST user
	 */
	kaustLookUp : function(){
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var oVmsLookupModel = this.getView().getModel("oVmsLookupModel");
		var userId = this.getView().byId('kInpId').getValue().trim();
		if(userId!=""){
			if(userId != this.getView().getModel("oUserModel").getData().d.results[0].KaustID ){
		oVmsLookupModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + userId + "',UserId='')?$format=json", null, false);
		if(oVmsLookupModel.getData().d.KaustID!=""){
			arr = [oVmsLookupModel.getData().d];
			oVmsLookupModel.setProperty("/results",arr);
		}else{
		sap.m.MessageBox.show(
				oResourceModel.getText("VALIDKAUSTID"), {
          	        icon: sap.m.MessageBox.Icon.WARNING,
          	        title: "Warning",
          	        actions: [sap.m.MessageBox.Action.OK],
          	      }
          	    );
		this.getView().byId('kInpId').setValue("");
		 return;
		}
		if (! this._oPopover) {
			this._oPopover = sap.ui.xmlfragment("kaust.ui.kitsteraccess.fragments.KaustLookup", this);
			this.getView().addDependent(this._oPopover);
		}
		this._oPopover.setModel(oVmsLookupModel);
		this._oPopover.open();
		}else{
			sap.m.MessageBox.show(oResourceModel.getText("ONBEHALFOWN"), {
      	        icon: sap.m.MessageBox.Icon.WARNING,
      	        title: "Warning",
      	        actions: [sap.m.MessageBox.Action.OK],
      	      }
      	    );
			this.getView().byId('kInpId').setValue("");
			return;
		}
		}else{
			sap.m.MessageBox.show(
					oResourceModel.getText("SERKAUSTID"), {
              	        icon: sap.m.MessageBox.Icon.WARNING,
              	        title: "Warning",
              	        actions: [sap.m.MessageBox.Action.OK],
              	      }
              	    );
		}
	},
	
	/**
	 * vmsLookUp to get team members based on VMS control number
	 */
	vmsLookUp : function(oEvent){
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var oVmsLookupModel = this.getView().getModel("oVmsLookupModel");
		var userId = this.getView().byId('vmsInpId').getValue().trim();
		if(oEvent.getParameters().query!=undefined){
			userId = oEvent.getParameters().query;
		}
		if(userId!=""){
			var oDataModel = new sap.ui.model.json.JSONModel();
			oDataModel.loadData("/sap/opu/odata/sap/ZUI5_VMS_SHORTERM_VISITOR_SRV/VisitorDetailsSet('"+userId+"')?$format=json", null, false);
			var data = JSON.parse(oDataModel.getData().d.EResult);
			if(data.length >= 1){
			oVmsLookupModel.setProperty("/results",data);
			}else{
				sap.m.MessageBox.show(
						oResourceModel.getText("VAL_VALIDVMS"), {
	              	        icon: sap.m.MessageBox.Icon.WARNING,
	              	        title: "Warning",
	              	        actions: [sap.m.MessageBox.Action.OK],
	              	      }
	              	    );
				return;
			}
		if (! this._oPopover1) {
			this._oPopover1 = sap.ui.xmlfragment("kaust.ui.kitsteraccess.fragments.VmsLookup", this);
			this.getView().addDependent(this._oPopover1);
		}
			oVmsLookupModel.refresh();
			this._oPopover1.setModel(oVmsLookupModel);
			this._oPopover1.open();
		}else{
			sap.m.MessageBox.show(
					oResourceModel.getText("VAL_VMS"), {
              	        icon: sap.m.MessageBox.Icon.WARNING,
              	        title: "Warning",
              	        actions: [sap.m.MessageBox.Action.OK],
              	      }
              	    );
		}
	},
	
	make_base_auth: function (user, password) {
		  var tok = user + ':' + password;
		  var hash = Base64.encode(tok);
		  return "Basic " + hash;
		},
		
	/**
	 * to close KAUST user search fragment
	 */
	onCancelPress: function () {
		this._oPopover.getContent()[2].removeSelections(true);
		this.byId("kInpId").setValue("");
		this._oPopover.close();
	},
	
	/**
	 * to close VMS users search fragment
	 */
	onCancelPress1: function () {
		this._oPopover1.getContent()[2].removeSelections(true);
		this.byId("vmsInpId").setValue("");
		this._oPopover1.close();
	},
	
	/**
	 * onPickPress is the event triggered on the press of the PICK button in the VmsLookup Fragment.
	 * It fills the team members table via model oPickUserModel.
	 * Any duplicate entry is eliminated here and a check is provided for no selection
	 */
	onPickPress : function(oEvent){
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var oPickUserModel = this.getView().getModel("oPickUserModel");
		var aPickedUsers="";
		if((oEvent.getSource().getParent().getParent() && oEvent.getSource().getParent().getParent().getTitle()=="Kaust User")){
			aPickedUsers = this._oPopover.getContent()[2].getSelectedContextPaths();
		}else if((oEvent.getSource().getParent().getParent() && oEvent.getSource().getParent().getParent().getTitle()=="User Details")){
			aPickedUsers = this._oPopover1.getContent()[2].getSelectedContextPaths();
		}
		var oVmsTblData = this.getView().getModel("oVmsLookupModel").getProperty("/results");
		//var oVmsTblData = this.getView().byId("othersTblId").getItems();
		var aIndex = [];
		if (aPickedUsers.length === 0) {
			sap.m.MessageBox.show(oResourceModel.getText("ATLEAST_ONE"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",                                 
			    onClose: null                                       
			});
			return;
		} else {
			aPickedUsers.forEach(function(oEle){
				 aIndex.push(oEle.split("/")[2]); 
			 }); 
			 oVmsTblData = oVmsTblData.filter(function(oEle,index) { 
				 return aIndex.indexOf(index.toString()) !== -1; 
			});
		}
		
		if(oPickUserModel.getData().oPickedUser == undefined){
		oPickUserModel.setProperty("/oPickedUser", oVmsTblData);
		}else{
		//	oPickUserModel.getData().oPickedUser.prototype.push.apply(oPickUserModel.getData().oPickedUser,oVmsTblData); 
		//oPickUserModel.getData().oPickedUser.concat(oVmsTblData);
			var userDataArr = [];
			for(var i in oPickUserModel.getData().oPickedUser){
			   var shared = false;
			   for (var j in oVmsTblData)
				   if((oEvent.getSource().getParent().getParent() && oEvent.getSource().getParent().getParent().getTitle()=="Kaust User")){
				       if (oVmsTblData[j].KaustID == oPickUserModel.getData().oPickedUser[i].KaustID) {
				           shared = true;
				           break;
				       }
				   }
				   else if((oEvent.getSource().getParent().getParent() && oEvent.getSource().getParent().getParent().getTitle()=="User Details")){ 
					   if (oVmsTblData[j].Id == oPickUserModel.getData().oPickedUser[i].Id) {
				           shared = true;
				           break;
				       } 
				   }
			   if(!shared) userDataArr.push(oPickUserModel.getData().oPickedUser[i])
			}
			userDataArr = userDataArr.concat(oVmsTblData);
		//	this.getView().byId('othersTblId').unbindItems();
		//	oPickUserModel.setProperty("/oPickedUser", arr3);            text:"{FirstName}"
			oPickUserModel.getData().oPickedUser = userDataArr;
		}
		
		this.getView().byId('othersTblId').setModel(oPickUserModel);
		this.getView().byId('othersTblId').bindAggregation("items", "/oPickedUser", new sap.m.ColumnListItem({
	        cells:[    new sap.m.Text({
	                   text:"{KaustID}"
	               }),
	               new sap.m.Text({
	                    text:"{parts:[{path:'FirstName'},{path:'MiddleName'},{path:'LastName'}],formatter: '.getFulName' }"
	               })
	               ]
	    }));
		this.getView().byId('othersTblId').setVisible(true);
		if((oEvent.getSource().getParent().getParent() && oEvent.getSource().getParent().getParent().getTitle()=="Kaust User")){
			this.getView().byId('kInpId').setValue("");
			this.onCancelPress();
		}else if((oEvent.getSource().getParent().getParent() && oEvent.getSource().getParent().getParent().getTitle()=="User Details")){ 
			this.getView().byId('vmsInpId').setValue("");
			this.onCancelPress1();
		}
	},
	
	
	/**
	 * onPrSelect event triggered on selection of Primary Circuit Check box.
	 * If selected Input field is made visible.
	 */
	onPrSelect : function(oEvent) {
		var bPrChecked = oEvent.getParameter("selected");
		if (bPrChecked){
			this.byId("inpPrId").setVisible(true);
		} else {
			this.byId("inpPrId").setVisible(false);
		//	this.byId("inpPrId").setValue("");
		}
	},
	
	/**
	 * onBcSelect event triggered on selection of Backup Circuit Check box.
	 * If selected Input field is made visible.
	 */
	onBcSelect : function(oEvent) {
		var bBcChecked = oEvent.getParameter("selected");
		if (bBcChecked){
			this.byId("inpBrId").setVisible(true);
		} else {
			this.byId("inpBrId").setVisible(false);
		//	this.byId("inpBrId").setValue("");
		}
	},
	
	/**
	 * onEcSelect event triggered on selection of Emergency Circuit Check box.
	 * If selected Input field is made visible.
	 */
	onEcSelect : function(oEvent) {
		var bEcChecked = oEvent.getParameter("selected");
		if (bEcChecked){
			this.byId("inpEcId").setVisible(true);
		} else {
			this.byId("inpEcId").setVisible(false);
		//	this.byId("inpEcId").setValue("");
		}
	},
	
	/**
	 * onValidate to validate the requester form
	 */
	onValidate: function(){
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var oStartDate = this.getView().byId("startDateId");
		var oEndDate = this.getView().byId("endDateId");
		var aSowData = this.getView().getModel("oScopeOfWorkModel").getProperty("/aSelScopeOfWork");
		if(!this.getView().byId('partOfTeamId').getSelected() && !this.getView().byId('othersId').getSelected()){
			sap.m.MessageBox.show(oResourceModel.getText("ACCESS_TER"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",             
			    onClose: null                
			});
			return false;
		}
		if(this.getView().byId('othersId').getSelected() && !(this.getView().byId('othersTblId').getVisible())){
			sap.m.MessageBox.show(oResourceModel.getText("USER_TER"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",             
			    onClose: null                
			});
			return false;
		}if(this.getView().byId('workPermitId').getValue().trim() ==""){
			sap.m.MessageBox.show(oResourceModel.getText("VAL_WORKPERMIT"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",             
			    onClose: null                
			});
			return false;
		}if(oStartDate.getDateValue() === null || oStartDate.getDateValue() === "" || oStartDate.getDateValue() === undefined) {
			sap.m.MessageBox.show(oResourceModel.getText("VAL_STARTDATE"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",             
			    onClose: null                
			});
			return false;
		}if(sap.ui.getCore().byId("idPickupTime").getValue() == null || sap.ui.getCore().byId("idPickupTime").getValue()== "" || sap.ui.getCore().byId("idPickupTime").getValue()== undefined) {
			sap.m.MessageBox.show(oResourceModel.getText("VAL_STARTTIME"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",             
			    onClose: null                
			});
			return false;
		}if(!this.validateStartDate()){
			return false;
		}if(this.getView().byId('endDateId').getSelectedItem()==null) {
			sap.m.MessageBox.show(oResourceModel.getText("VAL_ENDDATE"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",             
			    onClose: null                
			});
			return false;
		}if(this.getView().byId('buildingId').getSelectedItem()==null) {
			sap.m.MessageBox.show(oResourceModel.getText("VAL_BLD"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",             
			    onClose: null                
			});
			return false;
		}if(this.getView().byId('levelSelId').getSelectedItem()==null) {
			sap.m.MessageBox.show(oResourceModel.getText("VAL_LEV"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",             
			    onClose: null                
			});
			return false;
		}if(this.getView().byId('terRoomId').getSelectedItem()==null) {
			sap.m.MessageBox.show(oResourceModel.getText("VAL_ROOM"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",             
			    onClose: null                
			});
			return false;
		}if(aSowData.length === 0) {
			sap.m.MessageBox.show(oResourceModel.getText("VAL_SCOPEOFWORK"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",             
			    onClose: null                
			});
			return false;
		}
		if(this.getView().byId('cblChkId').getSelected() && !(this.getView().byId('cblAgreeId').getSelected())){
			sap.m.MessageBox.show(oResourceModel.getText("VAL_CABLE"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",             
			    onClose: null                
			});
			return false;
		}if(this.getView().byId('otherChkId').getSelected() && this.getView().byId('othersTextId').getValue().trim() ==""){
			sap.m.MessageBox.show(oResourceModel.getText("VAL_OTHERS"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",             
			    onClose: null                
			});
			return false;
		}if(this.getView().byId("PowerRadioGrpId").getSelectedIndex()==200 ){
			sap.m.MessageBox.show(oResourceModel.getText("VAL_PWRINT"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",             
			    onClose: null                
			});
			return false;
		}if(this.getView().byId("acIntRadioGrpId").getSelectedIndex()==200 ){
			sap.m.MessageBox.show(oResourceModel.getText("VAL_ACINT"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",             
			    onClose: null                
			});
			return false;
		}if(this.getView().byId("acIntRadioGrpId").getSelectedIndex()==2 && !(this.getView().byId('acAgreeId').getSelected())){
			sap.m.MessageBox.show(oResourceModel.getText("VAL_TERMSACINT"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",             
			    onClose: null                
			});
			return false;
		}else{
			if(this.getView().byId('powerActId').getSelected()){
			this.onPowerBackup();
			}
			this.submit(aSowData);
		}
		
	},
	
	/**
	 * validateStartDate to validate start date can not be past date
	 */
	validateStartDate : function(evt) {
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var inputField = this.getView().byId("startDateId");
		var startDate = inputField.getValue();
		var result = true;
		if (startDate != "") {
			var today = new Date().getTime();
			var time = sap.ui.getCore().byId("idPickupTime").getValue();
			time = time.split(":");
			var start = new Date(inputField.getDateValue().getFullYear()
                    ,inputField.getDateValue().getMonth()
                    ,inputField.getDateValue().getDate()
                    ,parseInt(time[0]),parseInt(time[1]),00);
			if (start < today) {
				sap.m.MessageBox.show(oResourceModel.getText("VAL_PASTDATE"), {
					icon : sap.m.MessageBox.Icon.ERROR,
					title : "Error",
					actions : [ sap.m.MessageBox.Action.OK ],
				});
				//inputField.setValueState("Error");
				result = false;
				inputField.setValue("");
				sap.ui.getCore().byId("idPickupTime").setValue("");
			} else {
				//inputField.setValueState("None");
			}
		}
		return result;

	},
	
	convertDateBack : function(date) {
		var time = new Date(date);
		var yyyy = time.getFullYear();
		var mm = time.getMonth() + 1;
		var dd = time.getDate();
		if (dd < 10) {
			dd = '0' + dd;
		}
		if (mm < 10) {
			mm = '0' + mm;
		}
		var result = mm + "/" + dd + "/" + yyyy;
		return result;
	},
	
	/**
	 * to submit request form : ECC service post call
	 */
	submit : function(aSowData){
		var busyDialog = new sap.m.BusyDialog();
		busyDialog.open();
		jQuery.sap.delayedCall(100, this , function () {
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var oView = this.getView();
		var oUserModelData = oView.getModel("oUserModel").getProperty("/d/results/0");
		var oPickUserModel = oView.getModel("oPickUserModel");
		var aTeamMembers = [];
		if (oPickUserModel.getProperty("/oPickedUser")) {
			var pckdUsers = oPickUserModel.getProperty("/oPickedUser");
			//var pckdUsers = this.getView().byId("othersTblId").getItems();
			if(pckdUsers.length > 0){
				for(var i=0; i<pckdUsers.length; i++){
					var obj= { "KaustID": "","Name": "","vmsControlNum":""};
				//	obj.UserId = pckdUsers[i].KaustID; [0].getCells()[0].getText()
				//	obj.Name = pckdUsers[i].FirstName;
					if(pckdUsers[i].KaustID != undefined){
						obj.KaustID = pckdUsers[i].KaustID;
						//obj.Name = pckdUsers[i].FirstName+" "+pckdUsers[i].MiddleName+" "+pckdUsers[i].LastName;
					}else{
						obj.vmsControlNum = pckdUsers[i].VisitId;
						//obj.Name = pckdUsers[i].FullName;
					}
					var name = pckdUsers[i].FirstName;
					if(pckdUsers[i].MiddleName !="" && pckdUsers[i].MiddleName !=null){
						name = name+" "+pckdUsers[i].MiddleName;
					}if(pckdUsers[i].LastName !="" && pckdUsers[i].LastName !=null){
						name = name+" "+pckdUsers[i].LastName;
					}
					obj.Name = name;
					//obj.KaustID = pckdUsers[i].getCells()[0].getText();
					//obj.Name = pckdUsers[i].getCells()[1].getText();
					aTeamMembers.push(obj);
				}
			}
		//	aTeamMembers = oPickUserModel.getProperty("/oPickedUser");
		}
		var sWorkPermit = this.byId("workPermitId").getValue().trim();
		/* 0 for NO and 1 for YES for Power Interruption */
		var sPowerInterrupt = this.byId("PowerRadioGrpId").getSelectedIndex().toString();
		/* 0 for No, 1 for Yes, less than 30 min and 2 for Yes, more than 30 min for AC interruption*/
		var sAcInterrupt = this.byId("acIntRadioGrpId").getSelectedIndex().toString();
		// Get start date and time
		var oDateTimeData = this._getDateData();
		/*  "TERToTmm" : aTeamMembers,  "onBehalf":"X","reqKaustId":"X", "stage":"X", "expeditor":"X", "role":"X",*/
		
		var oTerPayload= {
				"FirstName": oUserModelData.FirstName,
				"MiddleName": oUserModelData.MiddleName,
				"LastName": oUserModelData.LastName,
				"Email": oUserModelData.Email,
				"RManager": oUserModelData.RManager,
				"Position": oUserModelData.Position,
				"Deptname": oUserModelData.Deptname,
				"Mobile": oUserModelData.Mobile,
				"Office": oUserModelData.Office,
				"WorkPermit": sWorkPermit,
				"StartDate": oDateTimeData.sStartDate + "T00:00:00",
				"StartTime": oDateTimeData.sStartTime,
				"EndDate": oDateTimeData.sEndDate + "T00:00:00",
				"EndTime": oDateTimeData.sEndTime,
			    "Building":this.getView().byId('buildingId').getSelectedItem().getText(),
			    "Level":this.getView().byId('levelSelId').getSelectedItem().getText(),
			     "Room":this.getView().byId('terRoomId').getSelectedItem().getText(),
			     "Wftrigger":"X",
			     "MsgTyp1":"",
			     "Msg1":"",
			     "PowerInterrupt":this.getView().byId("PowerRadioGrpId").getSelectedIndex(),
			     "AcInterruption": this.getView().byId("acIntRadioGrpId").getSelectedIndex(),
			     "userId":oUserModelData.UserId,
			     "subServiceCode":"00"+"52",
			     "serviceCode":"0016",
			     "processId":"X",
			     "kaustId":oUserModelData.KaustID,
			     "TERToSow": aSowData, 
			     "IsReqtAccReq":"0",
			     "IsOtherTeamAccReq":"0",
			     "status":"001"               // Process "Initiated"
			  };
		
		if(this.getView().byId('partOfTeamId').getSelected()){
			oTerPayload.IsReqtAccReq="X";
		}
		if(this.getView().byId('othersId').getSelected()){
			oTerPayload.IsOtherTeamAccReq="X";
		}
		var radioIndex = this.getView().byId("PowerRadioGrpId").getSelectedIndex();
			if(radioIndex == 1){
			oTerPayload.PowerInterrupt = "X";
		}
		
		var equipmentsArray =[];
		var obj;
		if(this.getView().byId('prCbId').getSelected()){
			obj = { "EquipmentNumber":this.getView().byId('inpPrId').getValue(),"CircuitType":"PR"};
			equipmentsArray.push(obj);
		}
		if(this.getView().byId('brCbId').getSelected()){
			obj = { "EquipmentNumber":this.getView().byId('inpBrId').getValue(),"CircuitType":"BPR"};
			equipmentsArray.push(obj);
		}
		if(this.getView().byId('eprCbId').getSelected()){
			obj = { "EquipmentNumber":this.getView().byId('inpEcId').getValue(),"CircuitType":"EPR"};
			equipmentsArray.push(obj);
		}
		if(equipmentsArray.length != 0){
			oTerPayload.TERToPow = equipmentsArray;
		}
		if(aTeamMembers.length!=0){
			oTerPayload.TERToTmm = aTeamMembers;
		}
		var that = this;
		var oGascModel= new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS");
		oGascModel.create("/TERRequestSet", 
				oTerPayload, null, function(data,response){
				busyDialog.close();
					sap.m.MessageBox.show('Thank you and please note your request ID#'+data.RequestId+', To check status, please go to "My Requests" section.', {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Success",                                    // default
						actions: sap.m.MessageBox.Action.OK,
						onClose: function(oAction){
						that.resetAllTERFields();
						that.goBack(oAction);
					    },                                       // default
	  	  			    textDirection: sap.ui.core.TextDirection.Inherit     // default
	  	  			    });
				},function(oError){
					busyDialog.close();
					 sap.m.MessageBox.show(
							 oResourceModel.getText("ERR_SUB"), {
                       	        icon: sap.m.MessageBox.Icon.ERROR,
                       	        title: "Error",
                       	        actions: [sap.m.MessageBox.Action.OK],
                       	      });
				});
			});
		},
		
	/**
	 * resetAllTERFields to reset all UI fields post submission
	 */
	resetAllTERFields : function(){
		this.getView().byId('partOfTeamId').setSelected(false);
		this.getView().byId('othersId').setSelected(false);
		this.getView().byId('vmsLblId').setVisible(false);
		this.getView().byId('vmsInpId').setVisible(false);
		this.getView().byId('vmsInpId').setValue("");
	//	this.getView().byId('vmsIconId').setVisible(false);
		this.getView().byId('othersTblId').setVisible(false);
		
		this.getView().byId('kLblId').setVisible(false);
		this.getView().byId('kInpId').setVisible(false);
		this.getView().byId('kInpId').setValue("");
	//	this.getView().byId('kIconId').setVisible(false);
		this.getView().byId('workPermitId').setValue("");
		this.getView().byId('startDateId').setValue("");
		
		var that = this;
		this.getView().byId('endDateId').setValue();
		sap.ui.getCore().byId("idPickupTime").setValue(new Date().getHours()+1+":00");
		this.getView().byId('buildingId').setValue();
		this.getView().byId('levelSelId').setValue();
		this.getView().byId('levelSelId').destroyItems();
		this.getView().byId('levelSelId').clearSelection();
		this.getView().byId('terRoomId').setValue();
		this.getView().byId('terRoomId').destroyItems();
		this.getView().byId('terRoomId').clearSelection();
		
		this.getView().byId('powerActId').setSelected(false);
		this.byId('pwrLbl').setVisible(false);
		this.getView().byId('acMaintId').setSelected(false);
		this.getView().byId('terCleanId').setSelected(false);
		this.getView().byId('cblChkId').setSelected(false);
		this.getView().byId('cblAgreeId').setSelected(false);
		this.getView().byId('cblAgreeId').setVisible(false);
		this.getView().byId('hseInspectId').setSelected(false);
		this.getView().byId('otherChkId').setSelected(false);
		this.getView().byId('othersTextId').setValue("");
		this.getView().byId('othersTextId').setVisible(false);
		
		this.getView().byId("PowerRadioGrpId").setSelectedIndex(200);
		this.getView().byId('pwrChkBoxId').setVisible(false);
		
		this.getView().byId('prCbId').setSelected(false);
		this.getView().byId('inpPrId').setValue("");
		this.getView().byId('inpPrId').setVisible(false);
		this.getView().byId('brCbId').setSelected(false);
		this.getView().byId('inpBrId').setValue("");
		this.getView().byId('inpBrId').setVisible(false);
		this.getView().byId('eprCbId').setSelected(false);
		this.getView().byId('inpEcId').setValue("");
		this.getView().byId('inpEcId').setVisible(false);	
		
		this.getView().byId('acIntRadioGrpId').setSelectedIndex(200);
		this.getView().byId('acAgreeId').setSelected(false);
		this.getView().byId('acAgreeId').setVisible(false);
		
		this.getView().getModel("oPickUserModel").setProperty("/oPickedUser", []);
	},
	
	/**
	 * disableAllTERFields to disable all UI fields for ticket in readonly mode
	 */
	disableAllTERFields : function(){
		this.getView().byId('partOfTeamId').setEnabled(false);
		this.getView().byId('othersId').setEnabled(false);
		this.getView().byId('vmsLblId').setVisible(false);
		this.getView().byId('vmsInpId').setVisible(false);
		this.getView().byId('vmsInpId').setValue("");
	//	this.getView().byId('vmsIconId').setVisible(false);
		this.getView().byId('oTblRemoveBtn').setVisible(false);
		
		this.getView().byId('kLblId').setVisible(false);
		this.getView().byId('kInpId').setVisible(false);
		this.getView().byId('kInpId').setValue("");
	//	this.getView().byId('kIconId').setVisible(false);
		this.getView().byId('workPermitId').setEnabled(false);
		
		this.getView().byId('endDateId').setEnabled(false);
		this.getView().byId('buildingId').setEnabled(false);
		this.getView().byId('levelSelId').setEnabled(false);
		this.getView().byId('terRoomId').setEnabled(false);
		
		this.getView().byId('powerActId').setEnabled(false);
		this.getView().byId('acMaintId').setEnabled(false);
		this.getView().byId('terCleanId').setEnabled(false);
		this.getView().byId('cblChkId').setEnabled(false);
		this.getView().byId('cblAgreeId').setEnabled(false);
		this.getView().byId('cblAgreeId').setEnabled(false);
		this.getView().byId('hseInspectId').setEnabled(false);
		this.getView().byId('otherChkId').setEnabled(false);
		this.getView().byId('othersTextId').setEnabled(false);
		
		this.getView().byId("PowerRadioGrpId").setEnabled(false);
		this.getView().byId('prCbId').setEnabled(false);
		this.getView().byId('inpPrId').setEnabled(false);
		this.getView().byId('brCbId').setEnabled(false);
		this.getView().byId('inpBrId').setEnabled(false);
		this.getView().byId('eprCbId').setEnabled(false);
		this.getView().byId('inpEcId').setEnabled(false);	
		
		this.getView().byId('acIntRadioGrpId').setEnabled(false);
		this.getView().byId('acAgreeId').setEnabled(false);
		this.getView().byId('acAgreeId').setEnabled(false);
		
		this.getView().byId('terPage').destroyFooter();
		this.getView().byId('vendorShowUp').setEnabled(false);
		this.getView().byId('vendorExTime').setEnabled(false);
		this.getView().byId('toolbyVendor').setEnabled(false);
		    
	},
	
	/***   
	 * _getDateData to format the start and end date and time
	 * Return value: oDateTimeObject
	 */
	_getDateData : function(oEvent) {
		var oDateTimeObject = {};
		var oStartDateValue = this.byId("startDateId").getDateValue();
		var time = sap.ui.getCore().byId("idPickupTime").getValue();
		time = time.split(":");
		oStartDateValue = new Date(oStartDateValue.getFullYear()
                ,oStartDateValue.getMonth()
                ,oStartDateValue.getDate()
                ,parseInt(time[0]),parseInt(time[1]),00);
		//var oEndDateValue = this.byId("endDateId").getDateValue();
		var oEndDateValue ="";
		var selectedEndDate = this.getView().byId('endDateId').getSelectedItem().getText();
		if(selectedEndDate=="Same day"){
			oEndDateValue = new Date(oStartDateValue.getFullYear()
                    ,oStartDateValue.getMonth()
                    ,oStartDateValue.getDate()
                    ,23,59,59);
		}else{
			//oEndDateValue = new Date(oStartDateValue);
			oEndDateValue = new Date(oStartDateValue.getFullYear()
                    ,oStartDateValue.getMonth()
                    ,oStartDateValue.getDate()+1
                    ,23,59,59);
			//oEndDateValue.setDate(oStartDateValue.getDate()+1)
		}
		
	//	var oEndDateValue = this.calculateEndDate();
		var sStartMonth = (oStartDateValue.getMonth() + 1).toString();
		if (sStartMonth.length === 1) {
			sStartMonth = "0" + sStartMonth;
		}
		var sEndMonth = (oEndDateValue.getMonth() + 1).toString();
		if (sEndMonth.length === 1) {
			sEndMonth = "0" + sEndMonth;
		}
		oDateTimeObject.sStartDate = oStartDateValue.getFullYear() + "-" + sStartMonth + "-" + oStartDateValue.getDate();
		oDateTimeObject.sEndDate = oEndDateValue.getFullYear() + "-" + sEndMonth + "-" + oEndDateValue.getDate();
		oDateTimeObject.sStartTime = oStartDateValue.getTime().toString();
		oDateTimeObject.sEndTime = oEndDateValue.getTime().toString();
		return oDateTimeObject;
	},
	
	/**
	 * cancelRequest to go back from request screen without submission
	 */
	cancelRequest : function() {
		var that = this;
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		sap.m.MessageBox.confirm(oResourceModel.getText("CANREQ"), {
		    title: "Confirmation", 
		    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],// default
		    onClose: function(oAction){
		    	that.goBack(oAction);
		    	},                                  // default
		    textDirection: sap.ui.core.TextDirection.Inherit     // default
		    });
		},
	
	/**
	 * goBack to close screen
	 */		
	goBack : function(oAction){
		if(oAction=="YES" || oAction=="OK"){
			window.history.go(-1);
			//window.open('','_self').close();
			//window.top.close();
		}else{
			return false;
		}
	},
	
	
	/**
	 * deleteItems to remove other team members from main table
	 */	
	deleteItems: function(evt){
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var that =this;
		var selItems=this.getView().byId('othersTblId').getSelectedItems();
		var selItemsLen=selItems.length;
			if(selItemsLen>0){
				for(var i=0;i<selItemsLen;i++){
					if(selItems[i].getCells()[1].getText() && that.getView().getModel('oPickUserModel').getData().oPickedUser!=undefined){
						that.findAndRemove(that.getView().getModel('oPickUserModel').getData().oPickedUser, "FirstName","MiddleName","LastName", selItems[i].getCells()[1].getText());
					}
					this.getView().byId('othersTblId').removeItem(selItems[i]);
				}
			}else{
				 sap.m.MessageBox.show(
						 oResourceModel.getText("ITEM_REM"), {
                    	        icon: sap.m.MessageBox.Icon.WARNING,
                    	        title: "Warning",
                    	        actions: [sap.m.MessageBox.Action.OK],
                    	});
			}
},

/**
 * deletefindAndRemove to remove in others team members model based on key value
 */	
	findAndRemove :function (array,fn,mn,ln,value) {
	  array.forEach(function(result, index) {
	    //if(result[property] === value) {
		// if(value.indexOf(result[property]) != -1){
		  var name = result[fn];
		  if(value.indexOf("  ") != -1){
			 value = value.replace("  "," "); 
		  }
		  if(result[mn]!="" && result[mn]!=null){
			  name = name+" "+result[mn];
		  }
		  if(result[ln]!="" && result[ln]!=null){
			  name = name+" "+result[ln];
		  }
		  if(name === value) {
	      array.splice(index, 1);     //Remove from array
	    }    
	  });
	},

	/**
	 * onUserSearchPress to user information based on KAUST ID to add in other team members
	 */
	onUserSearchPress: function(oEvent) {
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var userId = oEvent.getParameters().query;
		if(userId!=""){
			if(userId != this.getView().getModel("oUserModel").getData().d.results[0].KaustID ){
		var oVmsLookupModel = new sap.ui.model.json.JSONModel();
		oVmsLookupModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + userId + "',UserId='')?$format=json", null, false);
		if(oVmsLookupModel.getData().d.KaustID!=""){
			arr = [oVmsLookupModel.getData().d];
			oVmsLookupModel.setProperty("/results",arr);
			this._oPopover.setModel(oVmsLookupModel);
		}else{
			oEvent.getSource().setValue("");
	        sap.m.MessageBox.show(
	        		oResourceModel.getText("VALIDKAUSTID"), {
	          	        icon: sap.m.MessageBox.Icon.WARNING,
	          	        title: "Warning",
	          	        actions: [sap.m.MessageBox.Action.OK],
	          	      }
	          	    );
	        return; 
			}
		}else{
			sap.m.MessageBox.show(oResourceModel.getText("ONBEHALFOWN"), {
      	        icon: sap.m.MessageBox.Icon.WARNING,
      	        title: "Warning",
      	        actions: [sap.m.MessageBox.Action.OK],
      	      }
      	    );
			oEvent.getSource().setValue("");
			return;
		}
		}else{
			if( !oEvent.getParameters().clearButtonPressed){
			 sap.m.MessageBox.show(oResourceModel.getText("SERKAUSTID"), {
	              	        icon: sap.m.MessageBox.Icon.WARNING,
	              	        title: "Warning",
	              	        actions: [sap.m.MessageBox.Action.OK],
	              	      }
	              	    );
			}
		}
	},

	/**
	 * getFulName to display user's full name
	 */
	getFulName : function(fn,mn,ln){
		var name =fn;
		if(mn!="" && mn!=null){
			name = name+" "+mn;
		}
		if(ln!="" && ln!=null){
			name = name+" "+ln;
		}
		return name;
	},
	
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf kaust.ui.kitsteraccess.TerAccessRequestView
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf kaust.ui.kitsteraccess.TerAccessRequestView
*/
	onAfterRendering: function() {
		var requestId = this.getRequestId();
		if(requestId ==""){
			this.getView().byId('PowerRadioGrpId').setSelectedIndex(200);
			this.getView().byId('acIntRadioGrpId').setSelectedIndex(200);
		 }
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf kaust.ui.kitsteraccess.TerAccessRequestView
*/
//	onExit: function() {
//
//	}
});