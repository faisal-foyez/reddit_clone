import React from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_POST_BY_POSTID } from '../../graphql/queries'
import Post from '../../components/Post'
import { Jelly } from '@uiball/loaders'
import { useForm, SubmitHandler } from 'react-hook-form'
import { ADD_COMMENT } from '../../graphql/mutation'
import toast from 'react-hot-toast'
import Avatar from '../../components/Avatar'
import TimeAgo from 'react-timeago'

type FormData = {
  comment: string,
}

function PostPage() {
  const router = useRouter()
  const { data: session } = useSession()

  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [
      {
        query: GET_POST_BY_POSTID,
        variables: { postId: router.query.postId }
      }
    ]
  })

  const { data } = useQuery(GET_POST_BY_POSTID, {
    variables: {
      postId: router.query.postId
    }
  })

  const post: Post = data?.getPost;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {

    const notification = toast.loading('Posting you comment');

    await addComment({
      variables: {
        input: {
          text: data.comment,
          post_id: router.query.postId,
          username: session?.user?.name
        }
      }
    })

    setValue('comment', '');
    toast.success('Comment Successfully Posted!', {
      id: notification
    })
  }

  if (!post) {
    return (
      <div className='w-full flex items-center justify-center'>
        <Jelly color="#FF4501" size={50} />
      </div>
    )
  }
  return (
    <div className='max-w-5xl mx-auto my-7 hover:border hover:border-black hover:rounded-md cursor-pointer'>
      <Post post={post} />

      <div className='-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16'>
        <p className='text-sm'>
          Comment as <span className='text-red-500'>{session?.user?.name}</span>
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex max-w-5xl flex-col space-y-2'>
          <textarea
            {...register('comment')}
            disabled={!session}
            className='h-24 rounded-md border border-gray-200 
            p-2 pl-4 outline-none disabled:bg-gray-50'
            placeholder={session ? 'What are your thoughts?' : 'Please sig in to comment'}
          />
          <button disabled={!session} className='rounded-full bg-red-400 p-3 font-semibold text-white disabled:bg-gray-200'>Comment</button>
        </form>
      </div>
      <div className='-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 px-10'>
        <hr />
        {post?.comments.map(comment => (
          <div className='flex items-center space-x-2 space-y-5 relative' key={comment.id}>
            <hr className='absolute top-10 left-7 z-0 h-16 border' />
            <div>
              <Avatar seed={comment.username} />
            </div>

            <div className='flex flex-col'>
              <p className='py-2 text-xs text-gray-400'>
                <span className='font-semibold text-gray-600'>{comment.username}</span> .{' '}
                <TimeAgo date={comment.created_at} />
              </p>
              <p>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostPage