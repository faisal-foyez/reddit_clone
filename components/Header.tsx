import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/router'
import {
  BellIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  GlobeAsiaAustraliaIcon,
  PlusIcon,
  SparklesIcon,
  MegaphoneIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline'
import {
  ChevronDownIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  Bars3Icon
} from '@heroicons/react/24/solid'
import { signIn, signOut, useSession } from 'next-auth/react'
function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div className='sticky top-0 z-50 flex bg-white px-2 py-2 shadow-sm'>
      <div className='relative  h-10 w-20'>
        <Image
          className='cursor-pointer'
          onClick={() => router.push('/')}
          src='/reddit_logo.png'
          fill={true}
          alt=''
          style={{
            objectFit: 'contain'
          }}
        />
      </div>
      <div className='flex items-center mx-7 xl:min-w-[300px]'>
        <HomeIcon className='h-5 w-5' />
        <p className='flex-1 ml-2 hidden xl:inline'>Home</p>
        <ChevronDownIcon className='h-5 w-5' />
      </div>

      {/* Searchbox */}
      <form className='flex flex-1 items-center space-x-2 rounded-sm border border-gray-200 bg-gray-100 px-3 py-1'>
        <MagnifyingGlassIcon className='h-6 w-6 text-gray-400' />
        <input type='text' placeholder='Search Reddit' className='flex-1' />
        <button type='submit' hidden />
      </form>
      <div className="mx-5 hidden items-center space-x-2 text-gray-500 lg:inline-flex">
        <SparklesIcon className="icon" />
        <GlobeAsiaAustraliaIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <hr className="h-10  border border-gray-100" />
        <ChatBubbleOvalLeftEllipsisIcon className="icon" />
        <BellIcon className="icon" />
        <PlusIcon className="icon" />
        <MegaphoneIcon className="icon" />
      </div>
      <div className='ml-5 items-center lg:hidden'>
        <Bars3Icon className='icon' />
      </div>

      {/* Sign in/ Sign out button */}
      {
        session ? (
          <div onClick={() => signOut()} className='hidden items-center space-x-2 border-gray-100 border lg:flex cursor-pointer '>
            <div className='relative h-5 w-5 flex-shrink-0 '>
              <Image
                src='/reddit_vector.png'
                alt=''
                fill={true}
              />
            </div>
            <div className='text-xs'>
              <p className='truncate text-gray-500'>{session?.user?.name}</p>
              <p className='text-gray-400'>Sign Out</p>
            </div>
          </div>
        ) : (
          // Sign in Sgin out button
          <div onClick={() => signIn()} className='hidden items-center space-x-2 border-gray-100 border lg:flex cursor-pointer '>
            <div className='relative h-5 w-5 flex-shrink-0 '>
              <Image
                src='/reddit_vector.png'
                alt=''
                fill={true}

              />
            </div>
            <p className='text-gray-400'>Sign In</p>
          </div>
        )
      }
    </div>
  )
}

export default Header