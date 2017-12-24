var getValFromQueryString=function(key) {
	var value = "";
	var re = new RegExp('(?:\\?|&)' + key + '=(.*?)(?=&|$)', 'gi');
	var r = [], m;
	
	while ((m = re.exec(document.location.search)) != null)
		r.push(m[1]);

	if (r.length != 0) {
		if (nullCheckValue(r[0])) {
			value = r[0].toString();
		}
	}
	return value;
};

var nullCheckValue = function(value) {
	if ((value != null) && (typeof (value != 'undefined')) && (value !== '')) {
		return true;
	}
	return false;
};
var loggedinUserModel = new sap.ui.model.json.JSONModel();
var gwLoginUserModel = new sap.ui.model.json.JSONModel();
var userTypeModel = new sap.ui.model.json.JSONModel();
//var labValue ="";
//var url= "sthcigwdq1.kaust.edu.sa:8006";
var urlKaustCountry = "";
var urlKaustUser ="/utilweb/GWProxyServlet?sap/opu/odata/sap/ZHRTRS0001TSR_GASC/";
var urlInc ="/utilweb/GWProxyServlet?sap/opu/odata/sap/ZGW_BPM_RFS_SERVICES_SRV/";
var urlCont="/utilweb/GWProxyServlet?sap/opu/odata/sap/ZCUSRVTS0001_COUNTRY_LIST/";

//var urlKaustUser = "https://sthcigwdq1.kaust.edu.sa:8006/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/";
//var urlInc = "https://sthcigwdq1.kaust.edu.sa:8006/sap/opu/odata/sap/ZGW_BPM_RFS_SERVICES_SRV/";

var dirName;
var taskIdCommJs;

function callCloseDialog(){
	parent.pleaseCloseMe();
}

function pleaseCloseMe(){
	//$('.close').click();
	$('.model').model('hide').data('bs.model',null);
	//location.reload();
}

function getFormattedDate(date) {
	 var year = date.getFullYear();
	 var month = (1 + date.getMonth()).toString();
	 month = month.length > 1 ? month : '0' + month;
	 var day = date.getDate().toString();
	 day = day.length > 1 ? day : '0' + day;
	 return day + '/' + month + '/' + year;
	}


/** 
* Edited by Darshna on 07/07/2017 - Method to trim white spaces at the start and end 
* of the string For all input fields 
*/ 
var getTrimUiInputVal = function(evt) { 
    if ((evt != null) && (typeof (evt != 'undefined')) && (evt !== '')) { 
    	// Adding a polyfill for trim method as the method is not supported in IE8 or below
    	if(!String.prototype.trim) {
    		String.prototype.trim = function() {
    			return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    		}
    	}
        evt.getSource().setValue(evt.getSource().getValue().trim()); 
    } 
}; 