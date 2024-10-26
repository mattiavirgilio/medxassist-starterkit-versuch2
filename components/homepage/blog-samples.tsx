import { TITLE_TAILWIND_CLASS } from '@/utils/constants'
import Link from "next/link"
export default function BlogSample() {

  const articles = [
    {
      id: 1,
      video: "https://your-video-url.com/video1.mp4",
      title: "Der neue unsichtbare Mitarbeiter",
      date: "2024-08-15 21:16:04.765648-05"
    },
    {
      id: 2,
      video: "https://your-video-url.com/video1.mp4",
      title: "Entlastung des Praxispersonals durch Automatisierung und KI",
      date: "2024-10-16 08:29:32.188999-05"
    },
    {
      id: 3,
      video: "https://your-video-url.com/video1.mp4",
      title: "Kostenreduzierung durch KI Systeme",
      date: "2024-11-30 15:20:52.368844-05"
    }
  ]

  return (
    <div className="flex flex-col justify-center items-center">
      <div className='flex flex-col items-center p-3 w-full'>
        <div className='flex flex-col justify-start items-center gap-2 w-full'>
          <div className='flex gap-3 justify-start items-center w-full'>
            <h1 className={`${TITLE_TAILWIND_CLASS} mt-1 font-semibold tracking-tight dark:text-white text-gray-900`}>
              MedXAssist: Fallstudien
            </h1>
          </div>
          <div className='flex gap-3 justify-start items-center w-full border-b pb-4'>
            <p className="text-gray-600 dark:text-gray-400">
                Einblicke unserer KI-Lösungen an verschiedenen Praxen
            </p>
          </div>
        </div>
      </div>
      <div className='flex flex-col items-start'>
        <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-5">
          {articles?.map((article) => (
            <Link href={"/"} key={article?.id}>
              <article
                className="flex flex-col space-y-2 p-4 rounded-md border dark:bg-black"
              >
                <video
                src={article?.video}
                width="804"
                height="452"
                controls
                autoPlay
                loop
                muted
                className="rounded-md border bg-muted transition-colors"
                />
                <div className='flex lg:flex-row w-full justify-between items-center'>
                  <h2 className="text-md lg:text-lg font-bold">{article?.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(article?.date!)?.toLocaleDateString()}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>

  )
}
