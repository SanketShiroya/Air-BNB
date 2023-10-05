
import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";


export default function Userdata(){

    
const [data,setdata] = useState([]);
  
useEffect(()=>{
  axios.get('http://localhost:4000/getUser')
.then(function (response) {
  // handle success
  // console.log(response.data);
  setdata(response.data)
})
.catch(function (error) {
  // handle error
  console.log(error);
})
.then(function () {
  // always executed
});
},[]);
function deletep(id) {
  // alert(id)
  alert("Press Ok For Delete Product")
  axios
  .delete(`http://localhost:4000/deleteproduct/${id}`)
  .then(() => this.setState(
    {
       status: 'Delete successful' 
  }));
  
  // alert(`delete call ID ${id}`)
}

    return(
        <>

<div className="flex bg-gray-100 min-h-screen">
  <aside className="hidden sm:flex sm:flex-col">
   
    <div className="flex-grow flex flex-col justify-between text-gray-500 bg-gray-800">
      <nav className="flex flex-col mx-4 my-6 space-y-4">
        
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center py-3 text-purple-600  rounded-lg"
        >
          <span className="sr-only">Dashboard</span>
          <svg
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
            
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </a>
        <Link
          to="/dashboard/userdata"
          className="inline-flex items-center justify-center py-3 hover:text-gray-400 bg-white   focus:text-gray-400 focus:bg-gray-700 rounded-lg"
        >
          <span className="sr-only">User</span>
          <AiOutlineUser></AiOutlineUser>
        </Link>
        <a
          href="/dashboard/allproduct"
          className="inline-flex items-center justify-center py-3  focus:text-gray-400 focus:bg-gray-700 rounded-lg"
        >
          <span className="sr-only">Documents</span>
          <svg
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </a>
      </nav>
      <div className="inline-flex items-center justify-center h-20 w-20 border-t border-gray-700">
        <button className="p-3 hover:text-gray-400  focus:text-gray-400 focus:bg-gray-700 rounded-lg">
          <span className="sr-only">Settings</span>
          <svg
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  </aside>
  <div className="flex-grow text-gray-800">
    
    <main className="p-6 sm:p-10 space-y-6">
      <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <div className="mr-6">
          <h1 className="text-4xl font-semibold mb-2">Dashboard</h1>
          <h2 className="text-gray-600 ml-0.5"></h2>
        </div>
        <div className="flex flex-wrap items-start justify-end -mb-3">
        <h1>table</h1>
          
        </div>
        
      </div>
   
   <div className="">
                        <table
                          id="example2"
                          className="table table-bordered table-hover w-full"
                        >
                          <thead>
                            <tr className="text-left">
                              <th>User Name</th>
                              <th>Email ID</th>
                              <th>Role</th>
                              {/* <th>Engine version</th> */}
                              {/* <th>CSS grade</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {
                              data.map((all)=>{
                                return(
                                  <>                                <tr>
                                  <td className="py-2">{all.name}</td>
                                  <td className="py-2">{all.email}</td>
                                  <td>{all.role}</td>
                                  <td><button 
                                  className="px-3 py-1 bg-red-600 text-white rounded-md"
                                  onClick={()=>{deletep(all._id)}}

                                  >Remove</button></td>
                                </tr>

                                </>

                                )
                              })
                            }
                          </tbody>
                          <tfoot>
                          <tr className="text-left">

                              
                            <th>User Name</th>
                              <th>Email ID</th>
                              <th>Role</th>
                              
                            </tr>
                          </tfoot>
                        </table>
                      </div>
      

      
    </main>
  </div>
  </div>        </>
    )
};
