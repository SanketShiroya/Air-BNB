import { useContext, useState } from "react";
import { UserContext } from "../UserContext.js";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage.js";
import AccountNav from "../AccountNav";
import AccountNavu from "../AccountNavu.js";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  async function logout() {
    await axios.post('http://localhost:4000/logout');
    setRedirect('/');
    setUser(null);
  }

  if (!ready) {
    return 'Loading...';
  }

  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }
  if ((user.role) === 'seller') {


    return (
      <div>
        <AccountNav />
        {subpage === 'profile' && (
          <div className="text-center max-w-lg mx-auto">
            Logged in as {user.name} ({user.email})<br />
            <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
          </div>
        )}
        {subpage === 'places' && (
          <PlacesPage />
        )}
      </div>
    );
  }

  else if ((user.role) === 'master') {


    return (
      <div>
        <AccountNavu />
        {subpage === 'profile' && (

          <div className="text-center max-w-lg mx-auto">
            <Link to={'/dashboard'}>
              <button className="primary max-w-sm mt-2">Dashboard</button>
            </Link>
            <p><br></br></p>
            Logged in as {user.name} ({user.email})<br />
            <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
          </div>
        )}
        {subpage === 'places' && (
          <PlacesPage />
        )}
      </div>
    );
  }

  else {

    return (
      <div>
        <AccountNavu />
        {subpage === 'profile' && (
          <div className="text-center max-w-lg mx-auto">
            Logged in as {user.name} ({user.email})<br />
            <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
          </div>
        )}
        {subpage === 'places' && (
          <PlacesPage />
        )}
      </div>
    );
  }


}