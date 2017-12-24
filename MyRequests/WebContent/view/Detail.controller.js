jQuery.sap.require("kaust.ui.kits.myRequest.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.layout.form.SimpleForm");
jQuery.sap.require("sap.ui.commons.Label");

sap.ui.controller("kaust.ui.kits.myRequest.view.Detail", {
	
	handleNavButtonPress : function (evt) {
		this.nav.back("Master");
	},
	ItemOpenAttachment:function(evt){
		evt.preventDefault();  //stop the browser from following				
		var itemObj = evt.getSource().getBindingContext().getObject();
		var itemUrl = itemObj.Url;
		//window.location.href = "http://sthhmdm8dv.kaust.edu.sa:01090/ContentServer/ContentServer.dll?get&pVersion=0046&contRep=ZSLUTL01&docId=5542AA0B26AF4572E10000000AFE0415&compId=1238629_pp.pdf.pdf";
		window.location.href =  itemUrl;
		
	},
	
	onAfterRendering: function(){
//		var detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
  		
	},
	
//	Dikhu edit starts
	onChange: function(evt){
		var item = evt.getParameter("listItem");
		var subSerCode = evt.getSource().getSelectedItem().getBindingContext().getObject().subServiceCode;
		if (subSerCode == "0504"){
			var itemForm = sap.ui.getCore().byId("CarLicenseIssue");
			itemForm.setBindingContext(item.getBindingContext());
		} else if (subSerCode == "0501"){
			var itemForm = sap.ui.getCore().byId("MotorcycleLicenseIssue");
			itemForm.setBindingContext(item.getBindingContext());
		} else if (subSerCode == "0206") {
			var itemForm = sap.ui.getCore().byId("Sponsortransfer");
			itemForm.setBindingContext(item.getBindingContext());
		} else if (subSerCode == "1706") {
			var itemForm = sap.ui.getCore().byId("DivingLicenseRenew");
			itemForm.setBindingContext(item.getBindingContext());
		} else if (subSerCode == "0104") {
			var itemForm = sap.ui.getCore().byId("policeClearance");
			itemForm.setBindingContext(item.getBindingContext());
		} else if (subSerCode == "0105") {
			var itemForm = sap.ui.getCore().byId("zakatLetter");
			itemForm.setBindingContext(item.getBindingContext());
		} else if (subSerCode == "0302") {
			var itemForm = sap.ui.getCore().byId("idBirthCertificateDetails");
			itemForm.setBindingContext(item.getBindingContext());
		} else if (subSerCode == "0507") {
			var itemForm = sap.ui.getCore().byId("idCarOwnershipTransfer");
			itemForm.setBindingContext(item.getBindingContext());
		} else if (subSerCode == "0506") {
			var itemForm = sap.ui.getCore().byId("idCarPlateChange");
			itemForm.setBindingContext(item.getBindingContext());
		} else if (subSerCode == "0402") {
			var itemForm = sap.ui.getCore().byId("idInfoCorrect");
			itemForm.setBindingContext(item.getBindingContext());
		} else if (subSerCode == "1700") {
			var itemForm = sap.ui.getCore().byId("PetsImportExport");
			itemForm.setBindingContext(item.getBindingContext());
		}
	}
//	Dikhu edit ends
});

