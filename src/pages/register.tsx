import React, { FormEvent, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import axios from 'axios';
import InputGroup from '../components/InputGroup';
import { useRouter } from 'next/router';

interface registerProps {}

const Register: React.FC<{}> = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [agreement, setAgreement] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const router = useRouter();

    const submitForm = async (event: FormEvent) => {
        event.preventDefault();

        if (!agreement) {
            setErrors({ ...errors, agreement: 'You must agree to T&Cs' });
            return;
        }

        try {
            await axios.post('/auth/register', {
                email,
                password,
                username
            });
            router.push('/login');
        } catch (err) {
            console.log(err);
            setErrors(err.response.data);
        }
    };

    return (
        <div className="flex">
            <Head>
                <title>Register</title>
            </Head>
            <div
                className="h-screen bg-center bg-cover w-36"
                style={{ backgroundImage: "url('/images/brick.jpg')" }}
            ></div>
            <div className="flex flex-col justify-center pl-6">
                <div className="w-70">
                    <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
                    <p className="mb-10 text-xs p">
                        By Continuing, you agree to our User Agreement and
                        privacy policy
                    </p>

                    <form onSubmit={submitForm}>
                        <div className="mb-6">
                            <input
                                name="agreement"
                                type="checkbox"
                                className="mr-1 cursor-pointer"
                                // id="agreement"
                                checked={agreement}
                                onChange={(e) => setAgreement(e.target.checked)}
                            />
                            <label
                                htmlFor="agreement"
                                className="text-xs cursor-pointer"
                            >
                                I agree to get emails about cool stuff on gras
                            </label>
                            <small className="block font-medium text-red-600">
                                {errors.agreement}
                            </small>
                        </div>
                        <InputGroup
                            classname="mb-2"
                            placeholder="Email"
                            type="email"
                            value={email}
                            setValue={setEmail}
                            error={errors.email}
                        />
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
                            Sign up
                        </button>
                    </form>

                    <small>
                        Already Signup?
                        <NextLink href="/login">
                            <a className="ml-1 text-blue-500 ">Login</a>
                        </NextLink>
                    </small>
                </div>
            </div>
        </div>
    );
};

export default Register;
