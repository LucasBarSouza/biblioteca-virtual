

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
});

const acervo =[
    {
        titulo: 'O Cortiço',
        autor: 'Aluísio Azevedo',
        capa: '/biblioteca-virtual/img/liv.cortico.png',
        link: 'https://drive.google.com/file/d/0BwGHnXDgyRQOYjBKTFVYdWVRcVk/view?resourcekey=0-FmeTvLPgj6RK_ltYSaSZPA',
    },
    {
        titulo: 'O Mulato',
        autor: 'Aluísio Azevedo',
        capa: '/biblioteca-virtual/img/omulato.png',
        link: 'https://drive.google.com/file/d/0B2ODxRLYQiZBUVdMTm1VamIxNms/view?usp=drive_link&resourcekey=0-3X_Kx798KmkoYU-G4iM9RA',
    },
    {
        titulo: 'Dom Casmurro',
        autor: 'Machado de Assis',
        capa: '/biblioteca-virtual/img/dom.jpg',
        link: 'https://drive.google.com/file/d/0B4KjWcTpqTHaTzg2VnhucXQ3TWc/view?usp=drive_link&resourcekey=0-9rgZWeLUm1py_FUNtOIqWw',
    },
    {
        titulo: 'Memorias Póstumas de Bras Bubas',
        autor: 'Machado de Assis',
        capa: '/biblioteca-virtual/img/memorias.bras.cubas.jpg',
        link: 'https://drive.google.com/file/d/0B4KjWcTpqTHaQWpkVWVJdVJGSFk/view?usp=drive_link&resourcekey=0-2H2L4RiQ6d2SmGfVmsZQZw',
    },
    {
        titulo: 'O Guarani',
        autor: 'José de Alencar',
        capa: '/biblioteca-virtual/img/o.guarani.jpg',
        link: 'https://drive.google.com/file/d/1rx-w2ZR1UlsEMfc0HUk2ZYnbRdsDUUFo/view',
    }
];

