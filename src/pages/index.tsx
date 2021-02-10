import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Post } from '../types';
import { PostCard } from '../components/PostCard';
// import { GetServerSideProps } from 'next';

dayjs.extend(relativeTime);

export default function Home({}) {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        axios
            .get('/posts')
            .then((res) => setPosts(res.data))
            .catch((err) => console.log(err));
    }, []);

    console.log(posts);

    return (
        <div className="pt-12">
            <Head>
                <title>v2-gras-reddit: Homepage</title>
            </Head>
            <div className="container flex pt-4">
                {/* Post feed */}
                <div className="w-160">
                    {posts.map((post) => (
                        <PostCard post={post} key={post.identifier} />
                    ))}
                </div>

                {/* sidebar */}
            </div>
        </div>
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
