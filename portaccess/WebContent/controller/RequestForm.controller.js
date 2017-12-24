jQuery.sap.require("sap.m.MessageBox");
sap.ui.controller("kaust.ui.kitsportaccess.controller.RequestForm", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf kaust.ui.kitsportaccess.RequestForm
*/
	onInit: function() {
		var oGascModel= new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS");
	    this.getView().setModel(oGascModel, "oGascModel");
	    var oDataModel= new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC");
		this.getView().setModel(oDataModel, "oDataModel");
		var requestId = this.getRequestId();
		if(requestId!=""){
			this.loadTicket(requestId);
		}
	    else{
	    var that = this;	
		var oJSONModel = new sap.ui.model.json.JSONModel();
		oGascModel.read("RequestTypeSet?$filter=processTypeId eq 'PORT'", {
			success: function(oData) {
				oJSONModel.setProperty("/oRequestType", oData.results);
				that.getView().byId('reqTypeId').setModel(oJSONModel);
			},
			error: function(oError) {
				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
			}
		});
		var oUserModel = new sap.ui.model.json.JSONModel();
		oGascModel.read("UserDetail", {
			success: function(oData) {
				oUserModel.setProperty("/oUserData", oData.results[0]);
				that.getView().setModel(oUserModel, "oUserModel");
			},
			error: function(oError) {
				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
			}
		});
		this.getView().byId('userInfoTab').setModel(oUserModel);
		
		var oBuildingLookupModel = new sap.ui.model.json.JSONModel();
		oGascModel.read("Infra_DetailSet", {
			success: function(oData) {
				oBuildingLookupModel.setProperty("/oBuildingData", oData.results);
				that.getView().setModel(oBuildingLookupModel, "oBuildingLookupModel");	
			},
			error: function(oError) {
				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
			}
		});
		this.initializeControlsReadOnly();
		}
	},
	
	/**
	 * initializeControlsReadOnly to not allowing to input from keys 
	 */
	initializeControlsReadOnly : function(){
		var oCombo = this.getView().byId("buildingId");
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
	 * onBuildingChange event is triggered on selection of Building name.
	 * Once Building is selected levels will be fetched.
	 */
	onBuildingChange : function(oEvent) {
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		this.getView().byId('levelSelId').destroyItems();
	//	this.getView().byId('terRoomId').destroyItems();
		this.getView().byId('levelSelId').setValue();
		this.getView().byId('terRoomId').setValue();
		this.getView().byId('levelSelId').clearSelection();
	//	this.getView().byId('terRoomId').clearSelection();
		var that = this;
		if (oEvent.getSource().getSelectedItem()) {
			var building= oEvent.getSource().getSelectedItem().getText();
			var oLevelLookupModel = new sap.ui.model.json.JSONModel();
			var oGascModel= that.getView().getModel("oGascModel");
			oGascModel.read("Infra_DetailSet?$filter=KBuilding eq '"+building+"'", {
				success: function(oData) {
					oLevelLookupModel.setProperty("/oLevelData", oData.results);
					that.getView().setModel(oLevelLookupModel, "oLevelLookupModel");
					that.getView().byId("levelSelId").setEnabled(true);
				},
				error: function(oError) {
					jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
				}
			});
		} 
	},
	
	/**
	 * onLevlChange event is triggered on selection of Level name.
	 * Once Level is selected TER Room Number will be fetched.
	 */
	/*onLevlChange : function(oEvent) {
		this.getView().byId('terRoomId').destroyItems();
		this.getView().byId('terRoomId').setValue();
		this.getView().byId('terRoomId').clearSelection();
		var that = this;
		if (oEvent.getSource().getSelectedItem()) {
			var building = that.getView().byId('buildingId').getSelectedItem().getText(); 
			var level= oEvent.getSource().getSelectedItem().getText();
			
			var oRoomLookupModel = new sap.ui.model.json.JSONModel();
			oRoomLookupModel.loadData("/sap/opu/odata/sap/ZTER_LOOKUP_SRV/Infra_DetailSet?$filter=KBuilding eq '"+building+"' and KLevel eq '"+level+"'&$format=json", null, true);
			oRoomLookupModel.attachRequestCompleted(function(oEvent) {
				if (oEvent.getParameter("success")) {
					that.getView().setModel(oRoomLookupModel, "oRoomLookupModel");	
				}
			});
			oRoomLookupModel.attachRequestFailed(function(oEvent) {
				sap.m.MessageBox.error(oEvent.getParameter("statusCode") + ":" + oEvent.getParameter("statusText"), {
					title: oResourceModel.getText("ERR_ROOM"),
					onClose: null,
					textDirection: sap.ui.core.TextDirection.Inherit
				});
			});
		//	that.byId("terRoomId").setEnabled(true);
		} else {
		//	that.byId("terRoomId").setEnabled(false);
		}
		that.resetITNCFields();
	},*/
	
	/**
	 * loadTicket to load view for CRM ticket
	 */
	loadTicket: function(requestId){
		var oGascModel= this.getView().getModel("oGascModel");
		var data = "";
		oGascModel.read("PortActivationRequest?$filter=RequestId eq '"+requestId+"'", null,null,false, function(oData) {
				data = oData.results[0];
			},function(oError) {
				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
		});
		
		if(data!=""){
		var item= new sap.ui.core.Item({
			text:data.reqTypeDesc,
			key:"01"
		})
		this.getView().byId('reqTypeId').addItem(item);
		this.getView().byId('reqTypeId').setSelectedKey("01");
		//
		//this.getView().byId('subHeader').setText(data.Request_Type);
		this.getView().byId('idPortNo').setValue(data.Port_Tag_Number);
		this.getView().byId('idPortNo').setTooltip(data.Port_Tag_Number);
		if(data.Request_Type != "1"){
			this.getView().byId('serviceId').setVisible(true);
			this.getView().byId('idServType').setValue(data.Service_Type);
			this.getView().byId('idServType').setTooltip(data.Service_Type);
		}else{
			this.getView().byId('serviceId').setVisible(false);
		}
		//this.getView().byId('idLoc').setValue(data.Location);
		var location= data.Location;
		location = location.split("-");
		this.getView().byId('buildingId').setValue(location[0]);
		this.getView().byId('levelSelId').setValue(location[1]);
		this.getView().byId('terRoomId').setValue(location[2]);
		this.getView().byId('terRoomId').setTooltip(location[2]);
		  
		//For Requester information    
		//var oLUserModel = new sap.ui.model.json.JSONModel();
		var oDataModel= this.getView().getModel("oDataModel");
		var userData = "";
		oDataModel.read("UserDetail(KaustID='" + data.Requester_KaustId + "',UserId='')", null,null,false, function(oData) {
				userData = oData;
			},function(oError) {
				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
		});
		
		if(userData!=""){
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
		
		//FOR ONBEHALF user information
		if(data.Onbehalf=="X"){
		var oUserSerchModel = new sap.ui.model.json.JSONModel();
		oDataModel.read("UserDetail(KaustID='" + data.KaustId + "',UserId='')", null,null,false, function(oData) {
				oUserSerchModel.setProperty("/d", oData);
			},function(oError) {
				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
		});
		
		if(oUserSerchModel.getData().d.KaustID!=""){
			this.getView().setModel(oUserSerchModel, "oUserSerchModel");
			this.getView().byId('onBehalfUserTab').setVisible(true);
			this.getView().byId('idOnBehalf').setSelected(true);
			}
		}
		this.disableAllFields();
		this.getView().byId('portPage').destroyFooter();
	}
	},
	
	/**
	 * onChange Request type, service field to be shown/hidden
	 */
	onChange : function(oEvent){
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var selectedItem = oEvent.getParameters().selectedItem.getText();
		this.resetAllFields();
		if(selectedItem == oResourceModel.getText("others")){
			this.getView().byId("serviceId").setVisible(true);
			//this.getView().byId("subHeader").setText(oResourceModel.getText("others"));
		}else{
			this.getView().byId("serviceId").setVisible(false);
			//this.getView().byId("subHeader").setText(oResourceModel.getText("internet"));
		}
	},
	
	/**
	 * portHelp pop up for port information
	 */
	portHelp : function(oEvent){
		if (! this._oPopover) {
			this._oPopover = sap.ui.xmlfragment("kaust.ui.kitsportaccess.fragments.PortHelp", this);
			this._oPopover.addStyleClass("sapUiSizeCompact");
			this.getView().addDependent(this._oPopover);
		}
		this._oPopover.openBy(oEvent.getSource());
	},

	/**
	 * closing pop up for port information
	 */
	handleCloseButton: function (oEvent) {
		this._oPopover.close();
	},
	
	/**
	 * serHelp pop up for service type information
	 */
	serHelp : function(oEvent){
		if (! this._oPopover1) {
			this._oPopover1 = sap.ui.xmlfragment("kaust.ui.kitsportaccess.fragments.SerHelp", this);
			this._oPopover1.addStyleClass("sapUiSizeCompact");
			this.getView().addDependent(this._oPopover1);
		}
		this._oPopover1.openBy(oEvent.getSource());
	},
	
	/**
	 * closing pop up for service type information
	 */
	handleCloseButton1: function (oEvent) {
		this._oPopover1.close();
	},
	
	/**
	 * onBehalf if checked, showing the select person button
	 */
	onBehalf : function(oEvent){
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var that = this;
		var checked = oEvent.getParameters().selected;
		if(checked){
			that.getView().byId('selPerson').setVisible(true);
		}else{
			if(that.getView().byId('onBehalfUserTab').getVisible()){
			 sap.m.MessageBox.confirm(oResourceModel.getText("DESELECT"), {
				    title: "Confirmation", 
				    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],// default   
				    onClose: function(oAction){
				    	that.selectPerson(oAction);
				    },                                  // default
				    textDirection: sap.ui.core.TextDirection.Inherit     // default
				    });
			}else{
				that.getView().byId('selPerson').setVisible(false);
				that.getView().byId('onBehalfUserTab').setVisible(false);
			}
			
		}
	},
	
	/**
	 * selectPerson to show user information in tab
	 */
	selectPerson : function(oAction){
		if(oAction=="YES"){
		this.getView().byId('selPerson').setVisible(false);
		this.getView().byId('onBehalfUserTab').setVisible(false);
		}else{
			this.getView().byId('idOnBehalf').setSelected(true);
		}
	},
	
	/**
	 * onSelectPersonPress to open fragment for search
	 */
	onSelectPersonPress: function() {
		if (!this.oSearchUserFragment) {
			this.oSearchUserFragment = sap.ui.xmlfragment("kaust.ui.kitsportaccess.fragments.UserSearch", this);
		}
		this.getView().addDependent(this.oSearchUserFragment);
		this.oSearchUserFragment.open();
	},
	
	/**
	 * onUserSearchPress to fetch user information
	 */
	onUserSearchPress: function(oEvent) {
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var userId = oEvent.getParameters().query;
		if(userId!=""){
			if(userId==this.getView().getModel("oUserModel").getData().oUserData.KaustID){
				 sap.m.MessageBox.show(oResourceModel.getText("ONBEHALFOWN"), {
		              	        icon: sap.m.MessageBox.Icon.WARNING,
		              	        title: "Warning",
		              	        actions: [sap.m.MessageBox.Action.OK],
		              	      }
		              	    );
				 oEvent.getSource().setValue("");
				 return;
			}else{
		var oSearchResForm = this.oSearchUserFragment.getContent()[2];
		var oPickUserBtn = this.oSearchUserFragment.getBeginButton();
		 
		var oUserSerchModel = new sap.ui.model.json.JSONModel();
		var oDataModel = this.getView().getModel("oDataModel");
		oDataModel.read("UserDetail(KaustID='" + userId + "',UserId='')",null,null,false, function(oData) {
			oUserSerchModel.setProperty("/d", oData);
		},function(oError) {
			jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
		});
		
		if(oUserSerchModel.getData().d.KaustID!=""){
		this.getView().setModel(oUserSerchModel, "oUserSerchModel");
		oSearchResForm.setModel("oUserSerchModel");
		oSearchResForm.setVisible(true);
		oPickUserBtn.setEnabled(true);
		}else{
            sap.m.MessageBox.show(oResourceModel.getText("VALIDKAUSTID"), {
              	        icon: sap.m.MessageBox.Icon.WARNING,
              	        title: "Warning",
              	        actions: [sap.m.MessageBox.Action.OK],
              	      }
              	    );
			}
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
	 * onCancelPress to clear user information
	 */
	onCancelPress: function() {
		this.oSearchUserFragment.close();
		var oSearchField = this.oSearchUserFragment.getContent()[1];
		var oSearchResForm = this.oSearchUserFragment.getContent()[2];
		var oPickUserBtn = this.oSearchUserFragment.getBeginButton();
		oSearchField.setValue(null);
		oSearchResForm.setVisible(false);
		oPickUserBtn.setEnabled(false);
	},
	
	/**
	 * onPickPress to show user information and closing the fragment
	 */
	onPickPress : function() {
		this.getView().byId('onBehalfUserTab').setVisible(true);
		this.getView().byId('idTabBar').setSelectedKey("Tab3");
		this.onCancelPress();
	},
	
	/**
	 * onValidate to validate the requester form
	 */
	onValidate: function(){
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var port_no = this.getView().byId('idPortNo').getValue().trim();
		//var loc =  this.getView().byId('idLoc').getValue().trim();  // location to dropdown instead of input field
		if(port_no == "" ||port_no==null){
			 sap.m.MessageBox.show(oResourceModel.getText("PORTVAL"), {
	              	        icon: sap.m.MessageBox.Icon.WARNING,
	              	        title: "Warning",
	              	        actions: [sap.m.MessageBox.Action.OK],
	              	      }
	              	    );
			return false;
		}
		if(this.getView().byId('reqTypeId').getSelectedItem().getText()==oResourceModel.getText("others") && this.getView().byId('idServType').getValue().trim()==""){
			 sap.m.MessageBox.show(oResourceModel.getText("SERVAL"), {
	              	        icon: sap.m.MessageBox.Icon.WARNING,
	              	        title: "Warning",
	              	        actions: [sap.m.MessageBox.Action.OK],
	              	      }
	              	    );
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
		}if(this.getView().byId('terRoomId').getValue().trim()=="") {
			sap.m.MessageBox.show(oResourceModel.getText("VAL_ROOM"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",             
			    onClose: null                
			});
			return false;
		}if(this.getView().byId('idOnBehalf').getSelected() && !(this.getView().byId('onBehalfUserTab').getVisible())){
			sap.m.MessageBox.show(oResourceModel.getText("SELONBEHALF"), {
              	        icon: sap.m.MessageBox.Icon.WARNING,
              	        title: "Warning",
              	        actions: [sap.m.MessageBox.Action.OK],
              	      }
              	    );
			return false;
		}
		else{
			this.getView().byId('submitBtn').setEnabled(false); 
			
			this.onSubmit();
		}
	},
	
	/**
	 * onSubmit to submit request form : ECC service post call
	 */
	onSubmit : function(){
		var busyDialog = new sap.m.BusyDialog();
		busyDialog.open();
		jQuery.sap.delayedCall(100, this , function () {
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var that = this;
		var portActModel = new sap.ui.model.json.JSONModel();
		var oUserData = this.getView().getModel("oUserModel").getData().oUserData;
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		var checked = this.getView().byId('idOnBehalf').getSelected();
		var payload = {
				"SubServiceCode": "00"+"51",
				"ServiceCode": "0015",
				"Port_Tag_Number": this.getView().byId('idPortNo').getValue(),
				"Service_Type": this.getView().byId('idServType').getValue(),
				//"Location": this.getView().byId('idLoc').getValue(),
				"Location":this.getView().byId('buildingId').getSelectedItem().getText()+" - "+this.getView().byId('levelSelId').getSelectedItem().getText()+" - "+this.getView().byId('terRoomId').getValue(),
				"Wftrigger": "X",
				"Request_Type":parseInt(this.getView().byId('reqTypeId').getSelectedItem().getKey()),
				"Requester_KaustId":oUserData.KaustID,
				"status":"001",               // Process "Initiated"
				"UserId" : oUserData.UserId
		};
		
		if(checked && this.getView().byId('onBehalfUserTab').getVisible()){
			var otherUser = this.getView().getModel("oUserSerchModel").getData().d;
			payload.Onbehalf= "X";
			payload.onBehalfUserId =otherUser.UserId;
		//	payload.UserId =otherUser.UserId;
			payload.KaustId = otherUser.KaustID;
			payload. FirstName = otherUser.FirstName;
			payload.MiddleName = otherUser.MiddleName;
			payload.LastName = otherUser.LastName;
			payload.Email = otherUser.Email;
			payload.RManager = otherUser.RManager;
			payload.Position = otherUser.Position;
			payload.Deptname = otherUser.Deptname;
			payload.Mobile = otherUser.Mobile;
			payload.Office = otherUser.Office;
		}else{
		//	payload.UserId = oUserData.UserId;
			payload.KaustId = oUserData.KaustID;
			payload. FirstName = oUserData.FirstName;
			payload.MiddleName = oUserData.MiddleName;
			payload.LastName = oUserData.LastName;
			payload.Email = oUserData.Email;
			payload.RManager = oUserData.RManager;
			payload.Position = oUserData.Position;
			payload.Deptname = oUserData.Deptname;
			payload.Mobile = oUserData.Mobile;
			payload.Office = oUserData.Office;
		}

		var oGascModel= this.getView().getModel("oGascModel");
		oGascModel.create("/PortActivationRequest", 
				payload, null, function(data,response){
				busyDialog.close();
					sap.m.MessageBox.show('Thank you and please note your request ID#'+data.RequestId+', To check status, please go to "My Requests" section.', {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Success",                                   
						actions: sap.m.MessageBox.Action.OK,
						onClose: function(oAction){
							that.resetAllFields();
							that.goBack(oAction);
					    },                                       // default
	  	  			    textDirection: sap.ui.core.TextDirection.Inherit     // default
	  	  			    });
				},function(oError){
					busyDialog.close()
					 sap.m.MessageBox.show(oResourceModel.getText("ERRSUB"), {
                       	        icon: sap.m.MessageBox.Icon.ERROR,
                       	        title: "Error",
                       	        actions: [sap.m.MessageBox.Action.OK],
                       	      }
                       	    );
				});
		});
	},
	
	/**
	 * resetAllFields to reset all UI fields post submission
	 */
	resetAllFields : function(){
	//	this.getView().byId('reqTypeId').setForceSelection(true);
		this.getView().byId('idPortNo').setValue("");
		this.getView().byId('idServType').setValue("");
		//this.getView().byId('idLoc').setValue("");
		this.getView().byId('buildingId').setValue();
		this.getView().byId('levelSelId').setValue();
		this.getView().byId('levelSelId').destroyItems();
		this.getView().byId('levelSelId').clearSelection();
		this.getView().byId('terRoomId').setValue();
	//	this.getView().byId('terRoomId').destroyItems();
	//	this.getView().byId('terRoomId').clearSelection();
		this.getView().byId('onBehalfUserTab').setVisible(false);
	//	this.getView().byId('idTabBar').setSelectedKey("Tab1");
	//	this.getView().byId('appInfo').setIconColor("Neutral");
		this.getView().byId('selPerson').setVisible(false);
		this.getView().byId('idOnBehalf').setSelected(false);
		this.getView().byId('submitBtn').setEnabled(true); 
	},
	
	/**
	 * disableAllFields to disable all UI fields for ticket in readonly mode
	 */
	disableAllFields : function(){
		this.getView().byId('reqTypeId').setEnabled(false);
		this.getView().byId('idPortNo').setEnabled(false);
		this.getView().byId('idServType').setEnabled(false);
		//this.getView().byId('idLoc').setEnabled(false);
		this.getView().byId('buildingId').setEnabled(false);
		this.getView().byId('levelSelId').setEnabled(false);
		this.getView().byId('terRoomId').setEnabled(false);
		this.getView().byId('idOnBehalf').setEnabled(false);
	},
	
	/**
	 * cancelRequest to go back from request screen without submission
	 */
	cancelRequest : function() {
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var that = this;
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
		}else{
			return false;
		}
	},
	
	/**
	 * open email for helpdesk
	 */	
	openEmail : function(){
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		sap.m.URLHelper.triggerEmail(oResourceModel.getText("HELP_DESK"));
	}
	
	
	
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf kaust.ui.kitsportaccess.RequestForm
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf kaust.ui.kitsportaccess.RequestForm
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf kaust.ui.kitsportaccess.RequestForm
*/
//	onExit: function() {
//
//	}
});

