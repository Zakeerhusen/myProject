sap.ui.controller("kaust.ui.kits.myRequest.view.App", {

  to : function(pageId, context) {

    var app = this.getView().app;

    // load page on demand
    var master = ("Master" === pageId);
    if (app.getPage(pageId, master) === null) {
      var page = sap.ui.view({
        id : pageId,
        viewName : "kaust.ui.kits.myRequest.view." + pageId,
        type : "XML"
      });
      page.getController().nav = this;
      app.addPage(page, master);
      jQuery.sap.log.info("app controller > loaded page: " + pageId);
    }

    // show the page
    app.to(pageId);

    // set data context on the page
    if (context) {
      var listItem = context;
      var requestId = listItem.getTitle();
      var helpModel = new sap.ui.model.json.JSONModel();
      var kaustId = listItem.getNumber();
     // var subService = listItem.getNumberUnit();
      var subService = listItem.getFirstStatus().getText();
      var status = listItem.getAttributes()[0].getText();

      // save serviceCode and subServiceCode for cancellation
      var binding = listItem.getBindingContext("listModel");
      var path = binding.sPath;
      var selectedItem = binding.oModel.getProperty(path);
      var serviceCode = selectedItem.ServiceCode;
      var subServiceCode = selectedItem.SubServiceCode;
      var helpObject = new Object();
      helpObject.requestId = requestId;
      helpObject.serviceCode = serviceCode;
      helpObject.subServiceCode = subServiceCode;
      helpObject.serviceOpened = subService;
      helpModel.setProperty("/helpItems", helpObject);
      helpModel.setProperty("/durationVisible", true);
      this.getView().setModel(helpModel, "helpModel");

      var tabsFragment;
      var detailsFragment;
      var detailsForm = app.getPage(pageId).byId("page");
      detailsForm.removeAllContent();

      /**
       * Darshna - Editing starts
       * Creating a oData preferenceModel.
       * Invoking loadPreferenceData method. Passing parameters - KaustId and subServiceCode.
      */
      var oPreferenceModel= new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/"));
      this.getView().setModel(oPreferenceModel,"oPreferenceModel");
      this.loadPreferenceData(selectedItem.KaustId, selectedItem.SubServiceCode);
      /** Darshna - Editing ends */

      switch (subService) {

      case 'Distribution List Service':
        var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Gemail(RequestId='"+requestId+"',KaustId='')");
        helpModel.setProperty("/url", url);
        app.getPage(pageId).setModel(sap.ui.getCore().oogetModel("ARequestModel"));
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.EmailDistrGrp", app.getPage(pageId).getController());
        this.getEmailDistrGrp(requestId,kaustId);
        break;
      case 'Generic Email Creation':
        var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Email(RequestId='"+requestId+"',KaustId='')");
        helpModel.setProperty("/url", url);
        app.getPage(pageId).setModel(sap.ui.getCore().getModel("ARequestModel"));
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.GenEmail", app.getPage(pageId).getController());
        this.getGenEmail(requestId,kaustId);
        break;
      case 'New E-fax Service':
        var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Fax(RequestId='"+requestId+"',KaustId='')");
        helpModel.setProperty("/url", url);
        app.getPage(pageId).setModel(sap.ui.getCore().getModel("ARequestModel"));
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.Efax", app.getPage(pageId).getController());
        this.getEfax(requestId,kaustId);
        break;
      case 'Loan Equipment':
        var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Loanequip(RequestId='" + requestId + "',KaustId='')");
        helpModel.setProperty("/url", url);
        app.getPage(pageId).setModel(sap.ui.getCore().getModel("ARequestModel"));
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.LoanEquip", app.getPage(pageId).getController());
        this.getLoanEquip(requestId, kaustId);
        break;
      case 'Replenish Equipment':
        var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Replenish(RequestId='" + requestId + "',KaustId='')");
        helpModel.setProperty("/url", url);
        app.getPage(pageId).setModel(sap.ui.getCore().getModel("ARequestModel"));
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TransferEquip", app.getPage(pageId).getController());
        this.getReplenishEquip(requestId, kaustId);
        break;
      case 'Transfer Equipment':
        var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Transferequipment(RequestId='" + requestId + "',KaustId='')");
        helpModel.setProperty("/url", url);
        app.getPage(pageId).setModel(sap.ui.getCore().getModel("ARequestModel"));
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TransferEquip", app.getPage(pageId).getController());
        this.getTransferEquip(requestId, kaustId);
        break;
      case 'Audio Visual Services':
        this.getConfereceRoomData(requestId, kaustId);
        //var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Vsm(RequestId='" + requestId + "',KaustId='')");
        var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Vsm?$filter=RequestId eq '"+requestId+"'");
        helpModel.setProperty("/url", url);
        app.getPage(pageId).setModel(sap.ui.getCore().getModel("ARequestModel"));
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.ConferenceRoomBooking", app.getPage(pageId).getController());
        this.setConferenceLayout(requestId);
        break;
      case 'Vulnerability Scan Service':
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.VulnerabilityScanDetails", app.getPage(pageId).getController());
        this.getVulnerabilityScanData(requestId, kaustId);
        app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("VScanModel"));
        break;
      case 'Security Incident Report':
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.SecurityIncidentDetails", app.getPage(pageId).getController());
        this.getSecurityIncidentData(requestId, kaustId);
        app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("SIncidentModel"));
        break;
      case 'Copyright Notice Service':
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.AccessRequestDetails", app.getPage(pageId).getController());
        this.getAccessRequestData(requestId, kaustId);
        app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("ARequestModel"));
        break;
      case 'Smart Printing Registration':
        app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("ARequestModel"));
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.AccessRequestDetails", app.getPage(pageId).getController());
        this.getAccessRequestData(requestId, kaustId);
        break;
      case 'Encryption Request Service':
        app.getPage(pageId).setModel(sap.ui.getCore().getModel("ARequestModel"));
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.AccessRequestDetails", app.getPage(pageId).getController());
        this.getAccessRequestData(requestId, kaustId);
        break;
      case 'VPN Access for Externals':
        this.getAccessRequestData(requestId, kaustId);
        app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("ARequestModel"));
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.AccessRequestDetails", app.getPage(pageId).getController());
        break;
      case 'Iqama Renewal':
        this.getIqamaRenewelOrExitEntryRequestDetails(requestId);
        app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel"));
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaRenewalDetails", app.getPage(pageId).getController());
        detailsFragment.setModel(helpModel, "helpModel");
        tabsFragment = sap.ui.getCore().byId("IqamaGRID");
        if (tabsFragment == null) {
          tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
        }
        break;
      case 'Exit Reentry Visa':
        this.getIqamaRenewelOrExitEntryRequestDetails(requestId, kaustId);
        app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel"));
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaRenewalDetails", this);
        tabsFragment = sap.ui.getCore().byId("IqamaGRID");
        helpModel.setProperty("/durationVisible", false);
        detailsFragment.setModel(helpModel, "helpModel");
        if (tabsFragment == null) {
          tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", this);
        }
        break;
      case 'Iqama Issuance':
        this.getIqamaRenewelOrExitEntryRequestDetails(requestId);
        app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel"));
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaRenewalDetails", app.getPage(pageId).getController());
        detailsFragment.setModel(helpModel, "helpModel");
        tabsFragment = sap.ui.getCore().byId("IqamaGRID");
        if (tabsFragment == null) {
          tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
        }
        break;
      case 'Transfer of Information':
        this.getIqamaRenewelOrExitEntryRequestDetails(requestId);
        app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel"));
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaRenewalDetails", app.getPage(pageId).getController());
        detailsFragment.setModel(helpModel, "helpModel");
        tabsFragment = sap.ui.getCore().byId("IqamaGRID"); 
        if (tabsFragment == null) {
          tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
        }
        break;
      case 'Govt Visa Extension':
        this.getIqamaRenewelOrExitEntryRequestDetails(requestId);
        app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel"));
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaRenewalDetails", app.getPage(pageId).getController());
        detailsFragment.setModel(helpModel, "helpModel");
        tabsFragment = sap.ui.getCore().byId("IqamaGRID");
        sap.ui.getCore().byId("lVisaExp").setVisible(true); 
        sap.ui.getCore().byId("tVisaExp").setVisible(true);
        sap.ui.getCore().byId("lisExp").setVisible(true);
        sap.ui.getCore().byId("tisExp").setVisible(true);
        sap.ui.getCore().byId("idDetailLabel").setText("Visitor Details");
        if (tabsFragment == null) {
          tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
        }
        break;
      case 'Final Exit':
        this.getIqamaRenewelOrExitEntryRequestDetails(requestId);
        app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel"));
        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaRenewalDetails", app.getPage(pageId).getController());
        helpModel.setProperty("/durationVisible", false);
        detailsFragment.setModel(helpModel, "helpModel");
        tabsFragment = sap.ui.getCore().byId("IqamaGRID");
        sap.ui.getCore().byId("lVisaExp").setVisible(false); 
        sap.ui.getCore().byId("tVisaExp").setVisible(false);
        sap.ui.getCore().byId("lisExp").setVisible(false);
        sap.ui.getCore().byId("tisExp").setVisible(false);
        sap.ui.getCore().byId("commentText").setEditable(true);
        if (tabsFragment == null) {
          tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
        }
        break;
        //For KIT new modules : zakeer
      case 'Port Activation':
          detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.PortAccess", app.getPage(pageId).getController());
          this.getPortDetails(requestId);
          break;
      case 'TER Access Process':   
    	  detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TERAccess", app.getPage(pageId).getController());
          this.getTERDetails(requestId);
          break;
         
      case 'Admin Rights Process':
    	  	var oPortModel = new sap.ui.model.json.JSONModel();
  			this.getView().setModel(oPortModel, "oPortModel");
  			detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.AdminAccess", app.getPage(pageId).getController());
  			detailsFragment.setModel(oPortModel);
  			this.getAdminAccessDetails(requestId);
  			break;

      case'Data Center Access Process':
    	  detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.DataAccess", app.getPage(pageId).getController());
    	  this.getDataCenterDetails(requestId,detailsFragment);
    	  detailsFragment.setModel(this.getView().getModel("dataRequestData"),"dataRequestData");
    	  break;
      case 'VPN Access for externals Process':
    	  	var oRequestModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oRequestModel, "oRequestModel");
    	    detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.VPNAccess", app.getPage(pageId).getController());
    	    detailsFragment.setModel(oRequestModel);
    	    this.getVPNDetails(requestId,listItem);
            break;
      }
      
      /**
       * For new GASC Modules: The identifier should be subServiceCode
       * New Switch statements with subServiceCode
       * Edited by Darshna 
       */
      
      switch(subServiceCode){
//      Dikhu edit starts
      	case '0036':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
      		detailsFragment.setModel(helpModel, "helpModel");
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break;
           
      	case '0303':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
      		detailsFragment.setModel(helpModel, "helpModel");
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break;
           
      	case '0204':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
      		detailsFragment.setModel(helpModel, "helpModel");
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break;
           
      	case '0205':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
      		detailsFragment.setModel(helpModel, "helpModel");
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break;
      	case '0207':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
      		detailsFragment.setModel(helpModel, "helpModel");
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break;
      	case '1701':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
      		detailsFragment.setModel(helpModel, "helpModel");
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break;
      	case '1702':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
      		detailsFragment.setModel(helpModel, "helpModel");
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break;
      	case '1704':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
      		detailsFragment.setModel(helpModel, "helpModel");
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break;
      	case '1705':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
      		detailsFragment.setModel(helpModel, "helpModel");
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break;
      	case '0504':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
//      		detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
      		detailsFragment.setModel(helpModel, "helpModel");
      		sap.ui.getCore().byId("CarLicenseIssue").setVisible(true);
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break; 
      	case '0501':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
//      		detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
      		detailsFragment.setModel(helpModel, "helpModel");
      		sap.ui.getCore().byId("MotorcycleLicenseIssue").setVisible(true);
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break;
           
      	case '1700':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
//      		detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
      		detailsFragment.setModel(helpModel, "helpModel");
      		sap.ui.getCore().byId("PetsImportExport").setVisible(true);
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break;
           
      	case '1706':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
//      		detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
      		detailsFragment.setModel(helpModel, "helpModel");
      		sap.ui.getCore().byId("DivingLicenseRenew").setVisible(true);
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break;
      	case '1707':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(helpModel, "helpModel");
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break;
//       Dikhu edit ends
     	case '0206':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
//      		detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
      		detailsFragment.setModel(helpModel, "helpModel");
      		sap.ui.getCore().byId("Sponsortransfer").setVisible(true);
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break;
    
           //NAVIN EDITING STARTS
           
     	case '0104':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
//      		detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
      		detailsFragment.setModel(helpModel, "helpModel");
      		sap.ui.getCore().byId("policeClearance").setVisible(true);
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break; 
           
     	case '0105':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
//      		detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
      		detailsFragment.setModel(helpModel, "helpModel");
      		sap.ui.getCore().byId("zakatLetter").setVisible(true);
//      	 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
//           	if (tabsFragment == null) {
//              	tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
//            	}
           break; 
           
        // NAVIN EDITING ENDS
      	case '0302':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(helpModel, "helpModel");
      		sap.ui.getCore().byId("idBirthCertificateDetails").setVisible(true);
           break;
      	case '0402':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(helpModel, "helpModel");
      		sap.ui.getCore().byId("idInfoCorrect").setVisible(true);
           break;
      	case '1703':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(helpModel, "helpModel");
      		sap.ui.getCore().byId("idMandanSalehForm").setVisible(true);
           break; 
      	case '0507':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(helpModel, "helpModel");
      		sap.ui.getCore().byId("idCarOwnershipTransfer").setVisible(true);
           break;
      	case '0502':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(helpModel, "helpModel");
           break;
      	case '0503':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(helpModel, "helpModel");
           break;
      	case '0505':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(helpModel, "helpModel");
           break;
      	case '0506':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(helpModel, "helpModel");
      		sap.ui.getCore().byId("idCarPlateChange").setVisible(true);
           break;
      	case '0304':
      		detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
      		this.getNewsPaperDetails(requestId,subServiceCode);
      		app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
      		detailsFragment.setModel(helpModel, "helpModel");
           break;
      }
      

      if (detailsFragment) {
    	  // Edited by Darshna - Added SubServiceCode
        detailsForm.addContent(this.getStatus(requestId, kaustId, status, subService, subServiceCode));
        var requesterInformationTab = sap.ui.getCore().byId("RequesterInformationSF");
        if (requesterInformationTab != undefined) {
          requesterInformationTab.setModel(sap.ui.getCore().byId("Master").getModel("RequesterInformationModel"));
        }
        detailsForm.addContent(detailsFragment);

        if (subService != "Audio Visual Services" && subService != "Replenish Equipment"  && subService != "Transfer Equipment" && subService != "Loan Equipment") {
          if (tabsFragment == null) {
            tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.Tabs", app.getPage(pageId).getController());
          }
          detailsForm.addContent(tabsFragment);
          
          //For Port, hiding comments tab : zakeer
          if (subService == "Port Activation"){
        	  detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].setVisible(false);
          }
          //closing of hiding comments tab : zakeer
        
          //For TER, comments tab : zakeer
          else if (subService == "TER Access Process"){
       		 var data = this.getView().getModel("oDataModel").getData().d.results[0]; 
        	 var comments = [];
  				if(data.itncTeamComments!=""){
  					 var commObj = {"text":""};
 				 commObj.text= data.itncTeamComments+" by "+data.itncTeamApprover;
 				 comments.push(commObj);}
 				if(data.itncAgentComment!=""){
 					 var commObj = {"text":""};
 				 commObj.text= data.itncAgentComment+" by "+data.itncAgentApprover;
 				 comments.push(commObj);}
 				if(data.feedbackComment!=""){
 					 var commObj = {"text":""};
  				 commObj.text= data.feedbackComment+" by "+data.netAgent_approver;
  				 comments.push(commObj);
  				 }
        	detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].destroyContent();
        	
        	if(comments.length >= 1){
  			var oModel = new sap.ui.model.json.JSONModel();
  			oModel.setData({"Comments":comments});
  			sap.ui.getCore().byId("Detail").setModel(oModel,"oCommModel");
  			
        	  var list = new sap.m.List();
        	  list.bindItems({
                  path : "oCommModel>/Comments", 
                  template : new sap.m.FeedListItem({
                	  text: "{oCommModel>text}",
                  })
              }); 
        	  detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].addContent(list); 
        	 }
          }            //TER : end of comments tab : zakeer
	      
          
          else if (subService == "VPN Access for externals Process"){
        		 var data = this.getView().getModel("oDataModel").getData().d.results[0]; 
         	 var comments = [];
   				if(data.secManagerComments!=""){
   					 var commObj = {"text":""};
  				 commObj.text= data.secManagerComments+" by "+data.infoSecManager;
  				 comments.push(commObj);}
  				if(data.msgTeamComments!=""){
  					 var commObj = {"text":""};
  				 commObj.text= data.msgTeamComments+" by "+data.msgTeam;
  				 comments.push(commObj);}
  				
         	detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].destroyContent();
         	
         	if(comments.length >= 1){
   			var oModel = new sap.ui.model.json.JSONModel();
   			oModel.setData({"Comments":comments});
   			sap.ui.getCore().byId("Detail").setModel(oModel,"oCommModel");
   			
         	  var list = new sap.m.List();
         	  list.bindItems({
                   path : "oCommModel>/Comments", 
                   template : new sap.m.FeedListItem({
                 	  text: "{oCommModel>text}",
                   })
               }); 
         	  detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].addContent(list); 
         	 }
           }            //TER : end of comments tab : zakeer
          else if(subService == "Admin Rights Process")
        	  {
        	  var requestId = this.getView().getModel("adminModel").getData().d.results[0].requestId;
        	  var oDataApproverModel = new sap.ui.model.json.JSONModel();
        		oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '"+requestId+"'&$format=json", null, false);
        		var data = oDataApproverModel.getData().d.results;
//        		
//        		data.forEach(function (oEle) {
//    				oEle["comment"] = oEle.Comments +" by "+ oEle.t_name;
//    			});
        		oDataApproverModel.setData(data);
        		this.getView().setModel(oDataApproverModel,"GAComments");
      	 }
          
          // Pavithra code- comments DC start
          else if(subService == "Data Center Access Process")
    	  {
    	  var rData = this.getView().getModel("dataCenter").getData().d.results[0]
    	  var requestId = rData.RequestId;
    	  var oDataApproverModel = new sap.ui.model.json.JSONModel();
    		oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '"+requestId+"'&$format=json", null, false);
    		var data = oDataApproverModel.getData().d.results;
//    		
//    		data.forEach(function (oEle) {
//				oEle["comment"] = oEle.Comments +" by "+ oEle.t_name;
//			});
    		oDataApproverModel.setData(data);
    		this.getView().setModel(oDataApproverModel,"GAComments");
    		if(rData.justification && (rData.stage =="Line Manager"||rData.stage == "Data Center Team"||rData.stage =="Data Center Lead"||rData.stage =="Research and Computing Team"))
    			{
    			sap.ui.getCore().byId("justificationtab").setVisible(true);
    			sap.ui.getCore().byId("justifctnTab").setValue(rData.justification);
    			
    			}
    		else if((rData.stage =="Requester"||rData.stage == "Justification"))
    			sap.ui.getCore().byId("justificationtab").setVisible(false);
  	 }
//          Pavithra code- comments DC end        
          
           // Tabs Fragment for GASC Services: Darshna 
           if (subServiceCode == "1700" || subServiceCode == "0036" || subServiceCode === "0504" || subServiceCode === "0207" || subServiceCode === "0501" || subServiceCode === "0302"  || subServiceCode === "0206" || subServiceCode === "1703" || subServiceCode === "0104" || subServiceCode === "1706" || subServiceCode === "1707" || subServiceCode === "0504" || subServiceCode === "1701" || subServiceCode === "1702" || subServiceCode === "1704" || subServiceCode === "1705" || subServiceCode === "0502" || subServiceCode === "0503" || subServiceCode === "0505" || subServiceCode === "0506" || subServiceCode === "0304" || subServiceCode === "0204" || subServiceCode === "0205") {
        	   /*	var data = sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel").getData();
        	   	var comments = [];
        	   	if(data.GAComments!="" && data.GAComments != undefined){
 					 var commObj = {"text":""};
				 commObj.text= "GA Comments: " + data.GAComments;
				 comments.push(commObj);}
				if(data.FinComments!="" && data.FinComments!=undefined){
					 var commObj = {"text":""};
				 commObj.text= "Financial Comments: " +  data.FinComments;
				 comments.push(commObj);}
				if(data.ReqComments!="" && data.ReqComments!=undefined){
					 var commObj = {"text":""};
 				 commObj.text= "Requester Comments: " +  data.ReqComments;
 				 comments.push(commObj);
 				 }
				detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].destroyContent();
				if(comments.length >= 1){
		  			var oComment = new sap.ui.model.json.JSONModel();
		  			oComment.setData({"Comments":comments});
		  			sap.ui.getCore().byId("Detail").setModel(oComment,"oCommModel");
		  			
		        	  var list = new sap.m.List();
		        	  list.bindItems({
		                  path : "oCommModel>/Comments", 
		                  template : new sap.m.FeedListItem({
		                	  text: "{oCommModel>text}",
		                  })
		              }); 
		        	  detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].addContent(list); 
		        	 }*/
           }
          this.getUserData(kaustId, requestId);

          if(subService == "Data Center Access Process"){
        	  sap.ui.getCore().byId("userInfoForm").setVisible(false);
        	  sap.ui.getCore().byId("userInfoFormDC").setVisible(true);
        	  
          }
          // sap.ui.getCore().byId("historyTab").setVisible(false);
        } else if (subService == "Audio Visual Services" || subService == "Loan Equipment") {
          var oModel = sap.ui.getCore().byId("Detail").getModel("confRoomModel");
          if (oModel.oData.Status != "013" && oModel.oData.Status != "015" && oModel.oData.Status != "011" && oModel.oData.Status != "016" && oModel.oData.Status != "018") {
            var footer = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.CancelFooter", this.getView().getController());
            detailsForm.setFooter(footer);
          }
          // Comments Log Service Integration
          	var requestId = sap.ui.getCore().byId("Detail").getModel("confRoomModel").getData().RequestId;
          	var oAVCommModel = new sap.ui.model.json.JSONModel();
          	oAVCommModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '"+requestId+"'&$format=json", null, false);
    		oAVCommModel.setData(oAVCommModel.getData().d.results);
    		this.getView().setModel(oAVCommModel,"GAComments");
        }

        if(subService == "Final Exit"){
          var oModel =  sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel");
          if(oModel.oData[0].Status == "099"){
            var footer = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.SubmitFooter", this.getView().getController());
            detailsForm.setFooter(footer);
          }
        }

        if(sap.ui.getCore().byId("familyTable")){
          sap.ui.getCore().byId("familyTable").setModel(helpModel,"helpModel");
        }
        var col= sap.ui.getCore().byId("passportLostColumn");
        if(col){
          col.setVisible(false);
          if(subServiceCode == '0401'){
            col.setVisible(true);
          }
        }

        if(subServiceCode == '0011'){
//          if(oModel.oData.EventLocation !='Conference Room')
//            this.getProcessStages1(listItem, status, detailsForm,'011b');
//          else if(oModel.oData.EventLocation =='Conference Room'&& (oModel.oData.Webex == 'X' || oModel.oData.Videowebconf == 'X' || oModel.oData.Avsupport == 'X' || oModel.oData.Confrecord == 'X'))
//            this.getProcessStages(listItem, status, detailsForm);
//          else
//            this.getProcessStages1(listItem, status, detailsForm,'011a');
        	this.getProcessStages(listItem, status, detailsForm);
        }
        else if(subServiceCode == '0101' || subServiceCode == '0102' ||subServiceCode == '0103' || subServiceCode == '0202'){
          debugger;
          var oModel =  sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel");
          if(oModel.oData[0].Categorytype == 'SLCM')
          {
            if(subServiceCode == '0101'){
              this.getProcessStages1(listItem, status, detailsForm,'0101a');
            }else if(subServiceCode == '0102'){
              this.getProcessStages1(listItem, status, detailsForm,'0102a');
            }else{
              this.getProcessStages1(listItem, status, detailsForm,'0103a');
            }

          }
          else
            this.getProcessStages(listItem, status, detailsForm);

        }
        else if(subServiceCode == '0053' || subServiceCode == '0054'||subServiceCode == '0055')
        	{
        	this.getProcessStages(listItem, status, detailsForm);
        	}
       /* else if(subServiceCode == '0054')
        	{
        	this.getProcessStages(listItem, status, detailsForm);
        	}*/
        else
        this.getProcessStages(listItem, status, detailsForm);
        // Rerender is moved to jsonp ajax call because it is asynchronous
      }
    }
  },
  
  onChange: function(){
	  debugger;
  },
  getStatus : function(requestId, kaustId, status, subService, subServiceCode) {
    var objHeader = new sap.m.ObjectHeader({
      title : requestId,
      number : kaustId
    });

    var firstStatus = new sap.m.ObjectStatus({
      text : subService
    });
    objHeader.addStatus(firstStatus);

    if (status == "Rejected") {
    	var text = "";
    	var model = "";
    	var modelData = "";
    	if(subService == "Transfer Equipment"){
    		model = sap.ui.getCore().byId("Detail").getModel("transferModel");
    		modelData = model.getData();
    		if(modelData.Stage  == 'Recipient Line Manager Approval'){
    			  text = "Reason: " + model.oData.Recmannotes;
    		}else if(modelData.Stage  == 'Line Manager Approval'){
    		    	 text = "Reason: " + model.oData.mcomments;
    		}else{
    		    	text = "Reason: " + model.oData.Empnote;
    		}
    	      var attribute = new sap.m.ObjectAttribute({
    	        text : text,
    	        tooltip:text
    	      });
    	      attribute.addStyleClass("redText");
    	      objHeader.addAttribute(attribute);
          
    	}
    	else if(subService == "TER Access Process"){
    		var data = this.getView().getModel("oDataModel").getData().d.results[0];
    		var text = "Reason: " + data.itncTeamComments;
    	    var attribute = new sap.m.ObjectAttribute({
    	        text : text,
    	        tooltip:text
    	      });
    	      attribute.addStyleClass("redText");
    	      objHeader.addAttribute(attribute);
    	      return objHeader;
    	}
    	else if (subService == "VPN Access for externals Process")
    		{
    		var text;
    		var vpnData = this.getView().getModel("oDataModel").getData().d.results[0];
//    		if(vpnData.Stage == "Info Sec Manager")
//    			{
//    			text = "Reason: " + vpnData.secManagerComments;
//    			}
//    		else 
    		if(vpnData.secManagerComments)
    			{
    			text = "Reason: " + vpnData.secManagerComments;
    			}
    		if(vpnData.msgTeamComments)
    			{
    			text = "Reason: " + vpnData.msgTeamComments;
    			}

    		var attribute = new sap.m.ObjectAttribute({
    	        text : text,
    	        tooltip:text
    	      });
    	      attribute.addStyleClass("redText");
    	      objHeader.addAttribute(attribute);
    	      return objHeader;
    		}
    	else if(subService == "Data Center Access Process")
    		{
//    		var requestId = this.getView().getModel("dataCenter").getData().d.results[0].RequestId;
//  		  var oDataApproverModel = new sap.ui.model.json.JSONModel();
//  			oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '"+requestId+"'&$format=json", null, false);
//  			var cdata = oDataApproverModel.getData().d.results;
//  	
//  		
    		 var data =  this.getView().getModel("dataCenter").getData().d.results[0];
//    		 if(cdata.Stage == data.stage)
//    			 {
//    			 	data.comments = cdata[]
//    			 }
    		 if(data.comments)
    			 {
    			 var attribute = new sap.m.ObjectAttribute({
    	    	        text : "Reason: " + data.comments,
    	    	        tooltip:"Reason: " + data.comments
    	    	      });
    			
    			 }
    		 attribute.addStyleClass("redText");
   	      objHeader.addAttribute(attribute);
   	   return objHeader;
    		}
    	else if(subService == "Admin Rights Process")
    		{
    		 var data =  this.getView().getModel("adminModel").getData().d.results[0];
    		 if(data.comments)
    			 {
    			 var attribute = new sap.m.ObjectAttribute({
    	    	        text : "Reason: " + data.comments,
    	    	        tooltip:"Reason: " + data.comments
    	    	      });
    			
    			 }
    		 attribute.addStyleClass("redText");
   	      objHeader.addAttribute(attribute);
   	   return objHeader;
    		}
    	else if (subService === "Audio Visual Services") {
    		var oAVData = sap.ui.getCore().byId("Detail").getModel("confRoomModel").getData();
    		if (oAVData.comments) {
    			var attribute = new sap.m.ObjectAttribute({
	    	        text : "Reason: " + oAVData.comments,
	    	        tooltip:"Reason: " +  oAVData.comments
	    	      });
    			 attribute.addStyleClass("redText");
    	   	     objHeader.addAttribute(attribute);
    	   	     return objHeader;
    		}
    	}
    	// GASC Modules: Started - Darshna
    	if(subServiceCode == "1700" || subServiceCode == "0036" || subServiceCode == "0303" || subServiceCode === "0504" || subServiceCode === "0207" || subServiceCode === "0501" || subServiceCode === "0302" || subServiceCode === "0206" || subServiceCode === "1706" || subServiceCode === "1707" || subServiceCode === "0502" || subServiceCode === "1703" || subServiceCode === "0104" || subServiceCode === "0504" || subServiceCode === "1701" || subServiceCode === "1702" || subServiceCode === "1705" || subServiceCode === "0503" || subServiceCode === "0505" || subServiceCode === "0506" || subServiceCode === "0304" || subServiceCode === "0204" || subServiceCode === "0205"){
    		if((this.getView().getModel("GAComments").getData().length) > 0)
    		{   
    			var oLen = this.getView().getModel("GAComments").getData().length;
	    		var text = "Reason: " + this.getView().getModel("GAComments").getData()[oLen-1].Comments;
	    	    var attribute = new sap.m.ObjectAttribute({
	    	        text : text
	    	      });
	    	      attribute.addStyleClass("redText");
	    	      objHeader.addAttribute(attribute);
    		}
    		else
    		{
    			var text = "Reason: Rejected by Approver";
    	    	var attribute = new sap.m.ObjectAttribute({
    	        text : text
    	    	});
    	        attribute.addStyleClass("redText");
    	        objHeader.addAttribute(attribute);
    		}
    	}
    	// GASC Modules: Ended
    	else{
        	model = sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel");
        	modelData = model.oData[0];
        	if(modelData.Comments == undefined || modelData.Comments == null || modelData.Comments == ''){
    		    if (modelData.FinComments == undefined || modelData.FinComments == null || modelData.FinComments == ''){
    		        text = "Reason: " + model.oData[0].GAComments;
    		    }
    		      else
    		        text = "Reason: " + model.oData[0].FinComments;
    		
    		    }
          else{
    	        text = "Reason: " + model.oData[0].Comments;
    	//      var text = "Reason: " + model.oData[0].Comments;
    	    //var text = "Reason: " + model.oData[0].Comments;
    	      var attribute = new sap.m.ObjectAttribute({
    	        text : text
    	      });
    	      attribute.addStyleClass("redText");
    	      objHeader.addAttribute(attribute);
          }
    	}
    	
    } else {
      var attribute = new sap.m.ObjectAttribute({
        text : status
      });
      objHeader.addAttribute(attribute);
    }
    return objHeader;
  },
  
  getVPNDetails : function(requestId,listItem){
	  if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
		}
	  var oRequestModel = this.getView().getModel("oRequestModel");
	  var oDataModel = new sap.ui.model.json.JSONModel();
		oDataModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/VPNRequestSet?$filter=requestId eq '"+requestId+"'&$format=json", null, false);
		this.getView().setModel(oDataModel,"oDataModel");
		var data = oDataModel.getData().d.results[0];
		if(data!=null){
			if(data.vpn == "X"){
				sap.ui.getCore().byId("vpnType").setSelectedIndex(0);
			}else{
				sap.ui.getCore().byId("vpnType").setSelectedIndex(1);
			}
			sap.ui.getCore().byId('hostIpId').setValue(data.eIPAddress);
			//sap.ui.getCore().byId('hostIpId').setTooltip(data.eIPAddress);
			oRequestModel.setProperty("/hostIpId",data.eIPAddress);
			if(data.VPNExpiryDate != null){
			var expiryDate = data.VPNExpiryDate;
			var startIndex = expiryDate.indexOf("(");
			var endIndex = expiryDate.indexOf(")");
			expiryDate=expiryDate.substring(startIndex+1,endIndex)
			expiryDate = new Date(parseInt(expiryDate)).toString();
			expiryDate = expiryDate.split(" ");
			sap.ui.getCore().byId('expiryDate').setValue(expiryDate[1]+" "+expiryDate[2]+" "+expiryDate[3]);
			}
			sap.ui.getCore().byId('justification').setValue(data.Justification);
		//	sap.ui.getCore().byId('justification').setTooltip(data.Justification);
			oRequestModel.setProperty("/justification",data.Justification);
			if(data.request_type=="0001"){
				sap.ui.getCore().byId('eFname').setValue(data.eFirstName);
				sap.ui.getCore().byId('eMname').setValue(data.eMiddleName);
				sap.ui.getCore().byId('eLname').setValue(data.eLastName);
				sap.ui.getCore().byId('eEmail').setValue(data.eMail);
				/*sap.ui.getCore().byId('eFname').setTooltip(data.eFirstName);
				sap.ui.getCore().byId('eMname').setTooltip(data.eMiddleName);
				sap.ui.getCore().byId('eLname').setTooltip(data.eLastName);
				sap.ui.getCore().byId('eEmail').setTooltip(data.eMail);*/
				oRequestModel.setProperty("/eFname",data.eFirstName);
				oRequestModel.setProperty("/eMname",data.eMiddleName);
				oRequestModel.setProperty("/eLname",data.eLastName);
				oRequestModel.setProperty("/eEmail",data.eMail);
				var step = this.getStage(listItem.getCustomData());
				if(step == "Resolved" && data.provisionedUserId != ""){
				sap.ui.getCore().byId('UIDSection').setVisible(true);
				sap.ui.getCore().byId('suggestedUID').setText(data.provisionedUserId);
				}
				//sap.ui.getCore().byId('adAccount').setVisible(false);
			}else{
				sap.ui.getCore().byId('adAccount').setValue(data.adId);
				//sap.ui.getCore().byId('adAccount').setTooltip(data.adId);
				oRequestModel.setProperty("/adAccount",data.adId);
				sap.ui.getCore().byId('renewType').setVisible(true);
				sap.ui.getCore().byId('newType').setVisible(false);
			}
			sap.ui.getCore().byId('newOrRenew').setValue(data.reqTypeDesc);
			
			//For reading the data
			var url ="/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileRead?$filter=UNIQUE_ID eq '" + requestId + "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '3'";
			var oFileModel = new sap.ui.model.json.JSONModel();
			oFileModel.loadData(url, null, false);
			if(oFileModel.getData().d.results[0].URL != ""){
				sap.ui.getCore().byId('fileSection').setVisible(true);
				sap.ui.getCore().byId('fileUrl').setHref(oFileModel.getData().d.results[0].URL);
			}
		}
  },

  getTERDetails : function(requestId){
	  if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		//Ticket detail
		var oDataModel = new sap.ui.model.json.JSONModel();
		 var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/TERRequestSet?$filter=RequestId eq '"+requestId+"'&$expand=TERToPow,TERToTmm,TERToSow&$format=json");
		oDataModel.loadData(url, null, false);
		this.getView().setModel(oDataModel,"oDataModel");
		var data = oDataModel.getData().d.results[0];
		
		if(data!=null){
			sap.ui.getCore().byId('workPermitId').setValue(data.WorkPermit);
			sap.ui.getCore().byId('workPermitId').setTooltip(data.WorkPermit);
			if(data.IsReqtAccReq=="X"){sap.ui.getCore().byId('partOfTeamId').setSelected(true);}
			if(data.IsOtherTeamAccReq=="X"){sap.ui.getCore().byId('othersId').setSelected(true);}
			if(data.TERToTmm.results.length > 0){
				sap.ui.getCore().byId('othersId').setSelected(true);
				sap.ui.getCore().byId('othersTblId').setVisible(true);
				
				var pHistory = sap.ui.getCore().byId('othersTblId');
				pHistory.unbindItems();
				var oVmsLookupModel= new sap.ui.model.json.JSONModel();
				oVmsLookupModel.setProperty("/results",data.TERToTmm.results);
				pHistory.setModel(oVmsLookupModel);
			    pHistory.bindAggregation("items", "/results", new sap.m.ColumnListItem({
			        cells:[
			              
			               new sap.m.Text({
			            	   text:"{KaustID}"
			               }),
			               new sap.m.Text({
			                   text:"{Name}"
			               })
			               ]
			    }));
			}
			
			if(data.StartTime!=""){
			//	var startDate = this.convertDateBack(parseInt(data.StartTime));
			//	sap.ui.getCore().byId('startDateId').setValue(startDate);
				var startDateDisp = new Date(parseInt(data.StartTime)).toString();
				startDateDisp = startDateDisp.split(":00 ");
				sap.ui.getCore().byId('startDateId').setValue(startDateDisp[0]);
			}
			if(data.EndTime!=""){
				var startDate = new Date(parseInt(data.StartTime));
				var endDate = new Date(parseInt(data.EndTime));
				var diff= endDate.getDate()-startDate.getDate();
				if(diff == 0){
					sap.ui.getCore().byId('endDateId').setValue("Same day");
				}else{
					sap.ui.getCore().byId('endDateId').setValue("Next day");
				}
			}
			
			
			sap.ui.getCore().byId('buildingId').setValue(data.Building);
			sap.ui.getCore().byId('levelSelId').setValue(data.Level);
			sap.ui.getCore().byId('terRoomId').setValue(data.Room);
			
			sap.ui.getCore().byId('buildingId').setTooltip(data.Building);
			sap.ui.getCore().byId('levelSelId').setTooltip(data.Level);
			sap.ui.getCore().byId('terRoomId').setTooltip(data.Room);
			
			var result = this.getFields(data.TERToSow.results, "scopeOfWork");
			if(result.indexOf("Power Activity/ Survey")!=-1){
				sap.ui.getCore().byId('powerActId').setSelected(true);
				var resultObject = this.search("Power Activity/ Survey", data.TERToSow.results);
				sap.ui.getCore().byId('pwrLbl').setVisible(true);
				//sap.ui.getCore().byId('pwrRdBtn').setVisible(true); 
				this.radioBtn = new sap.m.RadioButtonGroup("pwrRdBtn",{
					buttons:[
						new sap.m.RadioButton({text:"No"}),
						new sap.m.RadioButton({text:"Yes"})
					],
					enabled: false
				});
				var vBox = sap.ui.getCore().byId("pwrActVbox").insertItem(this.radioBtn,2);
				sap.ui.getCore().byId('pwrRdBtn').setSelectedIndex(parseInt(resultObject.powerBackup));
			}
			if(result.indexOf("A/C Maintenance")!=-1){
				sap.ui.getCore().byId('acMaintId').setSelected(true);
			}
			if(result.indexOf("TER Cleaning")!=-1){
				sap.ui.getCore().byId('terCleanId').setSelected(true);
			}
			if(result.indexOf("Cable Pulling and Testing")!=-1){
				sap.ui.getCore().byId('cblChkId').setSelected(true);
				sap.ui.getCore().byId('cblAgreeId').setVisible(true);
				sap.ui.getCore().byId('cblAgreeId').setSelected(true);
			}
			if(result.indexOf("HSE Inspection")!=-1){
				sap.ui.getCore().byId('hseInspectId').setSelected(true);
			}
			if(result.indexOf("Others")!=-1){
				sap.ui.getCore().byId('otherChkId').setSelected(true);
				var resultObject = this.search("Others", data.TERToSow.results);
				sap.ui.getCore().byId('othersTextId').setVisible(true);
				sap.ui.getCore().byId('othersTextId').setValue(resultObject.sowComments);
				sap.ui.getCore().byId('othersTextId').setTooltip(resultObject.sowComments);
			}
			if(data.PowerInterrupt=="X"){
				sap.ui.getCore().byId("PowerRadioGrpId").setSelectedIndex(1);
				sap.ui.getCore().byId('pwrChkBoxId').setVisible(true);
				var powRes = data.TERToPow.results;
				if(powRes.length > 0){
					for(var i=0; i<powRes.length; i++ ){
						if(powRes[i].CircuitType=="PR"){
							sap.ui.getCore().byId('prCbId').setSelected(true);
							sap.ui.getCore().byId('inpPrId').setVisible(true);
							sap.ui.getCore().byId('inpPrId').setValue(powRes[i].EquipmentNumber);
							sap.ui.getCore().byId('inpPrId').setTooltip(powRes[i].EquipmentNumber);
						}
						if(powRes[i].CircuitType=="BPR"){
							sap.ui.getCore().byId('brCbId').setSelected(true);
							sap.ui.getCore().byId('inpBrId').setVisible(true);
							sap.ui.getCore().byId('inpBrId').setValue(powRes[i].EquipmentNumber);
							sap.ui.getCore().byId('inpBrId').setTooltip(powRes[i].EquipmentNumber);
						}
						if(powRes[i].CircuitType=="EPR"){
							sap.ui.getCore().byId('eprCbId').setSelected(true);
							sap.ui.getCore().byId('inpEcId').setVisible(true);
							sap.ui.getCore().byId('inpEcId').setValue(powRes[i].EquipmentNumber);
							sap.ui.getCore().byId('inpEcId').setTooltip(powRes[i].EquipmentNumber);
						}
					}
				}
			}else{
				sap.ui.getCore().byId("PowerRadioGrpId").setSelectedIndex(parseInt(data.PowerInterrupt));
			}
			sap.ui.getCore().byId("acIntRadioGrpId").setSelectedIndex(parseInt(data.AcInterruption));
			if(data.AcInterruption=="2"){
				sap.ui.getCore().byId('acAgreeId').setSelected(true);
				sap.ui.getCore().byId('acAgreeId').setVisible(true);
			}
			
			 
	   
		}
		
		// User Detail Model
		var that = this;
		var oUserModel = new sap.ui.model.json.JSONModel();
		oUserModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + data.kaustId + "',UserId='')?$format=json", null, true);
		oUserModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				that.getView().setModel(oUserModel, "oUserModel");
			}
		});
		oUserModel.attachRequestFailed(function(oEvent) {
			sap.m.MessageBox.error(oEvent.getParameter("statusCode") + ":" + oEvent.getParameter("statusText"), {
				title: "Failed to load User Detail",
				onClose: null,
				textDirection: sap.ui.core.TextDirection.Inherit
			});
		});
	},
	
	 getFields :function(input, field) {
	    var output = [];
	    for (var i=0; i < input.length ; ++i)
	        output.push(input[i][field]);
	    return output;
	},
	
	search: function (nameKey, myArray){
	    for (var i=0; i < myArray.length; i++) {
	        if (myArray[i].scopeOfWork === nameKey) {
	            return myArray[i];
	        }
	    }
	},
  
	/**
	 * Fetch the details for Admin Rights Process  
	 **/
	getAdminAccessDetails : function (requestId) {
		 var oDataModel = new sap.ui.model.json.JSONModel();
		 var oPortModel = this.getView().getModel("oPortModel");
		 var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/AdminRightsReqSet?$filter=requestId eq '"+requestId+"'&$format=json");
			oDataModel.loadData(url, null, false);
			this.getView().setModel(oDataModel,"adminModel");
			var data = oDataModel.getData().d.results[0];
			 var oTUserModel = new sap.ui.model.json.JSONModel();
				oTUserModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserID(KaustID='',UserId='BILLORR')", null,false);
				var custodainName = oTUserModel.getProperty("/d/FirstName")+" "+oTUserModel.getProperty("/d/LastName");
			
			if (data.custodian === "X") {
				oPortModel.setProperty("/iCustodianRB", 1);
				sap.ui.getCore().byId("custodianName").setVisible(true);
				sap.ui.getCore().byId("custodianName").setText(custodainName);
			} else {
				sap.ui.getCore().byId("custodianName").setVisible(false);
				oPortModel.setProperty("/iCustodianRB", 0);
			}
			oPortModel.setProperty("/tagNumber", data.tagNumber);
//			sap.ui.getCore().byId("idTagInput").setValue();
			oPortModel.setProperty("/sJustText",data.justification);
			var aOperSys = data.operatingSystem.split(",");
			aOperSys.forEach(function (oEle) {
				oEle === "Windows" ? sap.ui.getCore().byId("idWinCB").setSelected(true) : oEle === "Mac" ? sap.ui.getCore().byId("idMacCB").setSelected(true) : sap.ui.getCore().byId("idLinuxCB").setSelected(true);
			});
			oPortModel.setProperty("/Onbehalf",data.Onbehalf);
			oPortModel.setProperty("/selectedOperSys",aOperSys);
			oPortModel.setProperty("/comments",data.comments);
			oPortModel.setProperty("/bWinEnable", false);
			oPortModel.setProperty("/bMacEnable", false);
			oPortModel.setProperty("/bLinuxEnable", false);
			oPortModel.setProperty("/bEnableFields", false);
			oPortModel.setProperty("/bTagSelect", false);
			oPortModel.setProperty("/bTagInpEnable", false);
			oPortModel.setProperty("/bTagInput", true);
			
			
			var startDateDisp = new Date(parseInt(data.expDate.split("(")[1].split(")")[0])).toDateString();
//			startDateDisp = startDateDisp.split(":00 ");
//			sap.ui.getCore().byId('startDateId').setValue(startDateDisp[0]);
//			var aDate = new Date(parseInt(data.expDate.split("(")[1].split(")")[0]))
			oPortModel.setProperty("/oDateValue",startDateDisp);
//			sap.ui.getCore().byId("idTNCCheckBox").setSelected(true); 	
			oPortModel.refresh();
			
	},
	
	
	
	getPortDetails : function(requestId){
		  var oDataModel = new sap.ui.model.json.JSONModel();
		  var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/PortActivationRequest?$filter=RequestId eq '"+requestId+"'&$format=json");
			oDataModel.loadData(url, null, false);
			var data = oDataModel.getData().d.results[0];
			sap.ui.getCore().byId('reqTypeId').setValue(data.reqTypeDesc);
			// sap.ui.getCore().byId('subHeader').setText(data.Request_Type);
			sap.ui.getCore().byId('idPortNo').setValue(data.Port_Tag_Number);
			sap.ui.getCore().byId('idPortNo').setTooltip(data.Port_Tag_Number);
			if(data.Request_Type != "0001"){
				 sap.ui.getCore().byId('serviceId').setVisible(true);
				 sap.ui.getCore().byId('idServType').setValue(data.Service_Type);
				 sap.ui.getCore().byId('idServType').setTooltip(data.Service_Type);
			}
			 sap.ui.getCore().byId('idLoc').setValue(data.Location);
			 sap.ui.getCore().byId('idLoc').setTooltip(data.Location);
			this.disableAllPortFields();
	  },

  disableAllPortFields : function(){
	  sap.ui.getCore().byId('reqTypeId').setEnabled(false);
	  sap.ui.getCore().byId('idPortNo').setEnabled(false);
	  sap.ui.getCore().byId('idServType').setEnabled(false);
	  sap.ui.getCore().byId('idLoc').setEnabled(false);
	},
	
  getEmailDistrGrp : function(requestId, kaustId){
    var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
    var filterstr = "Gemail(RequestId='" + requestId + "',KaustId='" + kaustId + "')";
    var that = this;
    oModelMyRequests.read(filterstr, null, null, false, function(data, response) {
      var oModelVScan = new sap.ui.model.json.JSONModel();

      oModelVScan.setData(data);

        sap.ui.getCore().byId("dispName").setText(oModelVScan.oData.Grpdisplayname);
          sap.ui.getCore().byId("coOwnGrp").setText(oModelVScan.oData.COwneremail);
          sap.ui.getCore().byId("emailTxt").setText(oModelVScan.oData.Grpemail);
          sap.ui.getCore().byId("primeOwnGrp").setText(oModelVScan.oData.Grpmember);
          //call for delegates
           var authSenders = oModelVScan.oData.Authsender;
           if(authSenders==""){
             sap.ui.getCore().byId("authSenders").setText("No restriction");
           }
          that.getMultiFieldsEmailDistrReadOnly(requestId);

      sap.ui.getCore().byId("Detail").setModel(oModelVScan, "emailDistrModel");

      sap.ui.getCore().byId("descr").setText(oModelVScan.oData.Accountdesc);

    }, function(response) {
      return "";
    });
    this.getUserData(kaustId,requestId);

  },

  getGenEmail : function(requestId, kaustId){
    var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
    var filterstr = "Email(RequestId='" + requestId + "',KaustId='" + kaustId + "')";
    var that = this;
    oModelMyRequests.read(filterstr, null, null, false, function(data, response) {
      var oModelVScan = new sap.ui.model.json.JSONModel();

      oModelVScan.setData(data);

      var reqType = oModelVScan.oData.Requesttype;
      sap.ui.getCore().byId("reqType").setText(oModelVScan.oData.Requesttype);
        if(reqType=="Generic Account"){
          sap.ui.getCore().byId("emailTxt").setText(oModelVScan.oData.Remail);
          sap.ui.getCore().byId("primeOwnBox").setText(oModelVScan.oData.Owneremail);
          sap.ui.getCore().byId("reqLogin").setVisible(false);
          //call for delegates
          that.getMultiFieldsGenEmailReadOnly(requestId);
        }else {
          sap.ui.getCore().byId("emailTxt").setVisible(false);
          sap.ui.getCore().byId("primeOwnBox").setVisible(false);
          sap.ui.getCore().byId("delegate").setVisible(false);
          sap.ui.getCore().byId("reqLogin").setText(oModelVScan.oData.Ruserid);
        }
        sap.ui.getCore().byId("dispName").setText(oModelVScan.oData.Displayname);
      sap.ui.getCore().byId("Detail").setModel(oModelVScan, "emailModel");

      sap.ui.getCore().byId("descr").setText(oModelVScan.oData.Accountdesc);

    }, function(response) {
      return "";
    });
    this.getUserData(kaustId, requestId);

  },

  getEfax : function(requestId, kaustId){
    var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
    var filterstr = "Fax(RequestId='" + requestId + "',KaustId='" + kaustId + "')";
    var that = this;
    oModelMyRequests.read(filterstr, null, null, false, function(data, response) {
      var oModelVScan = new sap.ui.model.json.JSONModel();

      oModelVScan.setData(data);

      var efaxType = "";
        if(oModelVScan.oData.Localonly=="X"){
          efaxType="Local Only";
        }else if(oModelVScan.oData.Localnational=="X"){
          efaxType="Local and National";
        }else if(oModelVScan.oData.Localinational=="X"){
          efaxType="Local/National/International";
        }
      sap.ui.getCore().byId("Detail").setModel(oModelVScan, "efaxModel");
      sap.ui.getCore().byId("efaxText").setText(efaxType);
      sap.ui.getCore().byId("descr").setText(oModelVScan.oData.Accountdesc);

    }, function(response) {
      return "";
    });
    this.getUserData(kaustId, requestId);

  },

  getLoanEquip : function(requestId, kaustId) {

    var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
    var filterstr = "Loanequip(RequestId='" + requestId + "',KaustId='" + kaustId + "')";
    var that = this;
    oModelMyRequests.read(filterstr, null, null, false, function(data, response) {
      var oModelVScan = new sap.ui.model.json.JSONModel();

      oModelVScan.setData(data);
      sap.ui.getCore().byId("Detail").setModel(oModelVScan, "confRoomModel");
      // sap.ui.getCore().byId("loanForm").setVisible(false);

      var startData = oModelVScan.oData.Startdate;
      // var msString = startData.slice(6, 19);
      // var msInt = parseInt(msString);
      var startDate = that.convertDateBack(startData);
      var start = startDate + " " + oModelVScan.oData.Starttime;
      sap.ui.getCore().byId("startTime").setVisible(true).setText(start);

      var endData = oModelVScan.oData.Enddate;
      // var msString = endData.slice(6, 19);
      // var msInt = parseInt(msString);
      var endDate = that.convertDateBack(endData);
      var end = endDate + " " + oModelVScan.oData.Endtime;
      sap.ui.getCore().byId("endTime").setVisible(true).setText(end);

      // devices and access. tab
      var devices = "";
      if (oModelVScan.oData.Pasystem == "X") {
        devices = devices + "Portable PA System;";
      }
      if (oModelVScan.oData.Projector == "X") {
        devices = devices + "Projector;";
      }
      if (oModelVScan.oData.Speaker == "X") {
        devices = devices + "Speaker;";
      }
      if (oModelVScan.oData.Screen == "X") {
        devices = devices + "Screen;";
      }
      if (oModelVScan.oData.Clicker == "X") {
        devices = devices + "Clicker;";
      }
      if (oModelVScan.oData.Appledviconnector == "X") {
        devices = devices + "Apple mini-DVI Connector;";
      }
      if (oModelVScan.oData.Hdmidviconnector == "X") {
        devices = devices + "HDMI-DVI Connector;";
      }
      if (oModelVScan.oData.Visualizer == "X") {
        devices = devices + "Visualizer;";
      }
      if (oModelVScan.oData.Vgaconnector == "X") {
        devices = devices + "VGA Scaler Connector;";
      }
      sap.ui.getCore().byId("avTxt").setVisible(true).setText(devices);

      // computer and access.
      var computers = "";
      if (oModelVScan.oData.Imacworkstation == "X") {
        computers = computers + oModelVScan.oData.Quantity + " iMac workstation;";
      }
      if (oModelVScan.oData.Printer == "X") {
        computers = computers + oModelVScan.oData.Quantity1 + " Printer;";
      }
      if (oModelVScan.oData.Lmacbookair == "X") {
        computers = computers + oModelVScan.oData.Quantity2 + " Laptop MacBook Air;";
      }
      if (oModelVScan.oData.Scanner == "X") {
        computers = computers + oModelVScan.oData.Quantity3 + " Scanner;";
      }
      if (oModelVScan.oData.Applemonitor == "X") {
        computers = computers + oModelVScan.oData.Quantity4 + " Apple Monitor;";
      }
      if (oModelVScan.oData.Others != "") {
        computers = computers + oModelVScan.oData.Quantity5 + " " + oModelVScan.oData.Others + ";";
      }
      if (oModelVScan.oData.Lmacair == "X") {
        computers = computers + oModelVScan.oData.Quantity6 + " iMac workstation;";
      }
      sap.ui.getCore().byId("devices").setVisible(true).setText(computers);
      sap.ui.getCore().byId("reason").setText(oModelVScan.oData.Reason);
      if (oModelVScan.oData.Reason == "Repair") {
        sap.ui.getCore().byId("incidentLbl").setVisible(true);
        sap.ui.getCore().byId("incident").setVisible(true).setText(oModelVScan.oData.Incireport);
      }

      sap.ui.getCore().byId("itComment").setText(oModelVScan.oData.Justification);
      sap.ui.getCore().byId("loanForm").setModel(oModelVScan);
      // sap.ui.getCore().byId("inputItem").setText(oModelVScan.oData.Replenishid);

    }, function(response) {
      return "";
    });
    this.getUserData(kaustId, requestId);
  },

  getReplenishEquip : function(requestId, kaustId) {

    var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
    var filterstr = "Replenish(RequestId='" + requestId + "',KaustId='" + kaustId + "')";
    oModelMyRequests.read(filterstr, null, null, false, function(data, response) {
      var oModelVScan = new sap.ui.model.json.JSONModel();

      oModelVScan.setData(data);
      sap.ui.getCore().byId("Detail").setModel(oModelVScan, "transferModel");
      sap.ui.getCore().byId("transferToForm").setVisible(false);
      sap.ui.getCore().byId("itComment").setText(oModelVScan.oData.Justification);
      sap.ui.getCore().byId("inputItem").setText(oModelVScan.oData.ReplenishName);

    }, function(response) {
      return "";
    });
    this.getUserData(kaustId, requestId);
  },

  getTransferEquip : function(requestId, kaustId) {
    var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
    var filterstr = "Transferequipment(RequestId='" + requestId + "',KaustId='" + kaustId + "')";
    // var filterstr = "Replenish(RequestId='" + requestId + "',KaustId='" + kaustId + "')";
    that = this;
    oModelMyRequests.read(filterstr, null, null, false, function(data, response) {
      var oModelVScan = new sap.ui.model.json.JSONModel();
      oModelVScan.setData(data);
      sap.ui.getCore().byId("Detail").setModel(oModelVScan, "transferModel");
      sap.ui.getCore().byId("itComment").setText(oModelVScan.oData.Justification);
      // sap.ui.getCore().byId("inputItem").setText(oModelVScan.oData.Replenishitem);
      sap.ui.getCore().byId("transferToForm").setModel(oModelVScan);
      that.getMultiFieldsTransferIT(requestId);
    }, function(response) {
      return "";
    });
    this.getUserData(kaustId, requestId);

  },

  getConfereceRoomData : function(requestId, kaustId) {
    var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
    var filterstr = "Vsm?$filter=RequestId eq '"+requestId+"'";
    oModelMyRequests.read(filterstr, null, null, false, function(data, response) {
      var oModelVScan = new sap.ui.model.json.JSONModel();
      oModelVScan.setData(data.results[0]);
      sap.ui.getCore().byId("Detail").setModel(oModelVScan, "confRoomModel");
    }, function(response) {
      return "";
    });
  },
  
  getPortData : function(requestId, kaustId) {
	    var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
	    var filterstr = "Vsm(RequestId='" + requestId + "',KaustId='" + kaustId + "')";
	    var filterstr = "PortActivationRequest?$filter=RequestId eq '20919775'&$format=json";
	    oModelMyRequests.read(filterstr, null, null, false, function(data, response) {
	      var oModelVScan = new sap.ui.model.json.JSONModel();

	      oModelVScan.setData(data);
	      sap.ui.getCore().byId("Detail").setModel(oModelVScan, "portModel");

	    }, function(response) {
	      return "";
	    });
	  },

  getSecurityIncidentData : function(requestId, kaustId) {
    var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
    var filterstr = "SecurityIncidentRequest(RequestId='" + requestId + "',KaustId='" + kaustId + "')";

    oModelMyRequests.read(filterstr, null, null, false, function(data, response) {
      var oModelVScan = new sap.ui.model.json.JSONModel();

      oModelVScan.setData(data);
      sap.ui.getCore().byId("Detail").setModel(oModelVScan, "SIncidentModel");

    }, function(response) {
      return "";
    });
  },
  getVulnerabilityScanData : function(requestId, kaustId) {
    var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
    var filterstr = "Vulnerabilityscan(RequestId='" + requestId + "',KaustId='" + kaustId + "')";

    oModelMyRequests.read(filterstr, null, null, false, function(data, response) {
      var oModelVScan = new sap.ui.model.json.JSONModel();

      oModelVScan.setData(data);
      sap.ui.getCore().byId("Detail").setModel(oModelVScan, "VScanModel");

    }, function(response) {
      return "";
    });
  },
  getAccessRequestData : function(requestId, kaustId) {
    var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
    var filterstr = "AccessRequest(RequestId='" + requestId + "',KaustId='" + kaustId + "')";

    oModelMyRequests.read(filterstr, null, null, false, function(data, response) {
      var oModelARequest = new sap.ui.model.json.JSONModel();

      oModelARequest.setData(data);
      sap.ui.getCore().byId("Detail").setModel(oModelARequest, "ARequestModel");
      sap.ui.getCore().byId("SFDetails").setModel(oModelARequest);

    }, function(response) {
      return "";
    });
    // this.getUserData(kaustId);
  },
  getIqamaRenewelOrExitEntryRequest : function(requestId, kaustId) {
    var oDataURLMyRequests = "/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/";
    var oModelRequest = new sap.ui.model.odata.ODataModel(this.getUrl(oDataURLMyRequests)); // Darshna - this.getUrl added
    var filterstr = "Requests(RequestId='" + requestId + "',Lock='')";

    oModelRequest.read(filterstr, null, null, false, function(data, response) {
      var oModelIREERequest = new sap.ui.model.json.JSONModel();

      oModelIREERequest.setData(data);
      sap.ui.getCore().byId("Detail").setModel(oModelIREERequest, "IREEModel");

    }, function(response) {
      return "";
    });
  },
  getIqamaRenewelOrExitEntryRequestDetails : function(requestId) {
    var oDataURLMyRequests = "/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/";
    var oModelRequest = new sap.ui.model.odata.ODataModel(this.getUrl(oDataURLMyRequests));  // Darshna - this.getUrl added
    var filter = "UserDependents/?$filter=RequestId eq '" + requestId + "'";

    oModelRequest.read(filter, null, null, false, function(data, response) {
      var oModelIREERequest = new sap.ui.model.json.JSONModel();

      if(data.results[0].SubServiceCode == "0203"){
        if(data.results[0].VisaExpired =="true"){
          data.results[0].VisaExpired = "Yes";
        }else if(data.results[0].VisaExpired == "false"){
          data.results[0].VisaExpired = "No";
        }
      }

      oModelIREERequest.setData(data.results);
      sap.ui.getCore().byId("Detail").setModel(oModelIREERequest, "IqamaDetailsModel");

    }, function(response) {
      return "";
    });
  },

  back : function(pageId) {
    this.getView().app.backToPage(pageId);
  },
  getProcessStages : function(listItem, status, detailsForm) {
    var step = this.getStage(listItem.getCustomData());
    var serviceCode = this.getSubServiceCode(listItem.getCustomData());
    // Zakeer : CRM for port,ter 
    //0053 - data center
    if(serviceCode == "0051"||serviceCode == "0052" ||serviceCode == '0053' ||serviceCode == '0055'){
    }else{
    	if(step == 'CRM'){
      step = 'IT Service Desk';
    }
    }
    if(serviceCode == "0102" && (step == "Line Manager Approval" || step == "Graduate Affairs Approval")){
    	step = "LM/Graduate Affairs Approval";
    }
    var that = this;
    var oDialog = new sap.m.BusyDialog();
    var brmURL = this.getBRMUrl();
    oDialog.open();
    $.ajax({
      url : brmURL,
      async : "false",
      dataType : "jsonp",
      contentType : "application/json",
      jsonpCallback : "a" + serviceCode,
      // Work with the response. JSONP is asynchronous service. That is the reason rerender is placed in the result.
      success : function(response) {
        if (response.stage1 != null) {
          var brmResult = [ response.stage1, response.stage2, response.stage3, response.stage4, response.stage5, response.stage6, response.stage7, response.stage8, response.stage9, response.stage10 ];
          var processFlow = that.getProcessFlow(step, brmResult, status);
          var contents = detailsForm.getContent();
          detailsForm.removeAllContent();
          detailsForm.addContent(processFlow);
          for (c in contents) {
            detailsForm.addContent(contents[c]);
          }
        }
        oDialog.destroy();
        detailsForm.rerender();
      },
      error : function() {
        oDialog.destroy();
        detailsForm.rerender();
      }
    });
  },
  getProcessStages1 : function(listItem, status, detailsForm,serviceCode) {
    var step = this.getStage(listItem.getCustomData());
    if(step == 'CRM')
      step = 'IT Service Desk';
    //var serviceCode = this.getSubServiceCode(listItem.getCustomData());
    var that = this;
    var oDialog = new sap.m.BusyDialog();
    var brmURL = this.getBRMUrl();
    oDialog.open();
    $.ajax({
      url : brmURL,
      async : "false",
      dataType : "jsonp",
      contentType : "application/json",
      jsonpCallback : "a" + serviceCode,
      // Work with the response. JSONP is asynchronous service. That is the reason rerender is placed in the result.
      success : function(response) {
        if (response.stage1 != null) {
          var brmResult = [ response.stage1, response.stage2, response.stage3, response.stage4, response.stage5, response.stage6, response.stage7, response.stage8, response.stage9, response.stage10 ];
          var processFlow = that.getProcessFlow(step, brmResult, status);
          var contents = detailsForm.getContent();
          detailsForm.removeAllContent();
          detailsForm.addContent(processFlow);
          for (c in contents) {
            detailsForm.addContent(contents[c]);
          }
        }
        oDialog.destroy();
        detailsForm.rerender();
      },
      error : function() {
        oDialog.destroy();
        detailsForm.rerender();
      }
    });
  },
  getBRMUrl : function() {
    var host = window.location.hostname;

    if (host == "localhost") {
      // Darshna - Edited : Replaced http with https
      return "https://sthcibpdqq1.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
    }
    if (host.indexOf("kaust.edu.sa") == -1) {
      host = host + ".kaust.edu.sa";
    }

    switch (host) {

    case 'sthcigwdq1.kaust.edu.sa':
           var port =  window.location.port;
           if(port == "8000" ||port == "8001" ){ //QA port
             return "https://sthcibpdqq1.kaust.edu.sa:50001/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
             //return "https://sthcibpdqq1.kaust.edu.sa:50001" + url;   
           }else {//port == "8005" ||port == "8006"
             return "https://sthcibpdqq1.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
             //return "https://sthcibpdqq1.kaust.edu.sa:50501" + url;            
           }                       
                break;
    /*case 'sthcigwdq1.kaust.edu.sa':
      return "https://sthcibpdqq1.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
      break;
    case 'sthcigwq1.kaust.edu.sa':
      return "https://sthcibpqq1.kaust.edu.sa:50001/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
      break;*/
    case 'sthgwpsrcs.kaust.edu.sa':
      return "https://sthbppsrcs.kaust.edu.sa:50101/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
      break;
    // Darshna - Edited : Added a switch case for localhost
    case 'localhost' :
      return "https://sthcibpdqq1.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
    }
    return;
  },
  getProcessFlow : function(step, stages, status) {
    var processFlow = new sap.suite.ui.commons.ProcessFlow();
    var processState = sap.suite.ui.commons.ProcessFlowNodeState.Positive;
    var stepFound = false;
    var icon = "sap-icon://employee-approvals";
    var subService = this.getView().getModel("helpModel").getData().helpItems.serviceOpened;
    var oSubCode = this.getView().getModel("helpModel").getData().helpItems.subServiceCode;
    //Zakeer : Resolved status
    if(subService=="Port Activation" || subService == "TER Access Process" || subService == "Data Center Access Process" || subService == "VPN Access for externals Process" ||subService == "Admin Rights Process" || subService == "Audio Visual Services"){
    	if(status == "Initiated"){
    		return ;
    	}
    	 var isCompleted = $.inArray(status, [ "Rejected", "Cancelled" ]);
    	 // For VPN skipping Info sec stage
    	 if(subService == "VPN Access for externals Process"){
    			var data =  this.getView().getModel("oDataModel").getData().d.results[0];
    			if(data.vpn == "X" && data.activityType == "New" && data.flow =="Non-Academic"){
    			}else{
    				stages.shift();
    			}
    			//if(data.requestType=="Non VPN"){ 
    			if(!(data.vpn == "X" && data.activityType == "New")){
    				 var index = stages.indexOf("CRM");
       			  stages.splice(index, 1);
    			}
    			var index = stages.indexOf("AD Automation");
       		  	if(index && data.requestType=="VPN" && data.reqTypeDesc=="New"){
       			   stages[index]= "Account Creation";
       			}else if(index && data.requestType=="VPN" && data.reqTypeDesc=="Renew"){
       			   stages[index]= "Account Renewal";
       			}else if(index && data.requestType=="Non VPN"){
       			   stages[index]= "Account Provision";
       			}
       		  	if(step == "AD Automation"){
       		  	 step = stages[index];
       		  	}
       		  	
       		  	var index = stages.indexOf("CRM");
    		  	if(index){
    			   stages[index]="Info Sec Team";
    				   if(step == "CRM"){
    		       		  	 step = stages[index];
    		       		  	}   
    			}
    	 }
    	 if(subService == 'Data Center Access Process') {
    		  var data =  this.getView().getModel("dataCenter").getData().d.results[0];
    		   if(data.requestType == "Non-Contractor"){
    			  var index = stages.indexOf("Line Manager");
    			  stages.splice(index, 1);
    		   }
    		  if(data.flow == "YES"){
    			  var index = stages.indexOf("KAUST Security");
    			  stages.splice(index, 1);
    		  }
    		  if(step =="CRM")
    			  step = "Data Center Access";
    		  
    		  
    		  if(step =="Justification" )
    			  step = "Pre Screening";
    		 
    		  if(!data.justification)
    			  {
    			  var index = stages.indexOf("Justification");
    			  stages.splice(index, 1);
    			  }
    		  
    		  var index = stages.indexOf("Justification");
    		  stages[index] = "Pre Screening";
//    			var index = stages.indexOf("CRM");
//       		  	if(index){
//       			   stages[index]="Data Center Access";
//       			}
        	
    		  
    		  //Pavithra -- for pre step justification ---- start
    		  if(data.RequestId&&data.approverStatus == 1||data.RequestId&&data.approverStatus == 2||data.RequestId&&data.approverStatus == 3)
    			  {
    			  var index = stages.indexOf("KAUST Security");
//    			  stages.splice(index, 1);
    			  }
    		  else  	
    			  {
    			  var index = stages.indexOf("Justification");
    			  stages.splice(index, 1);
    			  var index = stages.indexOf("Requester");
    			  stages.splice(index, 1);
    			  }
    		  //Pavithra -- for pre step justification ---- end
    	 }
    	 if(subService == "Admin Rights Process"){
    		var data= this.getView().getModel("oPortModel").getData();
    		var index = stages.indexOf("CRM");
   		  	if(index){
   			   stages[index]="IT Service Desk"
   			}
    		if(data.Onbehalf != "X"){
			 	var index = stages.indexOf("Line Manager");
		  		stages.splice(index, 1);
    		}
    		if(data.selectedOperSys){
    			var present = data.selectedOperSys.indexOf("Linux");
    			if(present!=-1) {
					var index = stages.indexOf("IT Service Manager");
			  		stages.splice(index, 1);
    			}
    			//to be removed once stage is updated in BPM / ECC
    		}
    	}
    	if (subService == "Audio Visual Services") {
    		var oAVData = sap.ui.getCore().byId("Detail").getModel("confRoomModel").getData();
    		var index1, index2, index3;
    		if (oAVData.requestType === "NA") {
    			index1 = stages.indexOf("IT Service Desk");
    			stages.splice(index1, 1);
    			index2 = stages.indexOf("Requester Feedback");
    			stages.splice(index2, 1);
    		}
    		if (oAVData.activityType === "NA") {
    			index1 = stages.indexOf("Room Booking Team");
    			stages.splice(index1, 1);
    		}
    		if (oAVData.activityType === "NA" && oAVData.requestType === "NA") {
    			index1 = stages.indexOf("IT Service Desk");
    			stages.splice(index1, 1);
    			index2 = stages.indexOf("Requester Feedback");
    			stages.splice(index2, 1);
    			index3 = stages.indexOf("Room Booking Team");
    			stages.splice(index3, 1);
    		}
    	}
    	 // end of VPN skipping Info sec stage
    }else{
    	 var isCompleted = $.inArray(status, [ "Rejected", "Resolved", "Cancelled" ]);
    }
    //Zakeer : Resolved status
   // var isCompleted = $.inArray(status, [ "Rejected", "Resolved", "Cancelled" ]);
    var i;
    for (i = 0; i < stages.length; i++) {
      if (stages[i] == null)
        break;
      if (stepFound) {
        processState = sap.suite.ui.commons.ProcessFlowNodeState.Planned;
        icon = "sap-icon://time-entry-request";
        if (isCompleted !== -1) {
          processState = null;
          break;
        }
      }
      if (stages[i].toUpperCase() == step.toUpperCase()) {
    	  if((subService == "VPN Access for externals Process" && step== "Resolved")||(subService == 'Data Center Access Process' && step== "Resolved")){
    	  }else{
    	  if (isCompleted != 0) {   // to remove red color
        processState = sap.suite.ui.commons.ProcessFlowNodeState.Negative;
    	  }
        icon = "sap-icon://customer-history";
        stepFound = true;
    	  }
      }
      
      if(oSubCode === "0036"  || oSubCode === "0207" || oSubCode === "1701" || oSubCode === "1702" || oSubCode === "1704" || oSubCode === "1705"  || oSubCode === "0204" || oSubCode === "0205" || oSubCode === "0503" || oSubCode === "0205" ||  oSubCode === "0504" || oSubCode === "0501" || oSubCode === "1706" || oSubCode === "1707" || oSubCode === "0502" || oSubCode === "0505" || oSubCode === "0104" || oSubCode === "0206" || oSubCode === "0105" || oSubCode === "0302" || oSubCode === "1703" || oSubCode === "0402" || oSubCode === "0303" || oSubCode === "0506" || oSubCode === "1700" || oSubCode === "0304"){
        	if (step === "Pending Requester") {
      	  if (isCompleted != 0) {   
          	processState = sap.suite.ui.commons.ProcessFlowNodeState.Negative;
      	  }
          icon = "sap-icon://customer-history";
          stepFound = true;
        }
        	if(oSubCode === "0206" || oSubCode === "0302")
            {
            	if (sap.ui.getCore().byId("userInfoForm").getModel().getData().d.Type === "STAFF")
            	{
            		var index = stages.indexOf("HR/Graduate Affairs Approval");
        			  stages.splice(index, 1);
        			  if (status === "Resolved" || status === "Rejected" || status === "Cancelled")
        				  processState = sap.suite.ui.commons.ProcessFlowNodeState.Positive;
        			  else
        				  processState = sap.suite.ui.commons.ProcessFlowNodeState.Negative;
            	}
            }
        }
     // var x = new sap.m.Text({text:stages[i],wrapping:true});
      processFlow.addLane(new sap.suite.ui.commons.ProcessFlowLaneHeader({
        text : stages[i],
        position : i,
        state : [ {
          state : processState,
          value : 100
        } ],
        iconSrc : icon
      }));
    }
    if (isCompleted !== -1) {
      var text = status;
   //   var y = new sap.m.Text({text:text,wrapping:true});
      processFlow.addLane(new sap.suite.ui.commons.ProcessFlowLaneHeader({
        text :text,
        position : i,
        state : [ {
          state : sap.suite.ui.commons.ProcessFlowNodeState.Positive,
          value : 100
        } ],
        iconSrc : "sap-icon://employee-approvals"
      }));
    }
    processFlow.addStyleClass("heigher");
    return processFlow;
  },
  getStage : function(customData) {
    for (var i = 0; i < customData.length; i++) {
      if (customData[i].getKey() == "stage") {
        return customData[i].getValue("stage");
      }
    }
    return "No stage";
  },
  getSubServiceCode : function(customData) {
    for (var i = 0; i < customData.length; i++) {
      if (customData[i].getKey() == "subServiceCode") {
        return customData[i].getValue("subServiceCode");
      }
    }
    return "No code";
  },
  setConferenceLayout : function(requestId) {
    var oModel = sap.ui.getCore().byId("Detail").getModel("confRoomModel");
    var form = sap.ui.getCore().byId("externForm");
    form.setModel(oModel);
    // create a Model for the table in the Tab Video and Web Conf
    var webConfModel = new sap.ui.model.json.JSONModel({
      "WebConf" : []
    });
    sap.ui.getCore().byId("Detail").setModel(webConfModel, "webConfModel");
    var oTab = sap.ui.getCore().byId("videoWebTab");
    oTab.setModel(webConfModel);

    // create a Model for the table in the Tab Webex Conference
    var webExModel = new sap.ui.model.json.JSONModel({
      "webExPart" : []
    });
    sap.ui.getCore().byId("Detail").setModel(webExModel, "webExModel");
    var oTabWebEx = sap.ui.getCore().byId("webExTab");
    oTabWebEx.setModel(webExModel);
    var location = oModel.oData.EventLocation;
    if (location == "Conference Room") {
      sap.ui.getCore().byId("roomInfoToolbar").setVisible(true);
      sap.ui.getCore().byId("roomInfoROmode").setVisible(true);
      sap.ui.getCore().byId("roomInfoROmode").setModel(oModel);
      if (oModel.oData.Foodservices == "Y") {
        sap.ui.getCore().byId("foodServ").setSelected(true);
      }
      if (oModel.oData.Recording == "Y") {
        sap.ui.getCore().byId("record").setSelected(true);
      }
      if (oModel.oData.Presentation == "Y") {
        sap.ui.getCore().byId("pressFac").setSelected(true);
      }
    }
    var start = oModel.oData.Ldate;
    // var msString = start.slice(6, 19);
    // var msInt = parseInt(msString);
    var startDate = this.convertDateBack(start);
    sap.ui.getCore().byId("inputDate").setText(startDate);
    if (oModel.oData.Adevent == "X") {
      sap.ui.getCore().byId("dayEvent").setSelected(true);
      sap.ui.getCore().byId("inputStartTime").setVisible(false);
      sap.ui.getCore().byId("timeLabel").setVisible(false);
      sap.ui.getCore().byId("endTimeLabel").setVisible(false);
      sap.ui.getCore().byId("inputEndTime").setVisible(false);
    }

    if (oModel.oData.Ishost == "") {
      sap.ui.getCore().byId("idHostLbl").setVisible(true);
      sap.ui.getCore().byId("hostName").setVisible(true);
      sap.ui.getCore().byId("hostName").setText(oModel.oData.HostUserName);
      this.getHostData(oModel.oData.Hostuserid);
    }
    if (oModel.oData.Wboard == "X") {
      sap.ui.getCore().byId("wBoard").setSelected(true);
    }
    if (oModel.oData.Flipchart == "X") {
      sap.ui.getCore().byId("chart").setSelected(true);
    }
    if (oModel.oData.Others != "") {
      sap.ui.getCore().byId("others").setSelected(true);
      sap.ui.getCore().byId("otherItems").setValue(oModel.oData.Others);
      sap.ui.getCore().byId("otherItems").setVisible(true);
    }
    // Reccurence
    // this.getView().byId("recurr").setVisible(false);
    if (oModel.oData.Rdevent == "X") {
      sap.ui.getCore().byId("reccurBox").setVisible(true);
      sap.ui.getCore().byId("pattLbl").setVisible(true);
      sap.ui.getCore().byId("reccPattern").setVisible(true);
      sap.ui.getCore().byId("reccRangeLbl").setVisible(true);
      var range = oModel.oData.Rstartdate;
      // var msString = range.slice(6, 19);
      // var msInt = parseInt(msString);
      var rangeStartDate = this.convertDateBack(range);
      var rangeEnd = oModel.oData.Renddate;
      // var msString = rangeEnd.slice(6, 19);
      // var msInt = parseInt(msString);
      var rangeEndDate = this.convertDateBack(rangeEnd);

      sap.ui.getCore().byId("reccRange").setVisible(true).setText(rangeStartDate + "-" + rangeEndDate);
      if (oModel.oData.Daily == "X") {
        sap.ui.getCore().byId("reccPattern").setText("Daily");
      }
      if (oModel.oData.Weekly == "X") {
        sap.ui.getCore().byId("reccPattern").setText("Weekly");
        sap.ui.getCore().byId("weeklyRecurLbl").setVisible(true);
        var reccurDays = "";
        if (oModel.oData.Sunday == "X") {
          reccurDays = reccurDays + "Sunday;";
        }
        if (oModel.oData.Monday == "X") {
          reccurDays = reccurDays + "Monday;";
        }
        if (oModel.oData.Tuesday == "X") {
          reccurDays = reccurDays + "Tuesday;";
        }
        if (oModel.oData.Wednesday == "X") {
          reccurDays = reccurDays + "Wednesday;";
        }
        if (oModel.oData.Thursday == "X") {
          reccurDays = reccurDays + "Thursday;";
        }
        if (oModel.oData.Friday == "X") {
          reccurDays = reccurDays + "Friday;";
        }
        if (oModel.oData.Saturday == "X") {
          reccurDays = reccurDays + "Saturday;";
        }
        sap.ui.getCore().byId("weeklyReccur").setVisible(true).setText(reccurDays);
      }
      if (oModel.oData.Monthly == "X") {
        sap.ui.getCore().byId("reccPattern").setText("Monthly");
      }
    }
    if (oModel.oData.comments != "") {
      sap.ui.getCore().byId("comment").setValue(oModel.oData.comments);
    }
    // Av Support Tab
    if (oModel.oData.Avsupport == "X") {
      sap.ui.getCore().byId("avFilter").setVisible(true);
      sap.ui.getCore().byId("avSupport").setSelected(true);
      if (oModel.oData.Laptop == "X") {
        sap.ui.getCore().byId("laptop").setSelected(true);
      }
      if (oModel.oData.Clicker == "X") {
        sap.ui.getCore().byId("clicker").setSelected(true);
      }
      if (oModel.oData.Adapter == "X") {
        sap.ui.getCore().byId("adapter").setSelected(true);
      }
      if (oModel.oData.Mphone == "X") {
        sap.ui.getCore().byId("mic").setSelected(true);
      }
      if (oModel.oData.Speakers == "X") {
        sap.ui.getCore().byId("speakers").setSelected(true);
      }
      if (oModel.oData.Projector == "X") {
        sap.ui.getCore().byId("projector").setSelected(true);
      }
      if (oModel.oData.Monitor == "X") {
        sap.ui.getCore().byId("monitor").setSelected(true);
      }
    }

    // Web And Video Conf Tab
    if (oModel.oData.Videowebconf == "X") {
      sap.ui.getCore().byId("webVideoFilter").setVisible(true);
      sap.ui.getCore().byId("webVideo").setSelected(true);
    }
    // Webex Tab
    if (oModel.oData.Webex == "X") {
      sap.ui.getCore().byId("webex").setSelected(true);
      sap.ui.getCore().byId("webexFilter").setVisible(true);
    }
    if (oModel.oData.Videowebconf == "X" || oModel.oData.Webex == "X") {
      this.getMultiFieldsConfRoomReadOnly(requestId);
    }
    // Conf. Recording Tab
    if (oModel.oData.Confrecord == "X") {
      var confForm = sap.ui.getCore().byId("confRecForm");
      confForm.setModel(oModel);
      sap.ui.getCore().byId("confRecFilter").setVisible(true);
      sap.ui.getCore().byId("confRec").setSelected(true);
      if (oModel.oData.Private == "X") {
        sap.ui.getCore().byId("grRec").setSelectedIndex(1);
      }
    }
    if (oModel.oData.serviceQualityDesc) {
    	var oFeedTab = sap.ui.getCore().byId("feedbackTab");
    	var oFeedRB = sap.ui.getCore().byId("idSrvQualRB");
    	oFeedTab.setVisible(true);
    	var iIndex = -1;
    	if (oModel.oData.serviceQuality === "1") {
    		iIndex = 0;
    	} else if(oModel.oData.serviceQuality === "2") {
    		iIndex = 1;
    	} else if(oModel.oData.serviceQuality === "3") {
    		iIndex = 2;
    	} else if(oModel.oData.serviceQuality === "4") {
    		iIndex = 3;
    	}
    	oFeedRB.setSelectedIndex(iIndex);
    	sap.ui.getCore().byId("idFeedback").setValue(oModel.oData.feedbackComments);
    }
    var kaustId = oModel.oData.KaustId;
    this.getUserData(kaustId, requestId);
  },
  
  getHostData : function(userId){
		var _that = this;
		var form = sap.ui.getCore().byId("HostInfoForm");
		form.setVisible(true);
		var dataModel = new sap.ui.model.json.JSONModel();
	//---------------
		var serviceUrl = _that.getBPMUrl("/kaust.com~sbf~bpm~java~restservices/requestDetails/RequestType?UserId="+userId);
		//
		$.ajax({
	        url: serviceUrl,
	        async: false,
	        dataType: "jsonp",
	        contentType: "application/json",
	        jsonpCallback: 'UserId',   
	        headers:
	        {     
	                       "X-Requested-With": "XMLHttpRequest",
	                       "Content-Type": "application/atom+xml",
	                       "DataServiceVersion": "2.0",       
	                       "X-CSRF-Token":"Fetch",  
	        },  
	        // Work with the response. JSONP is asynchronous service. That is the reason rerender is placed in the result.
	        success: function( responseData ) {            	            	
	        	//console.log( response );
	        	responseData.UserId = userId;
	        	dataModel.setData(responseData);
	        	form.setModel(dataModel);			  	
	           }, error: function(jqXHR, textStatus, errorThrown){
	        	   debugger;
	        	   alert('Unexpected error happened');
	           }
		});
  },
  
  /**Get Service URL*/
  getBPMUrl:function(url) {	 
	  var host = window.location.hostname;
	    if (host.indexOf("kaust.edu.sa") == -1) {
	      host = host + ".kaust.edu.sa";
	    }
	    switch (host) {
	    case 'sthcigwdq1.kaust.edu.sa':
	           var port =  window.location.port;
	           if(port == "8000" ||port == "8001" ){ //QA port
	        	   return "https://sthcibpdqq1.kaust.edu.sa:50001" + url;   
	           }else {//port == "8005" ||port == "8006"
	        	   return "https://sthcibpdqq1.kaust.edu.sa:50501" + url;            
	           }                       
	    break;
	    case 'sthgwpsrcs.kaust.edu.sa':
	    	return "https://sthbppsrcs.kaust.edu.sa:50101" + url;
	    	break;
	    }
	    return;
	},	
  
  getUserData : function(kaustId, requestId) {
    var sUrl = this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + kaustId + "',UserId='')");
    var form = sap.ui.getCore().byId("userInfoForm");
    var form1 = sap.ui.getCore().byId("userInfoFormDC");
    if (!form) return;
    var dataModel = new sap.ui.model.json.JSONModel();
    $.ajax({
      url : sUrl,
      type : "GET",
      dataType : 'json',
      contentType : "application/json",
      Accept : "application/json",
      async : false,
      headers : {
        "X-Requested-With" : "XMLHttpRequest",
        "Content-Type" : "application/atom+xml",
        "DataServiceVersion" : "2.0",
        "X-CSRF-Token" : "Fetch",
      },
      success : function(data, textStatus, XMLHttpRequest) {
        dataModel.setData(data);
      },
      error : function(data, textStatus, XMLHttpRequest) {
        alert("Error message");
      }
    });
    form1.setModel(dataModel);
    form.setModel(dataModel);

    if(requestId){
      var oModel= new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));  // Darshna - this.getUrl added
      var filterstr = "Requestlog?$filter=RequestId eq '" + requestId + "'";

      var model= new sap.ui.model.json.JSONModel();
      var table = sap.ui.getCore().byId("TblHistory");
      table.setModel(model, "historyModel");
      oModel.read(filterstr, null, null, false, function(data, response) {
        table.getModel("historyModel").setData(data.results);
      },function(response) {
        return "";
      });
    }
  },
  getMultiFieldsConfRoomReadOnly : function(requestId) {
    var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Vsm?$filter=RequestId eq '" + requestId + "'");
    // var url = "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Gemail?$filter=RequestId eq '"+requestId+"'";
    var result = "";
    $.ajax({
      url : url,
      dataType : 'json',
      async : false,
      type : "GET",
      cache : false,
      success : function(oResponse, textStatus, jqXHR) {
        result = oResponse;
      },
      error : function(jqXHR, textStatus, errorThrown) {
        if (textStatus === "timeout") {
          sap.m.MessageBox.show("Connection timed out", {
            icon : sap.m.MessageBox.Icon.ERROR,
            title : "Error",
            actions : [ sap.m.MessageBox.Action.OK ],
          // styleClass: bCompact ? "sapUiSizeCompact" : ""
          });
          // sap.ui.commons.MessageBox.alert("Connection timed out: too much data to retrieve. Please select a shorter period of time.", null, "Error");
        } else {
          sap.m.MessageBox.show("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText, {
            icon : sap.m.MessageBox.Icon.ERROR,
            title : "Error",
            actions : [ sap.m.MessageBox.Action.OK ],
          // styleClass: bCompact ? "sapUiSizeCompact" : ""
          });
          jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText);
          // sap.ui.commons.MessageBox.alert("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, null, "Error");
        }
        ;
      },
    });
    var persons = result.d.results;
    var oModel = sap.ui.getCore().byId("Detail").getModel("webConfModel");
    var oModelWebEx = sap.ui.getCore().byId("Detail").getModel("webExModel");
    for ( var i in persons) {
      if (persons[i].Ipaddress != "") {
        oModel.oData.WebConf.push({
          protocol : persons[i].Protocol,
          ipAddress : persons[i].Ipaddress,
          techAssist : persons[i].Contact,
          emailConf : persons[i].Cemail
        });
      }
      if (persons[i].Externalmail != "") {
        oModelWebEx.oData.webExPart.push({
          exUserEmail : persons[i].Externalmail,
          country : persons[i].country
        });
      }
    }
    oModel.updateBindings();
    oModelWebEx.updateBindings();
  },

  getMultiFieldsTransferIT : function(requestId) {

    var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Transferequipment?$filter=RequestId eq '" + requestId + "'");
    var result = "";

    $.ajax({
      url : url,
      dataType : 'json',
      async : false,
      type : "GET",
      cache : false,
      success : function(oResponse, textStatus, jqXHR) {
        result = oResponse;
      },
      error : function(jqXHR, textStatus, errorThrown) {

        if (textStatus === "timeout") {

          sap.m.MessageBox.show("Connection timed out", {
            icon : sap.m.MessageBox.Icon.ERROR,
            title : "Error",
            actions : [ sap.m.MessageBox.Action.OK ],
          });
        } else {

          sap.m.MessageBox.show("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText, {
            icon : sap.m.MessageBox.Icon.ERROR,
            title : "Error",
            actions : [ sap.m.MessageBox.Action.OK ],
          });
          jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText);
        }
        ;
      },

    });

    var items = "";
    var tagNumbers = "";
    var persons = result.d.results;

    for ( var i in persons) {
      if (persons[i].Replenishitem != "") {
        items = items + persons[i].Replenishitem + "\n";
      }
      if(persons[i].Equipnum!=""){
			tagNumbers = tagNumbers + persons[i].Equipnum+ "\n";
		}
    }
    sap.ui.getCore().byId("inputItem").setText(items);
    sap.ui.getCore().byId("equipNo").setText(tagNumbers);
  },

  //get Multiple Values for Delegates field
  getMultiFieldsGenEmailReadOnly : function(requestId){

//        var url = "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Email?$filter=RequestId eq '"+requestId+"'";
      var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Email?$filter=RequestId eq '"+requestId+"'");
      var result = "";

      $.ajax({
              url: url,
           dataType: 'json',
              async: false,
              type: "GET",
              cache: false,
              success: function(oResponse, textStatus, jqXHR) {
                result = oResponse;
                     },
                     error: function(jqXHR, textStatus, errorThrown){
                            
                            if(textStatus==="timeout") {

                             sap.m.MessageBox.show(
                                  "Connection timed out", {
                                        icon: sap.m.MessageBox.Icon.ERROR,
                                        title: "Error",
                                        actions: [sap.m.MessageBox.Action.OK],
                                      }
                                    );
                            } else {

                                 sap.m.MessageBox.show(
                                 "The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, {
                                          icon: sap.m.MessageBox.Icon.ERROR,
                                          title: "Error",
                                          actions: [sap.m.MessageBox.Action.OK],
                                        }
                                      );
                                   jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText);
                            };
                     },
              
              });

      var members ="";
      var persons = result.d.results;

      for(var i in persons){
        if(persons[i].Delegates!=""){
          members = members + persons[i].Delegates+";";
        }
      }
      sap.ui.getCore().byId("delegate").setText(members);
      },
      
  getMultiFieldsEmailDistrReadOnly : function(requestId){

    var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Gemail?$filter=RequestId eq '"+requestId+"'");
//      var url =  "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Gemail?$filter=RequestId eq '"+requestId+"'";
    var result = "";

    $.ajax({
            url: url,
         dataType: 'json',
            async: false,
            type: "GET",
            cache: false,
            success: function(oResponse, textStatus, jqXHR) {
              result = oResponse;
                   },
                   error: function(jqXHR, textStatus, errorThrown){
                          
                          if(textStatus==="timeout") {

                       	   sap.m.MessageBox.show(
                                "Connection timed out", {
                             	        icon: sap.m.MessageBox.Icon.ERROR,
                             	        title: "Error",
                             	        actions: [sap.m.MessageBox.Action.OK],
//                             	        styleClass: bCompact ? "sapUiSizeCompact" : ""
                             	      }
                             	    );
//                                 sap.ui.commons.MessageBox.alert("Connection timed out: too much data to retrieve. Please select a shorter period of time.", null, "Error");                              
                          } else {

                               sap.m.MessageBox.show(
                               "The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, {
                                        icon: sap.m.MessageBox.Icon.ERROR,
                                        title: "Error",
                                        actions: [sap.m.MessageBox.Action.OK],
//                                        styleClass: bCompact ? "sapUiSizeCompact" : ""
                                      }
                                    );
                                 jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText);
//                                 sap.ui.commons.MessageBox.alert("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, null, "Error");
                          };
                   },
            
            });

    var members ="";
    var senders ="";
    var persons = result.d.results;

    for(var i in persons){
      if(persons[i].Grpmember!=""){
        members = members + persons[i].Grpmember+";";
      }
      if(persons[i].Authsender!=""){
        senders = senders + persons[i].Authsender+";";
      }
    }
    if(senders==""){
      sap.ui.getCore().byId("authSenders").setText("No restriction");
    }else{
      sap.ui.getCore().byId("authSenders").setText(senders);
    }
    sap.ui.getCore().byId("grpMembers").setText(members);



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
  getUrl : function(sUrl) {
    if (sUrl == "") {
      return sUrl;
    }
    if (window.location.hostname == "localhost") {
      return "https://sthcigwdq1.kaust.edu.sa:8006" + sUrl;
    } else {
      return sUrl;
    }
  },
  cancelRq : function() {
    var helpModel = this.getView().getModel("helpModel");
    var helpItems = helpModel.getProperty("/helpItems");
    var serviceName = helpItems.serviceOpened;
    var oModel = "";
    var msg = "";
    switch (serviceName) {
    case 'Audio Visual Services':
      oModel = sap.ui.getCore().byId("Detail").getModel("confRoomModel");
      var startDate = new Date(oModel.oData.Ldate).getTime();
      var today = new Date().getTime();
      if ((today + 24 * 60 * 60 * 1000) > startDate) {
        sap.m.MessageBox.show("The request could not be cancelled less than 24h before the meeting date ", {
          icon : sap.m.MessageBox.Icon.WARNING,
          title : "Warning",
          actions : [ sap.m.MessageBox.Action.OK ],
        });
        return;
      }
      msg = "By cancelling room booking, you are also cancelling all assosiated Audio and Visual services. Are you sure you want to cancel your room booking?";
      break;
    case 'Loan Equipment':
      oModel = sap.ui.getCore().byId("Detail").getModel("confRoomModel");
      msg = "Are you sure you want to cancel your Loan Equipment request?";
      break;
    }
    if (oModel.oData.Status == "013" || oModel.oData.Status == "015" || oModel.oData.Status == "011" || oModel.oData.Status == "016" || oModel.oData.Status == "018") {
      sap.m.MessageBox.show("The request is already Resolved, no cancellation more possible", {
        icon : sap.m.MessageBox.Icon.WARNING,
        title : "Warning",
        actions : [ sap.m.MessageBox.Action.OK ],
      });
    } else {
      sap.m.MessageBox.show(msg, sap.m.MessageBox.Icon.QUESTION, "Confirmation", [ sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ], function(oAction) {
        if (sap.m.MessageBox.Action.OK === oAction) {
        	var oModel = sap.ui.getCore().byId("Detail").getModel("confRoomModel");
        	var oAVData = oModel.getProperty("/");
        	var token = sap.ui.getCore().byId("app").getController().getGateWayToken();
        	var url = helpModel.getProperty("/url");
        	var requestId = helpItems.requestId;
        	if(url.indexOf("Vsm")!=-1) {
        		url="/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Vsm(RequestId='" + requestId + "',KaustId='',ConfRoom='')";
        	}
        	var serviceCode = helpItems.serviceCode;
        	var subServiceCode = helpItems.subServiceCode;
        	var data = new Object();
        	data["Status"] = "015";
        	data["RequestId"] = requestId;
        	data["ServiceCode"] = serviceCode;
        	data["SubServiceCode"] = subServiceCode;
        	data["Wftrigger"] = "X";
        	data["Servicecall"] = "X";
        	data["Adapter"] = oAVData.Adapter;
        	data["Adevent"] = oAVData.Adevent;
        	data["Agree"] = oAVData.Agree;
        	data["Attendees"] = oAVData.Attendees;
        	data["Avsupport"] = oAVData.Avsupport;
        	data["Bldglevel"] = oAVData.Bldglevel;
        	data["Bldgname"] = oAVData.Bldgname;
        	data["Cemail"] = oAVData.Cemail;
        	data["Clicker"] = oAVData.Clicker;
        	data["ConfRoom"] = oAVData.ConfRoom;
        	data["Confrecord"] = oAVData.Confrecord;
        	data["Contact"] = oAVData.Contact;
        	data["Costcenter"] = oAVData.Costcenter;
        	data["Daily"] = oAVData.Daily;
        	data["Department"] = oAVData.Department;
        	data["Deptname"] = oAVData.Deptname;
        	data["Email"] = oAVData.Email;
        	data["Endtime"] = oAVData.Endtime;
        	data["EventLocation"] = oAVData.EventLocation;
        	data["Eventname"] = oAVData.Eventname;
        	data["Externalmail"] = oAVData.Externalmail;
        	data["FirstName"] = oAVData.FirstName;
        	data["Flipchart"] = oAVData.Flipchart;
        	data["Foodservices"] = oAVData.Foodservices;
        	data["Friday"] = oAVData.Friday;
        	data["HostUserName"] = oAVData.HostUserName;
        	data["Hostuserid"] = oAVData.Hostuserid;
        	data["Ipaddress"] = oAVData.Ipaddress;
        	data["Ishost"] = oAVData.Ishost;
        	data["Itmsequence"] = oAVData.Itmsequence;
        	data["KaustId"] = oAVData.KaustId;
        	data["Laptop"] = oAVData.Laptop;
        	data["LastName"] = oAVData.LastName;
        	data["Layout"] = oAVData.Layout;
        	data["Ldate"] = oAVData.Ldate;
        	data["Mcomments"] = oAVData.Mcomments;
        	data["MiddleName"] = oAVData.MiddleName;
        	data["Mobile"] = oAVData.Mobile;
        	data["Monday"] = oAVData.Monday;
        	data["Monitor"] = oAVData.Monitor;
        	data["Monthly"] = oAVData.Monthly;
        	data["Mphone"] = oAVData.Mphone;
        	data["Office"] = oAVData.Office;
        	data["Onbehalf"] = oAVData.Onbehalf;
        	data["Others"] = oAVData.Others;
        	data["Positiontext"] = oAVData.Positiontext;
        	data["Presentation"] = oAVData.Presentation;
        	data["Presenter"] = oAVData.Presenter;
        	data["Private"] = oAVData.Private;
        	data["ProcessId"] = oAVData.ProcessId;
        	data["Projector"] = oAVData.Projector;
        	data["Protocol"] = oAVData.Protocol;
        	data["Public"] = oAVData.Public;
        	data["RManager"] = oAVData.RManager;
        	data["Rdevent"] = oAVData.Rdevent;
        	data["Recording"] = oAVData.Recording;
        	data["Renddate"] = oAVData.Renddate;
        	data["Rstartdate"] = oAVData.Rstartdate;
        	data["Saturday"] = oAVData.Saturday;
        	data["Speakers"] = oAVData.Speakers;
        	data["Stage"] = oAVData.Stage;
        	data["Starttime"] = oAVData.Starttime;
        	data["Sunday"] = oAVData.Sunday;
        	data["Thursday"] = oAVData.Thursday;
        	data["Title"] = oAVData.Title;
        	data["Tuesday"] = oAVData.Tuesday;
        	data["UserId"] = oAVData.UserId;
        	data["Videowebconf"] = oAVData.Videowebconf;
        	data["Wboard"] = oAVData.Wboard;
        	data["Webex"] = oAVData.Webex;
        	data["Wednesday"] = oAVData.Wednesday;
        	data["Weekly"] = oAVData.Weekly;
        	data["activityType"] = oAVData.activityType;
        	data["country"] = oAVData.country;
        	data["flow"] = oAVData.flow;
        	data["requestType"] = oAVData.requestType;
        	data["roomno"] = oAVData.roomno;
        	data["lastTaskStatus"] = oAVData.lastTaskStatus;
        	data["onBehalfUserId"] = oAVData.onBehalfUserId;
          
          var jsonData = JSON.stringify(data);
          $.ajax({
            url : url,
            dataType : 'json',
            contentType : "application/json",
            async : false,
            data : jsonData,
            type : "PUT",
            beforeSend : function(xhr) {
              xhr.setRequestHeader("X-CSRF-Token", token);
            },
            success : function(oResponse, textStatus, jqXHR) {
              sap.m.MessageBox.show("Your Request '" + requestId + "' has been cancelled.", {
                icon : sap.m.MessageBox.Icon.SUCCESS,
                title : "Success",
                actions : [ sap.m.MessageBox.Action.OK ],
              });
              sap.ui.getCore().byId("cancelRq").setEnabled(false);

            },
            error : function(jqXHR, textStatus, errorThrown) {

              if (textStatus === "timeout") {
                sap.m.MessageBox.show("Connection timed out", {
                  icon : sap.m.MessageBox.Icon.ERROR,
                  title : "Error",
                  actions : [ sap.m.MessageBox.Action.OK ],
                // styleClass: bCompact ? "sapUiSizeCompact" : ""
                });
                // sap.ui.commons.MessageBox.alert("Connection timed out: too much data to retrieve. Please select a shorter period of time.", null, "Error");
              } else {
                sap.m.MessageBox.show("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText, {
                  icon : sap.m.MessageBox.Icon.ERROR,
                  title : "Error",
                  actions : [ sap.m.MessageBox.Action.OK ],
                // styleClass: bCompact ? "sapUiSizeCompact" : ""
                });
                jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText + "," + jqXHR.status + "," + jqXHR.statusText);
              }
              ;
            },
            complete : function() {
            }
          });
        }
      });
    }
  },

  submitRq : function() {
    var helpModel = this.getView().getModel("helpModel");
    var helpItems = helpModel.getProperty("/helpItems");
    var serviceName = helpItems.serviceOpened;
    var oModel = "";
    var msg = "Are you sure you want to submit request";
    var that=this;
    sap.m.MessageBox.show(msg, sap.m.MessageBox.Icon.QUESTION, "Confirmation", [ sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ], function(oAction) {
        if (sap.m.MessageBox.Action.OK === oAction) {
          var token = sap.ui.getCore().byId("app").getController().getGateWayToken();
          var url = helpModel.getProperty("/url");
          var requestId = helpItems.requestId;
          var serviceCode = helpItems.serviceCode;
          var subServiceCode = helpItems.subServiceCode;
          /*var data = new Object();
          data["Status"] = "005";
          data["RequestId"] = requestId;
          data["ServiceCode"] = serviceCode;
          data["SubServiceCode"] = subServiceCode;
          var comment = sap.ui.getCore().byId("commentText");
          data["Comments"] = comment.getValue();*/
          //data["Wftrigger"] = "X";
          //data["Servicecall"] = "X";
          //var jsonData = JSON.stringify(data);

          var oModelGasc = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));  // Darshna - this.getUrl added
          oEntryData = {};
          oEntry=[];
          reqData = sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel").getData()[0];
          oEntryData = that.assignData(reqData);
          oEntryData.ReqComment = sap.ui.getCore().byId("commentText").getValue();

          if(oEntryData.SubServiceCode == '0202' && oEntryData.Status == '006'){
            var requestId= oEntryData.RequestId;
            var utext = "UserDependents(UserId='" + oEntryData.UserId + "',RequestId='" + oEntryData.RequestId + "',KaustId='" + oEntryData.KaustId + "')";
            oModelGasc.update(utext, oEntryData, null, function(response) {
              sap.m.MessageBox.show("Your Request '" + requestId + "' has been submitted.", {
                icon : sap.m.MessageBox.Icon.SUCCESS,
                title : "Success",
                actions : [ sap.m.MessageBox.Action.OK ],
              });
              sap.ui.getCore().byId("submitRq").setEnabled(false);
              sap.ui.getCore().byId("commentText").setEditable(false);

            }, function(error) {
              var errorMsg =jQuery(error.response.body).find('message').text().replace("RFC Error:","");
              if(errorMsg){
                sap.m.MessageBox.alert(errorMsg, {
                  title : "Error",
                  icon : sap.m.MessageBox.Icon.ERROR
                });
              }else{
                alert(error.response.body);
              }
              return;
            });
          }else{
            oEntry.push(oModelGasc.createBatchOperation("UserDependents", "POST", oEntryData));

            var requestId= oEntryData.RequestId;
            oModelGasc.addBatchChangeOperations(oEntry);
            oModelGasc.setUseBatch(true);
            oModelGasc.submitBatch(function(data,response) {
              sap.m.MessageBox.show("Your Request '" + requestId + "' has been submitted.", {
                icon : sap.m.MessageBox.Icon.SUCCESS,
                title : "Success",
                actions : [ sap.m.MessageBox.Action.OK ],
              });
              sap.ui.getCore().byId("submitRq").setEnabled(false);
              sap.ui.getCore().byId("commentText").setEditable(false);
            },function(oError){
              sap.m.MessageBox.show("The following problem occurred: " + oError.responseText, {
                icon : sap.m.MessageBox.Icon.ERROR,
                title : "Error",
                actions : [ sap.m.MessageBox.Action.OK ],
              // styleClass: bCompact ? "sapUiSizeCompact" : ""
              });
            });
          }


//          $.ajax({
//            url : url,
//            dataType : 'json',
//            contentType : "application/json",
//            async : false,
//            data : jsonData,
//            type : "PUT",
//            beforeSend : function(xhr) {
//              xhr.setRequestHeader("X-CSRF-Token", token);
//            },
//            success : function(oResponse, textStatus, jqXHR) {
//              sap.m.MessageBox.show("Your Request '" + requestId + "' has been submitted.", {
//                icon : sap.m.MessageBox.Icon.SUCCESS,
//                title : "Success",
//                actions : [ sap.m.MessageBox.Action.OK ],
//              });
//              sap.ui.getCore().byId("submitRq").setEnabled(false);
//
//            },
//            error : function(jqXHR, textStatus, errorThrown) {
//
//              if (textStatus === "timeout") {
//                sap.m.MessageBox.show("Connection timed out", {
//                  icon : sap.m.MessageBox.Icon.ERROR,
//                  title : "Error",
//                  actions : [ sap.m.MessageBox.Action.OK ],
//                // styleClass: bCompact ? "sapUiSizeCompact" : ""
//                });
//                // sap.ui.commons.MessageBox.alert("Connection timed out: too much data to retrieve. Please select a shorter period of time.", null, "Error");
//              } else {
//                sap.m.MessageBox.show("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText, {
//                  icon : sap.m.MessageBox.Icon.ERROR,
//                  title : "Error",
//                  actions : [ sap.m.MessageBox.Action.OK ],
//                // styleClass: bCompact ? "sapUiSizeCompact" : ""
//                });
//                jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText + "," + jqXHR.status + "," + jqXHR.statusText);
//              }
//              ;
//            },
//            complete : function() {
//            }
//          });
        }
      });
  },

  assignData: function(reqdata){
    var requestorDetails = reqdata;

    oEntryData = {};
    oEntryData.KaustId = reqdata.KaustId;
    oEntryData.UserId = requestorDetails.UserId;
    oEntryData.RequestId = reqdata.RequestId;
    oEntryData.Categorytype = reqdata.Categorytype;
    oEntryData.RequestorKaustID = reqdata.KaustID;
    oEntryData.Cendda = this.setdateToJson(this.getDateFromJson( reqdata.Cendda));
    oEntryData.SubServiceCode = reqdata.SubServiceCode;
    oEntryData.ServiceCode = reqdata.ServiceCode;
    oEntryData.Status = "006";
    oEntryData.ProcessId = reqdata.ProcessId;
    oEntryData.Stage = reqdata.Stage;
    oEntryData.ExpDate = this.setdateToJson(this.getDateFromJson( reqdata.ExpDate));
    oEntryData.Comments = reqdata.Comments;
    oEntryData.GAComments = reqdata.GAComments;
    oEntryData.FinComments = reqdata.FinComments;

    oEntryData.Currency = reqdata.Currency;
    oEntryData.age = reqdata.age;
    oEntryData.ArabicFirstName = reqdata.ArabicFirstName;
    oEntryData.ArabicLastName = reqdata.ArabicLastName;
    oEntryData.ArabicMiddleName = reqdata.ArabicMiddleName;
    oEntryData.BorderNumber = reqdata.BorderNumber;

    oEntryData.IqamaNo = reqdata.IqamaNo;
    oEntryData.Fname = reqdata.Fname;
    oEntryData.Mname = reqdata.Mname;
    oEntryData.Lname = reqdata.Lname;
    oEntryData.SaudiNo = reqdata.SaudiNo;
    oEntryData.Iqmarenew = reqdata.Iqmarenew;
    oEntryData.IqamaEdate = reqdata.IqamaEdate;//"2014-08-38T00:00:00";//reqdata.IqamaEdate;
    oEntryData.Costcenter = reqdata.Costcenter;
    oEntryData.HIqamaEdate = reqdata.HIqamaEdate;
    oEntryData.PassEdate = this.setdateToJson(this.getDateFromJson(  reqdata.PassEdate));
    oEntryData.SequenceNumber = "0000000001";

    oEntryData.TimeStamp = this.setdateToJson(this.getDateFromJson( reqdata.TimeStamp));
    oEntryData.Expeditor = reqdata.Expeditor;
    oEntryData.Nationality = reqdata.Nationality;
    oEntryData.Passport = reqdata.Passport;
    oEntryData.Gender = reqdata.Gender;
    oEntryData.Relationship = reqdata.Relationship;
    oEntryData.Dob =  this.setdateToJson(this.getDateFromJson(reqdata.Dob));

    oEntryData.FileName = reqdata.FileName;
    oEntryData.Url = reqdata.Url;
    oEntryData.Onbehalf = reqdata.Onbehalf;//submitted by Requestor
    oEntryData.MsgTyp1 = reqdata.MsgTyp1;
    oEntryData.Msg1 = reqdata.Msg1;
    oEntryData.MsgTyp2 = reqdata.MsgTyp2;
    oEntryData.Msg2 = reqdata.Msg2;
    oEntryData.MsgTyp3 = reqdata.MsgTyp3;
    oEntryData.Msg3 = reqdata.Msg3;
    oEntryData.MsgTyp4 = reqdata.MsgTyp4;
    oEntryData.Msg4 = reqdata.Msg4;
    oEntryData.MsgTyp5 = reqdata.MsgTyp5;
    oEntryData.Msg5 = reqdata.Msg5;

    oEntryData.DependantOnly=reqdata.DependantOnly;
    return oEntryData;

  },
  getDateFromJson:function(jsonDate){
    if ( jsonDate == null ||jsonDate.trim()=="" || jsonDate == "0000-00-00" )
      {
        return null;
      }
    if(jsonDate.match(/\/Date\((.*?)\)\//gi))
      {
        return new Date(parseInt(jsonDate.substr(6)));
      }

    return jsonDate;
  },

  setdateToJson :function(dateValue) {
    if (dateValue == null|| dateValue == ""){
        return null;
      }
    if (dateValue instanceof Date){
      dateValue = dateValue.toJSON();
    }

    if(dateValue.indexOf('.') != -1){
      dateValue =  dateValue.split('.')[0];
    }

    return dateValue;
  },

  getGateWayToken : function() {
    var metadataEmail = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/AccessRequest(RequestId='',KaustId='')");
    var token = null;
    $.ajax({
      url : metadataEmail,
      type : "GET",
      dataType : 'json',
      contentType : "application/json",
      Accept : "application/json",
      async : false,
      headers : {
        "X-Requested-With" : "XMLHttpRequest",
        "Content-Type" : "application/atom+xml",
        "DataServiceVersion" : "2.0",
        "X-CSRF-Token" : "Fetch",
      },
      success : function(data, textStatus, XMLHttpRequest) {
        dataModel = data;
        token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
      },
      error : function(data, textStatus, XMLHttpRequest) {
        alert("Error message");
      }

    });
    return token;
  },
  back : function(pageId) {
    this.getView().app.backToPage(pageId);
  },

  /**
   * Darshna - Editing Starts
   * 
   * Methods related to my preference tab 
  */
  loadPreferenceData: function(KaustId, SubServiceCode){
    var oPreferenceModel=this.getView().getModel("oPreferenceModel");
    var preferenceModel=new sap.ui.model.json.JSONModel();
    this.getView().setModel(preferenceModel,"preferenceModel");
    var that = this;
    oPreferenceModel.read("/MyPreferencesCollection(KaustID='"+KaustId+"',SubServiceCode='"+SubServiceCode+"')",{
        success: function(oData){
          that.getView().getModel("preferenceModel").setData(oData);
          if(oData && oData.KaustID != "" && oData.SubServiceCode != ""){
          }
        },
        error: function(oError){

        }});
  },
  /** Darshna - Editing ends*/
  /**Pavithra -Data center*/
  getDataCenterDetails:function(requestId,detailsFragment)
  {
	  var oDataModel = new sap.ui.model.json.JSONModel();
	  
	  var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/DataCenterSet?$filter=RequestId eq '"+requestId+"'&$expand=DCToTemplate&$format=json");
		oDataModel.loadData(url, null, false);
		var data = oDataModel.getData().d.results[0];
		this.getView().setModel(oDataModel,"dataCenter");
		this.setDataCenterDetails(data,detailsFragment);
		
  },
  setDataCenterDetails:function(data)
  {
	  var reqData={};
		var justificationModel = new sap.ui.model.json.JSONModel();
		justificationModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/userJustRequestStatusSet?$filter=userId eq '"+data.userId+"'", null,false);
		if(justificationModel.getData().d.results.length>0)
		{
		 if(justificationModel.getData().d.results[0].approverStatus == 1 || data.stage == "Requester")
			{//pending for approval need to show the justification UI
			 reqData.justfVisibility = true;
			 reqData.otherVisibility = false;
			 reqData.justification = data.justification;
			}
		 else if(justificationModel.getData().d.results[0].approverStatus == 2)
			 {
			 // Approved need to show the Data center UI
			 reqData.justfVisibility = false;
			 reqData.otherVisibility = true;
			 }
		}
		else
			{
			reqData.justfVisibility = true;
			 reqData.otherVisibility = false;
			 reqData.justification = data.justification;
			}
	  reqData.enableField = false;
	  if(reqData.otherVisibility)
		  {
		if(data.DCToTemplate.results.length>0)
			{
			for(var i=0 ; i<data.DCToTemplate.results.length ; i++)
			{
			if(data.DCToTemplate.results[i].templateField.toUpperCase() == "IT-Data Center team".toUpperCase())
				reqData.itDataCenter = true;
			if(data.DCToTemplate.results[i].templateField.toUpperCase() == "IT-Exchange Building".toUpperCase())
				reqData.itExchangeBuild = true;
			if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-High Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.toUpperCase() == "Building-14 templates".toUpperCase())
				reqData.itBuldingHigh =true;
			if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Low Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.toUpperCase() == "Building-14 templates".toUpperCase())
				reqData.itBuldingLow = true;
			if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Medium Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.toUpperCase() == "Building-14 templates".toUpperCase())
				reqData.itBuldingMedium = true;
			if( data.DCToTemplate.results[i].templateField.toUpperCase().match("IT Test Room".toUpperCase()))
				reqData.itBuildingTest = true;
			if( data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-IN-Camps Maintenance".toUpperCase()))
				reqData.itInCmps=true;
			if( data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-OUT-Camps Maintenance".toUpperCase()))
				reqData.itOutCmps=true;
			if( data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-High Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.toUpperCase() == "Building 1 templates".toUpperCase())
				reqData.itBuildingTempHighDesity = true;
			if( data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Low Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.toUpperCase() == "Building 1 templates".toUpperCase())
				reqData.itBuildingTempLowDensity = true;
			if( data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Medium Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.toUpperCase() == "Building 1 templates".toUpperCase())
				reqData.itBuildingTempMedium = true;
			if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Stock Room".toUpperCase()))
				reqData.itBuildingTempItStock = true;
			if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-MTER-1".toUpperCase()))
				reqData.itBuildingTempItMeter = true;
			if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-MTER-2".toUpperCase()))
				reqData.itBuidingTempItMeter2 = true;
			if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Security Room".toUpperCase()))
				reqData.itSecurityRoom = true;
			if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Front and Back Stairs-BDC".toUpperCase()))
				reqData.otherTempItFront = true;
			if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Spine Access-BDC".toUpperCase()))
				reqData.otherTempItSpain = true;
			if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Spine Access-SCC".toUpperCase()))
				reqData.otherTempItSpainscc = true;
}
		if(data.attachment)
			reqData.fileLink=data.attachment;
		reqData.reqDate = new Date(parseInt(data.requestDate.split("(")[1].split(")")[0])).toISOString().split("T")[0];
		if(data.accessType == "X")
			sap.ui.getCore().byId("dataCenter_escorted").setSelected(true);
		else 
			sap.ui.getCore().byId("dataCenter_unEscorted").setSelected(true);
		var userData = {
				d:
				{
					results:
						[
			{
				FirstName:data.FirstName,
				LastName:data.LastName,
				KaustID : data.kaustId,
				Email: data.Email,
				Position:data.Position,
				Deptname:data.Deptname,
				Office:data.Office,
				Mobile:data.Mobile,
				
				
			}
		]}};
		var oUserModel =  new sap.ui.model.json.JSONModel();
		oUserModel.setData(userData);
//		this.getView().byId('userInfoTab').setModel(oUserModel);
////		userData.=data.FirstName;
//		this.getView().byId("Aggreement1").setVisible(false);
//		this.getView().byId("AggreeCheck").setVisible(false);
//		this.getView().byId("AggreeLink").setVisible(false);
		var requestModel =  new sap.ui.model.json.JSONModel();
		var url ="/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileRead?$filter=UNIQUE_ID eq '" + data.RequestId + "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '3'";
		var oFileModel = new sap.ui.model.json.JSONModel();
		oFileModel.loadData(url, null, false);
		if(oFileModel.getData().d.results[0].URL != ""){
			sap.ui.getCore().byId('fileUrl').setHref(oFileModel.getData().d.results[0].URL);
		}
		
		requestModel.setData(reqData);
this.getView().setModel(requestModel, "dataRequestData");	
		
	}
		else
			{
			var requestModel =  new sap.ui.model.json.JSONModel();
			requestModel.setData({});
			this.getView().setModel(requestModel, "dataRequestData");
			}
		  }

else
	  {
	var requestModel =  new sap.ui.model.json.JSONModel();
		requestModel.setData(reqData);
		this.getView().setModel(requestModel, "dataRequestData");
	  }
},
  /** Pavithra - Editing Done*/
  
  /** Edited for GASC Modules - Darshna*/
  /** GASC Processes*/
  getNewsPaperDetails : function(sRequestId,oSubCode) {
	  var that = this;
	  var specificUrl;
	  sap.ui.getCore().byId("CarLicenseIssue").setVisible(false);
	  sap.ui.getCore().byId("MotorcycleLicenseIssue").setVisible(false);
	  sap.ui.getCore().byId("DivingLicenseRenew").setVisible(false);
	  sap.ui.getCore().byId("Sponsortransfer").setVisible(false);
	  sap.ui.getCore().byId("policeClearance").setVisible(false);
	  var oNewsPaperModel = new sap.ui.model.json.JSONModel();
	  var oGAComments = new sap.ui.model.json.JSONModel();
	  sap.ui.getCore().byId("Detail").setModel(oNewsPaperModel, "oNewsPaperModel");
	  if((oSubCode === "0036")  || (oSubCode === "0207") || (oSubCode === "1701") || (oSubCode === "1702") || (oSubCode === "1704") || (oSubCode === "1705")  || (oSubCode === "0204")   || (oSubCode === "0205")|| (oSubCode === "0503"))
		  specificUrl = "HeaderToGUD";
//	  Dikhu edit starts
	  else if(oSubCode === "0504" || oSubCode === "0501" || oSubCode === "1706" || oSubCode === "1707" || oSubCode === "0502" || oSubCode === "0505")
		  specificUrl = "HeaderToDL";
//	  Dikhu edit ends
	  // navin editing starts
	  else if(oSubCode === "0104")
		  specificUrl = "HeaderToFPC";
	  else if(oSubCode === "1700")
		  specificUrl = "HeaderToPet";
	  else if(oSubCode === "0206")
		  specificUrl = "HeaderToDHS";	
	  else if(oSubCode === "0105")
		  specificUrl = "HeaderToTAX";	
	  // navin editing ends
	  else if(oSubCode === "0302" || oSubCode === "0303")
		  specificUrl = "HeaderToBC";
	  else if(oSubCode === "1703")
		  specificUrl = "HeaderToMadaEn";
	  else if(oSubCode === "0507" || oSubCode === "0506")
		  specificUrl = "HeaderToOwnChg";
	  else if(oSubCode === "0402")
		  specificUrl = "HeaderToIc";
	  else if (oSubCode === "0304")
		  specificUrl = "HeaderToFamilyCard";
	  var sUrl = "GASC_HeaderSet?$filter=Request_ID eq '" + sRequestId + "'&$expand=" + specificUrl + ",HeaderToComm";
	  var oNewsPaperOdataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
	  oNewsPaperOdataModel.read(sUrl,null,null,false, 
			  function(oData) {
		  if ((oSubCode === "0036") || (oSubCode === "0207") || (oSubCode === "1701") || (oSubCode === "1702") || (oSubCode === "1704") || (oSubCode === "1705") || (oSubCode === "0503")  || (oSubCode === "0204")  || (oSubCode === "0205") ) {
			  oNewsPaperModel.setProperty("/", oData.results[0].HeaderToGUD.results);
			  sap.ui.getCore().byId("idTable").setMode("None");
//			  Dikhu edit starts
		  } else if (oSubCode === "0504") {
			  oNewsPaperModel.setProperty("/", oData.results[0].HeaderToDL.results);
			  sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("CarLicenseIssue").setVisible(true);
			  sap.ui.getCore().byId("CarLicenseIssue").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
			  var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
			  sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
			  sap.ui.getCore().byId("CarLicenseIssue").setBindingContext(firstItem.getBindingContext());
		  } else if (oSubCode === "0501") {
			  oNewsPaperModel.setProperty("/", oData.results[0].HeaderToDL.results);
			  sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("MotorcycleLicenseIssue").setVisible(true);
			  sap.ui.getCore().byId("MotorcycleLicenseIssue").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
			  var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
			  sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
			  sap.ui.getCore().byId("MotorcycleLicenseIssue").setBindingContext(firstItem.getBindingContext());
		  } else if ((oSubCode === "1707") || (oSubCode === "0502") || (oSubCode === "0505")) {
			  oNewsPaperModel.setProperty("/", oData.results[0].HeaderToDL.results);
			  sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("idTable").setMode("None");
		  } else if (oSubCode === "1706") {
			  oNewsPaperModel.setProperty("/", oData.results[0].HeaderToDL.results);
			  sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("DivingLicenseRenew").setVisible(true);
			  sap.ui.getCore().byId("DivingLicenseRenew").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
			  var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
			  sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
			  sap.ui.getCore().byId("DivingLicenseRenew").setBindingContext(firstItem.getBindingContext());
		  }
//		  		Dikhu edit ends
		  else if (oSubCode === "0206") {
			  oNewsPaperModel.setProperty("/", oData.results[0].HeaderToDHS.results);
			  sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("Sponsortransfer").setVisible(true);
			  sap.ui.getCore().byId("Sponsortransfer").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
			  var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
			  sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
			  sap.ui.getCore().byId("Sponsortransfer").setBindingContext(firstItem.getBindingContext());
			  
		  } else if (oSubCode === "0104") {
				  oNewsPaperModel.setProperty("/", oData.results[0].HeaderToFPC.results);
				  sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
				  sap.ui.getCore().byId("policeClearance").setVisible(true);
				  sap.ui.getCore().byId("policeClearance").setModel(oNewsPaperModel);
				  sap.ui.getCore().byId("idTable").setMode("None");
				  var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
				  sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
				  sap.ui.getCore().byId("policeClearance").setBindingContext(firstItem.getBindingContext());
		  }	else if (oSubCode === "0105") {
			  oNewsPaperModel.setProperty("/", oData.results[0].HeaderToTAX.results);
			  sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("zakatLetter").setVisible(true);
			  sap.ui.getCore().byId("zakatLetter").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
			  var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
			  sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
			  sap.ui.getCore().byId("zakatLetter").setBindingContext(firstItem.getBindingContext());
		  }	else if (oSubCode === "0302") {
			  oNewsPaperModel.setProperty("/", oData.results[0].HeaderToBC.results);
			  sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("idBirthCertificateDetails").setVisible(true);
			  sap.ui.getCore().byId("idBirthCertificateDetails").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
			  var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
			  sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
			  sap.ui.getCore().byId("idBirthCertificateDetails").setBindingContext(firstItem.getBindingContext());
		  } else if (oSubCode === "1703") {
			  oNewsPaperModel.setProperty("/", oData.results[0].HeaderToMadaEn.results);
			  sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("idTable").setMode("None");
			  sap.ui.getCore().byId("idMandanSalehForm").setVisible(true);
			  sap.ui.getCore().byId("idMandanSalehForm").setModel(oNewsPaperModel);
		  } else if (oSubCode === "0507") {
			  oNewsPaperModel.setProperty("/", oData.results[0].HeaderToOwnChg.results);
			  sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("idCarOwnershipTransfer").setVisible(true);
			  sap.ui.getCore().byId("idCarOwnershipTransfer").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
			  var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
			  sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
			  sap.ui.getCore().byId("idCarOwnershipTransfer").setBindingContext(firstItem.getBindingContext());
		  } else if (oSubCode === "0402") {
			  oNewsPaperModel.setProperty("/", oData.results[0].HeaderToIc.results);
			  sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("idInfoCorrect").setVisible(true);
			  sap.ui.getCore().byId("idInfoCorrect").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
			  var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
			  sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
			  sap.ui.getCore().byId("idInfoCorrect").setBindingContext(firstItem.getBindingContext());
		  } else if (oSubCode === "0506") {
			  oNewsPaperModel.setProperty("/", oData.results[0].HeaderToOwnChg.results);
			  sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("idCarPlateChange").setVisible(true);
			  sap.ui.getCore().byId("idCarPlateChange").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
			  var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
			  sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
			  sap.ui.getCore().byId("idCarPlateChange").setBindingContext(firstItem.getBindingContext());
		  } else if (oSubCode === "0304") {
			  oNewsPaperModel.setProperty("/", oData.results[0].HeaderToFamilyCard.results);
			  sap.ui.getCore().byId("idTable").setMode("None"); 
		  } else if (oSubCode === "1700") {
			  oNewsPaperModel.setProperty("/", oData.results[0].HeaderToPet.results);
			  sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("PetsImportExport").setVisible(true);
			  sap.ui.getCore().byId("PetsImportExport").setModel(oNewsPaperModel);
			  sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
			  var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
			  sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
			  sap.ui.getCore().byId("PetsImportExport").setBindingContext(firstItem.getBindingContext());
		  }
		  
		  // Comments 
		  oGAComments.setData(oData.results[0].HeaderToComm.results);
		  that.getView().setModel(oGAComments, "GAComments");
		  /*oNewsPaperModel.setProperty("/GAComments", oData.results[0].Gasc_Agent_Comments);
		  oNewsPaperModel.setProperty("/FinComments", oData.results[0].Fin_Comments);
		  oNewsPaperModel.setProperty("/ReqComments", oData.results[0].Req_Comment);*/
	  }, function(oError) {
		  jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
	  });
  }
});