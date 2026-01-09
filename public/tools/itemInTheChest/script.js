function calc(){
	var gan=document.getElementById("guaranteed_all_num").value;
	var gts=document.getElementById("guaranteed_target_slot").value;
	var gas=document.getElementById("guaranteed_all_slot").value;
	var gtn=document.getElementById("guaranteed_target_num").value;
	var ean=document.getElementById("else_all_num").value;
	var ets=document.getElementById("else_target_slot").value;
	var eas=document.getElementById("else_all_slot").value
	var etn=document.getElementById("else_target_num").value;
	
	var answer=gts/gas*gtn*gan+ets/eas*etn*ean;
	
	document.getElementById("answer").innerHTML="期待値の個数:"+answer+"個、%表記:"+answer*100+"%";
	
}