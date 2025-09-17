import Swal, { type SweetAlertOptions } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const _Alert = withReactContent(Swal);

export function Alert(props: SweetAlertOptions) {
  return _Alert.fire({
    ...props,
    confirmButtonColor: props.confirmButtonColor ?? "#00C000",
  });
}
