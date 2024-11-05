import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from "./components/Header"
import Orientacoes from './pages/orientacao/Orientacoes'
import Orientadores from './pages/orientador/Orientadores'
import Temas from './pages/tema/Temas'
import Feedbacks from './pages/feedback/Feedbacks'
import Footer from './components/Footer'
import NovaOrientacao from './pages/orientacao/NovaOrientacao'
import Orientacao from './pages/orientacao/Orientacao'
import AtualizaOrientacao from './pages/orientacao/AtualizaOrientacao'
import GerenciarTemas from './pages/tema/GerenciarTemas'
import NovoTema from './pages/tema/NovoTema'
import AtualizarTema from './pages/tema/AtualizarTema'

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path='/faq-b2b/orientacoes' element={ <Orientacoes /> } />
        <Route path='/faq-b2b/nova/orientacao' element={ <NovaOrientacao /> } />
        <Route path='/faq-b2b/orientacao' element={ <Orientacao /> } />
        <Route path='/faq-b2b/atualiza/orientacao' element={ <AtualizaOrientacao /> } />
        <Route path='/faq-b2b/orientadores' element={ <Orientadores /> } />
        <Route path='/faq-b2b/temas' element={ <Temas /> } />
        <Route path='/faq-b2b/gerenciar/temas' element={ <GerenciarTemas /> } />
        <Route path='/faq-b2b/novo/tema' element={ <NovoTema /> } />
        <Route path='/faq-b2b/atualiza/tema' element={ <AtualizarTema /> } />
        <Route path='/feedbacks' element={ <Feedbacks /> } />
      </Routes>

      <Footer />
    </Router>
  )
}

export default App
