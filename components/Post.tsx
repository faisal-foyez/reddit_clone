import React, { useState, useEffect } from 'react'
import Avatar from './Avatar'
import TimeAgo from 'react-timeago'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
  GiftIcon,
  ShareIcon,
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_VOTES_BY_POSTID } from '../graphql/queries'
import { CAST_VOTE } from '../graphql/mutation'


type Props = {
  post: Post
}

function Post({ post }: Props) {
  const [vote, setVote] = useState<boolean>();
  const { data: session } = useSession();
  const router = useRouter();

  const { data, loading } = useQuery(GET_ALL_VOTES_BY_POSTID, {
    variables: {
      postId: post?.id
    }
  })

  const [castVote] = useMutation(CAST_VOTE, {
    refetchQueries: [
      {
        query: GET_ALL_VOTES_BY_POSTID,
        variables: {
          postId: post?.id
        }
      }
    ]
  })

  const upVote = async (isUpvote: boolean) => {
    if (!session) {
      toast("! You'll need to sign in to Vote")
      return;
    }

    if (vote && isUpvote) return;
    if (vote === false && !isUpvote) return;


    await castVote({
      variables: {
        input: {
          post_id: post.id,
          upvote: isUpvote,
          username: session?.user?.name
        }
      }
    })
  }

  useEffect(() => {
    const votes: Vote[] = data?.getVotesByPostId;

    const vote = votes?.find(vote => vote.username === session?.user?.name)?.upvote

    setVote(vote);
  }, [data])
  return (
    <div onClick={(e) => { router.push(`/post/${post?.id}`) }} className='flex rounded-md cursor-pointer border border-gray-300 bg-white shadow-sm hover:border hover:border-gray-600'>
      {/* Votes */}
      <div className='flex flex-col items-center justfiy-start sapce-y-1  
        rounded-l-md  bg-gray-50 p-4 text-gray-400 '>
        <ArrowUpIcon onClick={(e) => { e.stopPropagation(); upVote(true) }} className={`voteButtons hover:text-blue-400 ${vote && 'text-blue-400'}`} />
        <p className='text-black font-bold text-xs'>{data?.getVotesByPostId?.reduce((result: number, vote: { upvote: any }) => (result += vote.upvote ? 1 : -1), 0)}</p>
        <ArrowDownIcon onClick={(e) => { e.stopPropagation(); upVote(false) }} className={`voteButtons hover:text-red-400 ${vote === false && 'text-blue-400'}`} />
      </div>
      <div className='p-3 pb-1'>
        {/* Header */}
        <div className='flex items-center space-x-2'>
          <Avatar seed={post.subreddit?.topic} />
          <p className='text-xs text-gray-400'>
            <Link href={`/subreddit/${post.subreddit?.topic}`}>
              <span className='font-bold text-black hover:text-blue-400 hover:underline'>
                r/{post.subreddit?.topic}
              </span>
            </Link>{' '}
            • Posted by u/
            {post?.username} <TimeAgo date={parseInt(post?.created_at)} />
          </p>
        </div>

        {/* Body */}
        <div className='py-4'>
          <h2 className='text-xl font-semibold'>{post.title}</h2>
          <p className='mt-2 text-sm font-light'>{post.body}</p>
        </div>

        {/* Image */}
        <img className='w-full' src={post.image} alt='' />

        {/* Footer */}
        <div className='flex space-x-4 text-gray-400'>
          <div className='postButtons'>
            <ChatBubbleLeftIcon className='h-6 w-6' />
            <p className='hidden sm:inline-block'>{post.comments.length} Comments</p>
          </div>
          <div className='postButtons'>
            <GiftIcon className='h-6 w-6' />
            <p className='hidden sm:inline-block'>Award</p>
          </div>
          <div className='postButtons'>
            <ShareIcon className='h-6 w-6' />
            <p className='hidden sm:inline-block'>Share</p>
          </div>
          <div className='postButtons'>
            <BookmarkIcon className='h-6 w-6' />
            <p className='hidden sm:inline-block'>Save</p>
          </div>
          <div className='postButtons'>
            <EllipsisHorizontalIcon className='h-6 w-6' />
            <p className='hidden sm:inline-block'></p>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Post