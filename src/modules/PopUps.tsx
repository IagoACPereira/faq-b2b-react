import Swal from "sweetalert2";

export function PopUpSucesso(msg: string) {
  Swal.fire({
    title: "Sucesso",
    text: msg,
    icon: "success"
  });
}

export function PopUpErro(msg: string) {
  Swal.fire({
    title: "Erro",
    text: msg,
    icon: "error"
  });
}