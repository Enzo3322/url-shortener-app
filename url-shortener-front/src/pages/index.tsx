import { FormEvent, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");

  const createShortenUrl = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetch("http://localhost:5000/shorten", {
      method: "POST",
      body: JSON.stringify({
        originalUrl: currentUrl,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res: { shortUrl: string }) => {
        setData(res.shortUrl);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const copyData = async () => {
    await navigator.clipboard.writeText(data);
    toast.success("Copiado", {
      position: "bottom-center",
      autoClose: 2500,
    });
  };

  return (
    <main className="bg-slate-900">
      <section className="max-w-5xl m-auto">
        <div className="flex flex-col h-screen items-center justify-center">
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              Shortener
            </span>
          </h1>
          <h2 className="text-5xl mb-4 font-bold text-white text-center">
            Rápido e Fácil, como deve ser.
          </h2>
          <p className="text-2xl mb-8 text-white">
            Insira a url que deseja encurtar
          </p>

          <div className="flex flex-col items-start justify-center">
            <div className="flex flex-col items-center gap-8">
              <form onSubmit={createShortenUrl}>
                <input
                  className="bg-slate-500 outline-none p-2 rounded-l text-white"
                  type="url"
                  value={currentUrl}
                  placeholder="Sua url aqui!"
                  required
                  onChange={(e) => setCurrentUrl(e.target.value)}
                />
                <button
                  className="h-full px-4 font-bold rounded-r text-white bg-gradient-to-r to-emerald-600 from-sky-400 hover:brightness-[1.1]"
                  type="submit"
                >
                  {loading ? "Carregando" : "Enviar"}
                </button>
              </form>
              {data && (
                <div className="flex">
                  <p className="bg-slate-500 outline-none p-2 min-w-[200px] rounded-l text-white">
                    {data}
                  </p>
                  <button
                    className="h-full px-4 font-bold rounded-r bg-gradient-to-r to-emerald-600 from-sky-400 hover:brightness-[1.1]"
                    onClick={copyData}
                  >
                    <FaCopy />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
