

const inputBusca = document.getElementById('busca');
const btnBusca = document.getElementById('btnBusca');
const livros = document.querySelectorAll('.places article');
const semResultado = document.getElementById('semResultado');

function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function filtrar() {
    const termo = normalizar(inputBusca.value.trim());
    let encontrados = 0;

    livros.forEach(livro => {
        const texto = normalizar(livro.textContent);
        const combina = texto.includes(termo);

        livro.style.display = combina ? '' : 'none';
        if (combina) encontrados++;
    });

    semResultado.hidden = encontrados > 0;
}

btnBusca.addEventListener('click', filtrar);
inputBusca.addEventListener('input', filtrar);
inputBusca.addEventListener('keydown', e => {
    if (e.key === 'Enter') filtrar();
<<<<<<< HEAD
});

const acervo =[
    {
        titulo: '',
        autor: '',
        capa: '',
        link: '',
    }
   
]
