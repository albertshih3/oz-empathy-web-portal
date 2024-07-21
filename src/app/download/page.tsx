import { NavBar } from "@/components/navigation/navbar";
import { firebaseConfig } from "@/lib/firebaseconfig";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
if (app.name && typeof window !== 'undefined') {
    const analytics = getAnalytics(app);
}

const Download = () => {
    return (
        <div className={'flex w-full justify-between p-5 border-b border-gray-100'}>
            <NavBar />
        </div>
    )
}

export default Download;