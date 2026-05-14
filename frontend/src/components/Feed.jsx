import Posts from './Posts'

const Feed = () => {
  return (
    <div className="min-h-screen flex flex-col items-center transition-colors duration-300 bg-white dark:bg-black">
      <h1 className="text-3xl font-bold mt-8 mb-4 text-black dark:text-white tracking-tight">LUMORA</h1>
      <div className="flex-1 w-full flex flex-col items-center px-2 sm:px-0">
        <Posts/>
      </div>
    </div>
  )
}

export default Feed