import { NavBarDl } from "@/components/navigation/navbardl";
import { firebaseConfig } from "@/lib/firebaseconfig";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

// Components & Icons
import { CircleArrowUpIcon, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

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
                <Alert className='md:flex justify-between m-5' style={{ maxWidth: '95%' }}>
                    <CircleArrowUpIcon className='m-2' />
                    <div className='ml-5 mt-2 items-center'>
                        <AlertTitle>Version 1.2.0 is now available!</AlertTitle>
                        <AlertDescription>Download the latest version of the app to get the latest features and improvements.</AlertDescription>
                    </div>
                    <Button variant={"expandIcon"} iconPlacement="right" Icon={ArrowRight} className="mt-2 md:mt-0 left-12 md:left-0">Learn More</Button>
                </Alert>
                <h1 className='text-3xl font-bold mt-5 ml-5 mr-5'>Download the Empathy Guide Mobile App</h1>
                <p className='text-lg ml-5 mr-5 mt-2 text-gray-600'>Get started by selecting your device from below.</p>

                <div className='flex md:flex-col w-full md:content-center md:justify-center items-center mt-2 grid md:grid-cols-3 md:gap-4 pl-5 pr-5 md:pl-10 md:pr-10'>
                    <Card className='mt-5 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg'>
                        <CardHeader>
                            <CardTitle>Download for iOS</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Requires iOS or iPadOS 13.4 or later.</CardDescription>
                        </CardContent>
                        <CardFooter>
                        <Link href='https://testflight.apple.com/join/6LDvlFvm' className={buttonVariants({ variant: "gooeyLeft" })}>Download for iOS</Link>
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
                        <Link href='https://drive.google.com/file/d/1zt5UkFq8VBEh3iN43pSw_-yQGsfqD13u/view?usp=drive_link' className={buttonVariants({ variant: "gooeyLeft" })}>Download for Android</Link>
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
                            <Link href='https://sites.google.com/view/ozempathy/oakland-zoo-empathy-guide' className={buttonVariants({ variant: "gooeyLeft" })}>Visit Site</Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <div>
                <h2 className='text-2xl font-bold mt-10 ml-10 mr-10'>Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="mt-2 ml-10 mr-10 mb-10" defaultValue="item-0">
                    <AccordionItem value="item-0">
                        <AccordionTrigger>How do I get updates?</AccordionTrigger>
                        <AccordionContent>
                            <p>Check here! You can also check the on-grounds corkboard, as well as the chalkboard inside of the video theater. If you have the Testflight app installed, you will recieve a notification when a new update is available.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is Testflight? Do I need it?</AccordionTrigger>
                        <AccordionContent>
                            <p>In order to keep the app private and for internal use only, we distrubuite the app through Testflight. This allows for easy distribution and updates to the app for authorized users. It also is a way for me to work around the strict App Store restrictions that I don't want to deal with.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Do I need to keep Testflight installed?</AccordionTrigger>
                        <AccordionContent>
                            <p>While you do not need to keep the Testflight app installed, it is recommended to keep it installed as that is the only way you can recieve app updates. You can delete it after you have installed the Empathy Guide app, but you would need to redownload the app to get updates.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Is it safe to install on Android?</AccordionTrigger>
                        <AccordionContent>
                            <p>Yes, it is safe. "Install unknown apps" is a standard security message that appears when you download an app from a source other than the Google Play Store. It is meant to protect your device from bad actors. The Empathy Guide app is safe to install and use. For extra protection, you can go into settings and disable "Install apps from this source" after you have installed the empathy guide app.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>Can I share this with my friends & family?</AccordionTrigger>
                        <AccordionContent>
                            <p>No. Just like the web version, this app is for internal use only. While all of the information in this guide is acceptable to share with the public, the app, and link to this site should be shared with Oakland Zoo staff, volunteers, and interns only.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger>Why not go through official App Stores?</AccordionTrigger>
                        <AccordionContent>
                            <p>Privacy and restrictions. Using Testflight and Google Drive allows us to keep the app private and for internal use only. We can add or remove users, and take down builds if they become public. It also allows me to bypass the strict App Store and Google Play Store restrictions that I don't want to deal with. There is so much paperwork and legal stuff</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

            </div>
        </>
    )
}

export default Download;