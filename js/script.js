function gerarInserts(){
   document.getElementById("sql").value =  "";
   var textos = document.getElementById("json").value.replaceAll('"{','{').replaceAll('},','}').replaceAll('}"','}').replaceAll('\n','').replaceAll("NULL","null").split("{");
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