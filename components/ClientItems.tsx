'use client';
import { useState } from 'react';

import Image from 'next/image';
import InfiniteScroll from 'react-infinite-scroll-component';
import { supabase } from '../utils/supabaseServer';
export const revalidate = 10;
const first = 8;

async function getData(publickey: string, st = 0, ed = revalidate - 1) {
  const { data, error } = await supabase
    .from('posts')
    .select()
    .eq('publickey', publickey)
    .order('inserted_at', { ascending: false })
    .range(st+first, ed+first);

  return data;
}


const ClientItems = ({ publickey }: any) => {
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchMore = async () => {
    const len = data.length;
    const res: any = await getData(publickey, len, len+revalidate-1);
    if(res.length === 0) {
      setHasMore(false);
      return ;
    }
    const newData = data.concat(res);
    setData(newData);
  }
  
  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={<h3> </h3>}
    >


      <div className='flex-cols items-center justify-center'>
        <div className='grid grid-cols-2 gap-y-10 gap-x-6 md:grid-cols-4'>
          {data.map((item: any, idx: number) => (
            <a key={item.id} href={`/download/${item.id}`} className='group'>
              <div className='aspect-w-2 aspect-h-3 w-full overflow-hidden rounded-lg sm:aspect-w-2 sm:aspect-h-3 ransition-all duration-200 hover:shadow hover:-translate-y-1'>
                <Image
                  width={200}
                  height={200}
                  src={`https://picsum.photos/id/${idx}/200/300`}
                  alt={'media-' + item.igcode}
                  className='w-full h-full object-cover object-center group-hover:opacity-75 transition-all ease-in-out duration-300'
                />
              </div>
              <div className='mt-4 flex items-center justify-between text-base font-medium text-gray-900'>
                <div className='flex items-center'>
                  <Image
                    width={40}
                    height={40}
                    src={item.avatar}
                    alt={'avatar-' + item.username}
                    className='rounded-full w-10 mr-2'
                  />
                  <h3 className='font-semibold text-xs sm:text-base text-gray-400 truncate ...'>
                    {item.username}
                  </h3>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </InfiniteScroll>
  );
}

export default ClientItems;