"use client"

import {initializeApp} from "firebase/app";
import { useEffect, useState } from 'react';
import {NavBar} from "@/components/navigation/navbar";
import {Button} from "@/components/ui/button";
import {getAuth, signOut, onAuthStateChanged} from "firebase/auth";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {firebaseConfig} from "@/lib/firebaseconfig";
import Unauthorized from "@/components/unauthorized";

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({ uid: user.uid });
            } else {
                setUser(null);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return user;
};

const Home = () => {

    const router = useRouter();
    const user = useAuth();

    const signOutUser = () => {
        signOut(auth).then(() => {
            console.log("User signed out.");
            toast.info("You have been logged out.");
            router.push('/');
        }).catch((error) => {
            toast.error("An error occurred while logging out.");
            console.log(error);
        });
    }

    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        // ...
        return (
            <>
                <div className={'flex w-full justify-between p-5 border-b border-gray-100'}>
                    <NavBar/>
                    <Button variant={"outline"} onClick={signOutUser}>Logout</Button>
                </div>
                <div>
                    <h1>Home</h1>
                </div>
            </>
        );
    } else {
        // User is signed out
        // ...
        return <Unauthorized/>
    }


}

export default Home;