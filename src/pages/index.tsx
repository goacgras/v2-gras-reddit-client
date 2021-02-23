// import axios from 'axios';
import Head from 'next/head';
// import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Post, Sub } from '../types';
import PostCard from '../components/PostCard';
// import { GetServerSideProps } from 'next';
import useSWR, { useSWRInfinite } from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthState } from '../context/auth';
import { useEffect, useState } from 'react';

dayjs.extend(relativeTime);

export default function Home({}) {
    const [observedPost, setObservedPost] = useState('');

    const { authenticated } = useAuthState();

    // const { data: posts } = useSWR<Post[]>('/posts');
    const { data: topSubs } = useSWR<Sub[]>('/misc/top-subs');

    const {
        data,
        error,
        mutate,
        size: page,
        setSize: setPage,
        isValidating,
        revalidate
    } = useSWRInfinite<Post[]>((index) => `/posts?page=${index}`, {
        revalidateAll: true
    });

    const isInitialLoading = !data && !error;
    const posts: Post[] = data ? [].concat(...data) : [];

    // const [posts, setPosts] = useState<Post[]>([]);

    // useEffect(() => {
    //     axios
    //         .get('/posts')
    //         .then((res) => setPosts(res.data))
    //         .catch((err) => console.log(err));
    // }, []);

    useEffect(() => {
        if (!posts || posts.length === 0) return;

        const id = posts[posts.length - 1].identifier;

        if (id !== observedPost) {
            setObservedPost(id);
            observeElement(document.getElementById(id));
        }
    }, [posts]);

    const observeElement = (element: HTMLElement) => {
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting === true) {
                    console.log('bottom of post');
                    setPage(page + 1);
                    observer.unobserve(element);
                }
            },
            { threshold: 1 }
        );
        observer.observe(element);
    };

    return (
        <>
            <Head>
                <title>v2-gras-reddit: Homepage</title>
            </Head>
            <div className="container flex pt-4">
                {/* Post feed */}
                {isInitialLoading && (
                    <p className="text-lg text-center">Loading..</p>
                )}
                <div className="w-full px-4 md:w-160 md:p-0">
                    {posts?.map((post) => (
                        <PostCard
                            post={post}
                            key={post.identifier}
                            revalidate={revalidate}
                        />
                    ))}
                </div>
                {isValidating && posts.length > 0 && (
                    <p className="text-lg text-center">Loading More..</p>
                )}

                {/* sidebar */}
                <div className="hidden ml-6 md:block w-80">
                    <div className="bg-white rounded">
                        <div className="p-4 border-b-2">
                            <p className="text-lg font-semibold text-center">
                                Top Communities
                            </p>
                        </div>
                        <div>
                            {topSubs?.map((sub) => (
                                <div
                                    key={sub.name}
                                    className="flex items-center px-4 py-2 text-xs border-b"
                                >
                                    <Link href={`/r/${sub.name}`}>
                                        {/* Add <a> tag in every Next/Link */}
                                        <a>
                                            <Image
                                                className="rounded-full cursor-pointer "
                                                src={sub.imageUrl}
                                                alt="Sub"
                                                width={(6 * 16) / 4}
                                                height={(6 * 16) / 4}
                                            />
                                        </a>
                                    </Link>

                                    <Link href={`/r/${sub.name}`}>
                                        <a className="ml-2 font-bold hover:text-blue-500 ">
                                            /r/${sub.name}
                                        </a>
                                    </Link>
                                    <p className="ml-auto font-medium">
                                        {sub.postCount}
                                    </p>
                                </div>
                            ))}
                        </div>
                        {authenticated ? (
                            <div className="p-4 border-t-2">
                                <Link href="/subs/create">
                                    <a className="w-full px-2 py-1 blue button">
                                        Create Community
                                    </a>
                                </Link>
                            </div>
                        ) : null}
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
