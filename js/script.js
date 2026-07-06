var checkboxSequence = document.getElementById('checkIDsSequence');
var txtTabela = document.getElementById('tabela');

function normalizarEntradaJson(raw) {
	var texto = (raw || '').trim();

	if (texto === '') return '';

	texto = texto.replace(/^\uFEFF/, '');

	texto = texto.replace(/:\s*undefined\b/g, ': null');
	texto = texto.replace(/:\s*NaN\b/g, ': null');

	texto = texto.replace(/\r\n/g, '\n');

	return texto;
}

function extrairBlocosDeObjetos(texto) {
	var blocos = [];
	var depth = 0;
	var inString = false;
	var stringChar = '';
	var escaped = false;
	var start = -1;

	for (var i = 0; i < texto.length; i++) {
		var ch = texto[i];

		if (inString) {
			if (escaped) {
				escaped = false;
			} else if (ch === '\\') {
				escaped = true;
			} else if (ch === stringChar) {
				inString = false;
			}
			continue;
		}

		if (ch === '"' || ch === "'") {
			inString = true;
			stringChar = ch;
			continue;
		}

		if (ch === '{') {
			if (depth === 0) start = i;
			depth++;
		} else if (ch === '}') {
			depth--;
			if (depth === 0 && start !== -1) {
				blocos.push(texto.slice(start, i + 1));
				start = -1;
			} else if (depth < 0) {
				depth = 0;
			}
		}
	}

	return blocos;
}

function tentarCorrigirBloco(bloco) {
	var corrigido = bloco;

	corrigido = corrigido.replace(/,(\s*[}\]])/g, '$1');
	if (corrigido.indexOf('"') === -1 && corrigido.indexOf("'") !== -1) {
		corrigido = corrigido.replace(/'/g, '"');
	}

	corrigido = corrigido.replace(/([{,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)\s*:/g, '$1"$2":');

	return corrigido;
}

function parseJsonFlexivel(rawInput) {
	var resultado = { ok: false, objetos: [], avisos: [], erro: null };
	var texto = normalizarEntradaJson(rawInput);

	if (texto === '') {
		resultado.erro = 'Informe um JSON para continuar.';
		return resultado;
	}

	try {
		var direto = JSON.parse(texto);
		if (Array.isArray(direto)) {
			resultado.objetos = direto.filter(function (item) {
				return item !== null && typeof item === 'object' && !Array.isArray(item);
			});
			if (resultado.objetos.length !== direto.length) {
				resultado.avisos.push('Alguns itens do array foram ignorados por não serem objetos.');
			}
		} else if (direto !== null && typeof direto === 'object') {
			resultado.objetos = [direto];
		} else {
			resultado.erro = 'O JSON informado não representa um objeto ou lista de objetos.';
			return resultado;
		}
		resultado.ok = resultado.objetos.length > 0;
		if (!resultado.ok) resultado.erro = 'Nenhum objeto válido foi encontrado no JSON.';
		return resultado;
	} catch (eDireto) {
	}
	var blocos = extrairBlocosDeObjetos(texto);

	if (blocos.length === 0) {
		resultado.erro = 'Não foi possível identificar nenhum objeto "{ }" válido no texto informado.';
		return resultado;
	}

	var falhas = 0;
	blocos.forEach(function (bloco, idx) {
		try {
			var obj = JSON.parse(bloco);
			if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
				resultado.objetos.push(obj);
			} else {
				falhas++;
			}
		} catch (e1) {
			try {
				var obj2 = JSON.parse(tentarCorrigirBloco(bloco));
				if (obj2 !== null && typeof obj2 === 'object' && !Array.isArray(obj2)) {
					resultado.objetos.push(obj2);
					resultado.avisos.push('O objeto #' + (idx + 1) + ' precisou de correção automática de sintaxe.');
				} else {
					falhas++;
				}
			} catch (e2) {
				falhas++;
			}
		}
	});

	if (falhas > 0) {
		resultado.avisos.push(falhas + ' bloco(s) de objeto não puderam ser interpretados e foram ignorados.');
	}

	resultado.ok = resultado.objetos.length > 0;
	if (!resultado.ok) {
		resultado.erro = 'Não foi possível interpretar nenhum objeto válido a partir do texto informado. Verifique a formatação do JSON.';
	}

	return resultado;
}

function exibirFeedbackJson(mensagens, tipo) {
	var existente = document.getElementById('jsonFeedback');
	if (existente) existente.remove();

	if (!mensagens || mensagens.length === 0) return;

	var div = document.createElement('div');
	div.id = 'jsonFeedback';
	div.className = 'alert alert-parse ' + (tipo === 'erro' ? 'alert-danger' : 'alert-warning');
	div.innerHTML = mensagens.map(function (m) { return escaparHtml(m); }).join('<br>');

	var textarea = document.getElementById('json');
	textarea.parentNode.insertBefore(div, textarea.nextSibling);
}

function escaparHtml(texto) {
	var div = document.createElement('div');
	div.textContent = texto;
	return div.innerHTML;
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


function atualizarContadorInserts(quantidade) {
	var contador = document.getElementById('contadorInserts');
	if (!contador) return;

	contador.textContent = quantidade + (quantidade === 1 ? ' insert gerado' : ' inserts gerados');
}

function atualizarTextoBotaoCopiar(texto) {
	var botao = document.getElementById('btnCopiarInserts');
	if (!botao) return;

	botao.textContent = texto;
	if (texto !== 'Copiar') {
		setTimeout(function () {
			botao.textContent = 'Copiar';
		}, 1800);
	}
}

function copiarInserts() {
	var campoSql = document.getElementById('sql');
	var texto = campoSql ? campoSql.value : '';

	if (!texto.trim()) {
		atualizarTextoBotaoCopiar('Nada para copiar');
		return;
	}

	if (navigator.clipboard && window.isSecureContext) {
		navigator.clipboard.writeText(texto)
			.then(function () { atualizarTextoBotaoCopiar('Copiado!'); })
			.catch(function () { copiarInsertsFallback(campoSql); });
		return;
	}

	copiarInsertsFallback(campoSql);
}

function copiarInsertsFallback(campoSql) {
	try {
		campoSql.focus();
		campoSql.select();
		document.execCommand('copy');
		atualizarTextoBotaoCopiar('Copiado!');
	} catch (e) {
		atualizarTextoBotaoCopiar('Erro ao copiar');
	}
}

function gerarInserts() {
	document.getElementById('sql').value = '';
	atualizarContadorInserts(0);

	var parse = parseJsonFlexivel(document.getElementById('json').value);

	if (!parse.ok) {
		exibirFeedbackJson([parse.erro], 'erro');
		return;
	}
	exibirFeedbackJson(parse.avisos, 'aviso');

	var tabela = document.getElementById('tabela').value.replaceAll(' ', '');
	var inserts = '';
	var quantidadeInserts = 0;
	var sequence = checkboxSequence && checkboxSequence.checked ? document.getElementById('sequence').value : '';

	parse.objetos.forEach(function (json) {
		var chaves = [];
		var v = [];
		for (var c in json) {
			if (!Object.prototype.hasOwnProperty.call(json, c)) continue;
			var chk = obterCheckboxColuna(c);
			if (chk && !chk.checked) continue;

			chaves.push(c);

			if (sequence && c.toUpperCase() === sequence.toUpperCase()) {
				v.push("NEXTVAL('" + sequence.toUpperCase() + "')");
				continue;
			} else if (typeof json[c] === 'string') {
				v.push("'" + json[c].replace(/'/g, "''") + "'");
			} else if (json[c] !== null && typeof json[c] === 'object') {
				// objetos/arrays aninhados: serializa como JSON string
				v.push("'" + JSON.stringify(json[c]).replace(/'/g, "''") + "'");
			} else if (json[c] !== null) {
				v.push(json[c]);
			} else {
				v.push('NULL');
			}
		}
		inserts += 'INSERT INTO ' + tabela.toUpperCase() + ' (' + chaves.join(',') + ') VALUES (' + v.join(',') + ');\n';
		quantidadeInserts++;
	});

	document.getElementById('sql').value = inserts;
	atualizarContadorInserts(quantidadeInserts);
}

function ListarColunas() {
	var parse = parseJsonFlexivel(document.getElementById('json').value);

	if (!parse.ok) {
		document.getElementById('divColunas').style.display = 'none';
		document.getElementById('fieldColunas').innerHTML = '';
		// Só mostra erro se o usuário já digitou algo relevante
		if (document.getElementById('json').value.trim() !== '') {
			exibirFeedbackJson([parse.erro], 'erro');
		} else {
			exibirFeedbackJson([]);
		}
		return;
	}
	exibirFeedbackJson(parse.avisos, 'aviso');

	var chaves = [];
	var html = '';
	parse.objetos.forEach(function (json) {
		for (var c in json) {
			if (!Object.prototype.hasOwnProperty.call(json, c)) continue;
			if (chaves.indexOf(c) !== -1) continue;
			chaves.push(c);

			var idCheckbox = 'ckColuna_' + chaves.length;
			var colunaEscapada = escaparHtml(c);

			html += '<div class="cks" data-coluna="' + colunaEscapada + '">';
			html += '<input type="checkbox" id="' + idCheckbox + '" data-coluna="' + colunaEscapada + '" value="' + colunaEscapada + '" checked="true"/>';
			html += '<label for="' + idCheckbox + '" style="margin:5px;"> ' + colunaEscapada + '</label>';
			html += '</div>';
		}
	});

	document.getElementById('divColunas').style.display = 'block';
	document.getElementById('fieldColunas').innerHTML = html;

	var inputBusca = document.getElementById('buscarColuna');
	if (inputBusca) inputBusca.value = '';
	FiltrarColunas();
}

if (checkboxSequence) {
	checkboxSequence.addEventListener('change', function () {
		document.getElementById('divSequence').style.display = checkboxSequence.checked ? 'block' : 'none';
	});
}

if (txtTabela) {
	txtTabela.addEventListener('change', function () {
		document.getElementById('sequence').value = 'ID' + txtTabela.value.toUpperCase();
	});
}