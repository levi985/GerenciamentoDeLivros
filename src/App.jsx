import { useState, useEffect, useRef, useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

export function App() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const [livros, setLivros] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [ano, setAno] = useState(new Date().getFullYear());
  const [busca, setBusca] = useState('');

  const [livrosArmazenados, setLivrosArmazenados] = useLocalStorage('catalogo_livros', []);

  const inputBuscaRef = useRef(null);

  useEffect(() => {
    const carregarLivros = async () => {
      try {
        setCarregando(true);
        if (livrosArmazenados.length === 0) {
          const resposta = await fetch('/books.json');
          if (!resposta.ok) {
            throw new Error('Erro ao buscar o arquivo de livros');
          }
          const dados = await resposta.json();
          const livrosConvertidos = dados.map(livro => ({
            id: livro.id,
            titulo: livro.title || livro.titulo,
            autor: livro.author || livro.autor,
            ano: livro.year || livro.ano
          }));
          setLivros(livrosConvertidos);
          setLivrosArmazenados(livrosConvertidos);
        } else {
          const livrosConvertidos = livrosArmazenados.map(livro => ({
            id: livro.id,
            titulo: livro.title || livro.titulo,
            autor: livro.author || livro.autor,
            ano: livro.year || livro.ano
          }));
          setLivros(livrosConvertidos);
        }
      } catch (erro) {
        console.error('Erro:', erro);
        setErro('Não foi possível carregar os livros. Tente mais tarde.');
      } finally {
        setCarregando(false);
      }
    };

    carregarLivros();
    
    if (inputBuscaRef.current) {
      inputBuscaRef.current.focus();
    }
  }, []);

  //add livro
  const adicionarLivro = (e) => {
    e.preventDefault();

    if (!titulo.trim() || !autor.trim()) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    const novoLivro = {
      id: Math.max(...livros.map(l => l.id), 0) + 1,
      titulo: titulo.trim(),
      autor: autor.trim(),
      ano: parseInt(ano),
    };

    const novaLista = [...livros, novoLivro];
    setLivros(novaLista);
    setLivrosArmazenados(novaLista);

    setTitulo('');
    setAutor('');
    setAno(new Date().getFullYear());
  };

  const removerLivro = (id) => {
    const novaLista = livros.filter(livro => livro.id !== id);
    setLivros(novaLista);
    setLivrosArmazenados(novaLista);
  };

  // Filtragem dos livros 
  const livrosFiltrados = livros.filter(livro =>
    livro.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    livro.autor.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      <div className="container">
        <header className="header">
          <div className="header-conteudo">
            <h1>📚 Catálogo de Livros</h1>
            <button 
              className="btn-tema" 
              onClick={toggleTheme}
              title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <section className="secao-formulario">
          <h2>Adicionar Novo Livro</h2>
          <form onSubmit={adicionarLivro} className="formulario">
            <div className="grupo-input">
              <label htmlFor="titulo">Título:</label>
              <input
                id="titulo"
                type="text"
                placeholder="Ex: O Senhor dos Anéis"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="input"
              />
            </div>

            <div className="grupo-input">
              <label htmlFor="autor">Autor:</label>
              <input
                id="autor"
                type="text"
                placeholder="Ex: J.R.R. Tolkien"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                className="input"
              />
            </div>

            <div className="grupo-input">
              <label htmlFor="ano">Ano:</label>
              <input
                id="ano"
                type="number"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                className="input"
              />
            </div>

            <button type="submit" className="btn btn-primario">
              ➕ Adicionar Livro
            </button>
          </form>
        </section>

        <section className="secao-busca">
          <h2>Buscar Livros</h2>
          <input
            ref={inputBuscaRef}
            type="text"
            placeholder="Buscar por título ou autor..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-busca"
          />
        </section>

        {erro && (
          <div className="alerta alerta-erro">
            ⚠️ {erro}
          </div>
        )}

        {carregando && (
          <div className="alerta alerta-info">
            ⏳ Carregando livros...
          </div>
        )}

        {!carregando && (
          <section className="secao-livros">
            <h2>
              📖 Livros ({livrosFiltrados.length})
            </h2>

            {livrosFiltrados.length === 0 ? (
              <div className="alerta alerta-info">
                Nenhum livro encontrado. Adicione um novo livro acima! 😊
              </div>
            ) : (
              <div className="grade-livros">
                {livrosFiltrados.map((livro) => (
                  <div key={livro.id} className="cartao-livro">
                    <div className="cartao-conteudo">
                      <h3 className="cartao-titulo">{livro.titulo}</h3>
                      <p className="cartao-autor">
                        <strong>Autor:</strong> {livro.autor}
                      </p>
                      <p className="cartao-ano">
                        <strong>Ano:</strong> {livro.ano}
                      </p>
                    </div>
                    <button
                      onClick={() => removerLivro(livro.id)}
                      className="btn btn-secundario"
                    >
                      🗑️ Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <footer className="rodape">
          <p>© 2025 Catálogo de Livros</p>
        </footer>
      </div>
    </div>
  );
}
