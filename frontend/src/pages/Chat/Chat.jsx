import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../config.js';
import Avatar from '../../assets/images/Avatar-No-Background.png'
const baseUrl='http://localhost:5000'
const clientIo=io(baseUrl)
 const token =localStorage.getItem("token");
 const decoded=localStorage.getItem("user")

  const decodedObject = JSON.parse(decoded);
  
 
  const decodedId = decodedObject?._id;

  // Now you can use userId in your application


//  console.log(decoded);
 const role=localStorage.getItem("role");

 clientIo.emit('updateSocketId',{token})
 const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'authorization': token,
    'role':role
}


const Chat = () => {
    const [role, setRole] = useState(localStorage.getItem("role"));
const[allpatient,setAllPatient]=useState([]);
const [chatMessages, setChatMessages] = useState([]);
const [decoded, setDecoded] = useState({ id: '' });
const [meImage, setMeImage] = useState('');
    const [friendImage, setFriendImage] = useState('');
    const [destIdd, setDestIdd] = useState();
    const [messageInput, setMessageInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [doctors,setDoctor]=useState([]);

   const  getUsersData=()=>{
    let doctorId=decodedId
    console.log(doctorId);
    console.log({headers});
    axios.get(`${BASE_URL}/doctors/${doctorId}/patients`,{
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }).then((response)=>{
        console.log(response.data);
        setAllPatient(response.data)
    }).catch((error)=>{
        console.log(error.message);
    })
   }

   const getDoctors=()=>{
    axios.get(`${BASE_URL}/doctors/`).then((response)=>{
        console.log(response.data.data);
        setDoctor(response.data.data)
    }).catch((error)=>{
        console.log(error.message);
    })
 }




 const sendMessage = () => {
  console.log(destIdd);
  const data = {
    message: messageInput,
    destId:destIdd
  };

  axios
    .post(`${BASE_URL}/chats/chat`, data, {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => {
      console.log(response);
      const { message, chat } = response.data;
      if (message === 'Done') {
        console.log('Message sent successfully.');

        // If chat object is available in response, update images
        if (chat) {
          setMeImage(chat.pOne.photo || Avatar);
          setFriendImage(chat.pTwo.photo || Avatar);
        }

        // Clear the message input field after sending
        setMessageInput('');
    
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { message: messageInput, from: decodedId },
        ]);
        // You might want to update chat messages here as well
      } else {
        console.log('Failed to send message. Please check your connection.');
      }

        

        // You might want to update chat messages here as well
      
    })
    .catch((error) => {
      console.log(error.message);
    });
};

   
   const displayChatUser=(userId)=>{
    setDestIdd(userId); 
    setIsLoading(true);
    console.log(destIdd);
    axios.get(`${BASE_URL}/chats/ovo/${userId}`,{
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }).then((response)=>{
        console.log("Backend response data:", response.data);

        const{chat}=response.data
        setIsLoading(false); //
        
        if (chat) {
          console.log(chat);
            if (chat?.pOne && chat?.pTwo) {
              console.log(chat?.pOne,chat?.pTwo);
              console.log("Chat messages received:", chat.messages); // Debugging

               // Ensure pOne and pTwo exist
                // Compare pOne and pTwo IDs with decoded ID
                // const decodedId = decoded.user?._id; // Assuming decoded holds the user's ID
                console.log(decodedId);
                if (chat?.pOne?.toString() === decodedId) {
              
                    setMeImage(chat.pOne.photo);
                    setFriendImage(chat.pTwo.photo);
                } else if (chat?.pTwo?.toString() === decodedId) {
                  
                    setFriendImage(chat?.pOne?.photo);
                    setMeImage(chat?.pTwo?.photo);
                } 
                
                else {
                    console.log("Invalid chat data: Current user not found in chat.");
                }

                // Assuming chat.messages is an array of messages, set it accordingly
                setChatMessages(chat?.messages || []);
            } else {
                console.log("Invalid chat data: One or both users are null.");
            }
        } else {
            console.log("No chat data received from the server.");
        }
      }).catch((error)=>{
        setIsLoading(false); 
        console.log(error.message);
      })

}




   





useEffect(()=>{
        getUsersData();
        getDoctors();
        // displayChatUser(destIdd);
  
    },[token,role,destIdd, decodedId])

 

    useEffect(() => {
      const receiveMessageHandler = (message) => {
          const div = document.createElement('div');
          div.className = 'myFriend p-2  flex items-center gap-2 ';
          div.dir = 'rtl';
          div.innerHTML = `
              <img class="chatImage w-8 h-8" src="${friendImage || Avatar}" alt="" srcset="">
              <span class="mx-2 bg-gray-200 p-2 rounded-lg max-w-md">${message}</span>
          `;
          document.getElementById('chatMsg').appendChild(div);
      };
  
      clientIo.on('receiveMessage', receiveMessageHandler);
  
      return () => {
          clientIo.off('receiveMessage', receiveMessageHandler);
      };
  }, [clientIo, friendImage]);

    return (
    <>
         {role==='doctor'?<>
         <div className="bg-gray-200 min-h-screen flex justify-center">
            {/* Sidebar for patient list */}
            <div className="w-1/4 bg-white shadow-md rounded-lg p-6 mr-4">
                <h2 className="text-lg font-semibold mb-4">Patients:</h2>
                <ul>
    {allpatient?.map(patient => (
        <li key={patient.id} className="flex items-center mb-2" onClick={()=>{displayChatUser(patient._id)}}>
               <img src={patient.photo ? patient.photo : Avatar} alt={patient.name} className="w-8 h-8 rounded-full mr-2" />
            <span>{patient.name}</span>
        </li>
    ))}
</ul>
            </div>
            {/* Chat interface */}
            <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-6">
                <h1 className="text-xl font-bold mb-4">Chat Interface</h1>
                {/* Chat messages */}
                <div className="overflow-y-auto max-h-72 " id='chatMsg'>
                        {chatMessages.length > 0 ? (
                            chatMessages.map((message, index) => (
                                <div key={index} className={`  flex items-center gap-2 ${message?.from?.toString() === decoded.userId ? 'justify-end text-right' : 'justify-start text-left'}`}>
                                    <img src={message?.from?.toString() === decoded.userId ?(meImage || Avatar) : (friendImage || Avatar)} alt="User" className="w-8 h-8 rounded-full" />
                                    <div
                    className={`bg-gray-200 p-2 rounded-lg max-w-md ${
                      message?.from?.toString() === decoded.userId
                        ? 'text-right'
                        : 'text-left'
                    }`}
                  >
                    {message.message}
                  </div>
                                </div>
                            ))
                        ) : (
                            <div className="noResult text-center p-2">
                                <span className="mx-2">Say Hi to start the conversation.</span>
                            </div>
                        )}
                    </div>
                    
                    
                    
                {/* Chat input */}
                
                <div className="mt-4 flex items-center">
                    <input type="text" placeholder="Type your message..." className="flex-grow border border-gray-300 rounded-lg px-4 py-2 outline-none"  value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}/>
                     {isLoading ? (
              <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg" disabled>
                Sending...
              </button>
            ) : (
              <button
                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={()=>sendMessage(destIdd)}
              >
                Send
              </button>
            )}
                </div>
            </div>
            
        </div>
         
         
         </>:<>
         <div className="bg-gray-200 min-h-screen flex justify-center">
            {/* Sidebar for patient list */}
            <div className="w-1/4 bg-white shadow-md rounded-lg p-6 mr-4">
                <h2 className="text-lg font-semibold mb-4">Doctors:</h2>
                <ul>
    {doctors.map(doctor => (
        <li key={doctor.id} className="flex items-center mb-2" onClick={()=>{displayChatUser(doctor._id)}}>
               <img src={doctor?.photo ? doctor?.photo : Avatar} alt={doctor.name} className="w-8 h-8 rounded-full mr-2" />
            <span>{doctor.name}</span>
        </li>
    ))}
</ul>
            </div>
            {/* Chat interface */}
            <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-6">
                <h1 className="text-xl font-bold mb-4">Chat Interface</h1>
                {/* Chat messages */}
                <div className="overflow-y-auto max-h-72 " id='chatMsg'>
                        {chatMessages.length > 0 ? (
                            chatMessages.map((message, index) => (
                                <div key={index} className={`  flex items-center gap-2 ${message?.from?.toString() === decoded.doctorId ? 'justify-end text-right' : 'justify-start text-left'}`}>
                                    <img src={message?.from?.toString() === decoded.doctorId ?(meImage || Avatar) : (friendImage || Avatar)} alt="User" className="w-8 h-8 rounded-full" />
                                    <div
                    className={`bg-gray-200 p-2 rounded-lg max-w-md ${
                      message?.from?.toString() === decoded.userId
                        ? 'text-right'
                        : 'text-left'
                    }`}
                  >
                    {message.message}
                  </div>
                                </div>
                            ))
                        ) : (
                            <div className="noResult text-center p-2">
                                <span className="mx-2">Say Hi to start the conversation.</span>
                            </div>
                        )}
                    </div>
                    
                    
                    
                {/* Chat input */}
                
                <div className="mt-4 flex items-center">
                    <input type="text" placeholder="Type your message..." className="flex-grow border border-gray-300 rounded-lg px-4 py-2 outline-none"  value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}/>
                     {isLoading ? (
              <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg" disabled>
                Sending...
              </button>
            ) : (
              <button
                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={()=>sendMessage(destIdd)}
              >
                Send
              </button>
            )}
                </div>
            </div>
            
        </div>
         
         </>}
       
    </>
    )
}

export default Chat
