const db = window.supabase.createClient('https://qfvjglqkefqyvgmhdysz.supabase.co', 'sb_publishable_GquFh9qHOnPAQHwK5XzT1w_KWjM17e4');

const lista = document.querySelector('.places');
const inputBusca = document.getElementById('busca');
const btnBusca = document.getElementById('btnBusca');
const semResultado = document.getElementById('semResultado');

let acervo = [];
let categoriaAtual = 'Todas';

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

    const resultado = acervo.filter(livro => {
        const combinaBusca = normalizar(livro.titulo + ' ' + livro.autor).includes(termo);
        const combinaCategoria = categoriaAtual === 'Todas' || livro.categoria === categoriaAtual;
        return combinaBusca && combinaCategoria;
    });

    renderizar(resultado);
}
const boxCategorias = document.getElementById('categorias');

function renderizarCategorias() {
    const categorias = [...new Set(acervo.map(livro => livro.categoria).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, 'pt-BR'));

    // se a categoria escolhida deixou de existir, volta para "Todas"
    if (!categorias.includes(categoriaAtual)) categoriaAtual = 'Todas';

    boxCategorias.hidden = categorias.length === 0;
    boxCategorias.innerHTML = ['Todas', ...categorias].map(cat => `
        <button type="button" class="chip ${cat === categoriaAtual ? 'ativa' : ''}"
                data-categoria="${escapar(cat)}" aria-pressed="${cat === categoriaAtual}">
            ${escapar(cat)}
        </button>
    `).join('');
}

boxCategorias.addEventListener('click', (e) => {
    const botao = e.target.closest('.chip');
    if (!botao) return;

    categoriaAtual = botao.dataset.categoria;
    renderizarCategorias();
    filtrar();
});

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
    renderizarCategorias();
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
    setTimeout(() => painelForm.close(), 1000);
});

/* ---------- Painel do formulário ---------- */
const btnAbrirForm = document.getElementById('btnAbrirForm');
const btnFecharForm = document.getElementById('btnFecharForm');
const painelForm = document.getElementById('painelForm');

btnAbrirForm.addEventListener('click', () => {
    msgForm.textContent = '';
    painelForm.showModal();
});

btnFecharForm.addEventListener('click', () => painelForm.close());

// clicar no fundo escuro também fecha
painelForm.addEventListener('click', (e) => {
    if (e.target === painelForm) painelForm.close();
});

/* ---------- Início ---------- */
carregarAcervo();
const formLogin = document.getElementById('formLogin');
const msgLogin = document.getElementById('msgLogin');
const areaAdmin = document.getElementById('areaAdmin');
const btnSair = document.getElementById('btnSair');
const abas = document.querySelectorAll('.aba');
const painelExcluir = document.getElementById('painelExcluir');
const listaExcluir = document.getElementById('listaExcluir');
const msgExcluir = document.getElementById('msgExcluir');

function mostrarAdmin(logado) {
    formLogin.hidden = logado;
    areaAdmin.hidden = !logado;
}

function renderizarExclusao() {
    if (acervo.length === 0) {
        listaExcluir.innerHTML = '<li>Nenhum livro cadastrado.</li>';
        return;
    }

    listaExcluir.innerHTML = acervo.map(livro => `
        <li>
            <span>${escapar(livro.titulo)}<small>${escapar(livro.autor)}</small></span>
            <button type="button" class="btn-excluir" data-id="${livro.id}">Excluir</button>
        </li>
    `).join('');
}

function mostrarAba(nome) {
    form.hidden = nome !== 'adicionar';
    painelExcluir.hidden = nome !== 'excluir';

    abas.forEach(aba => {
        const ativa = aba.dataset.aba === nome;
        aba.classList.toggle('ativa', ativa);
        aba.setAttribute('aria-selected', ativa);
    });

    if (nome === 'excluir') {
        msgExcluir.textContent = '';
        renderizarExclusao();
    }
}

abas.forEach(aba => {
    aba.addEventListener('click', () => mostrarAba(aba.dataset.aba));
});

listaExcluir.addEventListener('click', async (e) => {
    const botao = e.target.closest('.btn-excluir');
    if (!botao) return;

    const id = Number(botao.dataset.id);
    const livro = acervo.find(l => l.id === id);

    if (!confirm(`Excluir "${livro.titulo}"? Essa ação não pode ser desfeita.`)) return;

    const { data, error } = await db.from('livros').delete().eq('id', id).select();

    if (error) {
        msgExcluir.textContent = 'Erro ao excluir: ' + error.message;
        return;
    }

    if (data.length === 0) {
        msgExcluir.textContent = 'Nada foi excluído. Confira se você está logado e se a policy de exclusão existe.';
        return;
    }

    msgExcluir.textContent = 'Livro excluído.';
    await carregarAcervo();
    renderizarExclusao();
});

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    msgLogin.textContent = 'Entrando...';

    const { error } = await db.auth.signInWithPassword({
        email: formLogin.elements.email.value.trim(),
        password: formLogin.elements.senha.value
    });

    if (error) {
        msgLogin.textContent = 'E-mail ou senha incorretos.';
        return;
    }

    formLogin.reset();
    msgLogin.textContent = '';
});

btnSair.addEventListener('click', () => db.auth.signOut());

db.auth.onAuthStateChange((evento, sessao) => {
    mostrarAdmin(Boolean(sessao));
});

db.auth.getSession().then(({ data }) => mostrarAdmin(Boolean(data.session)));
