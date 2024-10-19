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
                <Accordion type="single" collapsible className="mt-2 ml-10 mr-10 mb-10" defaultValue="item-0">
                    <AccordionItem value="item-0">
                        <AccordionTrigger>Version 1.2.1</AccordionTrigger>
                        <AccordionContent>
                            <p>Version 1.2.1 includes the following changes:
                                - Bug fixes and performance improvements
                                - Added the following Children's Zoo Animals:
                                    - Pygmy Goat
                                    - Domestic Goat
                                    - American Alligator
                                    - North American River Otter
                                    - African Spurred Tortoise
                                    - Aldabra Tortoise
                                    - Florida Red-Bellied Turtle
                                    - Domestic Rabbit
                                    - Shetland Sheep
                                    - Domestic Cat
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-1">
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