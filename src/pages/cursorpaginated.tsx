import React, { useState } from 'react';
import useSWR, { useSWRInfinite } from 'swr';
import { PaginatedPosts, Post } from '../types';

interface cursorpaginatedProps {}

const Cursorpaginated: React.FC<cursorpaginatedProps> = ({}) => {
    const [count, setCount] = useState(1);

    const getKey = (pageIndex, previousPageData) => {
        // reached the end
        if (previousPageData && !previousPageData.posts) {
            console.log('end of the page');
            return null;
        }

        // first page, we don't have `previousPageData`
        if (pageIndex === 0) {
            console.log('firstpage');
            return `/posts/paginated?limit=3`;
        }
        console.log('more page');
        return `/posts/paginated?limit=2&cursor=${
            previousPageData.posts[previousPageData.posts.length - 1].createdAt
        }`;
    };

    // const { data } = useSWR(`/posts/paginated?limit=5`);
    const { data, size, setSize } = useSWRInfinite<PaginatedPosts>(getKey, {
        revalidateAll: true
    });

    // console.log('data: ', data);
    // console.log('size: ', size);

    const posts: Post[] = data ? [].concat(...data[data.length - 1].posts) : [];

    if (!data) {
        return <div>Loading...</div>;
    }
    // console.log('posts: ', posts);
    // console.log('DATA: ', data);
    // posts = data.posts;

    // console.log('Posts: ', posts);
    return (
        <div className="container pt-4 w-160">
            {data.map((posts) =>
                posts.posts.map((post) => (
                    <div
                        key={post.identifier}
                        className="flex mb-4 bg-white rounded"
                    >
                        <div className="mx-3">
                            <h3>{post.title}</h3>
                            <h2 className="ml-auto">{post.createdAt}</h2>
                        </div>
                    </div>
                ))
            )}
            <button onClick={() => setSize(size + 1)}>load more</button>
        </div>
    );
};

export default Cursorpaginated;
