import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-center mb-8">
        <span className="block text-3xl font-extrabold">
          Auctra | Revolutionizing Public Procurement with Blockchain
        </span>
      </h1>
      <div className="max-w-4xl mx-auto">
        <iframe
          src="https://www.youtube.com/embed/wE3Hw-uF2Zc"
          className="w-full h-full aspect-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="w-full flex justify-center mt-8 capitalize">
        <Link
          href={"/videos/prototype"}
          className={cn(
            buttonVariants({
              variant: "default",
            })
          )}
        >
          See our Prototype demo video
        </Link>
      </div>
    </div>
  );
}
