import React from 'react';
import { useRouter } from "next/navigation";
import { Button } from './ui/button';

const Unauthorized = () => {
    const router = useRouter();

    const handleLoginRedirect = () => {
        router.push('/');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: 'full' }} className='flex-col'>
                <h1>You are not authorized to view this page</h1>
                <p className='mb-5'>Please log in to continue</p>
                <Button variant={'linkHover2'} onClick={handleLoginRedirect}>Log In</Button>
            </div>
        </div>
    );
};

export default Unauthorized;
