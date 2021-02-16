import axios from 'axios';
import Head from 'next/head';
import React, { FormEvent, useState } from 'react';
import InputGroup from '../components/InputGroup';

interface forgotPasswordProps {}

const ForgotPassword: React.FC<forgotPasswordProps> = ({}) => {
    const [email, setEmail] = useState('');
    const [complete, setComplete] = useState(false);

    const submitForm = async (event: FormEvent) => {
        event.preventDefault();
        try {
            await axios.post('/auth/forgot-password', {
                email
            });
            setComplete(true);
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="flex bg-white">
            <Head>
                <title>Forgot-Password</title>
            </Head>
            <div
                className="h-screen bg-center bg-cover w-36"
                style={{ backgroundImage: "url('/images/brick.jpg')" }}
            ></div>
            <div className="flex flex-col justify-center pl-6">
                <div className="w-70">
                    {complete ? (
                        <h1 className="mb-2 text-lg font-medium">
                            If your account exist, we already sent you an email
                        </h1>
                    ) : (
                        <>
                            <h1 className="mb-2 text-lg font-medium">Email</h1>
                            <form onSubmit={submitForm}>
                                <InputGroup
                                    classname="mb-2"
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    setValue={setEmail}
                                />

                                <button
                                    type="submit"
                                    className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded"
                                >
                                    Send
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
