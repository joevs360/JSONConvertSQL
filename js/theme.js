var CHAVE_TEMA = 'temaJSONConvertSQL';

function ObterTemaSalvo() {
	try {
		return localStorage.getItem(CHAVE_TEMA) || 'claro';
	} catch (e) {
		return 'claro';
	}
}

function SalvarTema(tema) {
	try {
		localStorage.setItem(CHAVE_TEMA, tema);
	} catch (e) { }
}

function AplicarTema(tema) {
	if (tema === 'escuro') {
		document.documentElement.setAttribute('data-tema', 'escuro');
	} else {
		document.documentElement.removeAttribute('data-tema');
	}

	var botao = document.getElementById('btnTema');
	if (botao) {
		botao.innerHTML = tema === 'escuro' ? '☀️ Tema claro' : '🌙 Tema escuro';
		botao.setAttribute('aria-label', tema === 'escuro' ? 'Ativar tema claro' : 'Ativar tema escuro');
	}
}

function AlternarTema() {
	var temaAtual = document.documentElement.getAttribute('data-tema') === 'escuro' ? 'escuro' : 'claro';
	var novoTema = temaAtual === 'escuro' ? 'claro' : 'escuro';
	AplicarTema(novoTema);
	SalvarTema(novoTema);
}

document.addEventListener('DOMContentLoaded', function () {
	AplicarTema(ObterTemaSalvo());
});
