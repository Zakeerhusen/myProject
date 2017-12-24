jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.Registration", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf kaust_corelabs.Login
*/
	onInit: function() {
	if (!jQuery.support.touch||jQuery.device.is.desktop){
		this.getView().addStyleClass("sapUiSizeCompact");
		}
	var that = this;
	this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	this.oRouter.attachRoutePatternMatched(function(oEvent) {
		if (oEvent.getParameter("name") === "Registration") {
			var readUserProfileModel = new sap.ui.model.json.JSONModel();
			var emailId=loggedinUserModel.getData().emailId;
			readUserProfileModel.loadData("/utilweb/rest/user/auth/read/"+emailId,null,false);
			that.getView().setModel(readUserProfileModel,"userData");
			
			that.getView().byId('reqAddr').setValue(readUserProfileModel.getData().address);
			
			if(readUserProfileModel.getData().userType=="RPT"){
				that.getView().byId('iskrpt').setSelected(true);
			}
			if(readUserProfileModel.getData().isAuthPersonReqd=="true"||readUserProfileModel.getData().isAuthPersonReqd==true){
				that.getView().byId('isapinfo').setSelected(true);
			}else{
				that.getView().byId('isapinfo').setSelected(false);
			}
			var oCountryJsonModel = new sap.ui.model.json.JSONModel();
			//oCountryJsonModel.iSizeLimit=300;
			//oCountryJsonModel.loadData(urlInc+"Countrys?$format=json",null,false);
			oCountryJsonModel.loadData(urlCont+"COUNTRY?$format=json&$select=LAND1,LANDX",null,false);
			//------------------------------------------------------------------------------------------
			// Country model size equal to number of country name - Edited by Darshna on 07/07/2017
			oCountryJsonModel.iSizeLimit = oCountryJsonModel.getData().d.results.length;
			//------------------------------------------------------------------------------------------
			that.getView().byId('country').setModel(oCountryJsonModel,"oCountryJsonModel");
			
			var orgTypeModel = new sap.ui.model.json.JSONModel(); 
			orgTypeModel.loadData("/kclrfs/rest/brm/organization",null,false);
			that.getView().setModel(orgTypeModel,"orgTypeModel");
		}});
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf kaust_corelabs.Login
*/
//	onBeforeRendering: function() {
//
//	},

	onSelect : function() {
		var chk = this.getView().byId("ckb2").getSelected();
		if(chk)
			this.getView().byId("layout1").setVisible(true);
		else
			this.getView().byId("layout1").setVisible(false);
	},
	
	isAuthPer : function(){
		/*var that = this;
		var check = that.getView().byId('isapinfo').getSelected();
		if(check){
			that.getView().byId('apname').setEnabled(true);
			that.getView().byId('apemail').setEnabled(true);
		}else{
			that.getView().byId('apname').setEnabled(false);
			that.getView().byId('apemail').setEnabled(false);
		}
		that.getView().byId('updateBtn').setEnabled(true);*/
	},
	
	 addressValidate : function(evt){
		getTrimUiInputVal(evt); // Edited by Darshna on 07/07/2017 - Trim the string for whitespace at the start and end
		var name = evt.getSource().getValue();
		var that = this;
		if (name == "") {
		  evt.getSource().setValueState(sap.ui.core.ValueState.Error);
		  sap.ui.commons.MessageBox.show("Please enter proper data",sap.ui.commons.MessageBox.Icon.ERROR, "Error");	
		} else {
		  that.getView().byId('updateBtn').setEnabled(true);
		  evt.getSource().setValueState(sap.ui.core.ValueState.None);
			}
		},
	
	nameValidate : function(evt){ 
        getTrimUiInputVal(evt); // Edited by Darshna on 07/07/2017 - Trim the string for whitespace at the start and end
		var name = evt.getSource().getValue();
		  var nameregex =  /^[a-zA-Z ]{1,70}$/;
		  evt.getSource().setValueState();
		    if (!nameregex.test(name)) {
		    	sap.ui.commons.MessageBox.show("Please enter proper data",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		      //alert("Invalid! Please Enter Proper Data");
		      evt.getSource().setValue("");
		      evt.getSource().setValueState(sap.ui.core.ValueState.Error);
		    }else{
		    	evt.getSource().setValueState(sap.ui.core.ValueState.None);
		    	}
		    var that =this;
			that.getView().byId('updateBtn').setEnabled(true);
	},
	
	teleValidate:function(oEvt){ 
        getTrimUiInputVal(oEvt); // Edited by Darshna on 07/07/2017 - Trim the string for whitespace at the start and end
		  var that =this;
		  var number = oEvt.getSource().getValue();
		 // var regex =  /^(\+\d{1,3}[- ]?)?\d{3,20}$/;
		 // var regex = /^[ 0-9+-]*$/;
		  var validTele = that.checkTelephoneAndFaxByValue(number);
		  oEvt.getSource().setValueState();
		    if (!validTele) {
		      sap.ui.commons.MessageBox.show("Please enter valid telephone number",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		      oEvt.getSource().setValueState(sap.ui.core.ValueState.Error);
		      oEvt.getSource().setValue("");
		    }else{
		    	oEvt.getSource().setValueState(sap.ui.core.ValueState.None);
		    	}
			that.getView().byId('updateBtn').setEnabled(true);
	   },
	
	   numberValidate:function(oEvt){ 
	        getTrimUiInputVal(oEvt); // Edited by Darshna on 07/07/2017 - Trim the string for whitespace at the start and end
			  var that =this;
			  var number = oEvt.getSource().getValue();
			 // var regex =  /^(\+\d{1,3}[- ]?)?\d{3,20}$/;
			  var regex = /^[ 0-9]*$/;
			  oEvt.getSource().setValueState();
			    if (!regex.test(number)) {
			      sap.ui.commons.MessageBox.show("Please enter proper data",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			      oEvt.getSource().setValueState(sap.ui.core.ValueState.Error);
			      oEvt.getSource().setValue("");
			    }else{
			    	oEvt.getSource().setValueState(sap.ui.core.ValueState.None);
			    	}
				that.getView().byId('updateBtn').setEnabled(true);
		   },  
	   
	enableUpdateBtn : function(){
		var that =this;
		that.getView().byId('updateBtn').setEnabled(true);
	},
	
	// Edited by Darshna on 07/07/2017 - Added the parameter oEvt 
	validateEmail: function(oEvt){
		getTrimUiInputVal(oEvt); // Edited by Darshna on 07/07/2017 - Trim the string for whitespace at the start and end
		var that =this;
		var email = that.getView().byId("email").getValue();
		  var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
		  var emails = ["@gmail.com","@yahoo.com","@rediff.com","@hotmail.com","@rocketmail.com","@GMAIL.COM","@YAHOO.COM","@REDIFF.COM","@HOTMAIL.COM","@ROCKETMAIL.COM"];
		  that.getView().byId("email").setValueState();
		    if (!mailregex.test(email)) {
		    	 if(email!=""){
		    		 sap.ui.commons.MessageBox.show(email + " is not a valid email address",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		    	 }
		    	 that.getView().byId("email").setValue("");
		    	 that.getView().byId("email").setValueState(sap.ui.core.ValueState.Error);
		    }else{
		    	that.getView().byId("email").setValueState(sap.ui.core.ValueState.None);
		    }
		    var emailLen=emails.length;
		    for(i=0;i<emailLen;i++){
			  if(email.indexOf(emails[i])!= -1){
				  if(email!=""){
					  sap.ui.commons.MessageBox.show(email + " is not a valid email address",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				  }
				  that.getView().byId("email").setValue("");
				  that.getView().byId("email").setValueState(sap.ui.core.ValueState.Error);
			      break;
		  }else{
		    	that.getView().byId("email").setValueState(sap.ui.core.ValueState.None);
		    }  } 
	},

	 // Edited by Darshna on 07/07/2017 - Added the parameter oEvt 
	validateAuthPerEmail: function(oEvt){
		getTrimUiInputVal(oEvt); // Edited by Darshna on 07/07/2017 - Trim the string for whitespace at the start and end
		var that =this;
		var email = that.getView().byId("apemail").getValue();
		  var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
		  var emails = ["@gmail.com","@yahoo.com","@rediff.com","@hotmail.com","@rocketmail.com","@GMAIL.COM","@YAHOO.COM","@REDIFF.COM","@HOTMAIL.COM","@ROCKETMAIL.COM"];
		  that.getView().byId("apemail").setValueState();
		    if (!mailregex.test(email)) {
		    	 if(email!=""){
		    		 sap.ui.commons.MessageBox.show(email + " is not a valid email address",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		      }
		    	 that.getView().byId("apemail").setValueState(sap.ui.core.ValueState.Error);
		    }else{
		    	that.getView().byId("apemail").setValueState(sap.ui.core.ValueState.None);
		    }
		    var emailLen=emails.length;
		    for(i=0;i<emailLen;i++){
			  if(email.indexOf(emails[i])!= -1){
				  if(email!=""){
					  sap.ui.commons.MessageBox.show(email + " is not a valid email address",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				  }
				  that.getView().byId("apemail").setValueState(sap.ui.core.ValueState.Error);
			      break;
		  }else{
		    	that.getView().byId("apemail").setValueState(sap.ui.core.ValueState.None);
		    }  } 
		  that.getView().byId('updateBtn').setEnabled(true);
	},
	
	validateAll : function(){
		var that=this;
		var updateUserData=that.getView().getModel("userData").getData();
		 
		var telephone=updateUserData.telephone;
		var orgNm=updateUserData.orgNm;
		var orgTypeNm=updateUserData.orgTypeNm;
		var address=updateUserData.address;
		var countryNm=updateUserData.countryNm;
		var authPersonNm=updateUserData.authPersonNm;
		var authPersonEmailId=updateUserData.authPersonEmailId;
		var check = that.getView().byId('isapinfo').getSelected();

		if(orgTypeNm==""||orgTypeNm==null){
			sap.ui.commons.MessageBox.show("Please select organization type",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			return false;
		}else if(orgNm==""||orgNm==null){
			sap.ui.commons.MessageBox.show("Please enter your organization name",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			return false;
		}else if(telephone==""||telephone==null){
			sap.ui.commons.MessageBox.show("Please enter valid telephone number",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			return false;
		}else if(address==""||address==null){
			sap.ui.commons.MessageBox.show("Please enter valid address",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			return false;
		}else if(countryNm==""||countryNm==null){
			sap.ui.commons.MessageBox.show("Please select country name",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			return false;
		}else if(check){
			if(authPersonNm==""||authPersonNm==null){
				sap.ui.commons.MessageBox.show("Please enter Authorized Person name",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				return false;
			}else if(authPersonEmailId==""||authPersonEmailId==null){
				sap.ui.commons.MessageBox.show("Please enter Authorized Person email",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				return false;
			}else{
				that.onUpdate();
			}
		}else{
		that.onUpdate();
		}
	},
	
	onUpdate : function(){
		var that = this;
		var updateUserData=that.getView().getModel("userData").getData();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		jQuery.sap.require("sap.m.MessageBox");
		var iskrpt = that.getView().byId("iskrpt").getSelected();
		if(iskrpt){
			iskrpt="RPT";
		}else{
		iskrpt="EXTERNAL";
		}
		var updatePayload={
			 "userId":updateUserData.userId,
			 "firstNm":updateUserData.firstNm,
			 "lastNm":updateUserData.lastNm,
			 "emailId":updateUserData.emailId,
			 "telephone":updateUserData.telephone,
			 "userType":iskrpt,
			 "orgNm":updateUserData.orgNm,
			 "orgTypeNm":updateUserData.orgTypeNm,
			 "position":updateUserData.position,
			 "deptNm":updateUserData.deptNm,
			 "address":that.getView().byId('reqAddr').getValue(),
			 "countryNm":that.getView().byId('country').getValue(),
			 "countryId":that.getView().byId('country').getSelectedKey(),
			 "postCode":updateUserData.postCode,
			 "isAuthPersonReqd":updateUserData.isAuthPersonReqd,
			 "authPersonNm":updateUserData.authPersonNm,
			 "authPersonEmailId":updateUserData.authPersonEmailId
			};
		
		var updateUserModel=new sap.ui.model.json.JSONModel();
		updateUserModel.loadData("/utilweb/rest/user/auth/editProfile",JSON.stringify(updatePayload),false,"POST",false,false,oHeader);
		if(updateUserModel.getData().status=="SUCCESS"){
			sap.ui.commons.MessageBox.show("Profile updated sucessfully",sap.ui.commons.MessageBox.Icon.SUCCESS,"Success");
		}else{
			sap.ui.commons.MessageBox.show("Update failed",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	},
	
	checkTelephoneAndFaxByValue : function(valueSpar) {
		var that=this;
		var validSpar = false;
		if (that.nullCheckSpar(valueSpar)) {
			if ((valueSpar.length <= 30) && (parseInt(valueSpar) != 0)) {
				var allowedTelNoCharSpar = "0123456789";
				var arrayOfOpenBraces = [];
				var arrayOfCloseBraces = [];

				for ( var i = 0; i < valueSpar.length; i++) {
					if (i == 0) {
						if ((allowedTelNoCharSpar + "+(").indexOf(valueSpar
								.charAt(i)) == -1) {
							return false;
						}
					} else if (i == (valueSpar.length - 1)) {
						if ((allowedTelNoCharSpar + ")").indexOf(valueSpar
								.charAt(i)) == -1) {
							return false;
						}
					} else {
						if ((allowedTelNoCharSpar + "-()").indexOf(valueSpar
								.charAt(i)) == -1) {
							return false;
						}
					}

					if (("(").indexOf(valueSpar.charAt(i)) != -1) {
						arrayOfOpenBraces.push(i);
					}
					if ((")").indexOf(valueSpar.charAt(i)) != -1) {
						arrayOfCloseBraces.push(i);
					}
					if (("-").indexOf(valueSpar.charAt(i)) != -1) {
						if (((i + 1) < valueSpar.length)
								&& (("-").indexOf(valueSpar.charAt(i + 1)) != -1)) {
							return false;
						}
					}
				}
				if (arrayOfOpenBraces.length == arrayOfCloseBraces.length) {
					if (arrayOfOpenBraces.length > 0) {
						for ( var int = 0; int < arrayOfOpenBraces.length; int++) {
							if (!((arrayOfCloseBraces[int] > (arrayOfOpenBraces[int] + 1))
									&& ((int == (arrayOfOpenBraces.length - 1)) || ((int != (arrayOfOpenBraces.length - 1)) && (arrayOfOpenBraces[int + 1] > arrayOfCloseBraces[int])))
									&& ((valueSpar.length <= arrayOfOpenBraces[int] + 1) || (allowedTelNoCharSpar
											.indexOf(valueSpar
													.charAt(arrayOfOpenBraces[int] + 1)) != -1)) && ((0 > arrayOfCloseBraces[int] - 1) || (allowedTelNoCharSpar
									.indexOf(valueSpar
											.charAt(arrayOfCloseBraces[int] - 1)) != -1)))) {
								return false;
							}
						}
					}
				} else {
					return false;
				}
				validSpar = true;
			}
		} else {
			validSpar = true;
		}
		return validSpar;
	},

	 nullCheckSpar: function(valueSpar) {
		if ((valueSpar != null) && (typeof (valueSpar != 'undefined'))
				&& (valueSpar !== '')) {
			return true;
		}
		return false;
	},
/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf kaust_corelabs.Login
*/
	onAfterRendering: function() {
		var that=this;
		that.getView().byId("too").$().find("input").attr("readonly", true);
		that.getView().byId("country").$().find("input").attr("readonly", true);
	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf kaust_corelabs.Login
*/
//	onExit: function() {
//
//	}

});