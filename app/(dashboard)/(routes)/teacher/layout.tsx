import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const layout = ({ children }: { children: React.ReactNode }) => {
  const { sessionClaims } = auth();
  if (sessionClaims?.metadata?.role !== "admin") {
    return redirect("/");
  }
  return <> {children}</>;
};

export default layout;
