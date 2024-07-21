"use client"

import { initializeApp } from "firebase/app";
import { useEffect, useState } from 'react';
import { NavBar } from "@/components/navigation/navbar";
import { Button } from "@/components/ui/button";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { firebaseConfig } from "@/lib/firebaseconfig";
import { getFirestore, collection, getDocs, DocumentData, doc, updateDoc } from "firebase/firestore";
import { ChevronRight } from "lucide-react";
import Unauthorized from "@/components/unauthorized";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";

import { Input } from "@/components/ui/input";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const useAuth = () => {
    const [user, setUser] = useState<{ uid: string } | null>(null);

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

    const [animalsList, setAnimals] = useState<DocumentData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAnimal, setSelectedAnimal] = useState<DocumentData | null>(null);

    useEffect(() => {
        const fetchAnimals = async () => {
            const querySnapshot = await getDocs(collection(db, "animals"));
            const animals: ((prevState: never[]) => never[]) | DocumentData[] = [];
            await Promise.all(querySnapshot.docs.map(async (doc) => {
                const animalData = doc.data();
                // Add the document ID to the animal data
                animalData.id = doc.id;
                const personalSnapshot = await getDocs(collection(doc.ref, "personal"));
                personalSnapshot.forEach((personalDoc) => {
                    const personalData = personalDoc.data();
                    if (personalData.name) {
                        if (animalData.personalNames) {
                            animalData.personalNames.push(personalData.name);
                        } else {
                            animalData.personalNames = [personalData.name];
                        }
                    }
                });
                animals.push(animalData);
            }));
            setAnimals(animals);
        };

        fetchAnimals();
    }, []);

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

    const [animalClass, setAnimalClass] = useState('');
    const [animalDiet, setAnimalDiet] = useState('');
    const [animalFamily, setAnimalFamily] = useState('');
    const [animalGenus, setAnimalGenus] = useState('');
    const [animalLifespan, setAnimalLifespan] = useState('');
    const [animalLifespanCap, setAnimalLifespanCap] = useState('');
    const [animalLocation, setAnimalLocation] = useState('');
    const [animalName, setAnimalName] = useState('');
    const [animalOrder, setAnimalOrder] = useState('');
    const [animalPhoto, setAnimalPhoto] = useState('');
    const [animalRange, setAnimalRange] = useState('');
    const [animalSciName, setAnimalSciName] = useState('');

    useEffect(() => {
        if (selectedAnimal) {
            setAnimalClass(selectedAnimal.class);
            setAnimalDiet(selectedAnimal.diet);
            setAnimalFamily(selectedAnimal.family);
            setAnimalGenus(selectedAnimal.genus);
            setAnimalLifespan(selectedAnimal.lifespan);
            setAnimalLifespanCap(selectedAnimal.lifespan_cap);
            setAnimalLocation(selectedAnimal.location);
            setAnimalName(selectedAnimal.name);
            setAnimalOrder(selectedAnimal.order);
            setAnimalPhoto(selectedAnimal.photo);
            setAnimalRange(selectedAnimal.range);
            setAnimalSciName(selectedAnimal.sci_name);
        }
    }, [selectedAnimal]);

    function saveChanges() {
        console.log("FUNCTION CALLED");
        // Use the name of the animal as the document ID
        const animalRef = selectedAnimal ? doc(db, 'animals', selectedAnimal.id) : null;

        const updatedData = {
            class: animalClass,
            diet: animalDiet,
            family: animalFamily,
            genus: animalGenus,
            lifespan: animalLifespan,
            lifespan_cap: animalLifespanCap,
            location: animalLocation,
            name: animalName,
            order: animalOrder,
            photo: animalPhoto,
            range: animalRange,
            sci_name: animalSciName
        };

        console.log(updatedData);

        if (animalRef) {
            updateDoc(animalRef, updatedData);
            router.push("/");
        } else {
            console.log("No selected animal to update");
        }
    };



    if (user) {
        // User is signed in
        return (
            <>
                <div className={'flex w-full justify-between p-5 border-b border-gray-100'}>
                    <NavBar />
                    <Button variant={"outline"} onClick={signOutUser}>Logout</Button>
                </div>
                <Input className='flex p-5 m-5' placeholder='Search animals' onChange={e => setSearchTerm(e.target.value)} />
                <Dialog>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-5'>
                        {animalsList.filter(animal => animal.name.toLowerCase().includes(searchTerm.toLowerCase()) || (animal.personalNames && animal.personalNames.some((name: string) => name.toLowerCase().includes(searchTerm.toLowerCase())))).map((animal, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <img src={animal.photo} alt={animal.name} className='w-full h-48 object-cover rounded-md mb-2' />
                                    <CardTitle>{animal.name}</CardTitle>
                                </CardHeader>
                                <CardContent className='flex flex-col w-full justify-between'>
                                    <DialogTrigger asChild>
                                        <Button className="mb-2" variant={"expandIcon"} Icon={ChevronRight} iconPlacement="right" onClick={() => setSelectedAnimal(animal)}>Edit Species Details</Button>
                                    </DialogTrigger>
                                    <Button variant={"outline"} Icon={ChevronRight} iconPlacement="right" onClick={() => router.push(`home/${animal.id}`)}>View Individual Animals</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Edit Species Information</DialogTitle>
                            <DialogDescription>
                                You can edit the details of the selected species below. Press save to apply changes or press the x button to cancel.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedAnimal && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="class" className="text-right">
                                        Class
                                    </Label>
                                    <Input
                                        id="class"
                                        value={animalClass}
                                        onChange={e => setAnimalClass(e.target.value)}
                                        className="col-span-3"
                                    />
                                    <Label htmlFor="diet" className="text-right">
                                        Diet
                                    </Label>
                                    <Input
                                        id="diet"
                                        value={animalDiet}
                                        onChange={e => setAnimalDiet(e.target.value)}
                                        className="col-span-3"
                                    />
                                    <Label htmlFor="family" className="text-right">
                                        Family
                                    </Label>
                                    <Input
                                        id="family"
                                        value={animalFamily}
                                        onChange={e => setAnimalFamily(e.target.value)}
                                        className="col-span-3"
                                    />
                                    <Label htmlFor="genus" className="text-right">
                                        Genus
                                    </Label>
                                    <Input
                                        id="genus"
                                        value={animalGenus}
                                        onChange={e => setAnimalGenus(e.target.value)}
                                        className="col-span-3"
                                    />
                                    <Label htmlFor="lifespan" className="text-right">
                                        Lifespan
                                    </Label>
                                    <Input
                                        id="lifespan"
                                        value={animalLifespan}
                                        onChange={e => setAnimalLifespan(e.target.value)}
                                        className="col-span-3"
                                    />
                                    <Label htmlFor="lifespan_cap" className="text-right">
                                        Lifespan in Captivity
                                    </Label>
                                    <Input
                                        id="lifespan_cap"
                                        value={animalLifespanCap}
                                        onChange={e => setAnimalLifespanCap(e.target.value)}
                                        className="col-span-3"
                                    />
                                    <Label htmlFor="location" className="text-right">
                                        Location
                                    </Label>
                                    <Input
                                        id="location"
                                        value={animalLocation}
                                        onChange={e => setAnimalLocation(e.target.value)}
                                        className="col-span-3"
                                    />
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={animalName}
                                        onChange={e => setAnimalName(e.target.value)}
                                        className="col-span-3"
                                    />
                                    <Label htmlFor="photo" className="text-right">
                                        Photo URL
                                    </Label>
                                    <Input
                                        id="photo"
                                        value={animalPhoto}
                                        onChange={e => setAnimalPhoto(e.target.value)}
                                        className="col-span-3"
                                    />
                                    <Label htmlFor="order" className="text-right">
                                        Order
                                    </Label>
                                    <Input
                                        id="order"
                                        value={animalOrder}
                                        onChange={e => setAnimalOrder(e.target.value)}
                                        className="col-span-3"
                                    />
                                    <Label htmlFor="Range" className="text-right">
                                        Range
                                    </Label>
                                    <Input
                                        id="range"
                                        value={animalRange}
                                        onChange={e => setAnimalRange(e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button type="submit" onClick={() => {
                                console.log("Save changes button clicked");
                                saveChanges();
                            }}>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>

                </Dialog>
            </>
        );
    } else {
        // User is signed out
        return <Unauthorized />
    }


}

export default Home;