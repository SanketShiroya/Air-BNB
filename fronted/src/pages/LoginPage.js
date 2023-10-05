import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext.js";
    
const Loginpage = () => { 
    const[email,setemail] = useState('');
    const[password,setpassword] = useState('');
    const[redirect,setredirect] = useState(false);
    const {setUser} = useContext(UserContext);
    
    async function LoginSubmit(ev){       
        ev.preventDefault();
        try {
            const {data} = await axios.post('http://localhost:4000/login', {email,password});
            setUser (data);      
                alert("Login successfull");
                setredirect(true);
        } catch (e) {
            alert("Log in Failed")
            alert(e)
        }   

    }

    if (redirect) {
        return <Navigate to="/"/>
    }
    return(
        <>
    <div className="grow flex items-center justify-around">
            <div className="mb-32">
                <h1 className="text-4xl text-center">Log In</h1>
                <form className="max-w-md mx-auto" onSubmit={LoginSubmit}>
                <input type={"email"} placeholder="Enter Your Email" onChange={(e)=>{setemail(e.target.value)}}></input>    
                <input type={"Password"} placeholder="Enter Your Password" onChange={(e)=>{setpassword(e.target.value)}}></input>    
                <button className="primary">Log in</button>
                <div className="text-center py-2 text-gray-500">
                    Don't Have Account Yet ? <Link className="underline text-black" to={"/register"}>Register</Link>
                </div>
                <div className="text-center py-2 text-gray-500">
                    Become A <Link className="underline text-black" to={"/registers"}>Seller</Link>
                </div>
                </form>
            </div>    
            </div>

        </>
    )
}

export default Loginpage;