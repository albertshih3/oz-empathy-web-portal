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

  useEffect(() => {
    const fetchPersonalAnimals = async () => {
      const animalDoc = doc(db, "animals", params.animal);
      const personalSnapshot = await getDocs(collection(animalDoc, "personal"));
      const personalAnimals = personalSnapshot.docs.map((doc) => ({
        id: doc.id,
        aniid: doc.id,
        photourl: doc.data().photourl || "",
        name: doc.data().name || '',
        arrived: doc.data().arrived instanceof Timestamp ? doc.data().arrived.toDate().toISOString().split('T')[0] : '',
        born: doc.data().born instanceof Timestamp ? doc.data().born.toDate().toISOString().split('T')[0] : '',
        ...doc.data(),
      }));

      setPersonalData(personalAnimals);
    };

    fetchPersonalAnimals();
  }, [params]);

  useEffect(() => {
    if (selectedAnimal) {
      setArrived(selectedAnimal.arrived);
      setBorn(selectedAnimal.born);
      setFrom(selectedAnimal.from);
      setAniId(selectedAnimal.aniid);
      setId(selectedAnimal.id);
      setKeepernotes(selectedAnimal.keepernotes);
      setName(selectedAnimal.name);
      setPhotocredit(selectedAnimal.photocredit);
      setPhotourl(selectedAnimal.photourl);
      setSex(selectedAnimal.sex);
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
      <div className={'flex w-full justify-between p-5 border-b border-gray-100'}>
        <NavBar />
        <Button variant={"outline"} onClick={signOutUser}>Logout</Button>
      </div>
      <Input
        className="max-w-md mx-auto mb-5 mt-5"
        placeholder="Search animals"
        onChange={e => setSearchTerm(e.target.value)}
      />
      <Dialog>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-5'>
          {personalData.filter(animal => animal.name.toLowerCase().includes(searchTerm.toLowerCase())).map((animal, index) => (
            <Card key={index}>
              <CardHeader>
                <img src={animal.photourl} alt={animal.name?.toString() || ''} className='w-full h-48 object-cover rounded-md mb-2' />
                <CardTitle>{animal.name}</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col w-full justify-between'>
                <div className='flex flex-col w-full self-end'>
                  <DialogTrigger asChild>
                    <Button variant={"expandIcon"} Icon={ChevronRight} iconPlacement="right" onClick={() => {
                      setSelectedAnimal(animal);
                      setIsAddingNew(false);
                    }}>Edit Animal Details</Button>
                  </DialogTrigger>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isAddingNew ? "Add New Animal" : "Edit Animal Information"}</DialogTitle>
            <DialogDescription>
              {isAddingNew ? "Enter details for the new animal." : "You can edit the details of the selected animal below. Press save to apply changes or press the x button to cancel."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="arrived" className="text-right">Arrived</Label>
              <Input
                id="arrived"
                type="date"
                value={arrived}
                onChange={e => setArrived(e.target.value)}
                className="col-span-3"
              />
              <Label htmlFor="born" className="text-right">Born</Label>
              <Input
                id="born"
                type="date"
                value={born}
                onChange={e => setBorn(e.target.value)}
                className="col-span-3"
              />
              <Label htmlFor="from" className="text-right">From</Label>
              <Input
                id="from"
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="col-span-3"
              />
              <Label htmlFor="id" className="text-right">ID</Label>
              <Input
                id="id"
                value={id}
                onChange={e => setId(e.target.value)}
                className="col-span-3"
              />
              <Label htmlFor="keepernotes" className="text-right">Keeper Notes</Label>
              <Textarea
                id="keepernotes"
                value={keepernotes}
                onChange={e => setKeepernotes(e.target.value)}
                className="col-span-3"
              />
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="col-span-3"
              />
              <Label htmlFor="photocredit" className="text-right">Photo Credit</Label>
              <Input
                id="photocredit"
                value={photocredit}
                onChange={e => setPhotocredit(e.target.value)}
                className="col-span-3"
              />
              <Label htmlFor="photourl" className="text-right">Photo URL</Label>
              <Input
                id="photourl"
                value={photourl}
                onChange={e => setPhotourl(e.target.value)}
                className="col-span-3"
              />
              <Label htmlFor="sex" className="text-right">Sex</Label>
              <Input
                id="sex"
                value={sex}
                onChange={e => setSex(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={isAddingNew ? addNewAnimal : saveChanges}>
              {isAddingNew ? "Add Animal" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
        <div className="fixed bottom-5 right-5">
          <DialogTrigger asChild>
            <Button onClick={() => {
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
            }}>
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
          </DialogTrigger>
        </div>
      </Dialog>
    </>
  );
}

export default Animal;