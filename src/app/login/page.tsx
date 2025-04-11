import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-100 to-pink-100">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-pink-600">DatingApp</h1>
          <p className="text-gray-600 mt-2">
            Temukan pasangan yang cocok untukmu
          </p>
        </div>

        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <p className="text-lg font-medium">Masuk untuk mulai</p>
            </div>

            <div className="space-y-4">
              <button className="w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition flex items-center justify-center">
                <span>Masuk dengan Email</span>
              </button>

              <button className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center justify-center">
                <span>Masuk dengan Facebook</span>
              </button>

              <button className="w-full py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg transition flex items-center justify-center">
                <span>Masuk dengan Google</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <Link href="/register" className="text-pink-600 font-medium">
                  Daftar sekarang
                </Link>
              </p>
            </div>

            {/* Tombol langsung masuk untuk pengembangan */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                href="/swipe"
                className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-center text-gray-700 rounded-lg transition"
              >
                Masuk Langsung (Development Mode)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
