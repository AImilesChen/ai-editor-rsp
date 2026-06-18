import { redirect } from "next/navigation";

export default function RefundRedirectPage() {
  redirect("/account/billing#refund");
}
