import Profile from "@/components/users/Profile";
import { StatusMessage } from "@/types";
import { useEffect, useState } from "react";
import Notification from "@/components/util/Notification";
import Header from "@/components/header";

const ProfilePage: React.FC = () => {
    const [notifications, setNotifications] = useState<(StatusMessage & { id: number })[]>([]);

    const pushNotification = (message: StatusMessage) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { ...message, id }]);

        setTimeout(() => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
        }, 3000);
    };

    useEffect(() => {
        const loggedInUser = sessionStorage.getItem("LoggedInUser");
        if (!loggedInUser) {
        pushNotification({ message: "You are not logged in. Redirecting to login.", type: "error" });
        setTimeout(() => {
            window.location.href = "/login";
        }, 2000);
        }
    }, []);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <Notification messages={notifications} />
            <main className="flex-1 flex justify-center items-start p-4">
                <Profile pushNotification={pushNotification}/>
            </main>
        </div>
    );
};

export default ProfilePage;