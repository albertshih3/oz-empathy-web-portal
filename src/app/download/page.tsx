import { NavBarDl } from "@/components/navigation/navbardl";
import { firebaseConfig } from "@/lib/firebaseconfig";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

// Components & Icons
import { CircleArrowUpIcon, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const app = initializeApp(firebaseConfig);
if (app.name && typeof window !== 'undefined') {
    const analytics = getAnalytics(app);
}

const Download = () => {
    return (
        <>
            <div className={'flex w-full justify-between p-5 border-b border-gray-100'}>
                <NavBarDl />
            </div>
            <div className='flex flex-col justify-center items-center'>
                <Alert className='flex justify-between m-5' style={{ maxWidth: '95%' }}>
                    <CircleArrowUpIcon className='m-2' />
                    <div className='ml-5 mt-2 items-center'>
                        <AlertTitle>Version 1.2.0 is now available!</AlertTitle>
                        <AlertDescription>Download the latest version of the app to get the latest features and improvements.</AlertDescription>
                    </div>
                    <Button variant={"expandIcon"} iconPlacement="right" Icon={ArrowRight}>Learn More</Button>
                </Alert>
                <h1 className='text-3xl font-bold mt-5'>Download the Empathy Guide Mobile App</h1>
                <p className='text-lg mt-2 text-gray-600'>Get started by selecting your device from below.</p>

                <div className='flex md:flex-col w-full content-center justify-center items-center mt-2 grid md:grid-cols-3 md:gap-4 :pl-10 pr-10'>
                    <Card className='mt-5 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg'>
                        <CardHeader>
                            <CardTitle>Download for iOS</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Requires iOS or iPadOS 13.4 or later.</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Button variant={"gooeyLeft"}>Download for iOS</Button>
                        </CardFooter>
                    </Card>
                    <Card className='mt-5 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg'>
                        <CardHeader>
                            <CardTitle>Download for Android</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Requires Android 5.0 and up.</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Button variant={"gooeyLeft"}>Download for Android</Button>
                        </CardFooter>
                    </Card>
                    <Card className='mt-5 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg'>
                        <CardHeader>
                            <CardTitle>Visit the Web Version</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Visit the Empathy Guide website.</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Button variant={"gooeyLeft"}>Visit Site</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Download;