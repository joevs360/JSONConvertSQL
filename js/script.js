function gerarInserts(){
   document.getElementById("sql").value =  "";
   var textos = document.getElementById("json").value.replaceAll('"{','{').replaceAll('},','}').replaceAll('}"','}').replaceAll('\n','').replaceAll('""','null').replaceAll("NULL","null").split("{");
   var tabela = document.getElementById("tabela").value.replaceAll(' ', '');
   var inserts = "";
   for (var i = 0; i < textos.length; i++){
	   if(textos[i].replaceAll(" ","") == "")
		   continue;
	   t = '{'+textos[i];
	   json = JSON.parse(t)
	   var chaves = [];
	   var v = [];
	   for(var c in json){
		   if(!document.getElementById("ck"+c).checked)
			   continue;
		   chaves.push(c);
		   if (typeof json[c] === 'string') {
				v.push("'" + json[c] + "'");
			} else {
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
		var textos = document.getElementById("json").value.replaceAll('"{','{').replaceAll('},','}').replaceAll('}"','}').replaceAll('\n','').replaceAll('""','null').replaceAll("NULL","null").split("{");
		var tabela = document.getElementById("tabela").value.replaceAll(' ', '');
		var inserts = "";
		for (var i = 0; i < textos.length; i++){
		   if(textos[i].replaceAll(" ","") == "")
			   continue;
		   t = '{'+textos[i];
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