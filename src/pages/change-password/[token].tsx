import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import InputGroup from '../../components/InputGroup';

interface changePasswordProps {}

const ChangePassword: React.FC<changePasswordProps> = ({}) => {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [errors, setErrors] = useState<any>({});

    const submitForm = async (event: FormEvent) => {
        event.preventDefault();
        try {
            await axios.post('/auth/change-password', {
                newPassword,
                token:
                    typeof router.query.token === 'string'
                        ? router.query.token
                        : ''
            });
            router.push('/login');
        } catch (err) {
            console.log(err);
            setErrors(err.response.data);
        }
    };

    return (
        <div className="flex bg-white">
            <Head>
                <title>Change-Password</title>
            </Head>
            <div
                className="h-screen bg-center bg-cover w-36"
                style={{ backgroundImage: "url('/images/brick.jpg')" }}
            ></div>
            <div className="flex flex-col justify-center pl-6">
                <div className="w-70">
                    <h1 className="mb-2 text-lg font-medium">New Password</h1>
                    <form onSubmit={submitForm}>
                        <InputGroup
                            classname="mb-4"
                            placeholder="password"
                            type="password"
                            value={newPassword}
                            setValue={setNewPassword}
                            error={errors.newPassword}
                        />

                        <button
                            type="submit"
                            className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
