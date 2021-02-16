// import axios from 'axios';
import Head from 'next/head';
// import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Post, Sub } from '../types';
import PostCard from '../components/PostCard';
// import { GetServerSideProps } from 'next';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';

dayjs.extend(relativeTime);

export default function Home({}) {
    const { data: posts } = useSWR<Post[]>('/posts');
    const { data: topSubs } = useSWR('/misc/top-subs');

    // const [posts, setPosts] = useState<Post[]>([]);

    // useEffect(() => {
    //     axios
    //         .get('/posts')
    //         .then((res) => setPosts(res.data))
    //         .catch((err) => console.log(err));
    // }, []);

    return (
        <>
            <Head>
                <title>v2-gras-reddit: Homepage</title>
            </Head>
            <div className="container flex pt-4">
                {/* Post feed */}
                <div className="w-160">
                    {posts?.map((post) => (
                        <PostCard post={post} key={post.identifier} />
                    ))}
                </div>

                {/* sidebar */}
                <div className="ml-6 w-80">
                    <div className="bg-white rounded">
                        <div className="p-4 border-b-2">
                            <p className="text-lg font-semibold text-center">
                                Top Communities
                            </p>
                        </div>
                        <div>
                            {topSubs?.map((sub: Sub) => (
                                <div
                                    key={sub.name}
                                    className="flex items-center px-4 py-2 text-xs border-b"
                                >
                                    <div className="mr-2 overflow-hidden rounded-full cursor-pointer">
                                        <Link href={`/r/${sub.name}`}>
                                            <Image
                                                src={sub.imageUrl}
                                                alt="Sub"
                                                width={(6 * 16) / 4}
                                                height={(6 * 16) / 4}
                                            />
                                        </Link>
                                    </div>
                                    <Link href={`/r/${sub.name}`}>
                                        <a className="font-bold hover:text-blue-500 ">
                                            /r/${sub.name}
                                        </a>
                                    </Link>
                                    <p className="ml-auto font-medium">
                                        {sub.postCount}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     try {
//         const res = await axios.get('/posts');

//         return { props: { posts: res.data } };
//     } catch (err) {
//         return { props: { error: 'Something went wrong' } };
//     }
// };
