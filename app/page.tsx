import SearchPlayer from '@/components/searchPlayer'
import Image from 'next/image'
import TablePlayer from '@/components/tablePlayer'
import TableVerifiedPlayer from '@/components/tableVerifiedPlayer'
export default function Home() {
  return (
    <div className='h-screen w-screen flex justify-center gap-10 '>
      <TablePlayer/>
      <TableVerifiedPlayer/>
    </div>
  )
}
