import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <p className="flex justify-center text-[48px] font-bold text-blue-700">
        Hello world
      </p>
      <Button variant={"outline"}>Click</Button>
    </>
  );
}
