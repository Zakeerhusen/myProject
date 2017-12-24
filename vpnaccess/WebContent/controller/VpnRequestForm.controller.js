jQuery.sap.require("kaust.ui.kitsvpnaccess.utility.Formatter");
jQuery.sap.require("sap.m.MessageBox");
sap.ui.controller("kaust.ui.kitsvpnaccess.controller.VpnRequestForm", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf kaust.ui.kitsvpnaccess.VpnRequestForm
*/
	onInit: function() {
		if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		var oGascModel= new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS");
	    this.getView().setModel(oGascModel, "oGascModel");
	    var oDataModel= new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC");
		this.getView().setModel(oDataModel, "oDataModel");
		var requestId = this.getRequestId();
		if(requestId!=""){
			this.loadTicket(requestId);
	    }else{
	    	var that = this;
	    	this.initializeControlsReadOnly();
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oGascModel.read("RequestTypeSet?$filter=processTypeId eq 'VPN'", {
				success: function(oData) {
					oJSONModel.setProperty("/oRequestType", oData.results);
					that.getView().byId('newOrRenew').setModel(oJSONModel);
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
			//this.byId("expiryDate").setMaxDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
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
	 * loadTicket to load view for CRM ticket
	 */
	loadTicket : function(requestId){
		var oTicketModel = new sap.ui.model.json.JSONModel();
		oTicketModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/VPNRequestSet?$filter=requestId eq '"+requestId+"'&$format=json", null, false);
		var data = oTicketModel.getData().d.results[0];
		/*var oGascModel= this.getView().getModel("oGascModel");
		var data = "";
		oGascModel.read("VPNRequestSet?$filter=requestId eq '"+requestId+"'", null,null,false, function(oData) {
				data = oData.results[0];
			},function(oError) {
				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
		});*/
		if(data){
			if(data.vpn == "X"){
				this.getView().byId("vpnType").setSelectedIndex(0);
			}else{
				this.getView().byId("vpnType").setSelectedIndex(1);
			}
			this.getView().byId('hostIpId').setValue(data.eIPAddress);
			this.getView().byId('hostIpId').setTooltip(data.eIPAddress);
			if(data.VPNExpiryDate != null){
			var expiryDate = data.VPNExpiryDate;
			var startIndex = expiryDate.indexOf("(");
			var endIndex = expiryDate.indexOf(")");
			expiryDate=expiryDate.substring(startIndex+1,endIndex)
			expiryDate = new Date(parseInt(expiryDate)).toString();
			expiryDate = expiryDate.split(" ");
			this.getView().byId('expiryDate').setValue(expiryDate[1]+" "+expiryDate[2]+" "+expiryDate[3]);
			}
			this.getView().byId('justification').setValue(data.Justification);
			this.getView().byId('justification').setTooltip(data.Justification);
			if(data.request_type == "0001"){
				this.getView().byId('eFname').setValue(data.eFirstName);
				this.getView().byId('eMname').setValue(data.eMiddleName);
				this.getView().byId('eLname').setValue(data.eLastName);
				this.getView().byId('eEmail').setValue(data.eMail);
				
				this.getView().byId('eFname').setTooltip(data.eFirstName);
				this.getView().byId('eMname').setTooltip(data.eMiddleName);
				this.getView().byId('eLname').setTooltip(data.eLastName);
				this.getView().byId('eEmail').setTooltip(data.eMail);
				
				if(data.provisionedUserId != ""){
				this.getView().byId('UIDSection').setVisible(true);                 //Provision UID in CRM ticket
				this.getView().byId('suggestedUID').setText(data.provisionedUserId);
				}
			}else{
				this.getView().byId('adAccount').setValue(data.adId);
				this.getView().byId('adAccount').setTooltip(data.adId);
				this.getView().byId('renewType').setVisible(true);
				this.getView().byId('newType').setVisible(false);
			}
			this.getView().byId('newOrRenew').insertItem(new sap.ui.core.Item({text: data.reqTypeDesc, key: "1"}), 0);
			this.getView().byId('newOrRenew').setSelectedKey("1");
		}
		//FOR ONBEHALF user information
		var oDataModel= this.getView().getModel("oDataModel");
		var userData = "";
		oDataModel.read("UserDetail(KaustID='" + data.KaustId + "',UserId='')", null,null,false, function(oData) {
				userData = oData;
			},function(oError) {
				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
		});
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
		
		var url ="/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileRead?$filter=UNIQUE_ID eq '" + requestId + "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '3'";
		var oFileModel = new sap.ui.model.json.JSONModel();
		oFileModel.loadData(url, null, false);
		if(oFileModel.getData().d.results[0].URL != ""){
			this.getView().byId('fileSection').setVisible(true);
			this.getView().byId('fileUrl').setHref(oFileModel.getData().d.results[0].URL);
		}
		this.disableAllFields();
		this.getView().byId('vpnPage').destroyFooter();
	},
	
	/**
	 * initializeControlsReadOnly to not allowing to input from keys 
	 */
	initializeControlsReadOnly : function(){
		var oCombo = this.getView().byId("expiryDate");
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
	 * disableAllFields to disable all UI fields for ticket in readonly mode
	 */
	disableAllFields : function(){
		this.getView().byId('passportSection').setVisible(false);
		this.getView().byId('vpnType').setEnabled(false);
		this.getView().byId('hostIpId').setEnabled(false);
		this.getView().byId('expiryDate').setEnabled(false);
		this.getView().byId('eFname').setEnabled(false);
		this.getView().byId('eMname').setEnabled(false);
		this.getView().byId('eLname').setEnabled(false);
		this.getView().byId('eEmail').setEnabled(false);
		this.getView().byId('adAccount').setEnabled(false);
		this.getView().byId('justification').setEnabled(false);
		this.getView().byId('newOrRenew').setEnabled(false);
		this.getView().byId('idVpnCheckForm').setVisible(false);
	},
	
	/**
	 * onChange to show corresponding fields for new/renew type
	 */
	onChange : function(oEvent){
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var selectedItem = oEvent.getParameters().selectedItem.getText();
		//this.resetAllFields();
		if(selectedItem == oResourceModel.getText("NEW")){
			this.getView().byId("newType").setVisible(true);
			this.getView().byId("renewType").setVisible(false);
		}else{
			this.getView().byId("newType").setVisible(false);
			this.getView().byId("renewType").setVisible(true);
			this.getView().byId("adAccount").setValueState("None");
		}
	},
	
	/**
	 * onValidate to validate the requester form
	 */
	onValidate: function(){
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var hostId = this.getView().byId('hostIpId').getValue().trim();
		var exDate = this.getView().byId('expiryDate').getValue();
		var justification = this.getView().byId('justification').getValue().trim();
		var vpnCheck = this.getView().byId('idVpnCheck').getSelected();
		if(this.getView().byId('newOrRenew').getSelectedItem().getKey() == "0001"){
			var eFname = this.getView().byId('eFname').getValue().trim();
			var eLname = this.getView().byId('eLname').getValue().trim();
			var eEmail = this.getView().byId('eEmail').getValue().trim();
			
			if(eFname == "" || eFname == null){
				 sap.m.MessageBox.show(oResourceModel.getText("EFNAME"), {
		              	        icon: sap.m.MessageBox.Icon.WARNING,
		              	        title: "Warning",
		              	        actions: [sap.m.MessageBox.Action.OK],
		              	      });
				return false;
			}if(eLname == "" || eLname == null){
				 sap.m.MessageBox.show(oResourceModel.getText("ELNAME"), {
				        icon: sap.m.MessageBox.Icon.WARNING,
				        title: "Warning",
				        actions: [sap.m.MessageBox.Action.OK],
				      });
				 return false;
			}if(eEmail == "" || eEmail == null ){
				 sap.m.MessageBox.show(oResourceModel.getText("EEMAIL"), {
				        icon: sap.m.MessageBox.Icon.WARNING,
				        title: "Warning",
				        actions: [sap.m.MessageBox.Action.OK],
				      });
				 return false;
			}else if(!this.validateEmail(eEmail)){
				return false;
			}
		}else{
			var adAccount =  this.getView().byId('adAccount').getValue().trim();
			if(adAccount == "" || adAccount == null){
				 sap.m.MessageBox.show(oResourceModel.getText("ADVAL"), {
				        icon: sap.m.MessageBox.Icon.WARNING,
				        title: "Warning",
				        actions: [sap.m.MessageBox.Action.OK],
				      });
			return false;
			}if(exDate == "" || exDate == null){
				 sap.m.MessageBox.show(oResourceModel.getText("EXPDATEVAL"), {
				        icon: sap.m.MessageBox.Icon.WARNING,
				        title: "Warning",
				        actions: [sap.m.MessageBox.Action.OK],
				      });
			return false;
			}
			else if(this.validateExpDate()){
				return false;
			}
		}
		if(hostId == "" || hostId == null){
			 sap.m.MessageBox.show(oResourceModel.getText("IPVAL"), {
			        icon: sap.m.MessageBox.Icon.WARNING,
			        title: "Warning",
			        actions: [sap.m.MessageBox.Action.OK],
			      });
		return false;
		}else if(!this.ValidateIPaddress(hostId)){
			return false;
		}
		//if(this.getView().byId('newOrRenew').getSelectedItem().getKey() == "0001"){
			//if(document.getElementById('idVpnRequestForm1--docFileUpload-fu').files[0] == undefined){
			if(!this.getView().byId('fileLink').getVisible()){
				 sap.m.MessageBox.show(oResourceModel.getText("PASSPORTVAL"), {
				        icon: sap.m.MessageBox.Icon.WARNING,
				        title: "Warning",
				        actions: [sap.m.MessageBox.Action.OK],
				      });
				 return false;
			}
		//}
		if(justification == "" || justification == null){
			 sap.m.MessageBox.show(oResourceModel.getText("JUSTIFICATIONVAL"), {
			        icon: sap.m.MessageBox.Icon.WARNING,
			        title: "Warning",
			        actions: [sap.m.MessageBox.Action.OK],
			      });
		return false;
		}
		if(!vpnCheck){
			sap.m.MessageBox.show(oResourceModel.getText("VPNCHECKVAL"), {
		        icon: sap.m.MessageBox.Icon.WARNING,
		        title: "Warning",
		        actions: [sap.m.MessageBox.Action.OK],
		      });
			return false;
		}
		else{
			this.onSubmit();
		}
	},
	 
	/**
	 * onSubmit to submit request form : ECC service post call
	 */
	onSubmit : function(){
		var busyDialog = new sap.m.BusyDialog();
		busyDialog.open();
		jQuery.sap.delayedCall(200, this , function () {
		var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var that = this;
		var oUserData = this.getView().getModel("oUserModel").getData().oUserData;
		var vpnType =this.getView().byId("vpnType").getSelectedIndex();
		var type="";
		if(vpnType== 0){type ="VPN";}
		else{type = "Non VPN";}
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		
		/*"requestId" : "", "ProcessId" : " ","Stage" : "","Onbehalf" : "X","FirstName" : "abc","MiddleName" : "def",
		 * "LastName" : "ghi", "MsgTyp1" : "","Msg1" : "",
		 * "rept_mang" : "","department" : "","position" : "",
		 * "role" : "","reqKaustId" : "", "VPNRenewalDate" : "2015-08-11T00:00:00",
		 */
		var payload = {
				"SubServiceCode" : "0055",
				"ServiceCode" : "0016",
				"Wftrigger" : "X",
				"FirstName" :oUserData.FirstName,
				"MiddleName":oUserData.MiddleName,
				"LastName": oUserData.LastName,
				"name" : this.getView().byId('fName').getText()+" "+this.getView().byId('lName').getText(),
				"email" : this.getView().byId('email').getText(),
				"mobile" : this.getView().byId('mobileId').getText(),
				"UserId" : oUserData.UserId,
				"office" : this.getView().byId('officeId').getText(),
				"request_type" : parseInt(this.getView().byId('newOrRenew').getSelectedItem().getKey()),
				"KaustId" : this.getView().byId('kaustId').getText(),
				"eFirstName" : this.getView().byId('eFname').getValue(),
				"eMiddleName" : this.getView().byId('eMname').getValue(),
				"eLastName" : this.getView().byId('eLname').getValue(),
				"eMail" : this.getView().byId('eEmail').getValue(),
				//"suggestedUserId": this.getView().byId('suggestedUID').getText(), 
				"eIPAddress" : this.getView().byId('hostIpId').getValue(),
				//"VPNExpiryDate" : "2015-08-11T00:00:00",
				"Justification" :this.getView().byId('justification').getValue(),
				"adId" : this.getView().byId('adAccount').getValue(),
				"status": "001",
				"requestType":type,
				"activityType":this.getView().byId('newOrRenew').getSelectedItem().getText(),
				"lastTaskStatus":"NA"
		};
		
		if(this.getView().byId("vpnType").getSelectedIndex()== 0){
			payload.vpn = "X";
		}else{
			payload.vpn = "0";
		}
		
		if(this.getView().byId('newOrRenew').getSelectedItem().getKey() != "0001"){
			var oDateTimeData = this._getDateData();
			payload.VPNExpiryDate = oDateTimeData.sExpiryDate+ "T00:00:00";
		}
		
		if(oUserData.Subcategorytype==""){
			payload.flow = "NA";
		}else{
			payload.flow = oUserData.Subcategorytype;
		}
		
		var oGascModel= this.getView().getModel("oGascModel");
		oGascModel.create("/VPNRequestSet",payload, null, function(data,response){
			busyDialog.close();
			if(that.getView().getModel("ofileModel")  != undefined && that.getView().byId('fileLink').getVisible()){
			that.handleFileUploadtoRMS(data.requestId,payload);
			}else{
					sap.m.MessageBox.show('Thank you and please note your request ID#'+data.requestId+', To check status, please go to "My Requests" section.', {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Success",                                    // default
						actions: sap.m.MessageBox.Action.OK,
						onClose: function(oAction){
							that.resetAllFields();
							that.goBack(oAction);
					    },                                       // default
	  	  			    textDirection: sap.ui.core.TextDirection.Inherit     // default
	  	  			    });
			}
		},function(oError){
			busyDialog.close();
					busyDialog.close();
					 sap.m.MessageBox.show(oResourceModel.getText("ERRSUB"), { 
                       	        icon: sap.m.MessageBox.Icon.ERROR,
                       	        title: "Error",
                       	        actions: [sap.m.MessageBox.Action.OK],
                       	      }
                       	    );
				});
		});
	},
	
	/***   
	 * _getDateData to format the VPN expiry date 
	 * Return value: oDateTimeObject
	 */
	_getDateData : function(oEvent) {
		var oDateTimeObject = {};
		var oExpiryDate = this.byId("expiryDate").getDateValue();
		var sExpiryMonth = (oExpiryDate.getMonth() + 1).toString();
		if (sExpiryMonth.length === 1) {
			sExpiryMonth = "0" + sExpiryMonth;
		}
		oDateTimeObject.sExpiryDate = oExpiryDate.getFullYear() + "-" + sExpiryMonth + "-" + oExpiryDate.getDate();
		return oDateTimeObject;
	},
	
	/***   
	 * validation of email format
	 */
	validateEmail: function(email){
		  var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
		    if (!mailregex.test(email)) {
		    	 if(email!=""){
		    		 sap.m.MessageBox.show(email + " is not a valid Email address",{
                	        icon: sap.m.MessageBox.Icon.ERROR,
                   	        title: "Error",
                   	        actions: [sap.m.MessageBox.Action.OK],
                   	      });
		    	 }
		    	return false; 
		    }else{
		    	return true; 
		    }
	},
	
	/***   
	 * validation of IP addresses format
	 */
	ValidateIPaddress: function (ip) {  
	var ipformat = /^((((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\,?)*)-?)*$/;
		if(ipformat.test(ip)){  
		 return true;  
	 }else{  
		 sap.m.MessageBox.show("Please enter valid IP addresses",{
 	        icon: sap.m.MessageBox.Icon.ERROR,
    	        title: "Error",
    	        actions: [sap.m.MessageBox.Action.OK],
    	      });
		 return false;  
	 }  
	 },  
	
	getUrl : function(sUrl) {
		if (sUrl == "") {
			return sUrl;
		}
		if (window.location.hostname == "localhost") {
			return "proxy" + sUrl;
		} else {
			return sUrl;
		}
	},
	
	getToken: function(){
		  var token = null;
		  var urlUserDetails = this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail"); 
		  $.ajax({  
	          url: urlUserDetails,  
	          type: "GET",  
	                dataType: 'json',
	                contentType: "application/json",
	                Accept: "application/json",
	                async: false,        
	          headers:{     
	                 "X-Requested-With": "XMLHttpRequest",
	                 "Content-Type": "application/atom+xml",
	                 "DataServiceVersion": "2.0",       
	                 "X-CSRF-Token":"Fetch"},  
	          success: function(data, textStatus, XMLHttpRequest) { 
	          	//dataModel = data;
	              token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
	              },
	          error: function(data, textStatus, XMLHttpRequest){  
	          	sap.m.MessageBox.show("Error message" + data.responseText, {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Error",                                    // default
					actions: sap.m.MessageBox.Action.OK,
  	  			    textDirection: sap.ui.core.TextDirection.Inherit     // default
  	  			    });
	          }        
	   });
		  //oDialog.close();
		  return token;
	},
	
	validateUser : function(evt){
		var value = evt.getSource().getValue();
		var that = this;
		if(value!=""){
	    	var busyDialog = new sap.m.BusyDialog();
	    	busyDialog.open();
	    	var getADUrl = this.getADUrl();
	    	var url = getADUrl + 'GetUserInfoByUserName?userName=';
//	    	var url = 'http://devvms.kaust.edu.sa:8079/api/ad/GetUserInfoByUserName?userName=';
	    	var servUrl = url + value;
	    	$.ajax({
	    	      url: servUrl,
	    	      async: "false",
	    	      type: "GET",
	    	      dataType: "jsonp",
	    	      contentType: "application/json",
	    	      jsonpCallback: "a",
	    	   
	    	      // Work with the response. JSONP is asynchronous service. That is the reason rerender is placed in the result.
	    	      success: function(data) {
	    	    	  busyDialog.close();
	                   var inputField = that.getView().byId("adAccount");
		                   if(data){
		                		   inputField.setValueState("Success");
			                	   inputField.setValue(data.UserName);
		                   }else{
		                	   		inputField.setValue("");
		                	   		inputField.setValueState("Error");
		                	   		inputField.removeStyleClass("sapMInputBaseMessage");
			                	  //inputField.setValueState("Error").setValueStateText("Please enter a valid x_account");
		                   }
	    	      },
	    	   error: function(data) {
	    		  // that.getView().byId("adAccount").setValue("");
	    		   that.getView().byId("adAccount").setValue("");
	    		   jQuery.sap.log.debug("error: " + data);
	    		   busyDialog.close();
                   sap.m.MessageBox.show(
                     		"Not authorised for AD service, please contact your administrator", {
                     	        icon: sap.m.MessageBox.Icon.ERROR,
                     	        title: "Error",
                     	        actions: [sap.m.MessageBox.Action.OK],
                     	      });
	    	   }
	    	  });
		}
	},
	
	/***   
	 * validation of AD User ID
	 */
	/*validateUser : function(evt){
		var value = evt.getSource().getValue();
		var that = this;
		if(value!=""){
	    	var busyDialog = new sap.m.BusyDialog();
	    	busyDialog.open();
	    	jQuery.sap.delayedCall(10, this , function () {
	    	var getADUrl = this.getADUrl();
	    	var url = getADUrl + 'GetUserInfoByUserName?userName=';
	    	var servUrl = url + value;
	    	
	    	var oUIDLookupModel = new sap.ui.model.json.JSONModel();
	    	oUIDLookupModel.loadData(servUrl, null, false);
	    	busyDialog.close();
	    	
	    	var inputField = that.getView().byId("adAccount");
	    	if(oUIDLookupModel.getData()!=null){
	    	   inputField.setValueState("Success");
         	   inputField.setValue(oUIDLookupModel.getData().UserName);
	    	}else{
	    	   inputField.setValue("");
         	   inputField.setValueState("Error").setValueStateText("Please enter a valid User ID");
	    	}
	    	busyDialog.close();
	    	});
		}
	},*/
	
	/***   
	 * getADUrl to get AD service URL
	 */
	getADUrl:function() {
		  var host = window.location.hostname;
		  var port = window.location.port;
		  if (host == "localhost") {
		  // return "http://devvms.kaust.edu.sa:8079/api/ad/";
		   return "https://ws.kaust.edu.sa/api/activedirectory/";
		  }
		  if (host.indexOf("kaust.edu.sa") == -1 ) {
		   host = host + ".kaust.edu.sa";
		  } 
		  switch (port){
		    case '8005':
		    // return "http://devvms.kaust.edu.sa:8079/api/ad/";
		    //	return "https://ws.kaust.edu.sa/api/ad/";	   // given by KAUST first time
		    	return "https://ws.kaust.edu.sa/api/activedirectory/";  // given by KAUST second time
		     break;
		    case '8006':
			// return "https://devvms.kaust.edu.sa:8079/api/ad/";
		    // 	return "https://ws.kaust.edu.sa/api/ad/";
		    	return "https://ws.kaust.edu.sa/api/activedirectory/";	
			 break;
		    case '8000':
		   //  return "https://ws.kaust.edu.sa/api/ad/";
		    	return "https://ws.kaust.edu.sa/api/activedirectory/";
		     break;
		    case '8001':
			// return "https://ws.kaust.edu.sa/api/ad/";
		    	return "https://ws.kaust.edu.sa/api/activedirectory/";
			 break;
		    case '8002':
		   //  return "https://ws.kaust.edu.sa/api/ad/";
		    	return "https://ws.kaust.edu.sa/api/activedirectory/";
		     break;
		    case '8003':
			 //    return "https://ws.kaust.edu.sa/api/ad/";
		    	return "https://ws.kaust.edu.sa/api/activedirectory/";
			     break;
		  }
		  return;
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
			    	that.resetAllFields();
			    	that.goBack(oAction);
			    },                                  // default
			    textDirection: sap.ui.core.TextDirection.Inherit     // default
			    });
		},
		
	/**
	 * goBack to close screen
	 */				
	goBack : function(oAction){
		if(oAction=="YES"|| oAction=="OK"){
			window.history.go(-1);
		//	window.open('','_self').close();
		}else{
			return false;
		}
	},
	
	/**
	 * getFulName to display user's full name
	 */
	getFulName : function(fn,mn,ln){
		if(fn!=""&& fn!=null && fn!=undefined){
			return fn+" "+mn+" "+ln;
		}
	},
	
	/**
	 * handleFileUploadLocal to upload file locally before submission
	 */
	handleFileUploadLocal : function(oEvent){
		var that = this;
		 file = document.getElementById('__xmlview1--docFileUpload-fu').files[0];
		 if(file != undefined && file.type == "application/pdf"){
			 var fileName = file.name;
			 var regex = /[!$%^&*()+|~=`{}\[\]:";'<>?,\/]/;
			 if(!regex.test(fileName)){
			var reader = new FileReader();
			reader.readAsArrayBuffer(file);
			reader.onload = function(evt) {
				var byteArray2 = new Uint8Array(evt.target.result);
				var fileEncodedData = window.btoa(that.uint8ToString(byteArray2));
				var ofileModel  = new sap.ui.model.json.JSONModel();
				var obj = {"fileData":"","fileName":"","type":""};
				obj.fileData = fileEncodedData;
				obj.fileName = fileName;
				obj.type = file.type;
				ofileModel.setData(obj);
				that.getView().setModel(ofileModel,"ofileModel");
				that.getView().byId('fileLink').setVisible(true);
				that.getView().byId('fileDelete').setVisible(true);
			};
		 }else{
			 this.showMessage("Filename should not contain special characters","Warning");
				that.getView().byId('fileLink').setVisible(false);
				that.getView().byId('fileDelete').setVisible(false);
		 }
		 }else{
				 this.showMessage("Please select a PDF file to upload","Warning");
			}
	},
			
	uint8ToString : function(buf) {
		var i, length, out = '';
		for (i = 0, length = buf.length; i < length; i += 1) {
			out += String.fromCharCode(buf[i]);
		}
		return out;
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
	
	/**
	 * UploadFileToRMS to upload on KAUST server
	 */
	UploadFileToRMS:function(fileName,KaustId,folderId,type,successFn){
				//var uploadCntr = this.getView().byId("docFileUpload");
				//	this.setBusy(true);
				/*Folder Name NodeID
					Passport 1
					Iqama 3
					Saudi Visa 5
					Degree Certificate 7
					Marriage Certificate 9
					Birth Certificate 11
					Driving License 13
					Car Registration Card 15
					Saudi ID 17
					Saudi Family Card 19
					Salary Certificate 21
					Employment Letter 23
					CV 25
					Others(unclassified) 27*/
				
				if( ! (fileName && KaustId && folderId)){
					this.showMessage("Missing parameters","Warning");
					return;
				}
				var that=this;
				var slug = fileName +','+ KaustId +','+ folderId;
				 //  var file = jQuery.sap.domById(uploadCntr.getId() + "-fu").files[0];
				   var uploadUrl = this.getUrl("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileAttachCollection");
				   var token = this.getToken();
				   var oHeaders = {
		                   "x-csrf-token": token ,
		                   "slug": slug,
		                   "X-Requested-With": "XMLHttpRequest",
		                   "Content-Type": type,
		                   "DataServiceVersion": "2.0",
		                   "Accept" : "text/plain, */*"
		                   };
				   if (file) {				   				   
						 $.ajax({
					 			url: uploadUrl ,			 		
					 			type: "POST",
					 			data: file,
					 			cache: false,
					 			processData:false,
					 			dataType: "text",
					 			headers: oHeaders,
//					 	        beforeSend: function(xhr){
//						                  xhr.setRequestHeader("X-CSRF-Token", token);
//						               },    			
									success: function(oResponse, textStatus, jqXHR) {
//										that.showMessage("File uploaded successfully", null, "Success");
										successFn.call(that);
									},
									error: function(jqXHR, textStatus, errorThrown){
										var errorMsg =jQuery(jqXHR.responseText).find('message').text().replace("RFC Error:","");
											if(errorMsg){
											sap.m.MessageBox.alert(errorMsg, {
												title : "Error",
												icon : sap.m.MessageBox.Icon.ERROR
											});
										}else if(textStatus==="error" && jqXHR.responseText.indexOf('/IWFND/CM_BEC/026') != -1){//unauthorize
											that.showMessage(" You Are Not Authorized To Upload The Documents");
										}else if(textStatus==="timeout") {
											that.showMessage("Connection timed out: too much data to retrieve. Please select a shorter period of time.", "Error");					
										} else {
											jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText);
											that.showMessage("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, "Error");
										};
									},
									complete:function(jqXHR, textStatus, errorThrown){
//										that.setBusy(false);
									}
								});	
				   }else{
						that.showMessage("File attachment is required. " +  "Validation");
				   }
			},
			
		/**
		 * getUserFilesByKaustId to get file for a particular raised request
		 */	
		getUserFilesByKaustId:function(requestId,kaustId,SuccessCallback,completeCallback){
			var that= this;
//				this.setBusy(true);
//				http://sthcigwd1.kaust.edu.sa:8000/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileRead?$filter=UNIQUE_ID eq '1002858975' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02 ' and DOCTYPE eq '30'
			$.ajax({
				url : "/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileRead?$filter=UNIQUE_ID eq '" + requestId + "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '3'",			
				dataType : "json",
				contentType : "application/json",
				success : function(data, response) {
					var filesResult  = $.map(data.d.results,function(item){ return {
						'CRD_DATE': kaust.ui.kitsvpnaccess.utility.Formatter.RmsDate( item.CRD_DATE ),
						'CRD_USER':item.CRD_USER,
						'FileName':item.FILENAME,
						'Url':item.URL,	
						'APPLICATION_TYPE':item.APPLICATION_TYPE,
						'UNIQUE_ID':item.UNIQUE_ID,
						'USER':item.USER,
						'EXP_DATE':kaust.ui.kitsvpnaccess.utility.Formatter.RmsDate(item.EXP_DATE),
						'MSG_TYPE':item.MSG_TYPE,
						'MESSAGE':item.MESSAGE
							} })
//							that.setBusy(false);
						SuccessCallback.call(that,filesResult);														
				},
				error : function() {
					that.showMessage("Server error happened","Warning")
				},
				complete:function(){
					completeCallback.call(that);	
				}
			});
		},

	/**
	 * handleFileUploadtoRMS to upload on KAUST server
	 */
	handleFileUploadtoRMS:function(requestId,createData){
	//if(this.getView().byId("docFileUpload").getValue()){
		var fielData = this.getView().getModel("ofileModel").getData();
		if(fielData){
		var data=this.getView().getModel("oUserModel").getData().oUserData;
//				this.setBusy(true);
		var busyDialog = new sap.m.BusyDialog();
 	        busyDialog.open();
 	       jQuery.sap.delayedCall(100, this , function () {
		var that=this;
		this.UploadFileToRMS(fielData.fileName.split(".")[0],requestId,"3",fielData.type,function(){
			this.getUserFilesByKaustId(requestId,data.KaustID,function(ofilesData){
				var ofileModel  = new sap.ui.model.json.JSONModel();
				//handle File
				if(ofilesData.length > 0 ){
					if( ofilesData[0].MSG_TYPE =="E"){
						that.showMessage(ofilesData[0].MESSAGE,"Warning");						
					}else{							    	
				    	ofileModel.setData(ofilesData);	    				    	
					}
					that.getView().setModel(ofileModel, "userFiles");	    			    	
//						    tbl.setModel(ofileModel);	
				}	
				that.updateVPN(requestId,createData,ofilesData[0].Url);
				that.getView().byId("docFileUpload").setValue("");
//						that.resetAllFields();
			    busyDialog.close();
//					    docTitle.setValue("");
//					    docExpiryDate.setValue("");
//					    tabAttachment.setExpanded(false)
		    },function(){
//				    	tbl.setBusy(false);
		    });	
		});
 	      });
		}
	},
	
	/**
	 * updateVPN to submit the request and ECC post call
	 */
	updateVPN:function(requestId,jsonData,attachment){
		var that=this;
		 var object = {};
		 jsonData.Attachment=attachment;
		 jsonData.Wftrigger = "0";
			var  url = "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/VPNRequestSet('"+requestId+"')";
			jsonData = JSON.stringify(jsonData); 
			var token = this.getGateWayToken();
//			object = this.jsonData(jsonData, status);
// 			object = JSON.stringify(object);
		  $.ajax({
		     url: url,
		     dataType: 'json',
		     contentType: "application/json",
		     async: false,
		     data: jsonData,
		     type: "PUT",
			beforeSend: function(xhr){  
			         xhr.setRequestHeader("X-CSRF-Token", token);
			}, 
		     success: function(oResponse, textStatus, jqXHR) {
		       var dataDetails = oResponse;
		       sap.m.MessageBox.show('Thank you and please note your request ID#'+requestId+', To check status, please go to "My Requests" section.', {
					icon: sap.m.MessageBox.Icon.SUCCESS,
					title: "Success",                                    // default
					actions: sap.m.MessageBox.Action.OK,
					onClose: function(oAction){
						that.resetAllFields();
						that.goBack(oAction);
				    },                                       // default
  	  			    textDirection: sap.ui.core.TextDirection.Inherit     // default
  	  			    });
		       		//   window.open('','_self').close();                 Zakeer : preventing closing of the tab
		           //sap.ui.commons.MessageBox.alert("Email Request Successfully created", null, "Success");
		          // sap.ui.getCore().byId("submit").setEnabled(false); 
		     },
		     error: function(jqXHR, textStatus, errorThrown){
		           if(textStatus==="timeout") {
		        	   sap.m.MessageBox.show(
                       		"Connection timed out", {
                       	        icon: sap.m.MessageBox.Icon.ERROR,
                       	        title: "Error",
                       	        actions: [sap.m.MessageBox.Action.OK],
//		                       	        styleClass: bCompact ? "sapUiSizeCompact" : ""
                       	      }
                       	    ); 
		           } else {
		        	   sap.m.MessageBox.show(
                			   "The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, {
                        	        icon: sap.m.MessageBox.Icon.ERROR,
                        	        title: "Error",
                        	        actions: [sap.m.MessageBox.Action.OK],
//		                        	        styleClass: bCompact ? "sapUiSizeCompact" : ""
                        	      }
                        	    );   
		        	   jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText + "," + jqXHR.status +"," + jqXHR.statusText);
		           };
		     },
		     complete: function(){
		     }
		});
	},
	
	/**
	 * 	 getGateWayToken to get token
	 */	
	 getGateWayToken:function(){
	     var metadataEmail = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/AccessRequest(RequestId='',KaustId='')");
	     var token = null;
	     $.ajax({  
	          url: metadataEmail,  
	          type: "GET",  
	                dataType: 'json',
	                contentType: "application/json",
	                Accept: "application/json",
	                async: false,        
	          headers:
	          {     
	                         "X-Requested-With": "XMLHttpRequest",
	                         "Content-Type": "application/atom+xml",
	                         "DataServiceVersion": "2.0",       
	                         "X-CSRF-Token":"Fetch",  
	          },  
	          success: function(data, textStatus, XMLHttpRequest) { 
	            dataModel = data;
	              token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');    },
	          error: function(data, textStatus, XMLHttpRequest){  
	         alert("Error message");
	          }        
	          
	   });
	     return token;
	 },

	 trimValue:function(oEvt){
		var value = oEvt.getSource().getValue();
		oEvt.getSource().setValue($.trim(value));
	 },
	 
	 /**
	 * 	 validateExpDate to validate expiry date to be greater than than current date
	 */	
	 validateExpDate:function(oEvt){
		 var date = Date.parse(this.getView().byId("expiryDate").getValue());
		 if(Date.parse(new Date()) > date ){
			   sap.m.MessageBox.show("Expiry date should be greater than Today's date", {
                  	        icon: sap.m.MessageBox.Icon.ERROR,
                  	        title: "Error",
                  	        actions: [sap.m.MessageBox.Action.OK],
                  	      }
                  	    ); 
			 //  oEvt.getSource().setValue("");
			   this.getView().byId("expiryDate").setValue("");
			   return true;
			 }
		 if(Date.parse(new Date(new Date().setFullYear(new Date().getFullYear() + 1))) < date){
			  sap.m.MessageBox.show("Expiry date should not be greater than one year", {
        	        icon: sap.m.MessageBox.Icon.ERROR,
        	        title: "Error",
        	        actions: [sap.m.MessageBox.Action.OK],
        	      }
        	    ); 
	 //  oEvt.getSource().setValue("");
	   this.getView().byId("expiryDate").setValue("");
	   return true;
		 }
		 return false;
	 },
		
	 /**
	 * resetAllFields to reset all UI fields post submission
	 */
	 resetAllFields:function(){
		 this.getView().byId("vpnType").setSelectedIndex(0);
		 this.getView().byId("docFileUpload").setValue("");
		 
			this.getView().byId('hostIpId').setValue("");
			this.getView().byId('expiryDate').setValue("");
			this.getView().byId('justification').setValue("");
//					if(data.request_type=="New"){
				this.getView().byId('eFname').setValue("");
				this.getView().byId('eMname').setValue("");
				this.getView().byId('eLname').setValue("");
				this.getView().byId('eEmail').setValue("");
//					}else{
				this.getView().byId('adAccount').setValue("");
				this.getView().byId("adAccount").setValueState("None");
				var oJSONModel = new sap.ui.model.json.JSONModel();
				// https://sthcigwdq1.kaust.edu.sa:8006
				//oJSONModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/RequestTypeSet?$filter=processTypeId eq 'VPN'&$format=json", null, false);----
				//this.getView().byId('newOrRenew').setModel(oJSONModel);
				/*var oGascModel= this.getView().getModel("oGascModel");
				oGascModel.read("RequestTypeSet?$filter=processTypeId eq 'VPN'", {
					success: function(oData) {
						oJSONModel.setProperty("/oRequestType", oData.results);
						that.getView().byId('newOrRenew').setModel(oJSONModel);
					},
					error: function(oError) {
						jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
					}
				});*/
//					}
//					this.getView().byId('newOrRenew').insertItem(new sap.ui.core.Item({text: data.request_type, key: "1"}), 0);
//					this.getView().byId('newOrRenew').setSelectedKey("1");
		//	this.getView().byId('UIDSection').setVisible(false);
 	},

 	/**
	 * showMessage to display messagebox to user with message
	 */
	showMessage:function(msg,mtitle){
		//jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.show(msg, {
			icon : sap.m.MessageBox.Icon.WARNING,
			title : mtitle,
			actions : [ sap.m.MessageBox.Action.OK ],
		});
		
	},
	
	/**
	 * removeFile to remove the link and clear of upload field
	 */
	removeFile: function(){
		this.getView().byId("docFileUpload").setValue("");
		this.getView().byId('fileLink').setVisible(false);
		this.getView().byId('fileDelete').setVisible(false);
	},
	
	/**
	 * fnFirstLettertoUppercase to make first letter to upper case for First, middle and last name
	 */
	fnFirstLettertoUppercase : function(oEvent){
		var sName = oEvent.getSource().getValue().trim();
		sName = sName.charAt(0).toUpperCase()+ sName.slice(1);
		oEvent.getSource().setValue(sName);
	},
	
	/*UID_creation : function(){
		var uid="x_";
		var fName = this.getView().byId('eFname').getValue().trim();
		var mName = this.getView().byId('eMname').getValue().trim();
		var lName = this.getView().byId('eLname').getValue().trim();
		if(lName!=""){
			if(lName.length > 6){
			uid = uid+lName.substring(0,6);
			}else{
				uid = uid+lName.substring(0,lName.length);
			}
		}else{
			this.getView().byId('UIDSection').setVisible(false);
			return;
		}
		
		if(fName != ""){
			uid = uid+fName.substring(0,1);
			}else{
				this.getView().byId('UIDSection').setVisible(false);
				return;
			}
		if(mName != ""){
			uid = uid+mName.substring(0,1);
			}
		uid = uid.toLowerCase();
		var busyDialog = new sap.m.BusyDialog();
		//busyDialog.open();
		var flag = this.validateUID(uid);
		if(flag){
			this.getView().byId('UIDSection').setVisible(false);
			var uid1 = uid+"0a";
			var flag1 = this.validateUID(uid1);
			if(flag1){
				this.getView().byId('UIDSection').setVisible(false);
				var uid2 = uid+"0b";
				var flag2 = this.validateUID(uid2);
				if(flag2){
					this.getView().byId('UIDSection').setVisible(false);
					// show the user id existing in AD for all combinations
				}else{
					this.getView().byId('UIDSection').setVisible(true);
					this.getView().byId('suggestedUID').setText(uid2);
				}
			}else{
				this.getView().byId('UIDSection').setVisible(true);
				this.getView().byId('suggestedUID').setText(uid1);
			}
		}else{
			this.getView().byId('UIDSection').setVisible(true);
			this.getView().byId('suggestedUID').setText(uid);
		}
		busyDialog.close();
		//return uid;	
	},
	
	validateUID : function(uid){
		var that = this;
	    	var getADUrl = this.getADUrl();
	    	var url = getADUrl + 'GetUserInfoByUserName?userName=';
//	    	var url = 'http://devvms.kaust.edu.sa:8079/api/ad/GetUserInfoByUserName?userName=';
	    	var servUrl = url + uid;
	    	
	    	var oUIDLookupModel = new sap.ui.model.json.JSONModel();
	    	oUIDLookupModel.loadData(servUrl, null, false);
	    	if(oUIDLookupModel.getData()!=null){
	    		return true;
	    	}else{
	    		return false;
	    	}	
	    	oUIDLookupModel.attachRequestCompleted(function(oEvent) {
				if (oEvent.getParameter("success")) {
					if(oUIDLookupModel.getData()!=null){
			    		return true;
			    	}else{
			    		return false;
			    	}	
				}
			});
	    	oUIDLookupModel.attachRequestFailed(function(oEvent) {
	    		return false;
			});
	    	
	},*/
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf kaust.ui.kitsvpnaccess.VpnRequestForm
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf kaust.ui.kitsvpnaccess.VpnRequestForm
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf kaust.ui.kitsvpnaccess.VpnRequestForm
*/
//	onExit: function() {
//
//	}

});