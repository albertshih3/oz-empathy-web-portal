"use client";

import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, DocumentData, Timestamp } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { useRouter } from "next/navigation";
import { ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";

import { NavBar } from "@/components/navigation/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Unauthorized from "@/components/unauthorized";

import { firebaseConfig } from "@/lib/firebaseconfig";

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

type Params = {
  animal: string;
};

const Animal = ({ params }: { params: Params }) => {
  const router = useRouter();
  const user = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<DocumentData | null>(null);
  const [personalData, setPersonalData] = useState<{ id: string; aniid: string; photourl: string; name: string; }[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [arrived, setArrived] = useState('');
  const [born, setBorn] = useState('');
  const [from, setFrom] = useState('');
  const [aniid, setAniId] = useState('');
  const [id, setId] = useState('');
  const [keepernotes, setKeepernotes] = useState('');
  const [name, setName] = useState('');
  const [photocredit, setPhotocredit] = useState('');
  const [photourl, setPhotourl] = useState('');
  const [sex, setSex] = useState('');

  // Helper function to fetch and refresh animal data
  const fetchPersonalAnimals = async () => {
    const animalDoc = doc(db, "animals", params.animal);
    const personalSnapshot = await getDocs(collection(animalDoc, "personal"));
    const personalAnimals = personalSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        aniid: doc.id,
        photourl: data.photourl || "",
        name: data.name || '',
        // Convert Timestamp to date string for form inputs
        arrived: data.arrived instanceof Timestamp ? data.arrived.toDate().toISOString().split('T')[0] : (data.arrived || ''),
        born: data.born instanceof Timestamp ? data.born.toDate().toISOString().split('T')[0] : (data.born || ''),
        // Include all other data fields
        ...data,
      };
    });

    setPersonalData(personalAnimals);
  };

  useEffect(() => {
    fetchPersonalAnimals();
  }, [params]);

  useEffect(() => {
    if (selectedAnimal) {
      // Convert Timestamp objects to date strings for input fields
      setArrived(selectedAnimal.arrived instanceof Timestamp 
        ? selectedAnimal.arrived.toDate().toISOString().split('T')[0] 
        : selectedAnimal.arrived || '');
      setBorn(selectedAnimal.born instanceof Timestamp 
        ? selectedAnimal.born.toDate().toISOString().split('T')[0] 
        : selectedAnimal.born || '');
      setFrom(selectedAnimal.from || '');
      setAniId(selectedAnimal.aniid || '');
      setId(selectedAnimal.id || '');
      setKeepernotes(selectedAnimal.keepernotes || '');
      setName(selectedAnimal.name || '');
      setPhotocredit(selectedAnimal.photocredit || '');
      setPhotourl(selectedAnimal.photourl || '');
      setSex(selectedAnimal.sex || '');
    }
  }, [selectedAnimal]);

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

  const saveChanges = async () => {
    const paramsDocumentId = params.animal;
    const actualDocumentId = selectedAnimal?.aniid;
    const animalRef = selectedAnimal ? doc(db, 'animals', paramsDocumentId, 'personal', actualDocumentId) : doc(db, 'animals', '');

    const updatedData = {
      arrived: arrived ? Timestamp.fromDate(new Date(arrived)) : null,
      born: born ? Timestamp.fromDate(new Date(born)) : null,
      from,
      id,
      keepernotes,
      name,
      photocredit,
      photourl,
      sex
    };

    try {
      await updateDoc(animalRef, updatedData);
      toast.success("Animal details updated successfully!");
      
      // Refresh the animal list to show updated data
      await fetchPersonalAnimals();
      
      router.push(`/home`);
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("Failed to update animal details.");
    }
  };

  const addNewAnimal = async () => {
    const paramsDocumentId = params.animal;
    const animalRef = collection(db, 'animals', paramsDocumentId, 'personal');

    const newAnimalData = {
      arrived: arrived ? Timestamp.fromDate(new Date(arrived)) : null,
      born: born ? Timestamp.fromDate(new Date(born)) : null,
      from,
      id,
      keepernotes,
      name,
      photocredit,
      photourl,
      sex
    };

    try {
      await addDoc(animalRef, newAnimalData);
      toast.success("New animal added successfully!");
      
      // Refresh the animal list to show the new animal
      await fetchPersonalAnimals();
      
      setIsAddingNew(false);
      router.push(`/home`);
    } catch (error) {
      console.error("Error adding new animal: ", error);
      toast.error("Failed to add new animal.");
    }
  };

  if (!user) {
    return <Unauthorized />;
  }

  return (
    <>
      <div className='flex w-full justify-between items-center p-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-40'>
        <NavBar />
        <Button variant="outline" onClick={signOutUser} className="hover:bg-destructive hover:text-destructive-foreground transition-colors">
          Logout
        </Button>
      </div>
      <div className="bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
        <div className="max-w-md mx-auto mb-6 mt-6 px-5">
          <Label htmlFor="search" className="text-sm font-medium text-foreground mb-2 block">Search Individual Animals</Label>
          <Input
            id="search"
            className="w-full"
            placeholder="Search by animal name..."
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      <Dialog>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-5'>
          {personalData.filter(animal => animal.name.toLowerCase().includes(searchTerm.toLowerCase())).map((animal, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 shadow-md">
              <CardHeader className="p-0">
                <div className="relative">
                  <img 
                    src={animal.photourl} 
                    alt={animal.name?.toString() || ''} 
                    className='w-full h-48 object-cover' 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <CardTitle className="absolute bottom-3 left-3 right-3 text-white text-lg font-semibold">
                    {animal.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className='p-4'>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="default" onClick={() => {
                    setSelectedAnimal(animal);
                    setIsAddingNew(false);
                  }}>
                    Edit Animal Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{isAddingNew ? "Add New Animal" : "Edit Animal Information"}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {isAddingNew ? "Enter details for the new animal." : "You can edit the details of the selected animal below. All changes will be saved when you click 'Save Changes'."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Animal Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter animal name"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id" className="text-sm font-medium">Animal ID</Label>
                  <Input
                    id="id"
                    value={id}
                    onChange={e => setId(e.target.value)}
                    placeholder="Enter unique ID"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sex" className="text-sm font-medium">Sex</Label>
                  <Input
                    id="sex"
                    value={sex}
                    onChange={e => setSex(e.target.value)}
                    placeholder="Male/Female/Unknown"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from" className="text-sm font-medium">Origin</Label>
                  <Input
                    id="from"
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                    placeholder="Where did this animal come from?"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground border-b pb-2">Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="born" className="text-sm font-medium">Date of Birth</Label>
                  <Input
                    id="born"
                    type="date"
                    value={born}
                    onChange={e => setBorn(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrived" className="text-sm font-medium">Arrival Date</Label>
                  <Input
                    id="arrived"
                    type="date"
                    value={arrived}
                    onChange={e => setArrived(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground border-b pb-2">Media</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="photourl" className="text-sm font-medium">Photo URL</Label>
                  <Input
                    id="photourl"
                    value={photourl}
                    onChange={e => setPhotourl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full"
                  />
                  {photourl && (
                    <div className="mt-2">
                      <img 
                        src={photourl} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-md border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photocredit" className="text-sm font-medium">Photo Credit</Label>
                  <Input
                    id="photocredit"
                    value={photocredit}
                    onChange={e => setPhotocredit(e.target.value)}
                    placeholder="Photographer name or source"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground border-b pb-2">Additional Information</h3>
              <div className="space-y-2">
                <Label htmlFor="keepernotes" className="text-sm font-medium">Keeper Notes</Label>
                <Textarea
                  id="keepernotes"
                  value={keepernotes}
                  onChange={e => setKeepernotes(e.target.value)}
                  placeholder="Special care instructions, behavioral notes, medical information, etc."
                  className="w-full min-h-[100px] resize-none"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Include any important information about this animal's care, behavior, or medical history.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                // Reset form and close dialog
                setIsAddingNew(false);
                setSelectedAnimal(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={isAddingNew ? addNewAnimal : saveChanges}
              className="bg-primary hover:bg-primary/90"
            >
              {isAddingNew ? "Add Animal" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
        <div className="fixed bottom-6 right-6 z-50">
          <DialogTrigger asChild>
            <Button 
              className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              onClick={() => {
                setIsAddingNew(true);
                setSelectedAnimal(null);
                setArrived('');
                setBorn('');
                setFrom('');
                setAniId('');
                setId('');
                setKeepernotes('');
                setName('');
                setPhotocredit('');
                setPhotourl('');
                setSex('');
              }}
              size="lg"
            >
              <Plus className="h-7 w-7" />
              <span className="sr-only">Add new individual animal</span>
            </Button>
          </DialogTrigger>
        </div>
      </Dialog>
      </div>
    </>
  );
}

export default Animal;