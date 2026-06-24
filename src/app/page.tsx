import { redirect } from "next/navigation";

// Trang chủ chuyển thẳng về /invite
export default function HomePage() {
  redirect("/invite");
}
