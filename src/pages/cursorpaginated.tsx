import React, { useState } from 'react';
import useSWR, { useSWRInfinite } from 'swr';
import { PaginatedPosts, Post } from '../types';

interface cursorpaginatedProps {}

const Cursorpaginated: React.FC<cursorpaginatedProps> = ({}) => {
    const [count, setCount] = useState(1);

    const getKey = (pageIndex, previousPageData) => {
        // reached the end
        if (previousPageData && !previousPageData.posts) {
            return null;
        }

        // first page, we don't have `previousPageData`
        if (pageIndex === 0) {
            return `/posts/paginated?limit=5`;
        }
        // console.log('prevData: ', previousPageData.posts);
        return `/posts/paginated?limit=10&cursor=${
            previousPageData.posts[previousPageData.posts.length - 1].createdAt
        }`;
    };

    // const { data } = useSWR(`/posts/paginated?limit=5`);
    const { data, size, setSize } = useSWRInfinite<PaginatedPosts>(getKey, {
        revalidateAll: true
    });

    console.log('data: ', data);
    // console.log('size: ', size);

    const posts: Post[] = data ? [].concat(...data[data.length - 1].posts) : [];

    if (!data) {
        return <div>Loading...</div>;
    }
    console.log('posts: ', posts);
    // console.log('DATA: ', data);
    // posts = data.posts;

    // console.log('Posts: ', posts);
    return (
        <div>
            {/* {data[0].posts.map((post) => (
                <h3 key={post.identifier}>{post.title}</h3>
            ))} */}
            {data.map((posts) =>
                posts.posts.map((post) => (
                    <h3 key={post.identifier}>{post.title}</h3>
                ))
            )}
            <button onClick={() => setSize(size + 1)}>load more</button>
        </div>
    );
};

export default Cursorpaginated;
