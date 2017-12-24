/**
 * 			ADMINISTRATIVE RIGHTS ACCESS - INCTURE
 * 
 * 3-11-2017: Requester Form to raise a request for seeking administrative rights
 * for the equipments tagged to the KAUST ID.
 * Variants: On-behalf and Custodian
 * Operating System: Windows, MAC and Linux
 * 
 * */
jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([ "sap/ui/core/mvc/Controller", 
                "sap/m/MessageBox",
                "sap/ui/model/json/JSONModel",
                "sap/ui/model/odata/ODataModel"
], function(Controller, MessageBox, JSONModel, ODataModel) {
	"use strict";
	
	return Controller.extend("kaust.ui.kitsAdminAccess.controller.main", { 
		
		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before it
		 * is displayed, to bind event handlers and do other one-time
		 * initialization.
		 * 
		 * @memberOf zui5_windowaccess.main
		 */
		onInit : function() {
			// apply compact density if touch is not supported, the standard cozy design otherwise
			this.getView().addStyleClass(sap.ui.Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact");
			var oView = this.getView();
			var oGascModel= new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS");
				this.getView().setModel(oGascModel, "oGascModel");
			var oDataModel= new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC");
				this.getView().setModel(oDataModel, "oDataModel");
			
			// Visibily model to handle the visibility and enable property of Non Custodian, On behalf buttons and Operating System Check Box 
			var oVisibilityModel = new JSONModel();
			oVisibilityModel.setData({
				"bSelectPersonBtn" : false,
				"bSelectPersonTabBtn" : false,
				"bOnBehalfTabBar" : false,
				"iCustodianRB" : 0,
				"bTagInput" : false,
				"bTagSelect" : true,
				"bWinEnable" : true,
				"bMacEnable" : true,
				"bLinuxEnable" : true,
				"bEnableFields" : true,
				"bTagInpEnable" : true,
				"bSelCustodian" : false, 				// If false use machineOwner fragment for On behalf, if true use for Custodian
				"bWinSel" : false,
				"bMacSel" : false,
				"bLinuxSel" : false,
				"bOnBehalfSel" : false,
				"bDisSel" : false
			});
			oView.setModel(oVisibilityModel, "oVisibilityModel");
			var oUserModel = new JSONModel();				// Logged in User model
			oView.setModel(oUserModel, "oUserModel");
			var oOnBehalfUserModel = new JSONModel();	// On Behalf user details based on KAUST ID
			oView.setModel(oOnBehalfUserModel, "oOnBehalfUserModel");
			
			var sRequestId = this.getRequestId();
			if(sRequestId!=""){ 
				this._fnLoadTicket(sRequestId);
			}else {
	            var that =this;
	    		oGascModel.read("UserDetail?$format=json", {
	    			success: function(oData,res) {
	    				var data =JSON.parse(res.body);
	    				that._fnTagDetails(data.d.results[0].KaustID);
	    				oUserModel.setData(data);
						oUserModel.setProperty("/oUserData", data.d.results[0]);
						that.initializeControlsReadOnly();
	    			},
	    			error: function(oError,res) {
	    				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
	    			}
	    		});
			}
			
		},
		initializeControlsReadOnly : function(){
			var oDatePicker = this.getView().byId("idExpiryDate");
			oDatePicker.addEventDelegate( {
				onAfterRendering : function() {
					
					var oDatePickerInner = this.$().find('.sapMInputBaseInner');
					var oID = oDatePickerInner[0].id;
					$('#' + oID).attr("readOnly", true);
					this.$().find("input").attr("readonly", true);
				}
			}, oDatePicker);
		
		},
		
		/**Fetching the Request ID from the URI Parameters*/
		getRequestId : function(){
			var url = (window.location != window.parent.location)? document.referrer: document.location.href;
			var requestId = url.split("requestId=");
			if(requestId.length > 1){
				return requestId[1];
			}else{
				return "";	
			}
		}, 
		
		/** The method is used to fetch the Equipment Number based on the KAUST ID */
		_fnTagDetails : function (sKaustId) {
			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var sBpmUrl = this._getBRMUrl() + sKaustId; 
			var oTagModel = new JSONModel();
			this.getView().setModel(oTagModel, "oTagModel")
			var that = this;
		    $.ajax({
		    	url: sBpmUrl,
		    	async: "false",
		    	type: "GET",
		    	dataType: "jsonp",
		    	contentType: "application/json",
		    	jsonpCallback: "a",
		    	success: function(oData) {
		    		oTagModel.setProperty("/tagData", oData);
		    	},
		    	error: function(oError) {
		    		MessageBox.show(oBundle.getText("TAG_ERROR"), {
		    			icon : sap.m.MessageBox.Icon.ERROR,
		    			title : oBundle.getText("ERROR_TEXT"),
		    			actions : [ sap.m.MessageBox.Action.OK ],
		    			onClose : null
		    		});
		    	}
		    });
		},
		
		/** Get the BPM URL for the Tag */
		_getBRMUrl : function() {
			var host = window.location.hostname;
			if (host == "localhost") {
				return "http://sthcibpdd1.kaust.edu.sa:50000/kaust.com~sbf~bpm~java~restservices/searchEquipment/searchTransUpdate?KaustId=";
			}
			if (host.indexOf("kaust.edu.sa") == -1) {
				host = host + ".kaust.edu.sa";
			}
			switch (host) {
				case 'sthcigwdq1.kaust.edu.sa':
					var port = window.location.port;
					if(port == "8000" ||port == "8001" ){ //QA port
						return "https://sthcibpdqq1.kaust.edu.sa:50001/kaust.com~sbf~bpm~java~restservices/searchEquipment/searchTransUpdate?KaustId="; 
					}else {//port == "8005" ||port == "8006"
						return "https://sthcibpdqq1.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/searchEquipment/searchTransUpdate?KaustId=";
					}	                            
					break;
				case 'sthgwpsrcs.kaust.edu.sa':
					return "https://sthbppsrcs.kaust.edu.sa:50101/kaust.com~sbf~bpm~java~restservices/searchEquipment/searchTransUpdate?KaustId=";
					break;
				}
			return;
		},
		
		/**
		 * In case the user selects Non-Custodian then Tag Number is entered by the User.
		 * This Tag Number should be same as the tag numbers related to the picked 
		 * KAUST ID.  
		 */
		fnTagInputChange : function (oEvent) {
			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var sTagNumber = oEvent.getSource().getValue().trim();
			sTagNumber = sTagNumber.toUpperCase();
			if(sTagNumber.startsWith("KL")||sTagNumber.startsWith("KW")){
			var bFlag = false;
			var aTagModel = this.getView().getModel("oTagModel").getProperty("/tagData");
			aTagModel.forEach(function(oEle) {
				if (oEle.equipmentNumber === sTagNumber) {
					oEvent.getSource().setValue(sTagNumber);
					bFlag = true;
				}
			});
			if (!bFlag) {
				oEvent.getSource().setValue("");
				MessageBox.show(oBundle.getText("TAG_INP_ERR"), {
	    			icon : sap.m.MessageBox.Icon.ERROR,
	    			title : oBundle.getText("ERROR_TEXT"),
	    			actions : [ sap.m.MessageBox.Action.OK ],
	    			onClose : null
	    		});
			}
		}else{
			oEvent.getSource().setValue("");
			MessageBox.show(oBundle.getText("VAL_TAG"), {
    			icon : sap.m.MessageBox.Icon.ERROR,
    			title : oBundle.getText("ERROR_TEXT"),
    			actions : [ sap.m.MessageBox.Action.OK ],
    			onClose : null
    		});
		}
		},

		/**
		 * On selection of type of user - Own or On behalf In case of On behalf make
		 * the button Select Person Visible
		 */
		onUserTypeSelect : function(oEvent) {
			var iSelectedUserType = oEvent.getSource().getSelectedIndex();
			var oUserModel = this.getView().getModel("oUserModel");
			var oVisibilityModel = this.getView().getModel("oVisibilityModel");
			if (iSelectedUserType === 1) {
				oVisibilityModel.setProperty("/bSelectPersonBtn", true);
				oVisibilityModel.setProperty("/bTagInput", true);
				oVisibilityModel.setProperty("/bTagSelect", false);
				oVisibilityModel.setProperty("/bTagInpEnable", false);
				this.getView().byId("custodianName").setText("");
			} else {
				oVisibilityModel.setProperty("/bSelectPersonBtn", false);
				oVisibilityModel.setProperty("/bTagInput", false);
				oVisibilityModel.setProperty("/bTagSelect", true);
				this.byId("idTagInput").setValue("");
				this._fnTagDetails(oUserModel.getProperty("/oUserData/KaustID"));
			}
		},

		/** If on behalf is selected open the search box based on KAUST Badge ID */
		onSelectPersonPress : function(oEvent) {
			var oVisibilityModel = this.getView().getModel("oVisibilityModel");
			var sBtnId = oEvent.getParameter("id").split("--")[1];
			if (sBtnId === "idCustodianSelBtn") {
				oVisibilityModel.setProperty("/bSelCustodian", true);
			} else {
				oVisibilityModel.setProperty("/bSelCustodian", false);
			}
			if (!this.oSearchUserFragment) {
				this.oSearchUserFragment = sap.ui.xmlfragment("kaust.ui.kitsAdminAccess.fragments.machineOwner", this);
				this.getView().addDependent(this.oSearchUserFragment);
			}
			this.oSearchUserFragment.open();
		},

		/**
		 * Search the user information based on the given KAUST Badge Number Show
		 * the detail of the user in Form Search Result
		 */
		onUserSearchPress : function(oEvent) {
			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var sSearchKID = oEvent.getParameter("query");
			var oUserModel = this.getView().getModel("oUserModel");
			var oOnBehalfUserModel = this.getView().getModel("oOnBehalfUserModel");
			var oSearchUserFrag = this.oSearchUserFragment;
			var oSearchResForm = oSearchUserFrag.getContent()[2];
			var oPickUserBtn = oSearchUserFrag.getBeginButton();
			var that = this;
			if (sSearchKID !== "") {
				if(sSearchKID==this.getView().getModel("oUserModel").getData().d.results[0].KaustID){
				 sap.m.MessageBox.show(oBundle.getText("ONBEHAL_USER_ERR"), {
	       	        icon: sap.m.MessageBox.Icon.WARNING,
	       	        title: "Warning",
	       	        actions: [sap.m.MessageBox.Action.OK],
	       	     });
				 oEvent.getSource().setValue("");
				 return;
				} else {
					oSearchUserFrag.setBusy(true);
//					oOnBehalfUserModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + sSearchKID + "',UserId='')?$format=json");
					 var oUserSerchModel = new sap.ui.model.json.JSONModel();
					var oDataModel = this.getView().getModel("oDataModel");
	                oDataModel.read("UserDetail(KaustID='" + sSearchKID + "',UserId='')?$format=json", {
	        			success: function(oData,res) {
	        				oSearchUserFrag.setBusy(false);
	        				oUserSerchModel.setData(JSON.parse(res.body));
	        		        if (oUserSerchModel.getData().d.KaustID != "") {
	                            that.getView().setModel(oUserSerchModel, "oOnBehalfUserModel");
	                            oSearchResForm.setModel("oOnBehalfUserModel");
	                            oSearchResForm.setVisible(true);
	                            oPickUserBtn.setEnabled(true);
	                        } else {
	                        	oSearchResForm.setVisible(false);
								oPickUserBtn.setEnabled(false);
	                            sap.m.MessageBox.show(oBundle.getText("USER_NF_ERROR"), {
	                                icon: sap.m.MessageBox.Icon.WARNING,
	                                title: "Warning",
	                                actions: [sap.m.MessageBox.Action.OK],
	                            });
	                        }
	        			},
	        			error: function(oError,res) {
	        				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
	        			}
	        		});
				}
			} else {
				MessageBox.show(oBundle.getText("KAUSTID_ERROR"), {
					icon : sap.m.MessageBox.Icon.ERROR,
					title : oBundle.getText("ERROR_TEXT"),
					actions : [ sap.m.MessageBox.Action.OK ],
					onClose : null
				});
				oSearchResForm.setVisible(false);
				oPickUserBtn.setEnabled(false);
			}
		},

		/** Close the Search User Dialog */
		onCancelPress : function() {
			this.oSearchUserFragment.close();
			var oSearchField = this.oSearchUserFragment.getContent()[1];
			var oSearchResForm = this.oSearchUserFragment.getContent()[2];
			var oPickUserBtn = this.oSearchUserFragment.getBeginButton();
			oSearchField.setValue(null);
			oSearchResForm.setVisible(false);
			oPickUserBtn.setEnabled(false);
		},

		/**  On press of the PICK button from the Select Custodian Fragment */
		onPickPress : function(oEvent) {
			var oView = this.getView();
			var sTagInput = this.byId("idTagInput").getValue();
			var oSearchField = this.oSearchUserFragment.getContent()[1];
			var oSearchResForm = this.oSearchUserFragment.getContent()[2];
			var oVisibilityModel = oView.getModel("oVisibilityModel");
			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			if (oVisibilityModel.getProperty("/bSelCustodian")) {
				var oOnBehalfUserModel = oView.getModel("oOnBehalfUserModel");
				if(!oOnBehalfUserModel.getProperty("/d/LastName"))
					this.getView().byId("custodianName").setText(oOnBehalfUserModel.getProperty("/d/FirstName"));
				else
					this.getView().byId("custodianName").setText(oOnBehalfUserModel.getProperty("/d/FirstName")+" "+oOnBehalfUserModel.getProperty("/d/LastName"));
//				this.getView().byId("custodianName").setVisible(true);
				this.custodianUserId = oOnBehalfUserModel.getProperty("/d/UserId");
				if (this.custodianUserId) {
					oVisibilityModel.setProperty("/bTagInpEnable", true);
					this._fnTagDetails(oOnBehalfUserModel.getProperty("/d/KaustID"));
				} else {
					MessageBox.show(oBundle.getText("CUS_NOUSERID_ERR"), {
						icon : sap.m.MessageBox.Icon.ERROR,
						title : oBundle.getText("ERROR_TEXT"),
						actions : [ sap.m.MessageBox.Action.OK ],
						onClose : null
					});
					oVisibilityModel.setProperty("/bTagInpEnable", false);
				}
				if (sTagInput) {
					this.byId("idTagInput").setValue("");
				}
			} else {
				var oOnBehalfTabBar = this.byId("idOnBehalfTab");
				var oMachineOwnerModel = oView.getModel("oMachineOwnerModel");
				oOnBehalfTabBar.setModel(oMachineOwnerModel);
				oOnBehalfTabBar.setVisible(true);
			}
			oSearchField.setValue(null);
			oSearchResForm.setVisible(false);
			oEvent.getSource().setEnabled(false);
			this.oSearchUserFragment.close();
		},

		/**
		 * If the user checks the on behalf check box make the Select Person button
		 * visible. The Select Person button helps in selecting the on behalf user
		 * which is the same functionality that happens on selection of the
		 * custodian as NO.
		 */
		fnOnBehalfSelect : function(oEvent) {
			var bOnBehalf = oEvent.getParameter("selected");
			var oVisibilityModel = this.getView().getModel("oVisibilityModel");
			if (bOnBehalf) {
				oVisibilityModel.setProperty("/bSelectPersonTabBtn", true);
			} else {
				oVisibilityModel.setProperty("/bSelectPersonTabBtn", false);
				oVisibilityModel.setProperty("/bOnBehalfTabBar", false);
			}
		},
		
		/**
		 * For operating system the user can select either Windows/MAC either one but in that case Linux is disabled.
		 * If the user selects Linux Windows/MAC are disabled.
		 * The method is invoked on the selection of Linux System
		 */
		fnLinuxCB : function(oEvent) {
			var oVisibilityModel = this.getView().getModel("oVisibilityModel");
			var bLinuxCB = oEvent.getParameter("selected");
			if (bLinuxCB) {
				oVisibilityModel.setProperty("/bWinEnable", false);
				oVisibilityModel.setProperty("/bMacEnable", false);
			} else {
				oVisibilityModel.setProperty("/bWinEnable", true);
				oVisibilityModel.setProperty("/bMacEnable", true);
			}
		},
		
		/**
		 * For operating system the user can select either Windows/MAC either one but in that case Linux is disabled.
		 * If the user selects Linux Windows/MAC are disabled.
		 * The method is invoked on the selection of Windows/MAC OS System
		 */
		fnWinMacCB : function(oEvent) {
			var oVisibilityModel = this.getView().getModel("oVisibilityModel");
			var bWinMacCB = oEvent.getParameter("selected");
			var bWinMacSelected = this.byId("idWinCB").getSelected() || this.byId("idMacCB").getSelected();
			if (bWinMacCB) {
				oVisibilityModel.setProperty("/bLinuxEnable", false);
			} else if (!(bWinMacSelected)) {
				oVisibilityModel.setProperty("/bLinuxEnable", true);
			}
		},
		
		/** The expiry date indicates until when the administrative rights are required */
		getEpiryDateChange : function(oEvent, oValue) {
			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oExpDate;
			if (!oEvent) {
				oExpDate = oValue;
			} else {
				oExpDate = oEvent.oSource.getDateValue();
			}
			var oCurrentDate = new Date();
			if (oExpDate < oCurrentDate || oExpDate === "") {
				MessageBox.show(oBundle.getText("EXP_DATE_ERR"), {
					icon : sap.m.MessageBox.Icon.ERROR,
					title : oBundle.getText("ERROR_TEXT"),
					actions : [ sap.m.MessageBox.Action.OK ],
					onClose : null
				});
				if (oEvent) {
					oEvent.oSource.setValueState("Error");
					oEvent.oSource.removeStyleClass("sapMInputBaseMessage");
				}
				return false;
			} else {
				if (oEvent) {
					oEvent.oSource.setValueState("None");
				}
				return true;
			} 
		},
		
		/**
		 * The event is used to trigger the mail to ithelpdesk@kaust.edu.sa
		 * The event will open the default mail configured in the user's 
		 * system.  
		 */
		fnHelpDeskPress : function (oEvent) {
			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			sap.m.URLHelper.triggerEmail(oBundle.getText("HELPDESK"));
		},

		/**
		 * On selection of Submit button Validate the fields before raising the request.
		 * The event is invoked internally. 
		 */
		_getValidationOnPress : function(oEvent) {
			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oVisibilityModel = this.getView().getModel("oVisibilityModel");
			var oTnCCheckBox = this.byId("idTNCCheckBox");
			var bOnBehalfCBSel = this.byId("idOnBehalfCB").getSelected();
			// Validate On Behalf
			if (bOnBehalfCBSel) {
				if (!(oVisibilityModel.getProperty("/bOnBehalfTabBar"))) {
					MessageBox.show(oBundle.getText("ON_BEHALF_ERR"), {
						icon : sap.m.MessageBox.Icon.ERROR,
						title : oBundle.getText("ERROR_TEXT"),
						actions : [ sap.m.MessageBox.Action.OK ],
						onClose : null
					});
					return false;
				}
			}
			// Validate Terms and Conditions
			if (!(oTnCCheckBox.getSelected())) {
				MessageBox.show(oBundle.getText("TNC_ERROR"), {
					icon : sap.m.MessageBox.Icon.ERROR,
					title : oBundle.getText("ERROR_TEXT"),
					actions : [ sap.m.MessageBox.Action.OK ],
					onClose : null
				});
				return false;
			}
			// Validate Operating System Selection
			if (!(this.byId("idWinCB").getSelected() || this.byId("idMacCB").getSelected() || this.byId("idLinuxCB").getSelected())) {
				MessageBox.show(oBundle.getText("OPERATING_SYS_ERROR"), {
					icon : sap.m.MessageBox.Icon.ERROR,
					title : oBundle.getText("ERROR_TEXT"),
					actions : [ sap.m.MessageBox.Action.OK ],
					onClose : null
				});
				return false;
			}
			// Validate Tag Number
			if (oVisibilityModel.getProperty("/iCustodianRB") === 0) {
				if (this.byId("idTagSelect").getSelectedKey() === "") {
					MessageBox.show(oBundle.getText("TAG_EMP_ERROR"), {
						icon : sap.m.MessageBox.Icon.ERROR,
						title : oBundle.getText("ERROR_TEXT"),
						actions : [ sap.m.MessageBox.Action.OK ],
						onClose : null
					});
					return false;
				}
			} else if (oVisibilityModel.getProperty("/iCustodianRB") === 1){
				if (this.byId("idTagInput").getValue() === "") {
					MessageBox.show(oBundle.getText("TAG_EMP_ERROR"), {
						icon : sap.m.MessageBox.Icon.ERROR,
						title : oBundle.getText("ERROR_TEXT"),
						actions : [ sap.m.MessageBox.Action.OK ],
						onClose : null
					});
					return false;
				}
			}
			// Validate expiry date - empty
			var oValue = this.byId("idExpiryDate").getDateValue();
			if (!(this.getEpiryDateChange(null, oValue))) {
				return false;	
			}
		
			return true;
		},
		
		/**
		 * Formation of the pay load to raise the request. The event is invoked internally
		 * when the validations return true. 
		 */
		_getAdminPayload : function(oAdminPayload) {
			var oView = this.getView();
			var oVisibilityModel = oView.getModel("oVisibilityModel");
			var oUserModelData = oView.getModel("oUserModel").getProperty("/oUserData");
			var aOperSys = [];
			oAdminPayload.UserId =oUserModelData.UserId;
			
			if (oVisibilityModel.getProperty("/bOnBehalfTabBar")) {
				var oOnBehalfUserData = oView.getModel("oOnBehalfUserModel").getProperty("/d");
				oAdminPayload.Onbehalf = "X";
				oAdminPayload.onBehalfUserId = oOnBehalfUserData.UserId;
				oAdminPayload.KaustId = oOnBehalfUserData.KaustID;
				oAdminPayload.FirstName = oOnBehalfUserData.FirstName;
				oAdminPayload.MiddleName = oOnBehalfUserData.MiddleName;
				oAdminPayload.LastName = oOnBehalfUserData.LastName;
				oAdminPayload.email = oOnBehalfUserData.Email;
				oAdminPayload.rept_mang = oOnBehalfUserData.RManager;
				oAdminPayload.position = oOnBehalfUserData.Position;
				oAdminPayload.department = oOnBehalfUserData.Deptname;
				oAdminPayload.mobile = oOnBehalfUserData.Mobile;
				oAdminPayload.office = oOnBehalfUserData.Office;
				oAdminPayload.activityType = "Behalf";
			} else {
				oAdminPayload.Onbehalf = "";
				oAdminPayload.activityType = "Self";
				oAdminPayload.UserId = oUserModelData.UserId;
				oAdminPayload.KaustId = oUserModelData.KaustID;
				oAdminPayload.FirstName = oUserModelData.FirstName;
				oAdminPayload.MiddleName = oUserModelData.MiddleName;
				oAdminPayload.LastName = oUserModelData.LastName;
				oAdminPayload.email = oUserModelData.Email;
				oAdminPayload.rept_mang = oUserModelData.RManager;
				oAdminPayload.position = oUserModelData.Position;
				oAdminPayload.department = oUserModelData.Deptname;
				oAdminPayload.mobile = oUserModelData.Mobile;
				oAdminPayload.office = oUserModelData.Office;
			}
			oAdminPayload.reqKaustId = oUserModelData.KaustID;
			oAdminPayload.justification = this.byId("idJustification").getValue().trim();
			var oDate = this.byId("idExpiryDate").getDateValue();
			var sMonth = oDate.getMonth()+1;
			sMonth = sMonth.toString();
			if (sMonth.length === 1) {
				sMonth = "0" + sMonth;
			}
			oAdminPayload.expDate = oDate.getFullYear() + "-" + sMonth + "-" + oDate.getDate() + "T00:00:00";
			if (oVisibilityModel.getProperty("/iCustodianRB") === 0) {
				oAdminPayload.custodian = "0";
				oAdminPayload.tagNumber = this.byId("idTagSelect").getSelectedKey();
				oAdminPayload.requestType = "Custodian";
			} else {
				oAdminPayload.custodian = "X";
				oAdminPayload.tagNumber = this.byId("idTagInput").getValue().trim();
				oAdminPayload.requestType = "Non Custodian";
				oAdminPayload.custodianUserId = this.custodianUserId;
			}
			this.byId("idWinCB").getSelected() ? aOperSys.push("Windows") : aOperSys;
			this.byId("idMacCB").getSelected() ? aOperSys.push("Mac") : aOperSys;
			this.byId("idLinuxCB").getSelected() ? aOperSys.push("Linux") : aOperSys;
			
			oAdminPayload.operatingSystem = aOperSys.join(",");
			this.byId("idLinuxCB").getSelected() ? oAdminPayload.flow = "YES" : oAdminPayload.flow = "NO";
			
			return oAdminPayload;
		},
		
		/**
		 * On press of Submit button invoke the validation function in case
		 * of all validations are done create the pay load and call the create 
		 * request oData Service.
		 */
		fnSubmitAdminReq : function(oEvent) {
			var that = this;
			var oAdminPage = this.byId("idAdminAccessPage");
			if (this._getValidationOnPress()) {
				var oAdminPayload = {
					"requestId" : "",
					"SubServiceCode" : "00" + "54",
					"status" : "001",
					"ServiceCode" : "0016",
					"ProcessId" : " ",
					"Stage" : "",
					"Onbehalf" : "",
					"onBehalfUserId":"",
					"FirstName" : "",
					"MiddleName" : "",
					"LastName" : "",
					"Wftrigger" : "X",
					"MsgTyp1" : "",
					"Msg1" : "",
					"email" : "",
					"mobile" : "",
					"UserId" : "",
					"office" : "",
					"rept_mang" : "",
					"department" : "",
					"position" : "",
					"KaustId" : "",
					"role" : "",
					"custodian" : "",
					"justification" : "",
					"tagNumber" : "",
					"operatingSystem" : "",
					"expDate" : "",
					"reqKaustId" : "",
					"requestType" : "",
					"activityType" : "",
					"flow" :"",
					"lastTaskStatus":"NA",
					"t_name":"",
					"t_userid":"",
					"t_kaustid":"",
					"t_role":"",
					"org_name":"",
					"org_unit":"",
					"comments":""
				}
				oAdminPayload = this._getAdminPayload(oAdminPayload);
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var oGascModel = this.getView().getModel("oGascModel");
//				var oKitsModel = new ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS");
				oAdminPage.setBusy(true);
				oGascModel.create("/AdminRightsReqSet", oAdminPayload, null, function(oData,oResponse){
					oAdminPage.setBusy(false);
					var sSuccessMsg = oBundle.getText("SUCCESS_MSG", [oData.requestId]);
					MessageBox.show(sSuccessMsg, {
					    icon: sap.m.MessageBox.Icon.SUCCESS,                 
					    title: oBundle.getText("SUCCESS"),                                         
					    actions: sap.m.MessageBox.Action.OK,              
					    onClose: function (oAction) {
							if (oAction === "OK") {
								that.resetAllFields();
							}
						},                                       
					    initialFocus: null,                                  
					    textDirection: sap.ui.core.TextDirection.Inherit    
					});
					},function(oError){
						oAdminPage.setBusy(false);
						MessageBox.show(oBundle.getText("ERR_SUBMIT"), {
							icon : sap.m.MessageBox.Icon.ERROR,
							title : oBundle.getText("ERROR_TEXT"),
							actions : [ sap.m.MessageBox.Action.OK ],
							onClose : null,
							details : oError
						});
					});
			}
		},
		
		/**
		 * If the user presses Cancel the user is prompted with the message to confirm the 
		 * cancellation of the request. 
		 */
		fnCancelAdminReq : function () {
			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var that = this;
			sap.m.MessageBox.show(oBundle.getText("CONFIRM_CANCEL"), {
				icon : sap.m.MessageBox.Icon.WARNING,
				title : oBundle.getText("WARNING_TEXT"),
				actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose : function (oAction) {
					if (oAction === "YES") {
						that.resetAllFields();
					}
				}
			});
		},
		
		/** Reset all the fields once a request is raised */
		resetAllFields:function() {
			var oView = this.getView();
			var oVisibilityModel = oView.getModel("oVisibilityModel");
			oVisibilityModel.setData({
				"bSelectPersonBtn" : false,
				"bSelectPersonTabBtn" : false,
				"bOnBehalfTabBar" : false,
				"iCustodianRB" : 0,
				"bTagInput" : false,
				"bTagSelect" : true,
				"bWinEnable" : true,
				"bMacEnable" : true,
				"bLinuxEnable" : true,
				"bEnableFields" : true,
				"bTagInpEnable" : true,
				"bSelCustodian" : false, 				// If false use machineOwner fragment for On behalf, if true use for Custodian
				"bWinSel" : false,
				"bMacSel" : false,
				"bLinuxSel" : false,
				"bOnBehalfSel" : false,
				"bDisSel" : false
			});
			oVisibilityModel.refresh(true);
			this.byId("idJustification").setValue("");
			var oUserModel = oView.getModel("oUserModel");
			this._fnTagDetails(oUserModel.getProperty("/d/results/0/KaustID"));
			this.byId("idExpiryDate").setValue("");
		},
		
		/**
		 * In case the Request ID is present then the view should load the details with 
		 * respect to the Request and disable all the fields for the same.
		 * The footer needs to be removed. 
		 */
		_fnLoadTicket : function (sRequestId) {
			var oAdminPage = this.byId("idAdminAccessPage");
			oAdminPage.setBusy(true);
			var that = this;
//			 var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
//			var oAdminAccessModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
			oGascModel = this.getView().getModel("oGascModel");
			this.getView().setModel(oAdminAccessModel, "oAdminAccessModel");
			oGascModel.read("AdminRightsReqSet?$filter=requestId eq '" + sRequestId + "'", {
				success: function(oData) {
					if (oData.results) {
						that._fnPrepareView(oData.results[0]);
						oAdminPage.setBusy(false);
						oAdminPage.destroyFooter();
					} else {
						MessageBox.show(oBundle.getText("NODATA_ERROR"), {
							icon : sap.m.MessageBox.Icon.ERROR,
							title : oBundle.getText("ERROR_TEXT"),
							actions : [ sap.m.MessageBox.Action.OK ],
							onClose : null
						});
					}
				},
				error: function(oError) {
					oAdminPage.setBusy(false);
					MessageBox.show(oError.response.statusCode + " : " + oError.response.statusText, {
						icon : sap.m.MessageBox.Icon.ERROR,
						title : oBundle.getText("ERROR_TEXT"),
						actions : [ sap.m.MessageBox.Action.OK ],
						onClose : null,
						details : oError
					});
				}
			});
		},
		
		/** Function to prepare the View in case the request id is available */
		_fnPrepareView : function(oAdminAccessData) {
			var that = this;
			var oView = this.getView();
			var oUserModel = oView.getModel("oUserModel");
			var oOnBehalfUserModel = oView.getModel("oOnBehalfUserModel");
			var oVisibilityModel = oView.getModel("oVisibilityModel");
			if (oAdminAccessData.custodian === "X") {
				oVisibilityModel.setProperty("/iCustodianRB", 1);
			} else {
				oVisibilityModel.setProperty("/iCustodianRB", 0);
			}
			this.byId("idTagInput").setValue(oAdminAccessData.tagNumber);
			this.byId("idJustification").setValue(oAdminAccessData.justification);
			var aOperSys = oAdminAccessData.operatingSystem.split(",");
			aOperSys.forEach(function (oEle) {
				oEle === "Windows" ? that.byId("idWinCB").setSelected(true) : oEle === "Mac" ? that.byId("idMacCB").setSelected(true) : that.byId("idLinuxCB").setSelected(true);
			});
			oVisibilityModel.setProperty("/bWinEnable", false);
			oVisibilityModel.setProperty("/bMacEnable", false);
			oVisibilityModel.setProperty("/bLinuxEnable", false);
			oVisibilityModel.setProperty("/bEnableFields", false);
			oVisibilityModel.setProperty("/bTagSelect", false);
			oVisibilityModel.setProperty("/bTagInpEnable", false);
			oVisibilityModel.setProperty("/bTagInput", true);
			
			var aDate = oAdminAccessData.expDate.split("T")[0].split("-");
			this.byId("idExpiryDate").setDateValue(new Date(aDate[0], aDate[1], aDate[2]));
			this.byId("idTNCCheckBox").setSelected(true);
			
			if (oAdminAccessData.Onbehalf === "X") {
//				var oOnBehalfUserModel = this.getView().getModel("oDataModel");

//				 var oOnBehalfUserModel = new sap.ui.model.json.JSONModel();
				var oDataModel = this.getView().getModel("oDataModel");
                oDataModel.read("UserDetail(KaustID='" + oAdminAccessData.KaustId + "',UserId='')?$format=json", {
        			success: function(oData,res) {
        				oOnBehalfUserModel.setData(JSON.parse(res.body));
        		        if (oOnBehalfUserModel.getData().d.KaustID != "") {
        		        	oVisibilityModel.setProperty("/bOnBehalfTabBar", true);
							oVisibilityModel.setProperty("/bSelectPersonTabBtn", true);
							that.byId("idOnBehalfCB").setSelected(true);
                        } else {
							MessageBox.show(oBundle.getText("USER_NF_ERROR"), {
								icon : sap.m.MessageBox.Icon.ERROR,
								title : oBundle.getText("ERROR_TEXT"),
								actions : [ sap.m.MessageBox.Action.OK ],
								onClose : null
							});
						}
        			},
        			error: function(oError,res) {
        				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
        			}
        		});
			
//				oOnBehalfUserModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + oAdminAccessData.KaustId + "',UserId='')?$format=json", null, true);
//				oOnBehalfUserModel.attachRequestCompleted(function(oEvent){
//					if (oEvent.getParameter("success")) {
//						if (oOnBehalfUserModel.getProperty("/d/KaustID") !== "") {
//							oVisibilityModel.setProperty("/bOnBehalfTabBar", true);
//							oVisibilityModel.setProperty("/bSelectPersonTabBtn", true);
//							that.byId("idOnBehalfCB").setSelected(true);
//						} else {
//							MessageBox.show(oBundle.getText("USER_NF_ERROR"), {
//								icon : sap.m.MessageBox.Icon.ERROR,
//								title : oBundle.getText("ERROR_TEXT"),
//								actions : [ sap.m.MessageBox.Action.OK ],
//								onClose : null
//							});
//						}
//					}
//				});
//				oOnBehalfUserModel.attachRequestFailed(function(oError){
//					MessageBox.show(oError.getParameter("statusCode") + ":" + oError.getParameter("statusText"), {
//						icon : sap.m.MessageBox.Icon.ERROR,
//						title : oBundle.getText("ERROR_TEXT"),
//						actions : [ sap.m.MessageBox.Action.OK ],
//						onClose : null,
//						details : oError
//					});
//				});
			} else {
				oVisibilityModel.setProperty("/bOnBehalfTabBar", false);
				that.byId("idOnBehalfCB").setSelected(false);
			}
//			 var oUserModel = new sap.ui.model.json.JSONModel();
				var oDataModel = this.getView().getModel("oDataModel");
             oDataModel.read("UserDetail(KaustID='" + oAdminAccessData.KaustId + "',UserId='')?$format=json", {
     			success: function(oData,res) {
     				oUserModel.setData(JSON.parse(res.body));
     		        if (oUserModel.getData().d.KaustID != "") {
     		        	oUserModel.setProperty("/oUserData", oUserModel.getProperty("/d"))
     		        	} else {
    						MessageBox.show(oBundle.getText("USER_NF_ERROR"), {
    							icon : sap.m.MessageBox.Icon.ERROR,
    							title : oBundle.getText("ERROR_TEXT"),
    							actions : [ sap.m.MessageBox.Action.OK ],
    							onClose : null
    						});
    					}
     			},
     			error: function(oError,res) {
     				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
     			}
     		});
			
			
//			
//			oUserModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + oAdminAccessData.reqKaustId + "',UserId='')?$format=json", null, true);
//			oUserModel.attachRequestCompleted(function(oEvent){
//				if (oEvent.getParameter("success")) {
//					if (oUserModel.getProperty("/d/KaustID") !== "") {
//						oUserModel.setProperty("/oUserData", oUserModel.getProperty("/d"))
//					} else {
//						MessageBox.show(oBundle.getText("USER_NF_ERROR"), {
//							icon : sap.m.MessageBox.Icon.ERROR,
//							title : oBundle.getText("ERROR_TEXT"),
//							actions : [ sap.m.MessageBox.Action.OK ],
//							onClose : null
//						});
//					}
//				}
//			});
//			oUserModel.attachRequestFailed(function(oError){
//				MessageBox.show(oError.getParameter("statusCode") + ":" + oError.getParameter("statusText"), {
//					icon : sap.m.MessageBox.Icon.ERROR,
//					title : oBundle.getText("ERROR_TEXT"),
//					actions : [ sap.m.MessageBox.Action.OK ],
//					onClose : null,
//					details : oError
//				});
//			});
//			
			
			
		}
	}); 
});