"use client"

import { initializeApp } from "firebase/app";
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, SetStateAction, useEffect, useState } from 'react';
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

type Params = {
  animal: string;
};

const Animal = ({ params }: { params: Params }) => {

  const router = useRouter();
  const user = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<DocumentData | null>(null);
  const [personalData, setPersonalData] = useState<{ id: string; photourl: string; name: string; }[]>([{ id: '', photourl: '', name: '' }]);

  useEffect(() => {
    const fetchPersonalAnimals = async () => {
      console.log(params);
      const animalDoc = doc(db, "animals", params.animal);
      const personalSnapshot = await getDocs(collection(animalDoc, "personal"));
      const personalAnimals = personalSnapshot.docs.map((doc) => ({
        id: doc.id,
        photourl: doc.data().photourl || "",
        name: doc.data().name || '',
        ...doc.data(),
      }));
      
      setPersonalData(personalAnimals);
      console.log(personalAnimals);
    };

    fetchPersonalAnimals();
  }, [params]);



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

  const [arrived, setArrived] = useState('');
  const [born, setBorn] = useState('');
  const [from, setFrom] = useState('');
  const [id, setId] = useState('');
  const [keepernotes, setKeepernotes] = useState('');
  const [name, setName] = useState('');
  const [photocredit, setPhotocredit] = useState('');
  const [photourl, setPhotourl] = useState('');
  const [sex, setSex] = useState('');

  useEffect(() => {
    if (selectedAnimal) {
      setArrived(selectedAnimal.arrived);
      setBorn(selectedAnimal.born);
      setFrom(selectedAnimal.from);
      setId(selectedAnimal.id);
      setKeepernotes(selectedAnimal.keepernotes);
      setName(selectedAnimal.name);
      setPhotocredit(selectedAnimal.photocredit);
      setPhotourl(selectedAnimal.photourl);
      setSex(selectedAnimal.sex);
    }
  }, [selectedAnimal]);


  function saveChanges() {
    console.log("FUNCTION CALLED");
    // Use the name of the animal as the document ID
    const animalRef = selectedAnimal ? doc(db, 'animals', selectedAnimal.id) : doc(db, 'animals', '');

    const updatedData = {
      arrived: arrived,
      born: born,
      from: from,
      id: id,
      keepernotes: keepernotes,
      name: name,
      photocredit: photocredit,
      photourl: photourl,
      sex: sex
    };


    console.log(updatedData);

    updateDoc(animalRef, updatedData);
    router.push("/");
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
            {personalData.filter((animal: { id: string; photourl: string; name: string; }) => animal.name.toLowerCase().includes(searchTerm.toLowerCase())).map((animal: {
              id: string;
              photourl: string;
              name: string;
            }, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <img src={animal.photourl} alt={animal.name?.toString() || ''} className='w-full h-48 object-cover rounded-md mb-2' />
                  <CardTitle>{animal.name}</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col w-full justify-between'>
                  <DialogTrigger asChild>
                    <Button variant={"expandIcon"} Icon={ChevronRight} iconPlacement="right" onClick={() => setSelectedAnimal(animal)}>Edit Animal Details</Button>
                  </DialogTrigger>
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
                  <Label htmlFor="arrived" className="text-right">
                    Arrived
                  </Label>
                  <Input
                    id="arrived"
                    value={arrived}
                    onChange={e => setArrived(e.target.value)}
                    className="col-span-3"
                  />
                  <Label htmlFor="born" className="text-right">
                    Born
                  </Label>
                  <Input
                    id="born"
                    value={born}
                    onChange={e => setBorn(e.target.value)}
                    className="col-span-3"
                  />
                  <Label htmlFor="from" className="text-right">
                    From
                  </Label>
                  <Input
                    id="from"
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                    className="col-span-3"
                  />
                  <Label htmlFor="id" className="text-right">
                    ID
                  </Label>
                  <Input
                    id="id"
                    value={id}
                    onChange={e => setId(e.target.value)}
                    className="col-span-3"
                  />
                  <Label htmlFor="keepernotes" className="text-right">
                    Keeper Notes
                  </Label>
                  <Input
                    id="keepernotes"
                    value={keepernotes}
                    onChange={e => setKeepernotes(e.target.value)}
                    className="col-span-3"
                  />
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="col-span-3"
                  />
                  <Label htmlFor="photocredit" className="text-right">
                    Photo Credit
                  </Label>
                  <Input
                    id="photocredit"
                    value={photocredit}
                    onChange={e => setPhotocredit(e.target.value)}
                    className="col-span-3"
                  />
                  <Label htmlFor="photourl" className="text-right">
                    Photo URL
                  </Label>
                  <Input
                    id="photourl"
                    value={photourl}
                    onChange={e => setPhotourl(e.target.value)}
                    className="col-span-3"
                  />
                  <Label htmlFor="sex" className="text-right">
                    Sex
                  </Label>
                  <Input
                    id="sex"
                    value={sex}
                    onChange={e => setSex(e.target.value)}
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

export default Animal;