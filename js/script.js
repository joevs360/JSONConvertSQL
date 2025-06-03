function gerarInserts(){
   document.getElementById("sql").value =  "";
   var textos = formatarJson();
   var tabela = document.getElementById("tabela").value.replaceAll(' ', '');
   var inserts = "";
   var sequence = checkboxSequence.checked ? document.getElementById("sequence").value : "";
   for (var i = 0; i < textos.length; i++){
	   t = textos[i];
	   json = JSON.parse(t)
	   var chaves = [];
	   var v = [];
	   for(var c in json){
		   if(document.getElementById("ck"+c) && !document.getElementById("ck"+c).checked)
			   continue;
		   chaves.push(c);
		   
		   if(sequence && c.toUpperCase() == sequence.toUpperCase()){
			   v.push("NEXTVAL('"+ sequence.toUpperCase()+ "')")
			   continue;
		   }
		   else if (typeof json[c] === 'string') {
				v.push("'" + json[c].replace("'","''") + "'");
			} 
			else {
				if(json[c]!=null)
					v.push(json[c]);
				else
					v.push("NULL");
			}
	   }
	   inserts += "INSERT INTO "+tabela.toUpperCase()+" (" + chaves.join(',') + ") VALUES (" + v.join(',') + ");\n";
   }
   document.getElementById("sql").value = inserts;
}

function ListarColunas(){
	try {
		var textos = formatarJson();
		var tabela = document.getElementById("tabela").value.replaceAll(' ', '');
		var inserts = "";
		for (var i = 0; i < textos.length; i++){
		   t = textos[i];
		   json = JSON.parse(t)
		   var chaves = [];
		   var v = [];
		   html = ""
		   for(var c in json){
			   chaves.push(c);
				html +=  '<div class="cks" >'
				html +=		'<input type="checkbox" id="ck'+c+'"  value="'+c+'" checked = true/>'
				html +=		'<label for="ck'+c+'" style="margin:5px;"> '+c+'</label>'
				html +=	'</div>'
		   }
		   document.getElementById("divColunas").style.display = 'block';
		   document.getElementById("fieldColunas").innerHTML = html;
		}
	}
	catch (e) {
	  document.getElementById("divColunas").style.display = 'none';
	  document.getElementById("fieldColunas").innerHTML = '';
	}
	
}

function validarTextosIgnorar(texto){
	if (texto.replaceAll(" ","") == "" || 
		texto.replaceAll(" ","").startsWith('"before_value":') || 
		texto.replaceAll(" ","").startsWith('"pid":')|| 
		texto.replaceAll(" ","").startsWith('"session_infos":'))
        return true;
		
	return false;
}
function formatarJson(){
	textos = document.getElementById("json").value.replaceAll('"{','{').replaceAll('},','}').replaceAll('}"','}').replaceAll('\n','').replaceAll('""','null').replaceAll("NULL","null").split(/[\{\}]/);
	retorno = []
	for (var i = 0; i < textos.length; i++){
		if(validarTextosIgnorar(textos[i]))
			   continue;
		retorno.push("{"+textos[i]+"}")  
	}
	return retorno
}

var checkboxSequence = document.getElementById('checkIDsSequence');
var txtTabela = document.getElementById('tabela');
 
checkboxSequence.addEventListener('change', function() {
	document.getElementById("divSequence").style.display = checkboxSequence.checked? 'block' : 'none'
});
  
txtTabela.addEventListener('change', function() {
	document.getElementById("sequence").value = "ID"+txtTabela.value.toUpperCase();
});