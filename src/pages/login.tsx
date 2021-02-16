import React, { FormEvent, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import axios from 'axios';
import InputGroup from '../components/InputGroup';
import { useRouter } from 'next/router';
import { useAuthDispatch, useAuthState } from '../context/auth';

interface registerProps {}

const Login: React.FC<{}> = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>({});

    const router = useRouter();

    const dispatch = useAuthDispatch();
    const { authenticated } = useAuthState();

    if (authenticated) router.push('/');

    const submitForm = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const res = await axios.post('/auth/login', {
                password,
                username
            });

            dispatch('LOGIN', res.data);
            router.push('/');
        } catch (err) {
            console.log(err);
            setErrors(err.response.data);
        }
    };

    return (
        <div className="flex bg-white">
            <Head>
                <title>Login</title>
            </Head>
            <div
                className="h-screen bg-center bg-cover w-36"
                style={{ backgroundImage: "url('/images/brick.jpg')" }}
            ></div>
            <div className="flex flex-col justify-center pl-6">
                <div className="w-70">
                    <h1 className="mb-2 text-lg font-medium">Login</h1>

                    <form onSubmit={submitForm}>
                        <InputGroup
                            classname="mb-2"
                            placeholder="Username"
                            type="text"
                            value={username}
                            setValue={setUsername}
                            error={errors.username}
                        />
                        <InputGroup
                            classname="mb-4"
                            placeholder="password"
                            type="password"
                            value={password}
                            setValue={setPassword}
                            error={errors.password}
                        />

                        <button
                            type="submit"
                            className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded"
                        >
                            Login
                        </button>
                    </form>
                    <div className="flex flex-col">
                        <small>
                            <NextLink href="/forgot-password">
                                <a className="text-blue-500">
                                    Forget password?
                                </a>
                            </NextLink>
                        </small>

                        <small>
                            Don't have account?
                            <NextLink href="/register">
                                <a className="ml-1 text-blue-500 ">Signup</a>
                            </NextLink>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
