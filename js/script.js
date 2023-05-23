function gerarInserts(){
   var textos = document.getElementById("json").value.replaceAll('"{','{').replaceAll('}"','}').replaceAll('\n','').split("{");
   var tabela = document.getElementById("tabela").value.replaceAll(' ', '');
   var inserts = "";
   for (var i = 0; i < textos.length; i++){
	   if(textos[i] == "")
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
				v.push(json[c]);
			}
	   }
	   inserts += "INSERT INTO "+tabela+" (" + chaves.join(',') + ") VALUES (" + v.join(',') + ");\n";
   }
   document.getElementById("sql").value = inserts.toUpperCase();
}