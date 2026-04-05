import { redirect } from "next/navigation";

/**
 * AD_LABS Root Redirect
 * Garantindo que a página inicial redirecione para o cockpit central.
 */
export default function RootPage() {
  redirect("/canais");
}
