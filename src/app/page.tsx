"use client";

import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { Toaster, toast } from "sonner";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { redirect, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: "Password cannot be empty!" }),
});

const Login = () => {

    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_APIKEY,
        authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
        projectId: process.env.NEXT_PUBLIC_PROJECTID,
        storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
        appId: process.env.NEXT_PUBLIC_APPID,
        measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID
    };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth();
    console.log(auth.currentUser);
    const router = useRouter();

    const useAuth = () => {
        const [user, setUser] = useState<{ uid: string } | null>(null);
    
        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUser({ uid: user.uid });
                    router.push("/home");
                } else {
                    setUser(null);
                }
            });
    
            // Cleanup subscription on unmount
            return () => unsubscribe();
        }, []);
    
        return user;
    };

    const user = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        signInWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                toast.success("Welcome back! You have successfully signed in!");
                router.push("/home");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error("There has been an issue signing you in: " + errorMessage);
                console.error(errorCode, errorMessage);
            });
    }

    return (
        <>
            <Toaster position="bottom-center" richColors />
            <div className="container relative flex flex-col items-center justify-center pt-20 lg:px-0">
                <div className="space0y-6 mx-auto flex w-full flex-col justify-center sm:w-[350px]">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <h1 className="text-2xl font-bold">Welcome Back!</h1>
                        <Link
                            className={buttonVariants({ variant: "linkHover2" })}
                            href="/sign-up"
                        >
                            Do not have an account? Create one!
                        </Link>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 pt-8"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="example@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="justify center flex flex-col">
                                <Button
                                    variant="ringHover"
                                    className=" align-center"
                                    type="submit"
                                >
                                    Sign In
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default Login;