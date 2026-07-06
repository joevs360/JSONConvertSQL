var jsons = [];


function pad(num) {
	return num < 10 ? '0' + num : String(num);
}

function formatarDataSql(date) {
	var year = date.getFullYear();
	var month = pad(date.getMonth() + 1);
	var day = pad(date.getDate());
	var hours = pad(date.getHours());
	var minutes = pad(date.getMinutes());
	var seconds = pad(date.getSeconds());
	var milliseconds = date.getMilliseconds();
	return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
}

function pareceSerialDeData(valor) {
	if (typeof valor !== 'number' || isNaN(valor)) return false;
	if (valor <= 0 || valor >= 60000) return false;
	return true;
}

function converterSerialExcelParaData(numero) {
	var utcDays = Math.floor(numero - 25569);
	var utcValue = utcDays * 86400; // segundos
	var dateInfo = new Date(utcValue * 1000);

	var fractionalDay = numero - Math.floor(numero);
	var totalSeconds = Math.floor(86400 * fractionalDay);
	var seconds = totalSeconds % 60;
	totalSeconds -= seconds;
	var hours = Math.floor(totalSeconds / (60 * 60));
	var minutes = Math.floor(totalSeconds / 60) % 60;

	return new Date(
		dateInfo.getUTCFullYear(),
		dateInfo.getUTCMonth(),
		dateInfo.getUTCDate(),
		hours,
		minutes,
		seconds
	);
}

var NOMES_COLUNA_DATA = ['DATA', 'DATE', 'HORA', 'VIGENCIA', 'DT_', '_DT', '_AT', 'TIMESTAMP'];

function nomeColunaSugereData(nomeColuna) {
	var upper = nomeColuna.toUpperCase();
	return NOMES_COLUNA_DATA.some(function (fragmento) {
		return upper.indexOf(fragmento) !== -1;
	});
}



function escaparHtml(texto) {
	var div = document.createElement('div');
	div.textContent = texto;
	return div.innerHTML;
}

function escaparJsString(texto) {
	return String(texto).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function normalizarTextoBusca(texto) {
	return (texto || '')
		.toString()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '');
}

function obterCheckboxColuna(nomeColuna) {
	var checks = document.querySelectorAll('#fieldColunas input[type="checkbox"]');
	for (var i = 0; i < checks.length; i++) {
		if (checks[i].getAttribute('data-coluna') === nomeColuna) return checks[i];
	}
	return null;
}

function FiltrarColunas() {
	var inputBusca = document.getElementById('buscarColuna');
	var termo = normalizarTextoBusca(inputBusca ? inputBusca.value : '');
	var itens = document.querySelectorAll('#fieldColunas .cks');

	itens.forEach(function (item) {
		var nomeColuna = normalizarTextoBusca(item.getAttribute('data-coluna'));
		item.style.display = nomeColuna.indexOf(termo) !== -1 ? 'inline-block' : 'none';
	});
}

function valorParaSql(valor) {
	if (valor === null || valor === undefined) return 'NULL';
	if (valor instanceof Date) {
		return "'" + formatarDataSql(valor) + "'";
	}
	if (typeof valor === 'string') {
		return "'" + valor.replace(/'/g, "''") + "'";
	}
	if (typeof valor === 'boolean') {
		return valor ? '1' : '0';
	}
	return valor;
}

function atualizarContadorSql(quantidade, tipo) {
	var contador = document.getElementById('contadorSql');
	if (!contador) return;

	if (tipo === 'insert') {
		contador.textContent = quantidade + (quantidade === 1 ? ' insert gerado' : ' inserts gerados');
		return;
	}

	if (tipo === 'update') {
		contador.textContent = quantidade + (quantidade === 1 ? ' update gerado' : ' updates gerados');
		return;
	}

	contador.textContent = quantidade + (quantidade === 1 ? ' SQL gerado' : ' SQLs gerados');
}

function atualizarTextoBotaoCopiarSql(texto) {
	var botao = document.getElementById('btnCopiarSql');
	if (!botao) return;

	botao.textContent = texto;
	if (texto !== 'Copiar') {
		setTimeout(function () {
			botao.textContent = 'Copiar';
		}, 1800);
	}
}

function copiarSqlGerado() {
	var campoSql = document.getElementById('sql');
	var texto = campoSql ? campoSql.value : '';

	if (!texto.trim()) {
		atualizarTextoBotaoCopiarSql('Nada para copiar');
		return;
	}

	if (navigator.clipboard && window.isSecureContext) {
		navigator.clipboard.writeText(texto)
			.then(function () { atualizarTextoBotaoCopiarSql('Copiado!'); })
			.catch(function () { copiarSqlGeradoFallback(campoSql); });
		return;
	}

	copiarSqlGeradoFallback(campoSql);
}

function copiarSqlGeradoFallback(campoSql) {
	try {
		campoSql.focus();
		campoSql.select();
		document.execCommand('copy');
		atualizarTextoBotaoCopiarSql('Copiado!');
	} catch (e) {
		atualizarTextoBotaoCopiarSql('Erro ao copiar');
	}
}

function gerarInserts() {
	document.getElementById('sql').value = '';
	atualizarContadorSql(0, 'insert');
	var inserts = '';
	var quantidadeInserts = 0;

	var chavePrimaria = document.getElementById('chavePrimaria').value;
	var geracaoIDs = document.getElementById('geracaoIDs').value;
	var tabela = document.getElementById('tabela').value;

	for (var i = 0; i < jsons.length; i++) {
		var json = jsons[i];
		var chaves = [];
		var v = [];

		for (var c in json) {
			if (!Object.prototype.hasOwnProperty.call(json, c)) continue;
			var chk = obterCheckboxColuna(c);
			if (chk && !chk.checked) continue;
			if (geracaoIDs == 1 && c.toUpperCase() === chavePrimaria.toUpperCase()) continue;

			chaves.push(c);
			v.push(valorParaSql(json[c]));
		}

		var nextval = '';
		var cp = '';
		if (geracaoIDs != 2) {
			cp = chavePrimaria.toLowerCase() + ',';
			nextval = "NEXTVAL('" + document.getElementById('sequence').value + "'),";
		}

		inserts += 'INSERT INTO ' + tabela.toUpperCase() + ' (' + cp + chaves.join(',') + ') VALUES (' + nextval + v.join(',') + ');\n';
		quantidadeInserts++;
	}
	document.getElementById('sql').value = inserts;
	atualizarContadorSql(quantidadeInserts, 'insert');
}

function gerarUpdates() {
	document.getElementById('sql').value = '';
	atualizarContadorSql(0, 'update');
	var updates = '';
	var quantidadeUpdates = 0;

	var tabela = document.getElementById('tabela').value;

	for (var i = 0; i < jsons.length; i++) {
		var json = jsons[i];
		var alteracoes = [];
		var where = ' ' + document.getElementById('regra').value;

		for (var c in json) {
			if (!Object.prototype.hasOwnProperty.call(json, c)) continue;

			var valorSql = valorParaSql(json[c]);
			where = where.replaceAll('[' + c + ']', valorSql);

			var chk = obterCheckboxColuna(c);
			if (chk && !chk.checked) continue;

			alteracoes.push(c + ' = ' + valorSql);
		}

		updates += 'UPDATE ' + tabela + ' SET ' + alteracoes.join(', ') + where + ';\n';
		quantidadeUpdates++;
	}
	document.getElementById('sql').value = updates;
	atualizarContadorSql(quantidadeUpdates, 'update');
}

function tratarLinha(linha) {
	var tratada = {};
	for (var c in linha) {
		if (!Object.prototype.hasOwnProperty.call(linha, c)) continue;
		var valor = linha[c];

		if (valor instanceof Date) {
			tratada[c] = valor;
			continue;
		}

		if (typeof valor === 'number' && nomeColunaSugereData(c) && pareceSerialDeData(valor)) {
			tratada[c] = converterSerialExcelParaData(valor);
			continue;
		}

		tratada[c] = valor;
	}
	return tratada;
}

function ListarColunas(output) {
	try {
		jsons = [];
		document.getElementById('sql').value = '';
		atualizarContadorSql(0);
		var linhasBrutas = JSON.parse(output);
		var chaves = [];
		var html = '';

		for (var i = 0; i < linhasBrutas.length; i++) {
			var json = tratarLinha(linhasBrutas[i]);
			jsons.push(json);

			for (var c in json) {
				if (!Object.prototype.hasOwnProperty.call(json, c)) continue;
				if (chaves.indexOf(c) === -1) {
					var idCheckbox = 'ckColuna_' + chaves.length;
					var colunaEscapada = escaparHtml(c);
					chaves.push(c);

					html += '<div class="cks" data-coluna="' + colunaEscapada + '">';
					html += '<input type="checkbox" id="' + idCheckbox + '" data-coluna="' + colunaEscapada + '" value="' + colunaEscapada + '" checked="true"/>';
					html += '<label for="' + idCheckbox + '" style="margin:5px;"> ' + colunaEscapada + '</label>';
					html += '</div>';
				}
			}

			if (chaves[0] && chaves[0].toUpperCase().startsWith('ID')) {
				document.getElementById('tabela').value = chaves[0].toUpperCase().replace('ID', '');
				document.getElementById('chavePrimaria').value = chaves[0].toUpperCase();
				document.getElementById('sequence').value = chaves[0].toUpperCase();
			}
		}

		document.getElementById('divColunas').style.display = jsons.length ? 'block' : 'none';
		document.getElementById('fieldColunas').innerHTML = html;

		var inputBusca = document.getElementById('buscarColuna');
		if (inputBusca) inputBusca.value = '';
		FiltrarColunas();

		ListarCamposValores();
	} catch (e) {
		document.getElementById('divColunas').style.display = 'none';
		document.getElementById('fieldColunas').innerHTML = '';
		atualizarContadorSql(0);
		var inputBusca = document.getElementById('buscarColuna');
		if (inputBusca) inputBusca.value = '';
	}
}

function AddValorRegra(valor) {
	document.getElementById('regra').value += ' [' + valor + '] ';
	document.getElementById('regra').focus();
}

function ListarCamposValores() {
	try {
		var html = '';
		var chaves = [];
		for (var i = 0; i < jsons.length; i++) {
			var json = jsons[i];
			for (var c in json) {
				if (!Object.prototype.hasOwnProperty.call(json, c)) continue;
				if (chaves.indexOf(c) === -1) {
					chaves.push(c);
					html += '<div class="btnCampos"><button type="button" class="btn btn-secondary" onclick="AddValorRegra(\'' + escaparJsString(c) + '\')">' + escaparHtml(c) + '</button></div>';
				}
			}
		}
		document.getElementById('fieldCamposValores').innerHTML = html;
	} catch (e) {
		document.getElementById('fieldCamposValores').innerHTML = '';
	}
}

document.getElementById('acao').addEventListener('change', function () {
	if (this.value === 'insert') {
		document.getElementById('divInsert').style.display = 'block';
		document.getElementById('divUpdate').style.display = 'none';
	} else {
		document.getElementById('divInsert').style.display = 'none';
		document.getElementById('divUpdate').style.display = 'block';
	}
	document.getElementById('sql').value = '';
	atualizarContadorSql(0);
});

document.getElementById('geracaoIDs').addEventListener('change', function () {
	document.getElementById('divSequence').style.display = this.value === '1' ? 'inline' : 'none';
});

function arquivoValidoXlsx(file) {
	if (!file) return false;
	var nome = file.name.toLowerCase();
	return nome.endsWith('.xlsx') || nome.endsWith('.xls');
}

function valorPreenchido(valor) {
	return valor !== null && valor !== undefined && String(valor).trim() !== '';
}

function normalizarNomeCabecalho(valor) {
	if (!valorPreenchido(valor)) return '';
	return String(valor).trim();
}

function contarValoresPreenchidos(linha) {
	if (!linha) return 0;
	var total = 0;
	for (var i = 0; i < linha.length; i++) {
		if (valorPreenchido(linha[i])) total++;
	}
	return total;
}

function contarDadosNaLinha(linha, indicesCabecalho) {
	if (!linha) return 0;
	var total = 0;
	for (var i = 0; i < indicesCabecalho.length; i++) {
		if (valorPreenchido(linha[indicesCabecalho[i]])) total++;
	}
	return total;
}

function encontrarLinhaCabecalho(linhas) {
	var melhorIndice = -1;
	var melhorPontuacao = -1;

	for (var i = 0; i < linhas.length; i++) {
		var linha = linhas[i] || [];
		var qtdCabecalhos = 0;

		for (var c = 0; c < linha.length; c++) {
			var nome = normalizarNomeCabecalho(linha[c]);
			if (!nome) continue;

			// Cabeçalhos normalmente são textos. Assim evitamos escolher linhas de dados numéricas.
			if (isNaN(Number(nome))) qtdCabecalhos++;
		}

		var proximaLinha = linhas[i + 1] || [];
		var qtdDadosProximaLinha = contarValoresPreenchidos(proximaLinha);
		var pontuacao = qtdCabecalhos * 2 + qtdDadosProximaLinha;

		if (qtdCabecalhos >= 2 && qtdDadosProximaLinha >= 1 && pontuacao > melhorPontuacao) {
			melhorPontuacao = pontuacao;
			melhorIndice = i;
		}
	}

	return melhorIndice;
}

function converterPlanilhaParaJson(sheet) {
	var linhas = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null, raw: true });
	var indiceCabecalho = encontrarLinhaCabecalho(linhas);

	if (indiceCabecalho === -1) {
		return {
			jsonData: XLSX.utils.sheet_to_json(sheet, { defval: null, raw: true }),
			linhasIgnoradas: 0
		};
	}

	var linhaCabecalho = linhas[indiceCabecalho] || [];
	var indicesCabecalho = [];
	var nomesCabecalho = [];
	var nomesUtilizados = {};

	for (var c = 0; c < linhaCabecalho.length; c++) {
		var nome = normalizarNomeCabecalho(linhaCabecalho[c]);
		if (!nome) continue;

		var nomeFinal = nome;
		var contador = 2;
		while (nomesUtilizados[nomeFinal.toUpperCase()]) {
			nomeFinal = nome + '_' + contador;
			contador++;
		}

		nomesUtilizados[nomeFinal.toUpperCase()] = true;
		indicesCabecalho.push(c);
		nomesCabecalho.push(nomeFinal);
	}

	var jsonData = [];
	for (var l = indiceCabecalho + 1; l < linhas.length; l++) {
		var linha = linhas[l] || [];
		if (contarDadosNaLinha(linha, indicesCabecalho) === 0) continue;

		var item = {};
		for (var i = 0; i < indicesCabecalho.length; i++) {
			item[nomesCabecalho[i]] = linha[indicesCabecalho[i]];
		}
		jsonData.push(item);
	}

	return {
		jsonData: jsonData,
		linhasIgnoradas: indiceCabecalho
	};
}

function processarArquivoXlsx(file) {
	if (!file) return;

	if (!arquivoValidoXlsx(file)) {
		alert('Selecione ou arraste apenas arquivos .xlsx ou .xls.');
		return;
	}

	document.getElementById('btnLixeiraJson').style.display = 'inline';
	var nomeArquivo = document.getElementById('nomeArquivo');
	if (nomeArquivo) {
		nomeArquivo.textContent = file.name;
	}

	var reader = new FileReader();
	reader.onload = function (event) {
		var data = event.target.result;

		var workbook = XLSX.read(data, { type: 'binary', cellDates: true });

		var sheetName = workbook.SheetNames[0];
		var sheet = workbook.Sheets[sheetName];

		var resultado = converterPlanilhaParaJson(sheet);
		var output = JSON.stringify(resultado.jsonData, null, 2);
		ListarColunas(output);

		if (nomeArquivo && resultado.linhasIgnoradas > 0) {
			nomeArquivo.textContent = file.name + ' - ' + resultado.linhasIgnoradas + ' linha(s) de cabeçalho ignorada(s)';
		}
	};

	reader.readAsBinaryString(file);
}

document.getElementById('file-input').addEventListener('change', function (e) {
	processarArquivoXlsx(e.target.files[0]);
});

var dropArea = document.getElementById('drop-area');
if (dropArea) {
	dropArea.addEventListener('click', function () {
		document.getElementById('file-input').click();
	});

	['dragenter', 'dragover'].forEach(function (evento) {
		dropArea.addEventListener(evento, function (e) {
			e.preventDefault();
			e.stopPropagation();
			dropArea.classList.add('drag-over');
		});
	});

	['dragleave', 'drop'].forEach(function (evento) {
		dropArea.addEventListener(evento, function (e) {
			e.preventDefault();
			e.stopPropagation();
			dropArea.classList.remove('drag-over');
		});
	});

	dropArea.addEventListener('drop', function (e) {
		var arquivos = e.dataTransfer.files;
		if (!arquivos || !arquivos.length) return;

		var fileInput = document.getElementById('file-input');
		fileInput.files = arquivos;
		processarArquivoXlsx(arquivos[0]);
	});
}

function removerJson() {
	document.getElementById('btnLixeiraJson').style.display = 'none';
	document.getElementById('divColunas').style.display = 'none';
	document.getElementById('fieldColunas').innerHTML = '';
	var inputBusca = document.getElementById('buscarColuna');
	if (inputBusca) inputBusca.value = '';
	var nomeArquivo = document.getElementById('nomeArquivo');
	if (nomeArquivo) nomeArquivo.textContent = '';
	jsons = [];
	document.getElementById('file-input').value = '';
	document.getElementById('tabela').value = '';
	document.getElementById('chavePrimaria').value = '';
	document.getElementById('sequence').value = '';
	document.getElementById('sql').value = '';
	atualizarContadorSql(0);
	document.getElementById('regra').value = '';
}