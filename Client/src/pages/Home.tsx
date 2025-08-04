import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">Unknot 🧶</h1>
      <p className="text-lg text-center max-w-md">Got into a misunderstanding with a friend? We’ll help you decide what to do — talk, wait, or think it through.</p>
      <button
        onClick={() => navigate('/questions')}
        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
      >
        Start
      </button>
    </div>
  )
}
