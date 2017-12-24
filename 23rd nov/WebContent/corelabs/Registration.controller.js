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
	var readUserProfileModel = new sap.ui.model.json.JSONModel();
	var emailId=loggedinUserModel.getData().emailId;
	readUserProfileModel.loadData("/utilweb/rest/user/auth/read/"+emailId,null,false);
	this.getView().setModel(readUserProfileModel,"userData");
	
	if(readUserProfileModel.getData().userType=="RPT"){
		this.getView().byId('iskrpt').setSelected(true);
	}
	
	if(readUserProfileModel.getData().isAuthPersonReqd=="true"||readUserProfileModel.getData().isAuthPersonReqd==true){
		this.getView().byId('isapinfo').setSelected(true);
	}else{
		this.getView().byId('isapinfo').setSelected(false);
	}
	var oCountryJsonModel = new sap.ui.model.json.JSONModel();
	oCountryJsonModel.iSizeLimit=300;
	oCountryJsonModel.loadData(urlInc+"Countrys?$format=json",null,false);
	this.getView().byId('country').setModel(oCountryJsonModel,"oCountryJsonModel");
	
	var orgTypeModel = new sap.ui.model.json.JSONModel(); 
	orgTypeModel.loadData("/kclrfs/rest/brm/organization",null,false);
	this.getView().setModel(orgTypeModel,"orgTypeModel");
	
	var check = this.getView().byId('isapinfo').getSelected();
	if(check){
		this.getView().byId('apname').setEnabled(true);
		this.getView().byId('apemail').setEnabled(true);
	}else{
		this.getView().byId('apname').setEnabled(false);
		this.getView().byId('apemail').setEnabled(false);
	}
	
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
		var that = this;
		var check = that.getView().byId('isapinfo').getSelected();
		if(check){
			that.getView().byId('apname').setEnabled(true);
			that.getView().byId('apemail').setEnabled(true);
		}else{
			that.getView().byId('apname').setEnabled(false);
			that.getView().byId('apemail').setEnabled(false);
		}
		that.getView().byId('updateBtn').setEnabled(true);
	},
	
	nameValidate : function(evt){
		var name = evt.getSource().getValue();
		  var nameregex =  /^[a-zA-Z ]{2,30}$/;
		
		  evt.getSource().setValueState();
		    if (!nameregex.test(name)) {
		    	sap.ui.commons.MessageBox.show("Invalid! Please Enter Proper Data",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		      //alert("Invalid! Please Enter Proper Data");
		      evt.getSource().setValue("");
		      evt.getSource().setValueState(sap.ui.core.ValueState.Error);
		    }else{
		    	evt.getSource().setValueState(sap.ui.core.ValueState.None);
		    }
		    var that =this;
			that.getView().byId('updateBtn').setEnabled(true);
	},
	
	numberValidate:function(oEvt)
	  {
	  var number = oEvt.getSource().getValue();
	  var regex =  /^(\+\d{1,3}[- ]?)?\d{3,20}$/;
	
	  oEvt.getSource().setValueState();
	    if (!regex.test(number)) {
	     // alert("Invalid! Please Enter Proper Data");
	      sap.ui.commons.MessageBox.show("Invalid! Please Enter Proper Data",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	      oEvt.getSource().setValueState(sap.ui.core.ValueState.Error);
	      oEvt.getSource().setValue("");
	    }else{
	    	oEvt.getSource().setValueState(sap.ui.core.ValueState.None);
	    }
	    var that =this;
		that.getView().byId('updateBtn').setEnabled(true);
	   },
	
	enableUpdateBtn : function(){
		var that =this;
		that.getView().byId('updateBtn').setEnabled(true);
	},
	validateEmail: function(){
		var that =this;
		var email = that.getView().byId("email").getValue();
		  var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
		  var emails = ["@gmail.com","@yahoo.com","@rediff.com","@hotmail.com","@rocketmail.com","@GMAIL.COM","@YAHOO.COM","@REDIFF.COM","@HOTMAIL.COM","@ROCKETMAIL.COM"];
		  that.getView().byId("email").setValueState();
		    if (!mailregex.test(email)) {
		    	 if(email!=""){
		     // alert(email + " is not a valid Email address");
		      sap.ui.commons.MessageBox.show(email + " is not a valid Email address",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
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
				 // alert(email + " is not a valid email address");
					  sap.ui.commons.MessageBox.show(email + " is not a valid Email address",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				  }
				  that.getView().byId("email").setValue("");
				  that.getView().byId("email").setValueState(sap.ui.core.ValueState.Error);
			      break;
		  }else{
		    	that.getView().byId("email").setValueState(sap.ui.core.ValueState.None);
		    }  } 
	},

	validateAuthPerEmail: function(){
		var that =this;
		
		var email = that.getView().byId("apemail").getValue();
		  var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
		  var emails = ["@gmail.com","@yahoo.com","@rediff.com","@hotmail.com","@rocketmail.com","@GMAIL.COM","@YAHOO.COM","@REDIFF.COM","@HOTMAIL.COM","@ROCKETMAIL.COM"];
		  that.getView().byId("apemail").setValueState();
		    if (!mailregex.test(email)) {
		    	 if(email!=""){
		      //alert(email + " is not a valid Email address");
		    		 sap.ui.commons.MessageBox.show(email + " is not a valid Email address",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		      }
		      that.getView().byId("apemail").setValueState(sap.ui.core.ValueState.Error);
		    }else{
		    	that.getView().byId("apemail").setValueState(sap.ui.core.ValueState.None);
		    }
		    var emailLen=emails.length;
		  for(i=0;i<emailLen;i++){
			  if(email.indexOf(emails[i])!= -1){
				  if(email!=""){
				  //alert(email + " is not a valid email address");
					  sap.ui.commons.MessageBox.show(email + " is not a valid Email address",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
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
			//alert("Please Select the Organization Type");
			sap.ui.commons.MessageBox.show("Please Select the Organization Type",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			return false;
		}else if(orgNm==""||orgNm==null){
			//alert(" Please Enter the Organization Name");
			sap.ui.commons.MessageBox.show("Please Enter the Organization Name",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			return false;
		}else if(telephone==""||telephone==null){
			//alert("Please Enter the Telephone");
			sap.ui.commons.MessageBox.show("Please Enter the Telephone",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			return false;
		}else if(address==""||address==null){
			//alert("Please Enter the Address");
			sap.ui.commons.MessageBox.show("Please Enter the Address",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			return false;
		}else if(countryNm==""||countryNm==null){
			//alert("Please Enter the Country Name");
			sap.ui.commons.MessageBox.show("Please Select the Country Name",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			return false;
		}else if(check){
			if(authPersonNm==""||authPersonNm==null){
				//alert("Please Enter the Authorization name");
				sap.ui.commons.MessageBox.show("Please Enter the Authorized Person Name",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				return false;
			}else if(authPersonEmailId==""||authPersonEmailId==null){
				//alert("Please Enter the Authorized email");
				sap.ui.commons.MessageBox.show("Please Enter the Authorized Email",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
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
			 "address":updateUserData.address,
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
			//alert("Updated Successfully");
			sap.ui.commons.MessageBox.show("Updated Successfully",sap.ui.commons.MessageBox.Icon.SUCCESS,"Success");
		}else{
			//alert("Updation Failed");
			sap.ui.commons.MessageBox.show("Updation Failed",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
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