jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.Otp", {

	
	onInit: function() {
	if (!jQuery.support.touch||jQuery.device.is.desktop){
	this.getView().addStyleClass("sapUiSizeCompact");
	}
//	this.getOtp();
	},

	getOtp : function(){
	var that= this;
	that.otp = getValFromQueryString('otp');
	//alert(taskId);
	that.validateUser(that.otp);

	},

	validateUser : function(otp){
	var that=this;
	/*var msgDialog=new sap.m.Dialog({
		content:[
		         new sap.m.Text({text:"User is activated"})
		         ],
		buttons:[
		         new sap.m.Button({text:"OK",press:function(evt){
		        	 that.closeMsgDialog(evt);
		         }
		        	 
		         })
		         ]
	});*/
	var otpModel = new sap.ui.model.json.JSONModel();
	otpModel.loadData("/utilweb/rest/user/activateUser/"+otp+"?$format=json",null,false);
	
	/*if(otpModel.getData().status=="SUCCESS"){
		sap.ui.commons.MessageBox.show("User is activated and password is sent to the registered email",sap.ui.commons.MessageBox.Icon.SUCCESS,"Success","OK",function(){
			window.location.href="/dashboard";
			that.getView().byId("resendbtn").setVisible(false);
			that.getView().byId("resendTxt").setVisible(false);
		});
	}
	else if(otpModel.getData().status=="FAILURE"){
		var msg=otpModel.getData().listMessage;
		if(!msg instanceof Array ){
			msg=msg;
		}else{
			msg=msg[0];
		}
			sap.ui.commons.MessageBox.show(msg,sap.ui.commons.MessageBox.Icon.ERROR,"Error","OK",function(){
				that.getView().byId("resendbtn").setVisible(true);
				that.getView().byId("resendTxt").setVisible(true);
			});
		}
	else{
		var msg=otpModel.getData().listMessage;
		if(!msg instanceof Array ){
		sap.ui.commons.MessageBox.show(msg,sap.ui.commons.MessageBox.Icon.INFORMATION,"Information","OK",function(){
			that.getView().byId("resendbtn").setVisible(true);
			that.getView().byId("resendTxt").setVisible(true);
		});
		}
		else if(msg instanceof Array){
		sap.ui.commons.MessageBox.show(msg[0],sap.ui.commons.MessageBox.Icon.INFORMATION,"Information","OK",function(){
			that.getView().byId("resendbtn").setVisible(true);
			that.getView().byId("resendTxt").setVisible(true);
		});
		}else{
		sap.ui.commons.MessageBox.show("Error while Activating User",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information","OK",function(){
		//that.getView().byId("loignlink").setVisible(false);
		that.getView().byId("resendbtn").setVisible(true);
		that.getView().byId("resendTxt").setVisible(true);
		});
		}
		}*/
	
	if(otpModel.getData().status=="SUCCESS"){
		sap.ui.commons.MessageBox.show(otpModel.getData().message,sap.ui.commons.MessageBox.Icon.SUCCESS,"Success","OK",function(){
			window.location.href="/dashboard";
			that.getView().byId("resendbtn").setVisible(false);
			that.getView().byId("resendTxt").setVisible(false);
			that.getView().byId("otpflexbox").setVisible(false);
		});
	}
	else if(otpModel.getData().status=="FAILURE"){
		sap.ui.commons.MessageBox.show(otpModel.getData().message,sap.ui.commons.MessageBox.Icon.ERROR,"Error","OK",function(){
			that.getView().byId("resendbtn").setVisible(true);
			that.getView().byId("resendTxt").setVisible(true);
			that.getView().byId("otpflexbox").setVisible(true);
		});
	}
	else if(otpModel.getData().status=="ERROR"){
		sap.ui.commons.MessageBox.show(otpModel.getData().message,sap.ui.commons.MessageBox.Icon.ERROR,"Error","OK",function(){
			window.location.href="/dashboard";
			that.getView().byId("resendbtn").setVisible(false);
			that.getView().byId("resendTxt").setVisible(false);
			that.getView().byId("otpflexbox").setVisible(false);
		});
	}
	else{
		sap.ui.commons.MessageBox.show(otpModel.getData().message,sap.ui.commons.MessageBox.Icon.INFORMATION,"Information","OK",function(){
			window.location.href="/dashboard";
			that.getView().byId("resendbtn").setVisible(false);
			that.getView().byId("resendTxt").setVisible(false);
			that.getView().byId("otpflexbox").setVisible(false);
		});
	}
},
	
	/*closeMsgDialog:function(event){
		var that=this;
		event.getSource().getParent().close()
	},*/

	resendOtp:function(evt){
		var that=this;

		var otp = getValFromQueryString('otp');	
		var resendOtpModel = new sap.ui.model.json.JSONModel();
		resendOtpModel.loadData("/utilweb/rest/user/resendOTP/"+otp+"?$format=json",null,false);
		
//		alert(resendOtpModel.getData().listMessage);
		if(resendOtpModel.getData().status=="SUCCESS")
		{
		//alert("Link sent to Email");
			sap.ui.commons.MessageBox.show("Activation Link sent to the registered Email",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		}
		else if(resendOtpModel.getData().status=="FAILURE")
		{
		//alert("Error");
		sap.ui.commons.MessageBox.show("Error while sending link",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
		else
		{
		//alert("Error");
			sap.ui.commons.MessageBox.show("Error while sending link",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}

		},
/**
 * Called when a controller is instantiated and its View controls (if available)
 * are already created. Can be used to modify the View before it is displayed,
 * to bind event handlers and do other one-time initialization.
 * 
 * @memberOf corelabs.PIApprovalRequest
 */
	
/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's
 * View is re-rendered (NOT before the first rendering! onInit() is used for
 * that one!).
 * 
 * @memberOf corelabs.PIApprovalRequest
 */
// onBeforeRendering: function() {
//
// },

/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 * 
 * @memberOf corelabs.PIApprovalRequest
 */
 onAfterRendering: function() {
	this.getOtp();
 }

/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf corelabs.PIApprovalRequest
 */
// onExit: function() {
//
// }

});