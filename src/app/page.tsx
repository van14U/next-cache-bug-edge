import { unstable_cache } from "next/cache";
import { Suspense } from "react";

export const runtime = "edge";

async function getLatestStory() {
  // Fetch the latest item IDs from the Hacker News API
  return fetch('https://hacker-news.firebaseio.com/v0/newstories.json', {
    cache: 'no-store',
  }).then(response => response.json())
    .then(storyIds => {
      console.log({ storyIds })
      // Assuming the first ID is the latest story
      if (storyIds.length > 0) {
        // Fetch the details of the latest story
        const randomIdx = Math.floor(Math.random() * storyIds.length);
        const storyId = storyIds[randomIdx];
        return fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`, {
          cache: 'no-store',
        })
          .then(response => response.json())
          .then(story => {
            console.log({ story })
            // Log the title of the latest story
            return (story.title) as string;
          })
      }
      return "No news found";
    })
}

const cachedHackerNews = unstable_cache(
  getLatestStory,
  ['hacker-news'],
  { revalidate: 10 }
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
