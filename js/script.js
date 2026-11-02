const acervo = [
    {
        titulo: 'O Cortiço',
        autor: 'Aluísio Azevedo',
        capa: '/biblioteca-virtual/img/liv.cortico.png',
        link: 'https://drive.google.com/file/d/0BwGHnXDgyRQOYjBKTFVYdWVRcVk/view?resourcekey=0-FmeTvLPgj6RK_ltYSaSZPA'
    },
    {
        titulo: 'O Mulato',
        autor: 'Aluísio Azevedo',
        capa: '/biblioteca-virtual/img/omulato.png',
        link: 'https://drive.google.com/file/d/0B2ODxRLYQiZBUVdMTm1VamIxNms/view?usp=drive_link&resourcekey=0-3X_Kx798KmkoYU-G4iM9RA'
    },
    {
        titulo: 'Dom Casmurro',
        autor: 'Machado de Assis',
        capa: '/biblioteca-virtual/img/dom.jpg',
        link: 'https://drive.google.com/file/d/0B4KjWcTpqTHaTzg2VnhucXQ3TWc/view?usp=drive_link&resourcekey=0-9rgZWeLUm1py_FUNtOIqWw'
    },
    {
        titulo: 'Memórias Póstumas de Brás Cubas',
        autor: 'Machado de Assis',
        capa: '/biblioteca-virtual/img/memorias.bras.cubas.jpg',
        link: 'https://drive.google.com/file/d/0B4KjWcTpqTHaQWpkVWVJdVJGSFk/view?usp=drive_link&resourcekey=0-2H2L4RiQ6d2SmGfVmsZQZw'
    },
    {
        titulo: 'O Guarani',
        autor: 'José de Alencar',
        capa: '/biblioteca-virtual/img/o.guarani.jpg',
        link: 'https://drive.google.com/file/d/1rx-w2ZR1UlsEMfc0HUk2ZYnbRdsDUUFo/view'
    },
    {
        titulo: 'A Moreninha',
        autor: 'Joaquim Manuel de Macedo',
        capa: '/biblioteca-virtual/img/A.moreninha.jpg',
        link: 'https://drive.google.com/file/d/1aj3zDeubMZu9Sm_H6KbEU1SVGiCQ84jA/view'
    }
];

const lista = document.querySelector('.places');
const inputBusca = document.getElementById('busca');
const btnBusca = document.getElementById('btnBusca');
const semResultado = document.getElementById('semResultado');

function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function criarCard(livro) {
    return `
        <article>
            <img src="${livro.capa}" alt="Capa de ${livro.titulo}">
            <div class="card-info">
                <h3>${livro.titulo}</h3>
                <p>Livro de ${livro.autor}</p>
                <button class="btn-ler" onclick="window.open('${livro.link}', '_blank')">
                    Leia Agora
                </button>
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

btnBusca.addEventListener('click', filtrar);
inputBusca.addEventListener('input', filtrar);

renderizar(acervo);

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