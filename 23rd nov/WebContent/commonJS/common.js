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

//var urlKaustUser = "https://sthcigwdq1.kaust.edu.sa:8006/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/";
//var urlInc = "https://sthcigwdq1.kaust.edu.sa:8006/sap/opu/odata/sap/ZGW_BPM_RFS_SERVICES_SRV/";

var dirName;

function callCloseDialog(){
	parent.pleaseCloseMe();
}

function pleaseCloseMe(){
	//$('.close').click();
	$('.model').model('hide').data('bs.model',null);
	//location.reload();
}
