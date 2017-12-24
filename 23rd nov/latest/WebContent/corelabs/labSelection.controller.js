jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.labSelection", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
*/
	/*onBeforeShow : function(){
		location.reload(true);
	},*/
	 
	onInit: function() {
		var that = this;
		
		if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		/*	var that = this;*/
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "labSelection") {
				that.onAfterRendering();
				
				//0.1 - Initialize view elements
				that.getView().byId('showLab').setVisible(false);
				that.getView().byId('noBadger').setVisible(false);
				that.getView().byId('noPIApproved').setVisible(false);
				that.getView().byId('notAuthPerReqd').setVisible(false);
				
				var loggedInUser = loggedinUserModel.getData();
				
				//1.1 For Internal and RPT User - Validation for Badger and PI approval
				if (userTypeModel.getData().message != "EXTERNAL") {
					var isActive = that.checkBadger();
					var piApprovedModel = new sap.ui.model.json.JSONModel(); 
					piApprovedModel.loadData("/utilweb/rest/piapprovalreq/isUserPIApproved/" + loggedInUser.userId, null, false);
					var isPiAprroved = piApprovedModel.getData().success;
					
					if (isActive && (isPiAprroved == "true")) {
						that.getView().byId('showLab').setVisible(true);
						that.getView().byId('noBadger').setVisible(false);
						that.getView().byId('noPIApproved').setVisible(false);
					} else if (isPiAprroved == "true") {
						that.getView().byId('showLab').setVisible(false);
						that.getView().byId('noBadger').setVisible(true);
						that.getView().byId('noPIApproved').setVisible(false);
					} else if (isActive) {
						that.getView().byId('showLab').setVisible(false);
						that.getView().byId('noBadger').setVisible(false);
						that.getView().byId('noPIApproved').setVisible(true);
					} else {
						that.getView().byId('noBadger').setVisible(true);
						that.getView().byId('noPIApproved').setVisible(true);
					}
				} else { 
					//1.2 For External User - In case if Auth Person needed, Validation to check if authorized person has also registered
					var authperReqdModel = new sap.ui.model.json.JSONModel();
					authperReqdModel.loadData("/utilweb/rest/user/auth/authPersonRequired/" + loggedInUser.emailId, null, false);
					
					if (authperReqdModel.getData().success == "true") {
						that.getView().byId('showLab').setVisible(true);
						that.getView().byId('noBadger').setVisible(false);
						that.getView().byId('noPIApproved').setVisible(false);
					} else {
						that.getView().byId('showLab').setVisible(false);
						that.getView().byId('noBadger').setVisible(false);
						that.getView().byId('noPIApproved').setVisible(false);
						that.getView().byId('notAuthPerReqd').setVisible(true);
					}
				}
				
				//2.0 validation to check if user data exists in BPM DB
				if (that.getView().byId('showLab').getVisible()) {
					var readUserProfileModel = new sap.ui.model.json.JSONModel();
					readUserProfileModel.loadData("/utilweb/rest/user/auth/read/" + loggedInUser.userId, null, false);
						
					if (readUserProfileModel.getData() == undefined) {
						that.getView().byId('showLab').setVisible(false);
						sap.ui.commons.MessageBox.show("User details does not exist in the system, please contact IT Team.", sap.ui.commons.MessageBox.Icon.ERROR, "Error");
						return;
					}
					
					//3.0 fetch lab list
					that.getView().byId('idLab').setTooltip("");
					var labListModel = new sap.ui.model.json.JSONModel(); 
					labListModel.loadData("/kclrfs/rest/brm/labs", null, false);
					that.getView().setModel(labListModel, "labListModel");
					labListModel.getData().labDto.unshift({labId:"", labName:"Select"});
					labListModel.refresh();
				}
			}
		});
	},
	
	checkBadger : function() {
		var isBadgerStatusActive=false;
		var loggedInUser = loggedinUserModel.getData();
		var userEmailId = loggedInUser.emailId.toLowerCase();  //"basil.chew@kaust.edu.sa";
		var soapMessage = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sch=\"http://www.badgerlms.com/webservices/resource/schemas\">"
				+ "<soapenv:Header/>"
				+ "<soapenv:Body>"
				+ "<sch:memberRequest>"
				+ "<name>"
				+ userEmailId
				+ "</name>"
				+ "</sch:memberRequest>"
				+ "</soapenv:Body>" + "</soapenv:Envelope>";

		$.ajax( {
			url :  "/utilweb/BadgerProxyServlet?WebServices/Resource?wsdl",            //"https://kaust1.badgerlms.com:8443/WebServices/Resource?wsdl",
			type : "POST",
			async : false,
			data : soapMessage,
			dataType : "xml",
			contentType : "text/xml; charset=\"utf-8\"",
			//headers: {	Username : "clbadger.admin@kaust.edu.sa",Password : "kaust2015"},
			success : function(data, textStatus, jqXHR) {
			xmldoc = jqXHR.responseXML;

			if(xmldoc.getElementsByTagName('active').length!=0 && xmldoc.getElementsByTagName('active')[0].childNodes[0].length!=0){
				if(xmldoc.getElementsByTagName('active')[0].childNodes[0].nodeValue=="true"){
					isBadgerStatusActive=true;
				}
			}
		},
		error : function(data) {
			}
		});
		return isBadgerStatusActive;
	},

	toRFSFrom : function(oEvt){
		var that =this;
//		valueLab = that.getView().byId('idLab').getValue();
//		keyLab = that.getView().byId('idLab').getSelectedKey();
		valueLab = that.getView().byId('idLab').getSelectedItem().getProperty("text");
		keyLab = that.getView().byId('idLab').getSelectedItem().getProperty("key");
//		that.getView().byId('idLab').clearSelection();
		if(valueLab==""||valueLab=="Select"){
			sap.ui.commons.MessageBox.show("Plese select lab to proceed",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		}
		else{
			that.oRouter.navTo("RFSForm");
			}
		that.getView().byId('idLab').setSelectedKey("select");
	},
	
	labSelected : function(oEvt){
		var that = this;
		that.getView().byId('idLab').setTooltip(that.getView().byId('idLab').getSelectedItem().getProperty("text"));
	},
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
*/
	onAfterRendering: function() {
		var that=this;
		var idLab=that.getView().byId("idLab");
		//idLab.addDelegate({
			idLab.$().find("input").attr("readonly", true);
		//});
	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
*/
//	onExit: function() {
//
//	}
//		jQuery.sap.require("sap.m.MessageBox");
//		if(message!=""){
//			sap.m.MessageBox.alert(message);
//		}
//		this.getView().setModel(oModel);
});

var valueLab;
var keyLab;