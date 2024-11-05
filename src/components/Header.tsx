import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-light p-3 border-bottom">
      <h1>FAQ B2B</h1>

      <nav>
        <ul style={{
          listStyle: 'none',
          display: 'flex',
        }} className="p-0">
          <li className="me-3"><Link style={{ textDecoration: 'none' }} to={'/faq-b2b/orientacoes?pagina=1&limite=12'}>Orientações</Link></li>
          <li className="me-3"><Link style={{ textDecoration: 'none' }} to={'/faq-b2b/temas?filtroTema=[]'}>Temas</Link></li>
          <li className="me-3"><Link style={{ textDecoration: 'none' }} to={'/faq-b2b/orientadores?pagina=1&limite=12'}>Orietadores</Link></li>
          <li className="me-3"><Link style={{ textDecoration: 'none' }} to={'/feedbacks?pagina=1&limite=12'}>Feedback</Link></li>
        </ul>
      </nav>
    </header>
  )
}