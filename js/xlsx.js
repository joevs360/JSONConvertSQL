jsons =[];
function gerarInserts(){
   document.getElementById("sql").value =  "";
	inserts = "";
	
   chavePrimaria = document.getElementById("chavePrimaria").value;
   geracaoIDs = document.getElementById("geracaoIDs").value;
   tabela = document.getElementById("tabela").value;
   for (var i = 0; i < jsons.length; i++){
	   json = jsons[i]
		var chaves = [];
		var v = [];
	   for(var c in json){
		   if(document.getElementById("ck"+c) && !document.getElementById("ck"+c).checked)
			   continue;
		   if(geracaoIDs == 1 && c.toUpperCase() == chavePrimaria.toUpperCase())
			   continue;
		   chaves.push(c);
			if (typeof json[c] === 'string') {
				v.push("'" + json[c].replace("'","''") + "'");
			} else {
				if(json[c]!=null)
					v.push(json[c]);
				else
					v.push("NULL");
			}
	   }
	   nextval='';
	   if(geracaoIDs == 2)
		   cp = '';
	   else{
		   cp = chavePrimaria.toLowerCase() + ','
		   nextval = "NEXTVAL('"+ document.getElementById("sequence").value+ "'),"
	   }

	   inserts += "INSERT INTO "+tabela.toUpperCase()+" (" +cp+ chaves.join(',') + ") VALUES (" +nextval+ v.join(',') + ");\n";
   }
   document.getElementById("sql").value = inserts;
}
function gerarUpdates(){
   document.getElementById("sql").value =  "";
	updates = "";
   chavePrimaria = document.getElementById("chavePrimaria").value;
   geracaoIDs = document.getElementById("geracaoIDs").value;
   tabela = document.getElementById("tabela").value;
   for (var i = 0; i < jsons.length; i++){
	   json = jsons[i]
	   alteracoes = [];
	   where = ' '+ document.getElementById("regra").value;
	   for(var c in json){
			alteracao = c
			if (typeof json[c] === 'string') {
				v = ("'"+json[c].replace("'","''") + "'");
			} else {
				if(json[c]!=null)
					v =(json[c]);
				else
					v =("NULL");
			}
			where = where.replaceAll('['+c+']',v);
			
			   if(document.getElementById("ck"+c) && !document.getElementById("ck"+c).checked)
				   continue;
			alteracao += ' = ' + v;
			alteracoes.push(alteracao);
	   }

	   updates += "UPDATE "+tabela+" SET "+alteracoes.join(', ')+where+";\n";
   }
   document.getElementById("sql").value = updates;
}

function ListarColunas(output){
	try {
		jsons =[];
		var textos = output.replaceAll('[','').replaceAll(']','').replaceAll('"{','{').replaceAll('},','}').replaceAll('}"','}').replaceAll('\n','').replaceAll('""','null').replaceAll("NULL","null").split("{");
		 var chaves = [];
		 var html = ""
		for (var i = 0; i < textos.length; i++){
		   if(textos[i].replaceAll(" ","") == "")
			   continue;
		   t = '{'+textos[i];
		   json = JSON.parse(t)
		   jsons.push(json)
		   var v = [];
		   for(var c in json){
			   if(!chaves.includes(c)){
				   chaves.push(c);
					html +=  '<div class="cks" >'
					html +=		'<input type="checkbox" id="ck'+c+'"  value="'+c+'" checked = true/>'
					html +=		'<label for="ck'+c+'" style="margin:5px;"> '+c+'</label>'
					html +=	'</div>'
			   }
			   
			   if(!isNaN(json[c]) && (c.toUpperCase().includes('DATA') || c.toUpperCase().includes('DATE') || c.toUpperCase().includes('HORA')|| c.toUpperCase().includes('VIGENCIA') ||  c.toUpperCase().includes('_AT'))){
				   json[c] = convertToDate(json[c]);
			   }
			   
		   }
		   if(chaves[0]?.toUpperCase().startsWith('ID')){
			   document.getElementById("tabela").value  = chaves[0]?.toUpperCase().replace('ID','');
			   document.getElementById("chavePrimaria").value  = chaves[0]?.toUpperCase();
			   document.getElementById("sequence").value  = chaves[0]?.toUpperCase();
		   }
		   document.getElementById("divColunas").style.display = 'block';
		   document.getElementById("fieldColunas").innerHTML = html;
		}
		ListarCamposValores();
	}
	catch (e) {
	  document.getElementById("divColunas").style.display = 'none';
	  document.getElementById("fieldColunas").innerHTML = '';
	}
}

function AddValorRegra(valor){
	document.getElementById("regra").value += ' ['+valor+ '] ';
	document.getElementById("regra").focus()
}
function ListarCamposValores(){
	try {
		var html = '';
		var chaves = [];
		for (var i = 0; i < jsons.length; i++){
		   json = jsons[i]
		   for(var c in json){
			   if(!chaves.includes(c)){
				   chaves.push(c);
				html += '<div class="btnCampos" ><button type="button"  class="btn btn-secondary"  onclick="AddValorRegra(\'' + c + '\')">' + c + '</button></div>';
			   }
		   }
	   }
	   document.getElementById("fieldCamposValores").innerHTML = html;
	}
	catch (e) {
	  document.getElementById("fieldCamposValores").innerHTML = '';
	}
}

document.getElementById('acao').addEventListener('change', function() {
	if(this.value == 'insert'){
		document.getElementById("divInsert").style.display = 'block';
		document.getElementById("divUpdate").style.display = 'none';
	}
	else{
		document.getElementById("divInsert").style.display = 'none';
		document.getElementById("divUpdate").style.display = 'block';
	}
	   document.getElementById("sql").value = '';

});
document.getElementById('geracaoIDs').addEventListener('change', function() {
	if(this.value == '1'){
		document.getElementById("divSequence").style.display = 'inline';
	}
	else{
		document.getElementById("divSequence").style.display = 'none';
	}
});

  
document.getElementById('file-input').addEventListener('change', function(e) {
	document.getElementById("btnLixeiraJson").style.display = 'inline';
	const file = e.target.files[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = function(event) {
		
		const data = event.target.result;
		const workbook = XLSX.read(data, { type: 'binary' });

		const sheetName = workbook.SheetNames[0]; 
		const sheet = workbook.Sheets[sheetName];

		const jsonData = XLSX.utils.sheet_to_json(sheet);
		const output = JSON.stringify(jsonData, null, 2);
		ListarColunas(output);
	};

	reader.readAsBinaryString(file);
});
  function pad(num) {
    return num < 10 ? '0' + num : num;
  }
function isDateValue(value) {
  const excelEpochStart = new Date(1900, 0, 1); 
  const excelEpochEnd = new Date(9999, 11, 31); 
  const testDate = new Date((value - 25569) * 86400 * 1000); 
  
  return testDate >= excelEpochStart && testDate <= excelEpochEnd && !isNaN(testDate);
}
function convertToDate(number) {
	  if(isDateValue(number)){
		  const date = new Date((number - 25569) * 86400 * 1000); // Converte número do Excel para data
		  
		const year = date.getFullYear();
		const month = pad(date.getMonth() + 1); 
		const day = pad(date.getDate());
		const hours = pad(date.getHours());
		const minutes = pad(date.getMinutes());
		const seconds = pad(date.getSeconds());
		const milliseconds = date.getMilliseconds();

		  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
	  }
	  return number;
}
function removerJson(id) {
	document.getElementById("btnLixeiraJson").style.display = 'none';
	document.getElementById("divColunas").style.display = 'none';
	document.getElementById("fieldColunas").innerHTML = '';
	jsons =[];
	document.getElementById('file-input').value = ''
	document.getElementById("tabela").value  = '';
	document.getElementById("chavePrimaria").value  = '';
	document.getElementById("sequence").value  = '';
	document.getElementById("sql").value = '';
	document.getElementById("regra").value = '';
}