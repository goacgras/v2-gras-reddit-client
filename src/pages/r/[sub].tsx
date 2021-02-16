import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import PostCard from '../../components/PostCard';
import { Sub } from '../../types';
import Image from 'next/image';
import { ChangeEvent, createRef, useEffect, useState } from 'react';
import { useAuthState } from '../../context/auth';
import classNames from 'classnames';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

interface SubProps {}

const SubPage: React.FC<SubProps> = ({}) => {
    const [subOwner, setSubOwner] = useState(false);

    const { authenticated, user } = useAuthState();

    const router = useRouter();
    const fileInputRef = createRef<HTMLInputElement>();
    const subName = router.query?.sub;

    const { data: sub, error } = useSWR<Sub>(
        subName ? `/subs/${subName}` : null
    );

    useEffect(() => {
        if (!sub) return;
        setSubOwner(authenticated && user.username === sub.username);
    }, [sub]);

    const openFileInput = (type: string) => {
        if (!subOwner) return;
        fileInputRef.current.name = type;
        fileInputRef.current.click();
    };

    const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0];

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', event.target.name);

        try {
            const res = await axios.post<Sub>(
                `/subs/${sub.name}/image`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    if (error) {
        router.push('/');
    }

    let postMarkup;
    if (!sub) {
        postMarkup = <p className="text-lg text-center">Loading...</p>;
    } else if (sub.posts.length === 0) {
        postMarkup = (
            <p className="text-lg text-center">No posts submitted yet</p>
        );
    } else {
        postMarkup = sub.posts.map((post) => (
            <PostCard key={post.identifier} post={post} />
        ));
    }

    return (
        <div>
            <Head>
                <title>{sub?.title}</title>
            </Head>

            {sub && (
                <>
                    <input
                        type="file"
                        hidden={true}
                        ref={fileInputRef}
                        onChange={uploadImage}
                    />
                    {/* Sub Info & images */}
                    <div>
                        {/* Banner image */}
                        <div
                            className={classNames('bg-blue-500', {
                                'cursor-pointer': subOwner
                            })}
                            onClick={() => openFileInput('banner')}
                        >
                            {sub.bannerUrl ? (
                                <div
                                    className="h-56 bg-blue-500"
                                    style={{
                                        backgroundImage: `url(${sub.bannerUrl})`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                ></div>
                            ) : (
                                <div className="h-20 bg-blue-500"></div>
                            )}
                        </div>

                        {/* Sub meta data */}
                        <div className="h-20 bg-white">
                            <div className="container relative flex">
                                <div className="absolute" style={{ top: -15 }}>
                                    <Image
                                        className={classNames('rounded-full', {
                                            'cursor-pointer': subOwner
                                        })}
                                        src={sub.imageUrl}
                                        alt="Sub"
                                        width={70}
                                        height={70}
                                        onClick={() => openFileInput('image')}
                                    />
                                </div>
                                <div className="pt-1 pl-24">
                                    <div className="flex items-center">
                                        <h1 className="mb-1 text-3xl font-bold">
                                            {sub.title}
                                        </h1>
                                    </div>
                                    <p className="text-sm font-bold text-gray-500">
                                        /r/{sub.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Posts & Sidebar */}
                    <div className="container flex pt-5">
                        <div className="w-160">{postMarkup}</div>
                        <Sidebar sub={sub} />
                    </div>
                </>
            )}
        </div>
    );
};

export default SubPage;
