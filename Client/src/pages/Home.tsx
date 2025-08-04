import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-violet-100 via-rose-100 to-purple-200 ">
      <h1 className="text-5xl md:text-6xl font-extrabold text-purple-700 mb-4 tracking-wide drop-shadow-md ">
        Unknot 🧶
      </h1>

      <p className="text-lg md:text-xl max-w-xl text-purple-800 mb-8 leading-relaxed">
        Friendships get tangled. Emotions get heavy. Let’s gently help you find clarity —
        whether it’s time to talk, wait, or just breathe.
      </p>

      <button
        onClick={() => navigate('/questions')}
        className="px-6 py-3 rounded-full bg-purple-600 text-white text-lg font-medium hover:bg-purple-700 shadow-lg transition duration-300"
      >
        Begin the Unknotting ✨
      </button>

      <p className="text-sm mt-6 text-purple-600 italic">You’re safe here. No judgment. Just guidance.</p>
    </div>
  )
}
