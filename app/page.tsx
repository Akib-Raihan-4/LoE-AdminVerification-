import SearchPlayer from '@/components/searchPlayer'
import Image from 'next/image'
import TablePlayer from '@/components/tablePlayer'
import TableVerifiedPlayer from '@/components/tableVerifiedPlayer'
export default function Home() {
  return (
    <div className='w-screen sm:flex sm:flex-col justify-center gap-2 sm:w-[1440px] sm:mx-auto '>
      <div className='flex justify-center'>
        <a className='mx-auto mt-10 font-extrabold' href='/matches'>Matches Updates ={">"} </a>
      </div>
      <TablePlayer />
      <TableVerifiedPlayer />
    </div>
  )
}
