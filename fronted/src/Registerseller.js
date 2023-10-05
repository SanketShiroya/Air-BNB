import {Link} from "react-router-dom";
import {useState} from "react";
import axios from "axios"; 

export default function Registerseller() {
  const [name,setName] = useState('');
  const [phone,setphone] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [password2,setPassword2] = useState('');
  const role = 'seller';
  // var regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
 
  async function registerUser(ev) {
    ev.preventDefault();
    if(password != password2){
        alert('Password Does not match')
        
    }

    // if (regex.test(phone)) {
    //     alert( 'Valid international phone number')
        
    // } else {
    //     alert('Invalid international phone number')
    //     return false;
    // }
    try {
      await axios.post('http://localhost:4000/register', {
        name,
        email,
        password,
        role
      });
      alert('Registration successful. Now you can log in');
    } catch (e) {
      alert('Registration failed. Please try again later');
      alert(e)
    }
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Seller Register </h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input type="text"
                 placeholder="John Doe"
                 value={name}
                 onChange={ev => setName(ev.target.value)} />
        
<input type="number"
    placeholder="Enter Your Mobile no."
    value={phone}
    onChange={ev => setphone(ev.target.value)}
/>
          <input type="email"
                 placeholder="your@email.com"
                 value={email}
                 onChange={ev => setEmail(ev.target.value)} />
            <input type="password"
                 placeholder="password"
                 value={password}
                 onChange={ev => setPassword(ev.target.value)} />
          <input type="password"
                 placeholder="confirm password"
                 value={password2}
                 onChange={ev => setPassword2(ev.target.value)} />

          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already a seller? <Link className="underline text-black" to={'/login'}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}