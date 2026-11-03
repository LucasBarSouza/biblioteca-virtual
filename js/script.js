const db = window.supabase.createClient('https://qfvjglqkefqyvgmhdysz.supabase.co', 'sb_publishable_GquFh9qHOnPAQHwK5XzT1w_KWjM17e4');

const lista = document.querySelector('.places');
const inputBusca = document.getElementById('busca');
const btnBusca = document.getElementById('btnBusca');
const semResultado = document.getElementById('semResultado');

let acervo = [];

function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function escapar(texto) {
    return String(texto ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function criarCard(livro) {
    return `
        <article>
            <img src="${escapar(livro.capa)}" alt="Capa de ${escapar(livro.titulo)}">
            <div class="card-info">
                <h3>${escapar(livro.titulo)}</h3>
                <p>Livro de ${escapar(livro.autor)}</p>
                <a class="btn-ler" href="${escapar(livro.link)}" target="_blank" rel="noopener noreferrer">Leia Agora</a>
            </div>
        </article>
    `;
}

function renderizar(livros) {
    lista.innerHTML = livros.map(criarCard).join('');
    semResultado.hidden = livros.length > 0;
}

function filtrar() {
    const termo = normalizar(inputBusca.value.trim());

    const resultado = acervo.filter(livro =>
        normalizar(livro.titulo + ' ' + livro.autor).includes(termo)
    );

    renderizar(resultado);
}

async function carregarAcervo() {
    lista.innerHTML = '<p>Carregando livros...</p>';

    const { data, error } = await db
        .from('livros')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('Erro ao buscar livros:', error);
        lista.innerHTML = '<p>Não foi possível carregar os livros.</p>';
        return;
    }

    acervo = data;
    filtrar();
}

btnBusca.addEventListener('click', filtrar);
inputBusca.addEventListener('input', filtrar);

/* ---------- Tema ---------- */
const btnTema = document.getElementById('btnTema');

function aplicarTema(escuro) {
    document.body.classList.toggle('escuro', escuro);
    btnTema.textContent = escuro ? '☀️' : '🌙';
}

function alternarTema() {
    const escuro = !document.body.classList.contains('escuro');
    aplicarTema(escuro);
    localStorage.setItem('tema', escuro ? 'escuro' : 'claro');
}

btnTema.addEventListener('click', alternarTema);

const salvo = localStorage.getItem('tema');
const sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
aplicarTema(salvo ? salvo === 'escuro' : sistemaEscuro);

/* ---------- Formulário ---------- */
const form = document.getElementById('formLivro');
const msgForm = document.getElementById('msgForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const campos = form.elements;
    const novo = {
        titulo: campos.titulo.value.trim(),
        autor: campos.autor.value.trim(),
        link: campos.link.value.trim(),
        capa: campos.capa.value.trim() || null,
        categoria: campos.categoria.value.trim() || null
    };

    const { error } = await db.from('livros').insert(novo);

    if (error) {
        msgForm.textContent = 'Erro ao salvar: ' + error.message;
        return;
    }

    msgForm.textContent = 'Livro adicionado!';
    form.reset();
    await carregarAcervo();
});

/* ---------- Início ---------- */
carregarAcervo();