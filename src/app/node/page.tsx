import { unstable_cache } from "next/cache";
import { Suspense } from "react";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

async function getLatestStory() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return fetch('https://hacker-news.firebaseio.com/v0/newstories.json', {
    next: {
      revalidate: 600
    }
  })
    .then(response => response.json())
    .then(async storyIds => {
      const randomIdx = Math.floor(Math.random() * storyIds.length);
      const storyId = storyIds[randomIdx];
      console.log({ storyId })
      return fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`)
        .then(response => response.json())
        .then(story => {
          return (story.title) as string;
        })
    })
}

const cachedHackerNews = unstable_cache(
  getLatestStory,
  ['hacker-news-node'],
  {
    revalidate: 15,
    tags: ['hacker-news-node']
  }
)

async function HackerNews() {
  const data = await cachedHackerNews();
  return <div>{data}</div>
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Suspense fallback={<div>Loading...</div>}>
        <HackerNews />
      </Suspense>
    </main>
  )
}
