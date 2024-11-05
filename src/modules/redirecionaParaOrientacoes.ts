export default function redirecionaParaOrientacoes(): void {
  setTimeout(() => {
    location.href = '/faq-b2b/orientacoes?pagina=1&limite=12';
  }, 2000);
}