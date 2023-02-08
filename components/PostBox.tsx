import React, { useState } from 'react'
import { useSession } from 'next-auth/react';
import Avatar from './Avatar';
import { LinkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import client from '../apollo-client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutation';
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries';
type FormData = {
  postTitle: string,
  postBody: string,
  postImage: string,
  subreddit: string
}

type Props = {
  subreddit?: string
}

function PostBox({ subreddit }: Props) {
  const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false);
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [
      GET_ALL_POSTS,
      'getPosts'
    ]
  })
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>()

  const { data: session } = useSession();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      //Query for the subreddit topic
      const { data: { getSubredditListByTopic } } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subreddit
        }
      })
      const subredditExists = getSubredditListByTopic.length > 0;

      if (!subredditExists) {
        //catch subreddit
        const { data: { insertSubreddit: newSubReddit } } = await addSubreddit({
          variables: {
            topic: formData.subreddit
          }
        })

        const image = formData.postImage || ''

        const { data: { insertPost: newPost } } = await addPost({
          variables: {
            input: {
              body: formData.postBody,
              image: image,
              subreddit_id: newSubReddit.id,
              title: formData.postTitle,
              username: session?.user?.name
            }
          }
        })

      } else {
        // use existing subreddit

        const image = formData.postImage || ''

        const { data: { insertPost: newPost } } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name
          }
        })

      }

      //After the post has been added!
      setValue('postBody', '')
      setValue('postImage', '')
      setValue('postTitle', '')
      setValue('subreddit', '')
    } catch (err) {

    }
  })
  return (
    <form
      onSubmit={onSubmit}
      className='sticky top-16 z-50 rounded-md border border-gray-300 bg-white p-2 mx-auto w-full max-w-5xl'>
      <div className='flex items-center space-x-3'>
        {/* Avatar */}
        <Avatar />
        <input
          {...register('postTitle', { required: true })}
          disabled={!session}
          className='bg-gray-50 p-2 pl-5 outline-none rounded-md flex-1'
          type='text'
          placeholder={
            session
              ? subreddit
                ? `Create a post in r/${subreddit}`
                : 'Create a post by entering a title!'
              : 'Sign in'
          }
        />

        <PhotoIcon onClick={() => { setImageBoxOpen(true) }} className={`h-6 cursor-pointer text-gray-300 ${imageBoxOpen && 'text-blue-300'}`} />
        <LinkIcon className='h-6 text-gray-300' />
      </div>

      {
        !!watch('postTitle') && (
          <div className='flex flex-col py-2'>
            {/* Body */}
            <div className='flex items-center px-2'>
              <p className='min-w-[90px]'>Body:</p>
              <input
                {...register('postBody')}
                className='m-2 flex-1 bg-blue-50 p-2 outline-none'
              />
            </div>

            {
              !subreddit &&
              (
                <div className='flex items-center px-2'>
                  <p className='min-w-[90px]'>Subreddit:</p>
                  <input
                    {...register('subreddit', { required: true })}
                    className='m-2 flex-1 bg-blue-50 p-2 outline-none'
                  />
                </div>
              )
            }

            {imageBoxOpen && (
              <div className='flex px-2 items-center '>
                <p className='min-w-[90px]'>Image URL:</p>
                <input
                  className='m-2 flex-1 bg-blue-50 p-2 outline-none'
                  {...register('postImage')}
                  type='text'
                  placeholder='Optional...'
                />
              </div>
            )}

            {/* Errors */}
            {
              Object.keys(errors).length > 0 && (
                <div className='space-y-2 p-2 text-red-500'>
                  {errors.postTitle?.type === 'required' && (
                    <p className='text-black'>- A Post Title is required</p>
                  )}

                  {errors.subreddit?.type === 'required' && (
                    <p>- A Subreddit is required</p>
                  )}
                </div>
              )
            }

            {!!watch('postTitle') &&
              <button className='w-full rounded-full bg-blue-400 p-2 text-white'>
                Create Post
              </button>
            }
          </div>
        )
      }
    </form>
  )
}

export default PostBox