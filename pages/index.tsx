import type { NextPage } from 'next'
import Head from 'next/head'
import PostBox from '../components/PostBox'
import Feed from '../components/Feed'
import { useQuery } from '@apollo/client'
import { GET_SUBREDDITS_BY_LIMIT } from '../graphql/queries'
import SubredditRow from '../components/SubredditRow'

const Home: NextPage = () => {

  const { data } = useQuery(GET_SUBREDDITS_BY_LIMIT, {
    variables: {
      limit: 10
    }
  })
  return (
    <div className='max-w-screen-5xl my-7 mx-auto'>
      <Head>
        <title>Reddit 2.0 Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Post Box */}
      <PostBox />

      {/* Feed */}
      <div className='flex justify-center max-w-screen-5xl my-7 mx-auto'>
        <Feed />

        <div className='sticky top-36 mx-5 mt-5 hidden h-fit min-w-[300px]
        rounded-md border border-gray-300 bg-white lg:inline'>
          <p className='text-md mb-1 p-4 pb-3 font-bold'>Top Communities</p>
          <div>
            {/* List subreddits */}
            {data?.getSubredditListLimit.map((subreddit: Subreddit, i: number) => (
              <SubredditRow key={subreddit.id} topic={subreddit.topic} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
