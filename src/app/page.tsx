"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
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
import {
    getAuth,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: "Password cannot be empty!" }),
});

const Landing = () => {
    const [showLogin, setShowLogin] = useState(false);
    const router = useRouter();

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
    if (app.name && typeof window !== 'undefined') {
        getAnalytics(app);
    }
    const auth = getAuth();

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
            <div className="min-h-screen relative flex items-center justify-center p-6">
                <div className="absolute inset-0 -z-10">
                    <Image
                        src="/hero.jpg"
                        fill
                        className="object-cover"
                        quality={100}
                        alt="background"
                    />
                </div>
                
                <div className="bg-white rounded-2xl shadow-2xl p-12 mx-4 w-full max-w-lg text-center relative">
                    <AnimatePresence mode="wait">
                        {!showLogin ? (
                            <motion.div
                                key="landing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-10"
                            >
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                                        Welcome to Oakland Zoo Empathy Guide
                                    </h1>
                                    <p className="text-gray-600 text-lg">
                                        Your gateway to understanding and connecting with wildlife
                                    </p>
                                </div>
                                
                                <div className="space-y-5">
                                    <Link href="/download" className="block">
                                        <Button variant="ringHover" className="w-full text-lg py-6">
                                            Download the App
                                        </Button>
                                    </Link>
                                    
                                    <Link 
                                        href="https://sites.google.com/view/ozempathy/oakland-zoo-empathy-guide" 
                                        target="_blank"
                                        className="block"
                                    >
                                        <Button variant="ringHover" className="w-full text-lg py-6">
                                            View Web Version
                                        </Button>
                                    </Link>
                                    
                                    <Button 
                                        variant="outline" 
                                        className="w-full text-lg py-6"
                                        onClick={() => setShowLogin(true)}
                                    >
                                        Login to Dashboard
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-10"
                            >
                                <div className="flex items-center justify-between">
                                    <h1 className="text-4xl font-bold text-gray-900">Welcome Back!</h1>
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setShowLogin(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ← Back
                                    </Button>
                                </div>

                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-5 text-left"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-left">Email</FormLabel>
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
                                                    <FormLabel className="text-left">Password</FormLabel>
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
                                        <Button
                                            variant="ringHover"
                                            className="w-full text-lg py-6"
                                            type="submit"
                                        >
                                            Sign In
                                        </Button>
                                    </form>
                                </Form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                <footer className="absolute bottom-4 left-0 right-0 px-6">
                    <p className="text-white text-sm text-center max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
                        While all of the information in this guide is acceptable to share with the public, 
                        the link to this website should be shared with Oakland Zoo staff, volunteers, and interns only. 
                        Copyright 2025
                    </p>
                </footer>
            </div>
        </>
    );
};

export default Landing;