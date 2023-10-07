import SearchPlayer from '@/components/searchPlayer'
import Image from 'next/image'
import TablePlayer from '@/components/tablePlayer'
import TableVerifiedPlayer from '@/components/tableVerifiedPlayer'
export default function Home() {
  return (
    <div className='w-screen sm:flex justify-center gap-2 '>
      <TablePlayer/>
      <TableVerifiedPlayer/>
    </div>
  )
}
