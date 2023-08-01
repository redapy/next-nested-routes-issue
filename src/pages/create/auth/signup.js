import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl">
        Hello to Signup page{" "}
        <span className="text-red-500">{router.locale}</span>{" "}
      </h1>
    </div>
  );
}
