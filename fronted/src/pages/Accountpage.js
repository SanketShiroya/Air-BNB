import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import Placepage from "./PlacesPage"
import axios from "axios";

const Accountpage = () => {
    const { ready, user, setuser } = useContext(UserContext);
    const { subpage } = useParams();
    const [Renav, setRenav] = useState(null);

    // console.log(subpage);
    async function logout() {
        await axios.post('/logout');
        setuser(null);
        setRenav('/');
    }

    if (ready && !user && !Renav) {
        return <Navigate to={"/login"} />
    }
    if (!ready) {
        return "Loading..."
    } 

    function profileclass(type = null) {
        // console.log(subpage);
        let classes = "py-2 px-4 inline-flex m-1 gap-1 rounded-full"
        if (type === subpage || subpage === undefined && type == 'profile') {
            classes += " bg-primary text-white";
        }
        else{
            classes += " bg-gray-300";
        }
        return classes;
    }

    if (Renav) {
        console.log(Renav);
        return <Navigate to={Renav} />
    }
    return (
        <>
            <div>
                <nav className="w-full flex mt-4 mb-3 justify-center">
                    <Link className={profileclass('profile')} to={"/account"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>

                        My Profile
                    </Link>
                    <Link className={profileclass('booking')} to={"/account/booking"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                        </svg>

                        My Booking
                    </Link>
                    <Link className={profileclass('places')} to={"/account/places"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                        </svg>

                        My Accommodations
                    </Link>
                </nav>

                {subpage === undefined && (
                    <div className="text-center mt-5 max-w-lg mx-auto ">
                        Logged in As {user.name} ({user.email})

                        <button className="primary max-w-sm mt-3" onClick={logout}>Log Out</button>
                    </div>
                )}

                {subpage === 'places' && (
                    <Placepage />
                )


                }
            </div>

        </>
    )
}

export default Accountpage;