function PostData(url,qObj){
	 var dataObject=[];
     $("#imagepage").hide();

	 $.ajax({
        url : url,
        type : "POST",
        async : false,
        dataType : 'json',
        data: JSON.stringify(qObj),
        contentType : "application/json",
        beforeSend:function(){
	        $("#ajaxloader").fadeIn();
	    },
        success : function(data, textStatus, jqXHR) {
            xmldoc7 = jqXHR.responseXML;
            dataObject= data;
            $("#ajaxloader").fadeOut(0);

                
        },
        error : function(data) {
        	$("#ajaxloader").fadeOut(0);
        }
});

	return dataObject;
}

function GetData(url){
	var dataObject=[];
	$.ajax({
		
        url : url,
        type : "GET",
        async : false,
        dataType : 'text',
        contentType : "application/json",
        beforeSend:function(){
//			$("#ajaxloader").fadeIn();
		},
        success : function(data, textStatus, jqXHR) {
		 dataObject= data;
//		 $("#ajaxloader").fadeOut(0);
                
        },
        error : function(data) {
//        	$("#ajaxloader").fadeOut(0);
                return null;
        }
       
});

	 return dataObject;
}
//pdf Link
function link(){
//	var loggedInData=GetData("/vendor_master_new/PdfGen");
	document.location.href = "/vendor_master_new/PdfGen";
}

function getValFromQueryString(key) {
    var re = new RegExp("(?:\\?|&)" + key + "=(.*?)(?=&|$)", "gi");
    var r = [], m;
    while ((m = re.exec(document.location.search)) != null)
        r.push(m[1]);
    return r;
}