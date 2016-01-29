var formTabName="表单页面";//是否是新的办理任务页面process-task-new.htm,pos="表单页面2"表示为新办理任务页面，"表单页面"表示为原办理任务页面
isUsingComonLayout=false;
	$().ready(function() {
		initFunction();
	});

	function initFunction(){
		$( "#tabs" ).tabs();
		$("#outDate").datepicker();
		validateForm();
		iMatrix.autoFillOpinion($("#autoFillOpinionInfo").attr("value"));
	}

	function validateForm(){
		addFormValidate($("#fieldPermission").attr("value"), 'expenseReportForm');
		expenseReportFormValidate();
		var active = $("#taskActive").attr("value");
		var documentCreateable = $("#documentCreateable").attr("value");
		if((active==0 || active==1|| active==4|| active==6)&&documentCreateable=="true"){//当待办理、等待设置办理人、待领取、等待选择环节并且有创建正文权限时
			if($("#documentName").val()==""){
				if(typeof(otherswfu)=="undefined"){
					uploadDocument();
				}
			}
		}
	}


	//表单验证
	function expenseReportFormValidate() {
		$("#expenseReportForm").validate({
			submitHandler : function() {
				$(".opt_btn").find("button.btn").attr("disabled", "disabled");
				//aa.submit("expenseReportForm", "", 'main', showMsg);
				var clickBtnName = iMatrix.getWorkflowClickButton();
				if(clickBtnName=="SAVE"){
					$("#save_sign").attr("value","save");
					$('#expenseReportForm').attr('action',webRoot+"/expense-report/save.htm");
				}else if(clickBtnName!=""){
					$('#expenseReportForm').attr('action',webRoot+"/expense-report/complete-task.htm");
				}
				if("save"==$("#save_sign").val()){
					aa.submit("expenseReportForm", "", 'viewZone', saveCallback);
					$("#save_sign").attr("value","");
				}else{
					$("#expenseReportForm").ajaxSubmit(function (id){
						dealResult(id);
					});
				}
			}
		});
	}
	
	function saveCallback(){
		showMsg();
		initFunction();
	}

	//流转历史和表单信息切换
	function changeViewSet(opt){
		if(opt=="basic"){
			if(formTabName=="表单页面"){
				aa.submit("defaultForm1", webRoot+"/expense-report/process-task.htm", 'btnZone,viewZone', validateForm);
			}else{
				aa.submit("defaultForm1", webRoot+"/expense-report/process-task-new.htm", 'btnZone,viewZone', validateForm);
			}
		}else if(opt=="history"){
			aa.submit("defaultForm1", webRoot+"/expense-report/history.htm", 'btnZone,viewZone');
		}
	}

	//办理完任务关闭窗口前执行
	function beforeCloseWindow(opt){
		aa.submit("defaultForm1", webRoot+"/expense-report/process-task.htm", 'btnZone,viewZone');
	}
	
	//下载文档
	function downloadDoc(id){
			window.open(webRoot+"/expense-report/download-docment.htm?id="+id);
	}

	//上传后走
	function rewriteMethod(){
		ajaxSubmit("expenseReportForm", webRoot+"/expense-report/process-task.htm", "main",uploadBack);
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
		function gobackTask(){
			$("#expenseReportForm").attr("action",webRoot+"/expense-report/goback.htm");
			$("#expenseReportForm").ajaxSubmit(function (id){
				alert(id);
				changeViewSet('basic');
				if(id.indexOf("成功")>=0){
				  window.parent.close();
				}
			});
		}

