import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC } from '../graphql/queries'
import Post from '../components/Post'

type Props = {
  topic?: string
}
function Feed({ topic }: Props) {
  const { data, error } = !topic ? useQuery(GET_ALL_POSTS) : useQuery(GET_ALL_POSTS_BY_TOPIC, {
    variables: {
      topic: topic
    }
  });

  const posts: Post[] = !topic ? data?.getPosts : data?.getPostsByTopic;
  return (
    <div className='mt-5 space-y-4 w-full max-w-3xl'>
      {posts?.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

export default Feed