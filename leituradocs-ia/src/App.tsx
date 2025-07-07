export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-800 text-white p-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-5xl font-extrabold">🚀 Tailwind CSS Teste Completo</h1>
        <p className="text-lg text-white/80">
          Se você está vendo isso com as cores, estilos e responsividade, o Tailwind está funcionando perfeitamente!
        </p>

        {/* Botões */}
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-white text-indigo-700 px-6 py-2 rounded hover:bg-indigo-100 transition-all duration-300">
            Botão Normal
          </button>
          <button className="bg-indigo-700 px-6 py-2 rounded hover:bg-indigo-800 focus:ring-2 focus:ring-white">
            Botão com Foco
          </button>
          <button className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-6 py-2 rounded shadow-md hover:scale-105 transform transition">
            Botão com Gradiente
          </button>
        </div>

        {/* Grid de cartões */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-md border border-white/20 hover:scale-105 transition-transform"
            >
              <h3 className="text-xl font-semibold mb-2">Cartão {i}</h3>
              <p className="text-sm text-white/70">
                Este é um exemplo de cartão com sombra, borda e animação ao passar o mouse.
              </p>
            </div>
          ))}
        </div>

        {/* Responsividade e tipografia */}
        <div className="mt-12 text-left">
          <h2 className="text-3xl font-bold mb-4">📱 Teste de Responsividade</h2>
          <ul className="list-disc list-inside space-y-1 text-white/90">
            <li><strong>Texto grande</strong> se adapta ao tamanho da tela.</li>
            <li><em>Espaçamento e layout</em> ajustam conforme o dispositivo.</li>
            <li>Grid muda de 1 → 2 → 3 colunas conforme o viewport.</li>
          </ul>
        </div>

        {/* Rodapé */}
        <footer className="mt-12 text-sm text-white/60">
          Desenvolvido para testar Tailwind com ❤️ — {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
