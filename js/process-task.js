	//提交form
	function completeTask(taskTransact) {
		$('#taskTransact').val(taskTransact);
		$("#expenseReportForm").attr("action",webRoot+"/expense-report/complete-task.htm");
		$('#expenseReportForm').submit();
	}
	
	//提交form
	function saveTask() {
		$("#expenseReportForm").attr("action",webRoot+"/expense-report/save.htm");
		$("#saveTaskFlag").attr("value","true");
		$('#expenseReportForm').submit();
	}
	//选择加签人员
	function addTask(){
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
					title: "选择加签人员",
					width: 300,
					height:400,
					url:acsSystemUrl,
					showBranch:false
				},
				feedback:{
					enable: true,
			                hiddenInput:"addSignPerson",
			                append:false
				},
				callback: {
					onClose:function(){
						addSignCallBack();
					}
				}			
				};
			    popZtree(zTreeSetting);
		
	}
	function addSignCallBack(){
		var userIds = ztree.getIds();
		if(userIds==""||typeof(userIds)=='undefined'){
			$('#addSignPerson').attr("value","all_user");
		}else{
			$('#addSignPerson').attr("value",userIds);
		}
		$("#expenseReportForm").attr("action",webRoot+"/expense-report/add-sign.htm");
		$("#expenseReportForm").ajaxSubmit(function (id){
			alert(id);
		});
		validateForm();
	}
	//选择减签人员
	function cutTask(){
		custom_ztree({url:webRoot+'/expense-report/cutsign.htm',
			onsuccess:function(){removeCountersignCallBack();},
			width:400,
			height:500,
			title:'选择减签人员',
			postData:{taskId:$("#taskId").attr("value")},
			nodeInfo:['type','name','loginName','transactorId','taskId'],
			multiple:true,
			webRoot:webRoot
		});
	}
	
	function removeCountersignCallBack(){
		var transactorIds=getSelectValue("taskId");
		var resultNames="";
		for(var i=0;i<transactorIds.length;i++){
			if(transactorIds[i]!="company"){
				resultNames=resultNames+transactorIds[i]+",";
			}
		}
		if(resultNames.indexOf(",")>=0){
			resultNames=resultNames.substring(0,resultNames.lastIndexOf(","));
		}
		if(resultNames==""){
			alert("只有一个办理人,无需减签");
		}else{
			$('#cutPersons').attr("value",resultNames);
			$("#defaultForm1").attr("action",webRoot+"/expense-report/cut.htm");
			$("#defaultForm1").ajaxSubmit(function (id){
				alert(id);
			});
		}
	}

	//领取回调
	function receiveback(){
		$("#message").show("show");
		setTimeout('$("#message").hide("show");',3000);
		$( "#tabs" ).tabs();
	}

	//提交
	workflowButtonGroup.btnSubmitTask.click = function(taskId){
		completeTask('SUBMIT');
	};
	//同意
	workflowButtonGroup.btnApproveTask.click = function(taskId){
		completeTask('APPROVE');
	};
	//不同意
	workflowButtonGroup.btnRefuseTask.click = function(taskId){
		completeTask('REFUSE');
	};
	//加签
	workflowButtonGroup.btnAddCountersign.click = function(taskId){
		addTask();
	};
	//减签
	workflowButtonGroup.btnDeleteCountersign.click = function(taskId){
		cutTask();
	};

	//保存
	workflowButtonGroup.btnSaveForm.click = function(taskId){
		$("#save_sign").attr("value","save");
		saveTask();
	};

	//取回
	workflowButtonGroup.btnGetBackTask.click = function(taskId){
		$("#expenseReportForm").attr("action",webRoot+"/expense-report/retrieve.htm");
		$("#expenseReportForm").ajaxSubmit(function (id){
			if(id=="任务已取回"){
				window.location.reload(false);
			}else{
				alert(id);
			}
		});
	};

	//领取
	workflowButtonGroup.btnDrawTask.click = function(taskId){
		aa.submit("defaultForm1", webRoot+"/expense-report/receive-task.htm", 'main',initFunction);
	};
	//放弃领取
	workflowButtonGroup.btnAbandonTask.click = function(taskId){
		aa.submit("defaultForm1", webRoot+"/expense-report/abandonReceive.htm", 'main',initFunction);
	};

	//指派
	workflowButtonGroup.btnAssign.click = function(taskId){
		$.colorbox({href:webRoot+"/expense-report/assign-tree.htm"+"?taskId="+$("#taskId").attr("value")+"&id="+$("#id").attr("value"),iframe:true, innerWidth:400, innerHeight:500,overlayClose:false,title:"指派人员"});
	};

	//已阅
	workflowButtonGroup.btnReadTask.click = function(taskId){
		$('#taskTransact').val('READED');
		aa.submit("expenseReportForm", webRoot+"/expense-report/complete-task.htm", 'main', readTaskCallback);
	};
	//选择环节
	workflowButtonGroup.btnChoiceTache.click = function(){
		completeTask('READED');
	};
	
	function readTaskCallback(){
		$("#message").show("show");
		setTimeout('$("#message").hide("show");',3000);
		window.parent.close();
	}

	//抄送
	workflowButtonGroup.btnCopyTache.click = function(taskId){
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
					title: "抄送人员",
					width: 300,
					height:400,
					url:acsSystemUrl,
					showBranch:false
				},
				feedback:{
					enable: true,
							showInput:"assignee",
			                hiddenInput:"assignee",
			                append:false
				},
				callback: {
					onClose:function(){
						copyPersonCallBack();
					}
				}			
				};
			    popZtree(zTreeSetting);
		};

		function copyPersonCallBack(){
			if(ztree.getNames().indexOf("全公司")>=0){
				$('#assignee').attr("value","all_user");
			}else{
				$('#assignee').attr("value",ztree.getIds());
			}
			$("#expenseReportForm").attr("action",webRoot+"/expense-report/copy-tasks.htm");
			$("#expenseReportForm").ajaxSubmit(function (id){
				alert(id);
			});
		}

