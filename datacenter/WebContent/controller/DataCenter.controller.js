jQuery.sap.require("kaust.ui.kitsDataAccess.utility.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.controller("kaust.ui.kitsDataAccess.controller.DataCenter", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf data_center.DataCenter
     */
    onInit: function() {
        var oGascModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS");
        this.getView().setModel(oGascModel, "oGascModel");
        var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC");
        this.getView().setModel(oDataModel, "oDataModel");
        var requestId = this.getRequestId();
        if (requestId != "") {
            this.loadTicket(requestId);
        } else {
            var oUserModel = new sap.ui.model.json.JSONModel();
            var that = this;
            oGascModel.read("UserDetail?$format=json", {
                success: function(oData, res) {
                    oUserModel.setData(JSON.parse(res.body));
                    that.getView().setModel(oUserModel, "oUserModel");
                    that.getView().byId('userInfoTab').setModel(oUserModel);
                    that.justifictaionForm();
                },
                error: function(oError, res) {
                    jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
                }
            });
            var requestModel = new sap.ui.model.json.JSONModel();
            var data = {
                enableField: true
            };
            requestModel.setData(data);
            this.getView().setModel(requestModel, "requestData");
            
        }
       
    },
    /**
     *  to Make all the Controls readonly
     *  */
    initializeControlsReadOnly: function() {
        var oDatePicker = this.getView().byId("requestDate");
        oDatePicker.addEventDelegate({
            onAfterRendering: function() {

                var oDatePickerInner = this.$().find('.sapMInputBaseInner');
                var oID = oDatePickerInner[0].id;
                $('#' + oID).attr("readOnly", true);
                this.$().find("input").attr("readonly", true);
            }
        }, oDatePicker);

    },
    /** 
     * to Fetch Request Id from the URL
     * */
    getRequestId: function() {
        var url = (window.location != window.parent.location) ? document.referrer : document.location.href;
        var requestId = url.split("requestId=");
        if (requestId.length > 1) {
            return requestId[1];
        } else {
            return "";
        }
    },
    /**
     *  to Load CRM Ticket
     *  */
    loadTicket: function(requestId) {
        var that = this;
        var oGascModel = this.getView().getModel("oGascModel");
        oGascModel.read("DataCenterSet?$filter=RequestId eq '" + requestId + "'&$expand=DCToTemplate&$format=json", {
            success: function(oData, res) {
                if (JSON.parse(res.body).d.results[0]) {
                    that.setDataToFields(JSON.parse(res.body).d.results[0]);
                    that.disableFields();
                    that.getView().byId("requestDateCRM").setValue(that.getView().byId("requestDate").getValue());
                }
            },
            error: function(oError, res) {
                jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
            }
        });
        

        
		var url ="/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileRead?$filter=UNIQUE_ID eq '" + requestId + "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '3'";
		var oFileModel = new sap.ui.model.json.JSONModel();
		oFileModel.loadData(url, null, false);
		if(oFileModel.getData().d.results[0].URL != ""){
			this.getView().byId('fileUrl').setHref(oFileModel.getData().d.results[0].URL);
		}
		
		this.getView().byId("uploadUrlLbl").setVisible(false);
		this.getView().byId("uploadBtn").setVisible(false);
		 this.getView().byId("fileuploaderBlock").setVisible(false);
		 this.getView().byId("fileDisplay").setVisible(false);
		 this.getView().byId("fileLinktoDwn").setVisible(true);
		 this.getView().byId("requestDateCRM").setVisible(true);
        this.getView().byId("requestDate").setVisible(false);
        this.getView().byId("Justification").setVisible(false);
        this.getView().byId("templateForm").setVisible(true);
        this.getView().byId("idOnBehalf").setEnabled(false);
        this.getView().byId("cancelBtn").setVisible(false);
        this.getView().byId("submitBtn").setVisible(false);
        this.getView().byId("updateBtn").setVisible(false);
    },
    /** 
     * to set Data for Readonly screen to the Form 
     * */
    setDataToFields: function(data) {
        var reqData = {}
        if (data.DCToTemplate.results.length > 0) {
            for (var i = 0; i < data.DCToTemplate.results.length; i++) {
                if (data.DCToTemplate.results[i].templateField.toUpperCase() == "IT-Data Center team".toUpperCase())
                    reqData.itDataCenter = true;
                if (data.DCToTemplate.results[i].templateField.toUpperCase() == "IT-Exchange Building".toUpperCase())
                    reqData.itExchangeBuild = true;
                if (data.DCToTemplate.results[i].templateField.toUpperCase().includes("IT-High Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.toUpperCase().includes("Building-14 templates".toUpperCase()))
                    reqData.itBuldingHigh = true;
                if (data.DCToTemplate.results[i].templateField.toUpperCase().includes("IT-Low Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.toUpperCase().includes("Building-14 templates".toUpperCase()))
                    reqData.itBuldingLow = true;
                if (data.DCToTemplate.results[i].templateField.toUpperCase().includes("IT-Medium Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.toUpperCase().includes("Building-14 templates".toUpperCase()))
                    reqData.itBuldingMedium = true;
                if (data.DCToTemplate.results[i].templateField.toUpperCase().includes("IT Test Room".toUpperCase()))
                    reqData.itBuildingTest = true;
                if (data.DCToTemplate.results[i].templateField.toUpperCase().includes("IT-IN-Camps Maintenance (BDC,SCC)".toUpperCase()))
                    reqData.itInCmps = true;
                if (data.DCToTemplate.results[i].templateField.toUpperCase().includes("IT-OUT-Camps Maintenance (EXB,SHQ)".toUpperCase()))
                    reqData.itOutCmps = true;
                if (data.DCToTemplate.results[i].templateField.toUpperCase().includes("IT-High Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.toUpperCase().includes("Building 1 templates".toUpperCase()))
                    reqData.itBuildingTempHighDesity = true;
                if (data.DCToTemplate.results[i].templateField.toUpperCase().includes("IT-Low Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.includes("Building 1 templates".toUpperCase()))
                    reqData.itBuildingTempLowDensity = true;
                if (data.DCToTemplate.results[i].templateField.includes("IT-Medium Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.includes("Building 1 templates".toUpperCase()))
                    reqData.itBuildingTempMedium = true;
                if (data.DCToTemplate.results[i].templateField.includes("IT-Stock Room".toUpperCase()))
                    reqData.itBuildingTempItStock = true;
                if (data.DCToTemplate.results[i].templateField.includes("IT-MTER-1".toUpperCase()))
                    reqData.itBuildingTempItMeter = true;
                if (data.DCToTemplate.results[i].templateField.includes("IT-MTER-2".toUpperCase()))
                    reqData.itBuidingTempItMeter2 = true;
                if (data.DCToTemplate.results[i].templateField.includes("IT-Security Room".toUpperCase()))
                    reqData.itSecurityRoom = true;
                if (data.DCToTemplate.results[i].templateField.includes("IT-Front and Back Stairs-BDC".toUpperCase()))
                    reqData.otherTempItFront = true;
                if (data.DCToTemplate.results[i].templateField.includes("IT-Spine Access-BDC".toUpperCase()))
                    reqData.otherTempItSpain = true;
                if (data.DCToTemplate.results[i].templateField.includes("IT-Spine Access-SCC".toUpperCase()))
                    reqData.otherTempItSpainscc = true;
            }
            if (data.attachment)
                reqData.fileLink = data.attachment;
            reqData.reqDate = new Date(parseInt(data.requestDate.split("(")[1].split(")")[0])).toISOString().split("T")[0];
            if (data.accessType == "X")
                this.getView().byId("escorted").setSelected(true);
            else
                this.getView().byId("unEscorted").setSelected(true);
            var userData = {
                d: {
                    results: [{
                        FirstName: data.FirstName,
                        LastName: data.LastName,
                        KaustID: data.kaustId,
                        Email: data.Email,
                        Position: data.Position,
                        Deptname: data.Deptname,
                        Office: data.Office,
                        Mobile: data.Mobile,
                    }]
                }
            };
            var oUserModel = new sap.ui.model.json.JSONModel();
            oUserModel.setData(userData);
            this.getView().byId('userInfoTab').setModel(oUserModel);
            this.getView().byId("Aggreement1").setVisible(false);
            this.getView().byId("AggreeCheck").setVisible(false);
            this.getView().byId("AggreeLink").setVisible(false);
            var requestModel = new sap.ui.model.json.JSONModel();
            requestModel.setData(reqData);
            this.getView().setModel(requestModel, "requestData");
        } else {
            var requestModel = new sap.ui.model.json.JSONModel();
            requestModel.setData({});
            this.getView().setModel(requestModel, "requestData");
        }
    },
    /**
     * to make all fields enable false ro Readonly screen
     */
    disableFields: function() {
        var data = this.getView().getModel("requestData").getData();
        data.enableField = false;
        this.getView().getModel("requestData").refresh();
    },
    /**
     * To display all the Aggrement selection change
     */
    onBehalf: function(oEvent) {
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        var that = this;
        var checked = oEvent.getParameters().selected;
        if (checked) {
            that.getView().byId('selPerson').setVisible(true);
            that.getView().byId("AggreeCheck").setVisible(true);
            that.getView().byId("AggreeLink").setVisible(true);
            that.getView().byId("Aggreement1").setVisible(true);
        } else {
            if (that.getView().byId('onBehalfUserTab').getVisible()) {
                sap.m.MessageBox.confirm(oResourceModel.getText("DESELECT"), {
                    title: "Confirmation",
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], // default   
                    onClose: function(oAction) {
                        that.selectPerson(oAction);
                        that.getView().byId("AggreeCheck").setVisible(false);
                        that.getView().byId("AggreeLink").setVisible(false);
                        that.getView().byId("Aggreement1").setVisible(true);
                    }, // default
                    textDirection: sap.ui.core.TextDirection.Inherit // default
                });
            } else {
                that.getView().byId("AggreeCheck").setVisible(false);
                that.getView().byId("AggreeLink").setVisible(false);
                that.getView().byId("Aggreement1").setVisible(true);
                that.getView().byId('selPerson').setVisible(false);
                that.getView().byId('onBehalfUserTab').setVisible(false);
            }

        }
    },
    /**
     * To Open Mail
     */
    openEmail: function() {
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        sap.m.URLHelper.triggerEmail(oResourceModel.getText("HELP_DESK"));
    },
    /**
     * In onBehalf User should select the person- to enable that button 
     */
    selectPerson: function(oAction) {
        if (oAction == "YES") {
            this.getView().byId('selPerson').setVisible(false);
            this.getView().byId('onBehalfUserTab').setVisible(false);
        } else {
            this.getView().byId('idOnBehalf').setSelected(true);
        }
    },
    /**
     * on click of on behalf button open the pop up to select the ONbehalf user ID
     */
    onSelectPersonPress: function() {
        if (!this.oSearchUserFragment) {
            this.oSearchUserFragment = sap.ui.xmlfragment("kaust.ui.kitsDataAccess.fragments.UserSearch", this);
        }
        this.getView().addDependent(this.oSearchUserFragment);
        this.oSearchUserFragment.open();
    },
/**
 * For user Search 
 * do all the validation for kaustID
 */
    onUserSearchPress: function(oEvent) {
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        var userId = oEvent.getParameters().query;
        if (userId != "") {
            if (userId == this.getView().getModel("oUserModel").getData().d.results[0].KaustID) {
                sap.m.MessageBox.show(oResourceModel.getText("ONBEHALFOWN"), {
                    icon: sap.m.MessageBox.Icon.WARNING,
                    title: "Warning",
                    actions: [sap.m.MessageBox.Action.OK],
                });
                oEvent.getSource().setValue("");
                return;
            } else {
                var oSearchResForm = this.oSearchUserFragment.getContent()[2];
                var oPickUserBtn = this.oSearchUserFragment.getBeginButton();
                var that = this;
                var oUserSerchModel = new sap.ui.model.json.JSONModel();
                var oDataModel = this.getView().getModel("oDataModel");
                oDataModel.read("UserDetail(KaustID='" + userId + "',UserId='')?$format=json", {
                    success: function(oData, res) {
                        oUserSerchModel.setData(JSON.parse(res.body));
                        if (oUserSerchModel.getData().d.KaustID != "") {
                            that.getView().setModel(oUserSerchModel, "oUserSerchModel");
                            oSearchResForm.setModel("oUserSerchModel");
                            oSearchResForm.setVisible(true);
                            oPickUserBtn.setEnabled(true);
                        } else {
                            sap.m.MessageBox.show(oResourceModel.getText("VALIDKAUSTID"), {
                                icon: sap.m.MessageBox.Icon.WARNING,
                                title: "Warning",
                                actions: [sap.m.MessageBox.Action.OK],
                            });
                        }
                    },
                    error: function(oError, res) {
                        jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
                    }
                });
            }
        } else {
            if (!oEvent.getParameters().clearButtonPressed) {
                sap.m.MessageBox.show(oResourceModel.getText("SERKAUSTID"), {
                    icon: sap.m.MessageBox.Icon.WARNING,
                    title: "Warning",
                    actions: [sap.m.MessageBox.Action.OK],
                });
            }
        }
    },
    /**
     * on click of pick Button in the user search pop up for on behalf user
     */
    onPickPress: function() {
        this.getView().byId('onBehalfUserTab').setVisible(true);
        this.getView().byId('idTabBar').setSelectedKey("Tab3");
        this.getView().byId("Aggreement1").setVisible(true);
        this.getView().byId("AggreeCheck").setVisible(true);
        this.getView().byId("AggreeLink").setVisible(true);
        this.oSearchUserFragment.close();
        var oSearchField = this.oSearchUserFragment.getContent()[1];
        var oSearchResForm = this.oSearchUserFragment.getContent()[2];
        var oPickUserBtn = this.oSearchUserFragment.getBeginButton();
        oSearchField.setValue(null);
        oSearchResForm.setVisible(false);
        oPickUserBtn.setEnabled(false);

    },
    /**
     * On click of cancel button the user search pop up should close 
     * and data should not shown in the icon tab bar for on behalf user
     */
    onCancelPress: function() {
        this.oSearchUserFragment.close();
        var oSearchField = this.oSearchUserFragment.getContent()[1];
        var oSearchResForm = this.oSearchUserFragment.getContent()[2];
        var oPickUserBtn = this.oSearchUserFragment.getBeginButton();
        this.getView().byId("Aggreement1").setVisible(true);
        this.getView().byId("AggreeCheck").setVisible(false);
        this.getView().byId("AggreeLink").setVisible(false);
        oSearchField.setValue(null);
        oSearchResForm.setVisible(false);
        oPickUserBtn.setEnabled(false);
    },
    /**
     * On click of cancel button in the requester Form
     * not send data to the backend
     * all data will be clear
     */
    cancelRequest: function() {
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        var that = this;
        sap.m.MessageBox.confirm(oResourceModel.getText("CANREQ"), {
            title: "Confirmation",
            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], // default
            onClose: function(oAction) {
                that.goBack(oAction);

            }, // default
            textDirection: sap.ui.core.TextDirection.Inherit // default
        });
    },
/**
 * to goback to the back screen
 */
    goBack: function(oAction) {
        if (oAction == "YES" || oAction == "OK") {
            window.history.go(-1);
        } else {
            return false;
        }
    },
    /**
     * validation Check for Request date and the File uploader
     * */
    fnValidation: function(unexcorted, reqData) {
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        if (unexcorted) {
            if (reqData.reqDate) {
                if (this.getView().getModel("ofileModel")) {
                    if (this.getView().getModel("ofileModel").getData()) {
                        var file = document.getElementById('__xmlview1--docFileUpload-fu').files[0];
                        if (file) {
                            if (this.getView().getModel("ofileModel").getData().fileName == file.name) {
                                return true;
                            } else {
                                this.showMessage(oResourceModel.getText("FILE_ATTCH_REQ"), "Warning");
                                return false;
                            }
                        } else {
                            this.showMessage(oResourceModel.getText("FILEUPLOAD_CHECK"), "Warning");
                            return false;
                        }
                    } else {
                        this.showMessage(oResourceModel.getText("FILE_ATTCH_REQ"), "Warning");
                        return false;
                    }
                } else {
                    this.showMessage(oResourceModel.getText("FILE_ATTCH_REQ"), "Warning");
                    return false;
                }
            } else {
                this.showMessage(oResourceModel.getText("REQUESTDATE_CHECK"), "Warning");
                return false;
            }
        } else {
            if (this.getView().getModel("ofileModel")) {
                var file = document.getElementById('__xmlview1--docFileUpload-fu').files[0];
                if (file) {
                    if (this.getView().getModel("ofileModel").getData().fileName == file.name) {
                        return true;
                    } else {
                        this.showMessage(oResourceModel.getText("FILE_ATTCH_REQ"), "Warning");
                        return false;
                    }
                } else {
                    this.showMessage(oResourceModel.getText("FILE_ATTCH_REQ"), "Warning");
                    return false;
                }
            } else {
                this.showMessage(oResourceModel.getText("FILE_ATTCH_REQ"), "Warning");
                return false;
            }
        }
    },
    /**
     * validation Check for Aggrement madatory check
     * */
    fnAgrementCheck: function(ag1, ag2) {
        var reqData = this.getView().getModel("requestData").getData();
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        if (ag1 && !ag2) {
            if (reqData.agree) {
                return true;
            } else {
                this.showMessage(oResourceModel.getText("AGGCHECK1"), "Warning");
                return false;
            }
        } else if (ag2 && ag1) {
        	
            if (reqData.agree2 && reqData.agree) {
                return true;
            } else {
                this.showMessage(oResourceModel.getText("AGGCHECK2"), "Warning");
                return false;
            }
        }
    },
    /**
     * validation Check for Bulding template- atleast one template should be selected
     * */
    fnValidForm: function() {
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        var reqData = this.getView().getModel("requestData").getData();
        if (reqData.itDataCenter || reqData.itExchangeBuild || reqData.itBuldingHigh || reqData.itBuldingLow || reqData.itBuldingMedium || reqData.itBuildingTest || reqData.itInCmps || reqData.itOutCmps || reqData.itBuildingTempHighDesity || reqData.itBuildingTempLowDensity || reqData.itBuildingTempItStock || reqData.itBuildingTempMedium || reqData.itBuildingTempItMeter || reqData.itBuidingTempItMeter2 || reqData.itSecurityRoom || reqData.otherTempItFront || reqData.otherTempItSpain || reqData.otherTempItSpainscc) {
            return true
        } else {
            this.showMessage(oResourceModel.getText("FORMCHECK"), "Warning");
            return false;
        }
    },
    /**
     * Justification form submit
     * First Time when user logged in user should submit the justification form
     */
    onJustificationSubmit: function() {
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        var reqData = this.getView().getModel("requestData").getData();
        var oUserData = this.getView().getModel("oUserModel").getData().d.results[0];
       var existUserId = false;
        if(oUserData.Type)
		   		existUserId=true;
        if(existUserId)
        	{
        if (reqData.justification.trim()) {
            var payload = {
                "justification": reqData.justification,
                "subServiceCode": "0053",
                "serviceCode": "0016",
                "Wftrigger": "X",
                "reqKaustId": oUserData.KaustID,
                "attachment": "url",
                "userId": oUserData.UserId,
                "lastTaskStatus": "NA",
                "activityType": "First", //First time sending First -- update with "NA"  
                "changedText": "NA",
                "status": "001",
                "req_orgUnit": "",
                "req_orgName": "",
                "comments": "",
                "org_unit": "",
                "org_name": "",
                "t_role": "",
                "t_name": "",
                "t_kaustid": "",
                "applicantType": "",
                "approverStatus": "",
                "flow": "NA",
                "accessType": "",
                "requestDate": "0000-00-00T00:00:00",
                "approverStatus": 1,
                "RequestId": ""
            };
            var checked = this.getView().byId('idOnBehalf').getSelected();
            if (checked && this.getView().byId('onBehalfUserTab').getVisible()) {
                var otherUser = this.getView().getModel("oUserSerchModel").getData().d;
                payload.onBehalf = "X";
                payload.kaustId = otherUser.KaustID;
                payload.onBehalfUserId = otherUser.UserId;
                payload.FirstName = otherUser.FirstName;
                payload.MiddleName = otherUser.MiddleName;
                payload.LastName = otherUser.LastName;
                payload.Email = otherUser.Email;
                payload.RManager = otherUser.RManager;
                payload.Position = otherUser.Position;
                payload.Deptname = otherUser.Deptname;
                payload.Mobile = otherUser.Mobile;
                payload.Office = otherUser.Office;
                payload.req_orgUnit = otherUser.Orgunit;
                payload.req_orgName = otherUser.Orgname;
                payload.applicantType = otherUser.Type;
                if (otherUser.Type.toUpperCase() == "STAFF"||otherUser.Type.toUpperCase() == "STUDENT")
                    payload.requestType = "Non-Contractor";
                else
                    payload.requestType = "Contractor";
            } else {
                if (oUserData.Type.toUpperCase() == "STAFF" || oUserData.Type.toUpperCase() == "STUDENT")
                    payload.requestType = "Non-Contractor";
                else
                    payload.requestType = "Contractor";
                payload.applicantType = oUserData.Type;
                payload.kaustId = oUserData.KaustID;
                payload.FirstName = oUserData.FirstName;
                payload.MiddleName = oUserData.MiddleName;
                payload.LastName = oUserData.LastName;
                payload.Email = oUserData.Email;
                payload.RManager = oUserData.RManager;
                payload.Position = oUserData.Position;
                payload.Deptname = oUserData.Deptname;
                payload.Mobile = oUserData.Mobile;
                payload.Office = oUserData.Office;
                payload.req_orgUnit = oUserData.Orgunit;
                payload.req_orgName = oUserData.Orgname;
            }
            var oHeader = {
                "Content-Type": "application/json;charset=utf-8"
            };
            var that = this;
            //            var oDataAccess = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS");
            var oGascModel = this.getView().getModel("oGascModel");
            oGascModel.create("/DataCenterSet",
                payload, null,
                function(data, response) {
                    that.requestId = data.RequestId;
                    that.displayDialog(data.RequestId);
                },
                function(oError) {
                    sap.m.MessageBox.show(oResourceModel.getText("ERRSUB"), {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Error",
                        actions: [sap.m.MessageBox.Action.OK],
                    });
                });
        } else
            this.showMessage(oResourceModel.getText("JUSTIFICATIONCHECK"), "Warning");
        	}
        else
        	this.showMessage(oResourceModel.getText("USERID_MAND"), "Warning");
    },
    /**
     * After user got approved he can submit the actual Requester Form
     */
    onSubmit: function() {
    	var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        var reqData = this.getView().getModel("requestData").getData();
        var unexcorted = this.getView().byId("unEscorted").getSelected();
        var oUserData = this.getView().getModel("oUserModel").getData().d.results[0];
        var reqDateB = this.fnValidation(unexcorted, reqData);
        var existUserId=false;
        
       //to check user Id is exist or not
        var checked = this.getView().byId('idOnBehalf').getSelected();
        if (checked && this.getView().byId('onBehalfUserTab').getVisible()) {
            var otherUser = this.getView().getModel("oUserSerchModel").getData().d;
            if(otherUser.Type)
           		existUserId=true;
        }
       else
    	   {
    	   if(oUserData.Type)
   		   		existUserId=true;
    	   }
        if(existUserId)
        	{
       if (reqDateB) {
            var aggrement = this.getView().byId("Aggreement1").getVisible();
            var aggrement2 = this.getView().byId("AggreeCheck").getVisible();
            var formValid = this.fnValidForm();
            if (formValid) {
                var agg = this.fnAgrementCheck(aggrement, aggrement2);
                var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                if (agg) {
                    //        	  var file = jQuery.sap.domById(uploadCntr.getId() + "-fu").files[0];

                    //        	  if(file){
                    //            if (agg && formValid) {
                    var payload = {
                        "subServiceCode": "0053",
                        "serviceCode": "0016",
                        "Wftrigger": "X",
                        "reqKaustId": oUserData.KaustID,
                        "attachment": "url",
                        "userId": oUserData.UserId,
                        "lastTaskStatus": "NA",
                        "activityType": "NA", //Changed or Not Changed
                        "changedText": "NA",
                        "status": "001",
                        "req_orgUnit": "",
                        "req_orgName": "",
                        "comments": "",
                        "org_unit": "",
                        "org_name": "",
                        "t_role": "",
                        "t_name": "",
                        "t_kaustid": "",
                        "applicantType": "",
                    };
                    if (unexcorted) {
                        payload.accessType = "0";
                        payload.flow = "NO";
                    } else {
                        payload.accessType = "X";
                        payload.flow = "YES";
                    }

                    payload.DCToTemplate = [];
                    if (reqData.itDataCenter) {
                        var obj = {
                            templateType: oResourceModel.getText("dataCenterTeamTemplate"),
                            templateField: oResourceModel.getText("ITDataCenterTeam")

                        };
                        payload.DCToTemplate.push(obj);
                    }
                    if (reqData.itExchangeBuild) {
                        var obj = {
                            templateType: oResourceModel.getText("exchangeBuildingTemplate"),
                            templateField: oResourceModel.getText("ITExchangeBuilding")
                        };
                        payload.DCToTemplate.push(obj);
                    }
                    if (reqData.itBuldingHigh || reqData.itBuldingLow || reqData.itBuldingMedium || reqData.itBuildingTest) {

                        var obj = {
                            templateType: oResourceModel.getText("buildingTemplates"),
                            templateField: ""
                        };
                        if (reqData.itBuldingHigh)
                            obj.templateField = obj.templateField + oResourceModel.getText("ITHighDensity");

                        if (reqData.itBuldingLow) {
                            if (obj.templateField.length > 1)
                                obj.templateField = obj.templateField + "|" + oResourceModel.getText("ItLowDensity");
                            else
                                obj.templateField = obj.templateField + oResourceModel.getText("ItLowDensity");
                        }
                        if (reqData.itBuldingMedium) {
                            if (obj.templateField.length > 1)
                                obj.templateField = obj.templateField + "|" + oResourceModel.getText("ITMediumDensity");
                            else
                                obj.templateField = obj.templateField + oResourceModel.getText("ITMediumDensity");
                        }
                        if (reqData.itBuildingTest) {
                            if (obj.templateField.length > 1)
                                obj.templateField = obj.templateField + "|" + oResourceModel.getText("ITTestRoom");
                            else
                                obj.templateField = obj.templateField + oResourceModel.getText("ITTestRoom");
                        }
                        payload.DCToTemplate.push(obj);
                    }

                    if (reqData.itInCmps || reqData.itOutCmps) {

                        var obj = {
                            templateType: oResourceModel.getText("maintanaceTemplate"),
                            templateField: ""
                        };
                        if (reqData.itInCmps)
                            obj.templateField = obj.templateField + oResourceModel.getText("ITincmps");

                        if (reqData.itOutCmps) {
                            if (obj.templateField.length > 1)
                                obj.templateField = obj.templateField + "|" + oResourceModel.getText("IToutcmps");
                            else
                                obj.templateField = obj.templateField + oResourceModel.getText("IToutcmps");
                        }
                        payload.DCToTemplate.push(obj);
                    }

                    if (reqData.itBuildingTempHighDesity || reqData.itBuildingTempLowDensity || reqData.itBuildingTempItStock || reqData.itBuildingTempMedium || reqData.itBuildingTempItMeter || reqData.itBuidingTempItMeter2 || reqData.itSecurityRoom) {

                        var obj = {
                            templateType: oResourceModel.getText("buildingTemplate"),
                            templateField: ""
                        };
                        if (reqData.itBuildingTempHighDesity)
                            obj.templateField = obj.templateField + oResourceModel.getText("ITHighDensity1");

                        if (reqData.itBuildingTempLowDensity) {
                            if (obj.templateField.length > 1)
                                obj.templateField = obj.templateField + "|" + oResourceModel.getText("ITLowDensity1");
                            else
                                obj.templateField = obj.templateField + oResourceModel.getText("ITLowDensity1");
                        }

                        if (reqData.itBuildingTempItStock) {
                            if (obj.templateField.length > 1)
                                obj.templateField = obj.templateField + "|" + oResourceModel.getText("ITStockRoom");
                            else
                                obj.templateField = obj.templateField + oResourceModel.getText("ITStockRoom");
                        }
                        if (reqData.itBuildingTempMedium) {
                            if (obj.templateField.length > 1)
                                obj.templateField = obj.templateField + "|" + oResourceModel.getText("ITMediumDensity1");
                            else
                                obj.templateField = obj.templateField + oResourceModel.getText("ITMediumDensity1");
                        }
                        if (reqData.itBuildingTempItMeter) {
                            if (obj.templateField.length > 1)
                                obj.templateField = obj.templateField + "|" + oResourceModel.getText("ITMeter");
                            else
                                obj.templateField = obj.templateField + oResourceModel.getText("ITMeter");
                        }
                        if (reqData.itBuidingTempItMeter2) {
                            if (obj.templateField.length > 1)
                                obj.templateField = obj.templateField + "|" + oResourceModel.getText("ITMeter2");
                            else
                                obj.templateField = obj.templateField + oResourceModel.getText("ITMeter2");
                        }
                        if (reqData.itSecurityRoom) {
                            if (obj.templateField.length > 1)
                                obj.templateField = obj.templateField + "|" + oResourceModel.getText("ITSecurityRoom");
                            else
                                obj.templateField = obj.templateField + oResourceModel.getText("ITSecurityRoom");
                        }
                        payload.DCToTemplate.push(obj);
                    }

                    if (reqData.otherTempItFront || reqData.otherTempItSpain || reqData.otherTempItSpainscc) {
                        var obj = {
                            templateType: oResourceModel.getText("otherTemplates"),
                            templateField: ""
                        };
                        if (reqData.otherTempItFront)
                            obj.templateField = obj.templateField + oResourceModel.getText("ITFront");

                        if (reqData.otherTempItSpain) {
                            if (obj.templateField.length > 1)

                                obj.templateField = obj.templateField + "|" + oResourceModel.getText("ITSpain");
                            else
                                obj.templateField = obj.templateField + oResourceModel.getText("ITSpain");
                        }
                        if (reqData.otherTempItSpainscc) {
                            if (obj.templateField.length > 1)
                                obj.templateField = obj.templateField + "|" + oResourceModel.getText("ITSpainScc");
                            else
                                obj.templateField = obj.templateField + oResourceModel.getText("ITSpainScc");
                        }
                        payload.DCToTemplate.push(obj);
                    }

                    if (unexcorted) {
                        payload.requestDate = new Date(Date.parse(reqData.reqDate)).toISOString().split(".")[0];
                    } else {
                        payload.requestDate = new Date().toISOString().split(".")[0];
                    }
                    var checked = this.getView().byId('idOnBehalf').getSelected();
                    if (checked && this.getView().byId('onBehalfUserTab').getVisible()) {
                        var otherUser = this.getView().getModel("oUserSerchModel").getData().d;
                        payload.onBehalf = "X";
                        payload.kaustId = otherUser.KaustID;
                        payload.onBehalfUserId = otherUser.UserId;
                        payload.FirstName = otherUser.FirstName;
                        payload.MiddleName = otherUser.MiddleName;
                        payload.LastName = otherUser.LastName;
                        payload.Email = otherUser.Email;
                        payload.RManager = otherUser.RManager;
                        payload.Position = otherUser.Position;
                        payload.Deptname = otherUser.Deptname;
                        payload.Mobile = otherUser.Mobile;
                        payload.Office = otherUser.Office;
                        payload.req_orgUnit = otherUser.Orgunit;
                        payload.req_orgName = otherUser.Orgname;
                        payload.requestType = "OnBehalf";
                        payload.applicantType = otherUser.Type;
                        if(otherUser.Type)
                        	{
                        if (otherUser.Type.toUpperCase() == "STAFF"||otherUser.Type.toUpperCase()=="STUDENT")
                            payload.requestType = "Non-Contractor";
                        else
                            payload.requestType = "Contractor";
                        	}
                        else
                            payload.requestType = "Non-Contractor";//double check to avoid sending null value in Line Manger later, ui will popup a message and does not allow submit if UserID is missing
                    } else {
                    	if(oUserData.Type){
                        if (oUserData.Type.toUpperCase() == "STAFF" || oUserData.Type.toUpperCase() == "STUDENT")
                            payload.requestType = "Non-Contractor";
                        else
                            payload.requestType = "Contractor";
                    	}
                    	else
                    		payload.requestType = "Non-Contractor";//double check to avoid sending null value in Line Manger later, ui will popup a message and does not allow submit if UserID is missing
                    	
                        payload.applicantType = oUserData.Type;
                        payload.kaustId = oUserData.KaustID;
                        payload.FirstName = oUserData.FirstName;
                        payload.MiddleName = oUserData.MiddleName;
                        payload.LastName = oUserData.LastName;
                        payload.Email = oUserData.Email;
                        payload.RManager = oUserData.RManager;
                        payload.Position = oUserData.Position;
                        payload.Deptname = oUserData.Deptname;
                        payload.Mobile = oUserData.Mobile;
                        payload.Office = oUserData.Office;
                        payload.req_orgUnit = oUserData.Orgunit;
                        payload.req_orgName = oUserData.Orgname;
                    }
                    this.postDataEcc(payload);

                } else {
                    return;
                    //		this.showMessage("Please check the ageement to submit the form","Agreement");
                }
            }
        }
        	}//close of if condition for exist UserId
        else
        	this.showMessage(oResourceModel.getText("USERID_MAND"),"Warning");
    },
    /**
     * to Show warning messages
     */
    showMessage: function(msg, mtitle) {
        //jQuery.sap.require("sap.m.MessageBox");
        sap.m.MessageBox.show(msg, {
            icon: sap.m.MessageBox.Icon.WARNING,
            title: mtitle,
            actions: [sap.m.MessageBox.Action.OK],
        });

    },
    /**
     * Post call to ECC to create the Request ID
     */
    postDataEcc: function(payload) {
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        var oHeader = {
            "Content-Type": "application/json;charset=utf-8"
        };
        var that = this;
        var oDataAccess = this.getView().getModel("oGascModel");
        oDataAccess.create("/DataCenterSet",
            payload, null,
            function(data, response) {
                that.handleFileUploadtoRMS(data.RequestId, payload);
            },
            function(oError) {
                sap.m.MessageBox.show(oResourceModel.getText("ERRSUB"), {
                    icon: sap.m.MessageBox.Icon.ERROR,
                    title: "Error",
                    actions: [sap.m.MessageBox.Action.OK],
                });
            });
    },
    /**upload File to RMS
     * Require Kaust id to send the file to store in backend*/
    handleFileUploadtoRMS: function(requestId, createData) {
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        //    	   var fileData = this.getView().getModel("ofileModel").getData();
        if (this.getView().getModel("ofileModel")) {
            //        if (this.getView().byId("docFileUpload").getValue()) {
            var fileData = this.getView().getModel("ofileModel").getData();
            var data = this.getView().getModel("oUserModel").getData().d.results[0];
            //		this.setBusy(true);
            var busyDialog = new sap.m.BusyDialog();
            busyDialog.open();
            var that = this;
            this.UploadFileToRMS(fileData.fileName.split(".")[0], requestId, "3", function() {
                this.getUserFilesByKaustId(requestId, data.KaustID, function(ofilesData) {
                    var ofileModel = new sap.ui.model.json.JSONModel();
                    //handle File
                    if (ofilesData.length > 0) {
                        if (ofilesData[0].MSG_TYPE == "E") {
                            that.showMessage(ofilesData[0].MESSAGE, "Warning");
                        } else {
                            ofileModel.setData(ofilesData);
                        }
                        that.getView().setModel(ofileModel, "userFiles");
                    }
                    that.updateDataCenter(requestId, createData, ofilesData[0].Url);
                    that.getView().byId("docFileUpload").setValue("");
                    busyDialog.close();
                }, function(err) {});
            });
        } else {
            this.showMessage(oResourceModel.getText("FILEUPLOAD_CHECK"), "Warning");
        }
    },
    /**
     * Update the File to corresponding Request Id Raised
     */
    updateDataCenter: function(requestId, jsonData, Url) {
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        var that = this;
        var object = {};
        jsonData.attachment = Url;
        var url = "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/DataCenterSet('" + requestId + "')";
        delete jsonData["DCToTemplate"];
        jsonData = JSON.stringify(jsonData);
        debugger;
        var token = this.getGateWayToken();
        $.ajax({
            url: url,
            dataType: 'json',
            contentType: "application/json",
            async: false,
            data: jsonData,
            type: "PUT",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-CSRF-Token", token);
                debugger;
            },
            success: function(oResponse, textStatus, jqXHR) {
                var dataDetails = oResponse;
                debugger;
                that.displayDialog(requestId);

            },
            error: function(jqXHR, textStatus, errorThrown) {

                if (textStatus === "timeout") {
                    sap.m.MessageBox.show(
                        oResourceModel.getText("CONNECTION_TIME"), {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: "Error",
                            actions: [sap.m.MessageBox.Action.OK],
                        }
                    );
                } else {
                    sap.m.MessageBox.show(
                        oResourceModel.getText("FAILOCC") + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText, {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: "Error",
                            actions: [sap.m.MessageBox.Action.OK],
                        }
                    );
                    jQuery.sap.log.fatal(oResourceModel.getText("FAILOCC") + textStatus, jqXHR.responseText + "," + jqXHR.status + "," + jqXHR.statusText);

                };
            },
            complete: function() {}
        });
    },
    /**
     * to Fetch gateway Token
     */
    getGateWayToken: function() {
        var metadataEmail = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/AccessRequest(RequestId='',KaustId='')");
        var token = null;
        $.ajax({
            url: metadataEmail,
            type: "GET",
            dataType: 'json',
            contentType: "application/json",
            Accept: "application/json",
            async: false,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/atom+xml",
                "DataServiceVersion": "2.0",
                "X-CSRF-Token": "Fetch",
            },
            success: function(data, textStatus, XMLHttpRequest) {
                dataModel = data;
                token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
            },
            error: function(data, textStatus, XMLHttpRequest) {
                alert("Error message");
            }

        });
        return token;
    },
    /**
     * upload File to Rms
     */
    UploadFileToRMS: function(fileName, KaustId, folderId, successFn) {
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        var uploadCntr = this.getView().byId("docFileUpload");
        if (!(fileName && KaustId && folderId)) {
            this.showMessage(oResourceModel.getText("MISSING_PARM"), "Warning");
            return;
        }
        var that = this;
        var slug = fileName + ',' + KaustId + ',' + folderId;
        var file = jQuery.sap.domById(uploadCntr.getId() + "-fu").files[0];
        var fileModel = this.getView().getModel("ofileModel");
        if (fileModel.getData().fileName == file.name) {
            var uploadUrl = this.getUrl("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileAttachCollection");
            var token = this.getToken();
            var oHeaders = {
                "x-csrf-token": token,
                "slug": slug,
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": file.type,
                "DataServiceVersion": "2.0",
                "Accept": "text/plain, */*"
            };
            if (file) {
                $.ajax({
                    url: uploadUrl,
                    type: "POST",
                    data: file,
                    cache: false,
                    processData: false,
                    dataType: "text",
                    headers: oHeaders,
                    success: function(oResponse, textStatus, jqXHR) {
                        successFn.call(that);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        var errorMsg = jQuery(jqXHR.responseText).find('message').text().replace("RFC Error:", "");
                        if (errorMsg) {
                            sap.m.MessageBox.alert(errorMsg, {
                                title: "Error",
                                icon: sap.m.MessageBox.Icon.ERROR
                            });
                        } else if (textStatus === "error" && jqXHR.responseText.indexOf('/IWFND/CM_BEC/026') != -1) { //unauthorize
                            that.showMessage(oResourceModel.getText("AUTH_USER"), "Warning");
                        } else if (textStatus === "timeout") {
                            that.showMessage(oResourceModel.getText("CONNEC_TIME_OUT"), "Error");
                        } else {
                            jQuery.sap.log.fatal(oResourceModel.getText("FAILOCC") + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText);
                            that.showMessage(oResourceModel.getText("FAILOCC") + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText, "Error");
                        };
                    },
                    complete: function(jqXHR, textStatus, errorThrown) {
                        //								that.setBusy(false);
                    }

                });
            } else {
                that.showMessage(oResourceModel.getText("FILE_ATTCH_REQ"), "Warning");
            }
        } else {
            this.showMessage("File attachment is required.", "Warning");
        }
    },
    /**
     * To give the File based on the KAust Id
     */
    getUserFilesByKaustId: function(requestId, kaustId, SuccessCallback, completeCallback) {
        var that = this;
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        $.ajax({
            url: "/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileRead?$filter=UNIQUE_ID eq '" + requestId + "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '3'",
            dataType: "json",
            contentType: "application/json",
            success: function(data, response) {
                var filesResult = $.map(data.d.results, function(item) {
                    return {
                        'CRD_DATE': kaust.ui.kitsDataAccess.utility.Formatter.RmsDate(item.CRD_DATE),
                        'CRD_USER': item.CRD_USER,
                        'FileName': item.FILENAME,
                        'Url': item.URL,
                        'APPLICATION_TYPE': item.APPLICATION_TYPE,
                        'UNIQUE_ID': item.UNIQUE_ID,
                        'USER': item.USER,
                        'EXP_DATE': kaust.ui.kitsDataAccess.utility.Formatter.RmsDate(item.CRD_DATE),
                        'MSG_TYPE': item.MSG_TYPE,
                        'MESSAGE': item.MESSAGE
                    }
                })
                SuccessCallback.call(that, filesResult);
            },
            error: function() {
                that.showMessage(oResourceModel.getText("SERVICE_ERR"), "Warning")
            },
            complete: function() {
                completeCallback.call(that);
            }
        });

    },
    /**
     * To reset All the Fields after submit the form
     */
    resetAllFields: function() {
        this.getView().getModel("requestData").setData({});

    },
    /**
     * to Fetch the URL based on the Location
     * */
    getUrl: function(sUrl) {
        if (sUrl == "") {
            return sUrl;
        }
        if (window.location.hostname == "localhost") {
            return "proxy" + sUrl;
        } else {
            return sUrl;
        }
    },
    /**
     * to Fetch x-csrf tokenToken
     */
    getToken: function() {
        var token = null;
        var urlUserDetails = this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail");
        $.ajax({
            url: urlUserDetails,
            type: "GET",
            dataType: 'json',
            contentType: "application/json",
            Accept: "application/json",
            async: false,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/atom+xml",
                "DataServiceVersion": "2.0",
                "X-CSRF-Token": "Fetch",
            },
            success: function(data, textStatus, XMLHttpRequest) {
                //dataModel = data;
                token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
            },
            error: function(data, textStatus, XMLHttpRequest) {
                alert("Error message" + data.responseText);
            }
        });
        return token;
    },

    /**
     * Validate the Date should be greater than today's Date
     */
    validateDate: function(oEvt) {
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        var currentDate = new Date();
        var date = Date.parse(new Date(oEvt.getSource().getValue()));
        if (Date.parse(currentDate) > date) {
            sap.m.MessageBox.show(
                oResourceModel.getText("REQ_DATE_ERR"), {
                    icon: sap.m.MessageBox.Icon.ERROR,
                    title: "Error",
                    actions: [sap.m.MessageBox.Action.OK],
                }
            );
            oEvt.getSource().setValue("");
        } else
            oEvt.getSource().setValue(new Date(date).toISOString().split("T")[0]);
    },
    /**
     * Check the Request Type is escorter or unescorted
     * */
    checkType: function(oEvt) {
        var value = oEvt.getSource().getText();
        if (value == 'Escorted') {
            this.getView().byId("requestDate").setEnabled(false);
            this.getView().byId("requestDate").setValue(new Date().toISOString().split("T")[0]);
        } else {
            this.getView().byId("requestDate").setEnabled(true);
            this.getView().byId("requestDate").setValue();
        }
    },
    /**Display Success Msg
     * for the Request
     */
    displayDialog: function(requestId) {
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        var msg = oResourceModel.getText('REQ_MSG1');
        var that = this;
        var msg2 = oResourceModel.getText('REQ_MSG2');
        var dialog = new sap.m.Dialog({
            title: 'Success',
            type: 'Message',
            state: 'Success',
            contentWidth: "800px",
            content: [
                new sap.ui.layout.VerticalLayout({
                    content: [
                        new sap.ui.layout.HorizontalLayout({
                            content: [
                                new sap.m.Label({
                                    text: msg
                                }),
                                new sap.m.Label({
                                    text: ' # ' + requestId + ", ",
                                    design: "Bold"
                                }),
                            ]
                        }),
                        new sap.m.Label({
                            text: msg2
                        })
                    ]
                })
            ],
            beginButton: new sap.m.Button({
                text: 'Ok',
                press: function() {
                    that.resetAllFields();
                    dialog.close();
                }
            }),
            afterClose: function() {
                dialog.destroy();
                window.history.go(-1);
            }
        });

        dialog.open();

    },
    /**
     * To show and hide the upload button for file uploader
     */
    handleUploadChange: function() {
    	file = document.getElementById('__xmlview1--docFileUpload-fu').files[0];
    	var regex = /[!$%^&*()+|~=`{}\[\]:";'<>?,\/]/;
    	if(file)
    		{
		 if(!regex.test(file.name)){ 
			 this.getView().byId("fileLinkIcon").setVisible(false);
			 this.getView().byId("fileLink").setVisible(false);
			 this.getView().byId("fileuploadlbl").setVisible(false);
			 this.getView().byId("uploadBtn").setVisible(true);
		 }else
			 {

			 this.getView().byId("fileLinkIcon").setVisible(false);
			 this.getView().byId("fileLink").setVisible(false);
			 this.getView().byId("fileuploadlbl").setVisible(false);
			 this.getView().byId("uploadBtn").setVisible(false);
				this.showMessage("Filename should not contain special characters","Warning");   
			 }
    		}
		 else
			 {

			 this.getView().byId("fileLinkIcon").setVisible(false);
			 this.getView().byId("fileLink").setVisible(false);
			 this.getView().byId("fileuploadlbl").setVisible(false);
			 this.getView().byId("uploadBtn").setVisible(false);
			 this.showMessage("Please select the file to upload","Warning");
			 }
    	
			 
    },

    /**
     * handleFileUploadLocal to upload file locally before submission
     */
    handleFileUploadLocal: function(oEvent) {
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        var that = this;
        file = document.getElementById('__xmlview1--docFileUpload-fu').files[0];
        var regex = /[!$%^&*()+|~=`{}\[\]:";'<>?,\/]/;
        if(file)
        	{
		 if(!regex.test(file.name)){
        if (file != undefined && file.type == "application/pdf") {
            var reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = function(evt) {
                var fileName = file.name;
                var byteArray2 = new Uint8Array(evt.target.result);
                var fileEncodedData = window.btoa(that.uint8ToString(byteArray2));
                var ofileModel = new sap.ui.model.json.JSONModel();
                var obj = {
                    "fileData": "",
                    "fileName": "",
                    "type": ""
                };
                obj.fileData = fileEncodedData;
                obj.fileName = fileName;
                obj.type = file.type;
                ofileModel.setData(obj);
                that.getView().setModel(ofileModel, "ofileModel");
                that.getView().byId("fileuploadlbl").setVisible(true);
                that.getView().byId("fileLink").setVisible(true);
                that.getView().byId("fileLinkIcon").setVisible(true);
                that.getView().byId("uploadBtn").setVisible(false);
            };
        } else {
        	that.getView().byId("fileLink").setVisible(false);
			 that.getView().byId("fileLinkIcon").setVisible(false);
            that.getView().byId("fileuploadlbl").setVisible(false);
            that.showMessage(oResourceModel.getText("FILE_PDF"), "Warning");
            
        }
		 }
		 else
			 {

			 this.getView().byId("fileLinkIcon").setVisible(false);
			 this.getView().byId("fileLink").setVisible(false);
			 this.getView().byId("fileuploadlbl").setVisible(false);
			 this.getView().byId("uploadBtn").setVisible(false);
			 this.showMessage("Filename should not contain special characters","Warning");
			 }
        	}
        else
        	{

			 this.getView().byId("fileLinkIcon").setVisible(false);
			 this.getView().byId("fileLink").setVisible(false);
			 this.getView().byId("fileuploadlbl").setVisible(false);
			 this.getView().byId("uploadBtn").setVisible(false);
       	 this.showMessage("Please select the file to upload","Warning");
        	}
    },
    /**to get Encoded data for The file
     * pdf file he should upload
     * */
    uint8ToString: function(buf) {
        var i, length, out = '';
        for (i = 0, length = buf.length; i < length; i += 1) {
            out += String.fromCharCode(buf[i]);
        }
        return out;
    },
    /**
     *  to Display Error Messgae
     */
    displayErrorMsg: function() {
        var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        var msg = oResourceModel.getText('USER_RAISED');
        var that = this;
        var dialog = new sap.m.Dialog({
            title: 'Raise Request',
            type: 'Message',
            state: 'Warning',
            content: [
                new sap.ui.layout.HorizontalLayout({
                    content: [
                        new sap.m.Label({
                            text: msg
                        }),
                    ]
                })
            ],
            beginButton: new sap.m.Button({
                text: 'Ok',
                press: function() {
                    dialog.close();
                }
            }),
            afterClose: function() {
                window.history.go(-1);
                dialog.destroy();
            }
        });
        dialog.open();
    },


    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf data_center.DataCenter
     */
    //	onBeforeRendering: function() {
    //
    //	},

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf data_center.DataCenter
     */
    /**
     * Display Justification form or Reqeuster Form depends on userId
     */
    justifictaionForm: function() {
        var userData = this.getView().getModel("oUserModel").getData();
        var justificationModel = new sap.ui.model.json.JSONModel();
        var that = this;
        var busyDialog = new sap.m.BusyDialog();
        busyDialog.open();
        var oGascModel = this.getView().getModel("oGascModel");
        oGascModel.read("userJustRequestStatusSet?$filter=userId eq '" + userData.d.results[0].UserId + "'", {
            success: function(oData, res) {
                justificationModel.setData(oData);
                if (justificationModel.getData().results.length > 0) {
                    busyDialog.close();
                    if (justificationModel.getData().results[0].approverStatus == 0 || justificationModel.getData().results[0].approverStatus == 3) {
                        that.getView().byId("Justification").setVisible(true);
                        that.getView().byId("templateForm").setVisible(false);
                        that.getView().byId("submitBtn").setVisible(true);
                        that.getView().byId("updateBtn").setVisible(false);
                        that.getView().byId("idOnBehalf").setEnabled(false);
                        var requestModel = new sap.ui.model.json.JSONModel();
                        var data = {};
                        requestModel.setData(data);
                        that.getView().setModel(requestModel, "requestData");

                    } else if (justificationModel.getData().results[0].approverStatus == 2) {
                        that.getView().byId("idOnBehalf").setEnabled(true);
                        that.getView().byId("Justification").setVisible(false);
                        that.getView().byId("templateForm").setVisible(true);
                        that.getView().byId("submitBtn").setVisible(false);
                        that.getView().byId("updateBtn").setVisible(true);
                        var requestModel = new sap.ui.model.json.JSONModel();
                        var data = {
                            enableField: true
                        };
                        requestModel.setData(data);
                        that.getView().setModel(requestModel, "requestData");
                    } else if (justificationModel.getData().results[0].approverStatus == 1) {
                        that.getView().byId("submitBtn").setVisible(false);
                        that.getView().byId("updateBtn").setVisible(false);
                        that.displayErrorMsg();
                    }  
                } else {
                    busyDialog.close();
                    that.getView().byId("Justification").setVisible(true);
                    that.getView().byId("templateForm").setVisible(false);
                    that.getView().byId("submitBtn").setVisible(true);
                    that.getView().byId("updateBtn").setVisible(false);
                    that.getView().byId("idOnBehalf").setVisible(false);
                    var requestModel = new sap.ui.model.json.JSONModel();
                    var data = {};
                    requestModel.setData(data);
                    that.getView().setModel(requestModel, "requestData");
                }
            },
            error: function(oError, res) {
                busyDialog.close();
                jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
            }
        });
    },
	/**
	 * getFile to read file on click on link after uploading
	 */
	getFile : function(){
		var prntWin = window.open();
	//  if ( prntWin ) {
	 prntWin.document.write("<html><head></head><body>"
	 + '<embed width="100%" height="100%" name="plugin" src="data:application/pdf;base64, '
	 + this.getView().getModel('ofileModel').getProperty("/fileData")
	 + '" '
	 + 'type="application/pdf" internalinstanceid="21"></body></html>');
	 prntWin.document.close();
	 
	},
	removeUploadedFile:function()
	{
		this.getView().getModel('ofileModel').setData("");
		this.getView().byId("docFileUpload").setValue("");
		this.getView().byId("uploadBtn").setVisible(false);
		this.getView().byId("fileuploadlbl").setVisible(false);
		this.getView().byId("fileLink").setVisible(false);
		 this.getView().byId("fileLinkIcon").setVisible(false);
		
		
	}

    //    onAfterRendering: function() {
    //
    //    },

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf data_center.DataCenter
     */
    //	onExit: function() {
    //
    //	}

});