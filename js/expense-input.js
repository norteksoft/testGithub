 //保存提交验证
function expenseReportFormValidate(){
	$("#expenseReportForm").validate({
		submitHandler: function() {
			$(".opt_btn").find("button.btn").attr("disabled","disabled");
			var clickBtnName = iMatrix.getWorkflowClickButton();
			if(clickBtnName=="SAVE"){
				$('#expenseReportForm').attr('action',webRoot+"/expense-report/save.htm");
			}else if(clickBtnName=="SUBMIT"){
				$('#expenseReportForm').attr('action',webRoot+"/expense-report/submit-process.htm");
			}
			aa.submit('expenseReportForm','','main',__callback);
		}
	});
}

function validateForm(){
	addFormValidate($("#fieldPermission").attr("value"), 'expenseReportForm');
	expenseReportFormValidate();
}
//保存提交
var submitType;
function submitForm(url,type){
	submitType = type;
	$('#taskTransact').val("SUBMIT");
	if(type=='submit'&& $('#documentName').attr('value')==''){
		alert("请先上传文件！");
		return;
	}
	$('#expenseReportForm').attr('action',url);
	$('#expenseReportForm').submit();
}

//保存提交回调
function __callback(){
	var result = $("#dealResultInput").val();
	//处理任务提交结果
	//dealResult(result);
	expenseReportFormValidate();
	$( "#tabs" ).tabs();
	uploadDocument();
	getContentHeight();
	var results=result.split(";");
	if(typeof results[1]=='undefined'||results[1]==null||results[1]==''){//如果不是选择环节、选择办理人、填写意见时，关闭窗口
		$("#message").show("show");
		setTimeout('$("#message").hide("show");',3000);
		if(submitType=='submit'){
			window.parent.$.colorbox.close();
			window.close();
		}
	}
}

//选择陪同人员
function selectPerson(){
	var acsSystemUrl = webRoot;
	var zTreeSetting={
			leaf: {
				enable: false
			},
			type: {
				treeType: "MAN_DEPARTMENT_TREE",
				noDeparmentUser:true,
				onlineVisible:false
			},
			data: {
			},
			view: {
				title: "选择人员",
				width: 300,
				height:400,
				url:acsSystemUrl,
				showBranch:false
			},
			feedback:{
				enable: true,
                showInput:"companion",
                hiddenInput:"userId",
                append:false
			},
			callback: {
				onClose:function(){
				}
			}			
			};
		    popZtree(zTreeSetting);
}

//选择一级审批人
function selectFirstPerson(){
	var acsSystemUrl = webRoot;
	var zTreeSetting={
			leaf: {
				enable: false
			},
			type: {
				treeType: "MAN_DEPARTMENT_TREE",
				noDeparmentUser:true,
				onlineVisible:false
			},
			data: {

			},
			view: {
				title: "选择一级审批人",
				width: 300,
				height:400,
				url:acsSystemUrl,
				showBranch:false
			},
			feedback:{
				enable: true,
						showInput:"firstApprover",
		                hiddenInput:"userId",
		                append:false
			},
			callback: {
				onClose:function(){
					firstCallBack();
				}
			}			
			};
		    popZtree(zTreeSetting);
	
}

function firstCallBack(){
	$('#firstLoginName').attr("value",ztree.getLoginName());
	$('#firstApproverId').attr("value",ztree.getId());
}

//选择批示传阅人员
function selectReadPerson(){
	var acsSystemUrl = webRoot;
	var zTreeSetting={
			leaf: {
				enable: false
			},
			type: {
				treeType: "MAN_DEPARTMENT_TREE",
				noDeparmentUser:true,
				onlineVisible:false
			},
			data: {
				chkStyle:"checkbox",
				chkboxType:"{'Y' : 'ps', 'N' : 'ps' }"
			},
			view: {
				title: "选择批示传阅人员",
				width: 300,
				height:400,
				url:acsSystemUrl,
				showBranch:false
			},
			feedback:{
				enable: true,
                showInput:"readPersons",
                hiddenInput:"readPersonIds",
                append:false
			},
			callback: {
				onClose:function(){
					readPersonCallBack();
				}
			}			
			};
		    popZtree(zTreeSetting);
}
function readPersonCallBack(){
	$('#readPersons').attr("title",ztree.getNames());
	$('#readLoginNames').attr("value",ztree.getLoginNames());
	$('#readPersonIds').attr("value",ztree.getIds());
}

//选择会签人员
function selectSignPerson(){
	var acsSystemUrl = webRoot+"";
	var zTreeSetting={
			leaf: {
				enable: false
			},
			type: {
				treeType: "MAN_DEPARTMENT_TREE",
				noDeparmentUser:true,
				onlineVisible:false
			},
			data: {
				chkStyle:"checkbox",
				chkboxType:"{'Y' : 'ps', 'N' : 'ps' }"
			},
			view: {
				title: "选择会签人员",
				width: 300,
				height:400,
				url:acsSystemUrl,
				showBranch:false
			},
			feedback:{
				enable: true,
                showInput:"signPersons",
                hiddenInput:"signPersonIds",
                append:false
			},
			callback: {
				onClose:function(){
					signPersonCallBack();
				}
			}			
			};
		    popZtree(zTreeSetting);
}
function signPersonCallBack(){
	$('#signPersons').attr("title",ztree.getNames());
	$('#signLoginNames').attr("value",ztree.getLoginNames());
	$('#signPersonIds').attr("value",ztree.getIds());
}

function changeViewSet(opt){
	if(opt=="basic"){
		aa.submit("defaultForm1", webRoot+"/expense-report/input.htm", 'btnZone,viewZone');
	}else if(opt=="history"){
		aa.submit("defaultForm1", webRoot+"/expense-report/history.htm", 'btnZone,viewZone');
	}
}

function unloadFunction(){
	if(otherswfu!=undefined){//销毁上传对象
		otherswfu.destroy();
	}
}