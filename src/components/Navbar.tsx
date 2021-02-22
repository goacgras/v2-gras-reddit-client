import React, { useEffect, useState } from 'react';
import RedditLogo from '../images/reddit.svg';
import Link from 'next/link';
import { useAuthDispatch, useAuthState } from '../context/auth';
import axios from 'axios';
import { Sub } from '../types';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
    const [name, setName] = useState('');
    const [subs, setSubs] = useState<Sub[]>([]);
    const [timer, setTimer] = useState(null);

    const router = useRouter();

    const { authenticated, loading } = useAuthState();
    const dispatch = useAuthDispatch();

    const logout = async () => {
        try {
            await axios.get('/auth/logout');
            dispatch('LOGOUT');
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (name.trim() === '') {
            setSubs([]);
            return;
        }

        searchSubs();
    }, [name]);

    const searchSubs = async () => {
        clearTimeout(timer);
        setTimer(
            setTimeout(async () => {
                try {
                    const { data } = await axios.get(`/subs/search/${name}`);
                    setSubs(data);
                    console.log(data);
                } catch (err) {
                    console.log(err);
                }
            }, 250)
        );
    };

    const goToSub = (subName: string) => {
        router.push(`/r/${subName}`);
        setName('');
    };

    return (
        <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
            {/* Logo & title */}
            <div className="flex items-center">
                <Link href="/">
                    <a>
                        <RedditLogo className="w-8 h-8 mr-2" />
                    </a>
                </Link>
                <span className="text-2xl font-semibold">
                    <Link href="/">v2-gras-reddit</Link>
                </span>
            </div>

            {/* Search input */}
            <div className="relative flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
                <i className="pl-4 pr-3 text-gray-500 fas fa-search" />
                <input
                    placeholder="Search"
                    type="text"
                    className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div
                    className="absolute left-0 right-0 bg-white"
                    style={{ top: '100%' }}
                >
                    {subs?.map((sub) => (
                        <div
                            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
                            onClick={() => goToSub(sub.name)}
                        >
                            <Image
                                className="rounded-full"
                                src={sub.imageUrl}
                                alt="Sub"
                                height={(8 * 16) / 4}
                                width={(8 * 16) / 4}
                            />
                            <div className="ml-4 text-sm">
                                <p className="font-medium">{sub.name}</p>
                                <p className="text-gray-600">{sub.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Auth button */}
            <div className="flex">
                {!loading &&
                    (authenticated ? (
                        // Show logout
                        <button
                            className="w-32 py-1 mr-4 leading-5 hollow blue button"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link href="/login">
                                <a className="w-32 py-1 mr-4 leading-5 hollow blue button">
                                    Login
                                </a>
                            </Link>
                            <Link href="/register">
                                <a className="w-32 py-1 leading-5 blue button">
                                    Signup
                                </a>
                            </Link>
                        </>
                    ))}
            </div>
        </div>
    );
};

export default Navbar;
