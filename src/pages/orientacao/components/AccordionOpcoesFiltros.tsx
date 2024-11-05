import { Link } from "react-router-dom";
import FiltrosOrientacoes from "./FiltrosOrientacoes";

export default function AccordionOpcoesFiltros() {
  return (
    <div className="accordion accordion-flush border mb-3" id="accordionFlushExample">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button className="accordion-button collapsed bi bi-tools" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
            &nbsp;
            Opções
          </button>
        </h2>
        <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
          <div className="accordion-body">
            <Link to={'/faq-b2b/nova/orientacao'} className="btn btn-primary bi bi-plus-circle">
              &nbsp;
              Nova Orientação
            </Link>
          </div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button className="accordion-button collapsed bi bi-funnel" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
            &nbsp;
            Filtros
          </button>
        </h2>
        <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
          <div className="accordion-body">
            <FiltrosOrientacoes />
          </div>
        </div>
      </div>
    </div>
  )
}