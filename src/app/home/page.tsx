"use client";

import { initializeApp } from "firebase/app";
import { useEffect, useState } from 'react';
import { NavBar } from "@/components/navigation/navbar";
import { Button } from "@/components/ui/button";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { firebaseConfig } from "@/lib/firebaseconfig";
import { getFirestore, collection, getDocs, DocumentData, doc, updateDoc, addDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { ChevronRight, Plus } from "lucide-react";
import Unauthorized from "@/components/unauthorized";
import {
    Card,
    CardContent,
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
if (app.name && typeof window !== 'undefined') {
    const analytics = getAnalytics(app);
}

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
    const [isNewAnimalDialogOpen, setIsNewAnimalDialogOpen] = useState(false);

    useEffect(() => {
        const fetchAnimals = async () => {
            const querySnapshot = await getDocs(collection(db, "animals"));
            const animals: DocumentData[] = [];
            await Promise.all(querySnapshot.docs.map(async (doc) => {
                const animalData = doc.data();
                animalData.id = doc.id;
                const personalSnapshot = await getDocs(collection(doc.ref, "personal"));
                animalData.personalNames = personalSnapshot.docs.map(personalDoc => personalDoc.data().name).filter(Boolean);
                animals.push(animalData);
            }));
            setAnimals(animals);
        };

        fetchAnimals();
    }, []);

    const signOutUser = () => {
        signOut(auth).then(() => {
            toast.info("You have been logged out.");
            router.push('/');
        }).catch((error) => {
            toast.error("An error occurred while logging out.");
            console.error(error);
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
            setAnimalClass(selectedAnimal.class || '');
            setAnimalDiet(selectedAnimal.diet || '');
            setAnimalFamily(selectedAnimal.family || '');
            setAnimalGenus(selectedAnimal.genus || '');
            setAnimalLifespan(selectedAnimal.lifespan || '');
            setAnimalLifespanCap(selectedAnimal.lifespan_cap || '');
            setAnimalLocation(selectedAnimal.location || '');
            setAnimalName(selectedAnimal.name || '');
            setAnimalOrder(selectedAnimal.order || '');
            setAnimalPhoto(selectedAnimal.photo || '');
            setAnimalRange(selectedAnimal.range || '');
            setAnimalSciName(selectedAnimal.sci_name || '');
        }
    }, [selectedAnimal]);

    const saveChanges = async () => {
        if (selectedAnimal) {
            const animalRef = doc(db, 'animals', selectedAnimal.id);
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

            try {
                await updateDoc(animalRef, updatedData);
                toast.success("Animal updated successfully");
                setSelectedAnimal(null);
                router.push(`/home`);
            } catch (error) {
                console.error("Error updating document: ", error);
                toast.error("Failed to update animal");
            }
        }
    };

    const createNewAnimal = async () => {
        const newAnimalData = {
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

        try {
            const docRef = await addDoc(collection(db, "animals"), newAnimalData);
            toast.success("New animal created successfully");
            setIsNewAnimalDialogOpen(false);
            // Reset form fields
            setAnimalClass('');
            setAnimalDiet('');
            setAnimalFamily('');
            setAnimalGenus('');
            setAnimalLifespan('');
            setAnimalLifespanCap('');
            setAnimalLocation('');
            setAnimalName('');
            setAnimalOrder('');
            setAnimalPhoto('');
            setAnimalRange('');
            setAnimalSciName('');
            // Refresh the animals list
            const newAnimal = { id: docRef.id, ...newAnimalData };
            setAnimals([...animalsList, newAnimal]);
            router.push(`/home`);
        } catch (error) {
            console.error("Error adding document: ", error);
            toast.error("Failed to create new animal");
        }
    };

    if (!user) {
        return <Unauthorized />;
    }

    return (
        <>
            <div className="flex w-full justify-between items-center p-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-40">
                <NavBar />
                <Button variant="outline" onClick={signOutUser} className="hover:bg-destructive hover:text-destructive-foreground transition-colors">
                    Logout
                </Button>
            </div>
            <div className="p-5 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
                <div className="max-w-md mx-auto mb-6">
                    <Label htmlFor="search" className="text-sm font-medium text-foreground mb-2 block">Search Animals</Label>
                    <Input
                        id="search"
                        className="w-full"
                        placeholder="Search by species name or individual animal..."
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {animalsList.filter(animal =>
                        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (animal.personalNames && animal.personalNames.some((name: string) => name.toLowerCase().includes(searchTerm.toLowerCase())))
                    ).map((animal, index) => (
                        <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 shadow-md">
                            <CardHeader className="p-0">
                                <div className="relative">
                                    <img 
                                        src={animal.photo} 
                                        alt={animal.name} 
                                        className="w-full h-48 object-cover" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <CardTitle className="absolute bottom-3 left-3 right-3 text-white text-lg font-semibold">
                                        {animal.name}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="w-full" variant="outline" onClick={() => setSelectedAnimal(animal)}>
                                            Edit Species Details
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-semibold">Edit Species Information</DialogTitle>
                                            <DialogDescription className="text-sm text-muted-foreground">
                                                Update the species details below. All changes will be saved when you click 'Save Changes'.
                                            </DialogDescription>
                                        </DialogHeader>
                                        {selectedAnimal && (
                                            <div className="space-y-6 py-4">
                                                {/* Basic Species Info */}
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-medium text-foreground border-b pb-2">Basic Information</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="name" className="text-sm font-medium">Species Name *</Label>
                                                            <Input
                                                                id="name"
                                                                value={animalName}
                                                                onChange={e => setAnimalName(e.target.value)}
                                                                placeholder="e.g., African Lion"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="photo" className="text-sm font-medium">Photo URL</Label>
                                                            <Input
                                                                id="photo"
                                                                value={animalPhoto}
                                                                onChange={e => setAnimalPhoto(e.target.value)}
                                                                placeholder="https://example.com/photo.jpg"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="diet" className="text-sm font-medium">Diet</Label>
                                                            <Input
                                                                id="diet"
                                                                value={animalDiet}
                                                                onChange={e => setAnimalDiet(e.target.value)}
                                                                placeholder="e.g., Carnivore, Herbivore, Omnivore"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="location" className="text-sm font-medium">Zoo Location</Label>
                                                            <Input
                                                                id="location"
                                                                value={animalLocation}
                                                                onChange={e => setAnimalLocation(e.target.value)}
                                                                placeholder="e.g., African Savanna, Tropical Forest"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Taxonomy */}
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-medium text-foreground border-b pb-2">Taxonomy</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="class" className="text-sm font-medium">Class</Label>
                                                            <Input
                                                                id="class"
                                                                value={animalClass}
                                                                onChange={e => setAnimalClass(e.target.value)}
                                                                placeholder="e.g., Mammalia"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="order" className="text-sm font-medium">Order</Label>
                                                            <Input
                                                                id="order"
                                                                value={animalOrder}
                                                                onChange={e => setAnimalOrder(e.target.value)}
                                                                placeholder="e.g., Carnivora"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="family" className="text-sm font-medium">Family</Label>
                                                            <Input
                                                                id="family"
                                                                value={animalFamily}
                                                                onChange={e => setAnimalFamily(e.target.value)}
                                                                placeholder="e.g., Felidae"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="genus" className="text-sm font-medium">Genus</Label>
                                                            <Input
                                                                id="genus"
                                                                value={animalGenus}
                                                                onChange={e => setAnimalGenus(e.target.value)}
                                                                placeholder="e.g., Panthera"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                        <div className="space-y-2 md:col-span-2">
                                                            <Label htmlFor="range" className="text-sm font-medium">Natural Range</Label>
                                                            <Input
                                                                id="range"
                                                                value={animalRange}
                                                                onChange={e => setAnimalRange(e.target.value)}
                                                                placeholder="e.g., Sub-Saharan Africa"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Lifespan Information */}
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-medium text-foreground border-b pb-2">Lifespan</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="lifespan" className="text-sm font-medium">Wild Lifespan</Label>
                                                            <Input
                                                                id="lifespan"
                                                                value={animalLifespan}
                                                                onChange={e => setAnimalLifespan(e.target.value)}
                                                                placeholder="e.g., 10-14 years"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="lifespan_cap" className="text-sm font-medium">Captivity Lifespan</Label>
                                                            <Input
                                                                id="lifespan_cap"
                                                                value={animalLifespanCap}
                                                                onChange={e => setAnimalLifespanCap(e.target.value)}
                                                                placeholder="e.g., 15-20 years"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <DialogFooter className="flex gap-2 pt-4 border-t">
                                            <Button 
                                                variant="outline"
                                                onClick={() => setSelectedAnimal(null)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button 
                                                type="submit" 
                                                onClick={saveChanges}
                                                className="bg-primary hover:bg-primary/90"
                                            >
                                                Save Changes
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Button className="w-full" variant="default" onClick={() => router.push(`home/${animal.id}`)}>
                                    View Individual Animals
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <Dialog open={isNewAnimalDialogOpen} onOpenChange={setIsNewAnimalDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
                        onClick={() => setIsNewAnimalDialogOpen(true)}
                        size="lg"
                    >
                        <Plus className="h-7 w-7" />
                        <span className="sr-only">Add new animal species</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Add New Animal Species</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Create a new animal species entry for the zoo database. Fill in as many details as possible.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        {/* Basic Species Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-foreground border-b pb-2">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium">Species Name *</Label>
                                    <Input
                                        id="name"
                                        value={animalName}
                                        onChange={e => setAnimalName(e.target.value)}
                                        placeholder="e.g., African Lion"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="photo" className="text-sm font-medium">Photo URL</Label>
                                    <Input
                                        id="photo"
                                        value={animalPhoto}
                                        onChange={e => setAnimalPhoto(e.target.value)}
                                        placeholder="https://example.com/photo.jpg"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="diet" className="text-sm font-medium">Diet</Label>
                                    <Input
                                        id="diet"
                                        value={animalDiet}
                                        onChange={e => setAnimalDiet(e.target.value)}
                                        placeholder="e.g., Carnivore, Herbivore, Omnivore"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-sm font-medium">Zoo Location</Label>
                                    <Input
                                        id="location"
                                        value={animalLocation}
                                        onChange={e => setAnimalLocation(e.target.value)}
                                        placeholder="e.g., African Savanna, Tropical Forest"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Taxonomy */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-foreground border-b pb-2">Taxonomy</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="class" className="text-sm font-medium">Class</Label>
                                    <Input
                                        id="class"
                                        value={animalClass}
                                        onChange={e => setAnimalClass(e.target.value)}
                                        placeholder="e.g., Mammalia"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="order" className="text-sm font-medium">Order</Label>
                                    <Input
                                        id="order"
                                        value={animalOrder}
                                        onChange={e => setAnimalOrder(e.target.value)}
                                        placeholder="e.g., Carnivora"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="family" className="text-sm font-medium">Family</Label>
                                    <Input
                                        id="family"
                                        value={animalFamily}
                                        onChange={e => setAnimalFamily(e.target.value)}
                                        placeholder="e.g., Felidae"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="genus" className="text-sm font-medium">Genus</Label>
                                    <Input
                                        id="genus"
                                        value={animalGenus}
                                        onChange={e => setAnimalGenus(e.target.value)}
                                        placeholder="e.g., Panthera"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="range" className="text-sm font-medium">Natural Range</Label>
                                    <Input
                                        id="range"
                                        value={animalRange}
                                        onChange={e => setAnimalRange(e.target.value)}
                                        placeholder="e.g., Sub-Saharan Africa"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Lifespan Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-foreground border-b pb-2">Lifespan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="lifespan" className="text-sm font-medium">Wild Lifespan</Label>
                                    <Input
                                        id="lifespan"
                                        value={animalLifespan}
                                        onChange={e => setAnimalLifespan(e.target.value)}
                                        placeholder="e.g., 10-14 years"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lifespan_cap" className="text-sm font-medium">Captivity Lifespan</Label>
                                    <Input
                                        id="lifespan_cap"
                                        value={animalLifespanCap}
                                        onChange={e => setAnimalLifespanCap(e.target.value)}
                                        placeholder="e.g., 15-20 years"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2 pt-4 border-t">
                        <Button 
                            variant="outline"
                            onClick={() => setIsNewAnimalDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            onClick={createNewAnimal}
                            className="bg-primary hover:bg-primary/90"
                        >
                            Create Species
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default Home;