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

const Changelog = () => {
    return (
        <>
            <div className={'flex w-full justify-between p-5 border-b border-gray-100'}>
                <NavBarDl />
            </div>
            <div className='flex flex-col justify-center items-center'>
                <h1 className='text-3xl font-bold mt-5 ml-5 mr-5'>Changelog</h1>
                <p className='text-lg ml-5 mr-5 mt-2 text-gray-600'>Learn about the latest updates here!</p>
            </div>

            <div>
                <h2 className='text-2xl font-bold mt-10 ml-10 mr-10'>Versions</h2>
                <Accordion type="single" collapsible className="mt-2 ml-10 mr-10 mb-10 border rounded-lg p-5" defaultValue="item-0">
                <AccordionItem value="item-0">
                        <AccordionTrigger>Version 1.3.1</AccordionTrigger>
                        <AccordionContent>
                            <p>Version 1.3.0 includes the following changes:</p>
                            <ul>
                                <li> - Loading times have been vastly improved for all sections of the zoo (Thanks Keith, Taylor, and Anna for testing this out for me)</li>
                                <li> - Offline use should be much more stable, and be much faster than before</li>
                            </ul>
                            <br />
                            <p>
                                **Important for L&E On-Grounds**
                                Please check to see if loading any section of the app is any faster than before.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Version 1.3</AccordionTrigger>
                        <AccordionContent>
                            <p>Version 1.3.0 includes the following changes:</p>
                            <ul>
                                <li> - Added a back button to the animal details page (Thanks Momo & TWGS)</li>
                                <li> - Reworked code to make loading faster (just for search + CAT)</li>
                                <li> - Added buttons for Rainforest and Australia</li>
                                <li> - Fixed Shetland Sheep button not having a photo</li>
                            </ul>
                            <br />
                            <p>
                                **Important for L&E On-Grounds**
                                Please check to see if loading the 'CAT' section of the app is any faster than before.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Version 1.2.1</AccordionTrigger>
                        <AccordionContent>
                            <p>Version 1.2.1 includes the following changes:</p>
                            <ul>
                                <li> - Bug fixes and performance improvements</li>
                                <li> - Added the following Children's Zoo Animals:</li>
                                <li> - Pygmy Goat</li>
                                <li> - Pygmy Goat</li>
                                <li> - Domestic Goat</li>
                                <li> - American Alligator</li>
                                <li> - North American River Otter</li>
                                <li> - African Spurred Tortoise</li>
                                <li> - Aldabra Tortoise</li>
                                <li> - Florida Red-Bellied Turtle</li>
                                <li> - Domestic Rabbit</li>
                                <li> - Shetland Sheep</li>
                                <li> - Domestic Cat</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Version 1.2.0</AccordionTrigger>
                        <AccordionContent>
                            <p>Version 1.2.0
                                - African Savanna animals have all been added.
                                - Children's Zoo contact yard has been added.</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

            </div>
        </>
    )
}

export default Changelog;