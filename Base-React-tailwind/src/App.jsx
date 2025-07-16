function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6 space-y-12">
      {/* Cabeçalho */}
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-2">
          🚀 Vite + React + Tailwind
        </h1>
        <p className="text-lg text-gray-600">Testando componentes e utilitários do Tailwind CSS</p>
      </header>

      {/* Botões */}
      <section className="flex gap-4 justify-center flex-wrap">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Clique aqui</button>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:scale-105 transition">Confirmar</button>
        <button className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-100">Cancelar</button>
      </section>

      {/* Alerta */}
      <section className="max-w-xl mx-auto bg-yellow-100 text-yellow-800 p-4 rounded shadow">
        ⚠️ Isso é apenas um alerta de demonstração!
      </section>

      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2">Card {n}</h2>
            <p className="text-gray-600">Conteúdo de exemplo para testar layout com Tailwind CSS.</p>
          </div>
        ))}
      </section>

      {/* Lista com ícones */}
      <section className="max-w-md mx-auto">
        <ul className="space-y-2">
          <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Lista com ícone 1</li>
          <li className="flex items-center gap-2"><span className="text-blue-500">📘</span> Lista com ícone 2</li>
          <li className="flex items-center gap-2"><span className="text-pink-500">❤️</span> Lista com ícone 3</li>
        </ul>
      </section>

      {/* Formulário simples */}
      <section className="max-w-md mx-auto bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-bold">Formulário</h3>
        <input type="text" placeholder="Seu nome" className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300" />
        <input type="email" placeholder="Seu email" className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300" />
        <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Enviar</button>
      </section>
    </div>
  )
}

export default App
