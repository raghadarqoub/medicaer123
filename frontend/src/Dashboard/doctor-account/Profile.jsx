import {useEffect, useState} from 'react'
import {AiOutlineDelete} from 'react-icons/ai'
import uploadImageToCloudinary from '../../utils/uploadCloudinary.js';
import { BASE_URL ,token} from '../../config.js';
import { toast } from 'react-toastify';
const Profile = ({doctorData}) => {
    const [formData ,setFormData]=useState({
        name:'',
        email:'',
        password:'',
        gender:'',
        bloodType:'',
        address:'',
        phone:'',
        bio:'',
        specialization:'',
        ticketPrice:null,
        qualifications: [],
        experiences: [],
        timeSlots: [],
        about: '',
        photo: null,
    })
    useEffect(()=>{
        setFormData({
            name:doctorData.name,
            email:doctorData.email,
            gender:doctorData.gender,
            bloodType:doctorData.bloodType,
            address:doctorData.address,
            phone:doctorData.phone,
            bio:doctorData.bio,
            specialization:doctorData.specialization,
            ticketPrice:doctorData.ticketPrice,
            qualifications:doctorData.qualifications,
            experiences:doctorData.experiences,
            timeSlots:doctorData.timeSlots,
            about:doctorData.about,
            photo:doctorData.photo,
        })
    },[doctorData])
    const handelInputChange =e => {
        setFormData({ ...formData , [e.target.name]:e.target.value})
    }
    const handleFileInputChange=async event => {
        const file = event.target.files[0];
        const data = await uploadImageToCloudinary(file);
        // setPreviewURL(data.url);
        // setselectedFile(data.url);
        setFormData({...formData,photo:data?.url})
    };
    const updateProfileHandler = async e=> { 
        e.preventDefault();
            try {
                const res = await fetch(`${BASE_URL}/doctors/${doctorData._id}`,{
                    method: 'Put',
                    headers:{
                        'Content-Type' : 'application/json',
                        Authorization:`Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                })
                const result = await res.json();
                if(!res.ok){
                    throw Error (result)
                }
                toast.success(result.message);
            } catch (err) {
                toast.error(err.message)
            }
    };
    //reusable function for adding item
    const addItem = (key, item) => {
        setFormData(prevFormData => ({
            ...prevFormData,
                [key]: [...prevFormData[key], item],
        }))
    };
    //reusable input change function
    const handeleReusableInputChangeFunc = (key, index, event) => {
        const {name , value} = event.target;
        setFormData(prevFormData =>{ 
            const updateItems = [...prevFormData[key]];
            updateItems[index] [name]=value;
            return {
                ...prevFormData,
                [key]: updateItems,
            };
        });
    };
    // resuable function for deleting item
    const deleteItem = (key, index) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [key]:prevFormData[key].filter((_,i)=>i !== index),
        }));
    };
    // resuable function for adding qualification
    const addQualification =e=>{
        e.preventDefault();
        addItem('qualifications',{
            startingData:'',
            endingData:'',
            degree:'zxcv',
            university:'zxcv',
        });
    };
    const handleQualificationChange = (event ,index)=>{
        handeleReusableInputChangeFunc('qualifications',index,event);
    };
    const deleteQualification = (e,index) => {
        e.preventDefault();
        deleteItem('qualifications',index)
    };
    ///////////// experiences///////////////////
    const addExperiences =e=>{
        e.preventDefault();
        addItem('experiences',{
            startingData:"" ,
            endingData:"", 
            position:"qwe" ,
            hospital:"asdfg"
        });
    };
    const handleExperiencesChange = (event ,index)=>{
        handeleReusableInputChangeFunc('experiences',index,event);
    };
    const deleteExperience = (e,index) => {
        e.preventDefault();
        deleteItem('experiences',index)
    };
///////////////   timeSlots //////////////////
const addtimeSlots =e=>{
    e.preventDefault();
    addItem('timeSlots',{
        day:"" ,
        startingTime:"" ,
        endingTime:"" ,
    });
};
const handleTimeSlotsChange = (event ,index)=>{
    handeleReusableInputChangeFunc('timeSlots',index,event);
};
const deleteTimeSlots = (e,index) => {
    e.preventDefault();
    deleteItem('timeSlots',index)
};
    return (
    <div>
        <h2 className='text-headingColor font-bold text-[24px] leading-9 mb-10 '>Profile Information</h2>
        <form> 
            <div className='mb-5'>
            <p className='form__label'>Name*</p>
            <input 
            type="text" 
            name='name' 
            value={formData.name} 
            onChange={handelInputChange}
            placeholder='Full Name' 
            className='form__input'
            />
            </div>
            <div className='mb-5'>
            <p className='form__label'>Email*</p>
            <input 
            type="email" 
            name='email' 
            value={formData.email} 
            onChange={handelInputChange}
            placeholder='Email' 
            className='form__input'
            readOnly
            aria-readonly
            disabled="true"
            />
            </div>
            <div className='mb-5'>
            <p className='form__label'>Phone*</p>
            <input 
            type="number" 
            name='phone' 
            value={formData.phone} 
            onChange={handelInputChange}
            placeholder='Phone Number' 
            className='form__input'
            />
            </div>
            <div className='mb-5'>
            <p className='form__label'>Bio*</p>
            <input 
            type="text" 
            name='bio' 
            value={formData.bio} 
            onChange={handelInputChange}
            placeholder='Bio'  
            className='form__input'
            maxLength={100}
            />
            </div>
            <div className='mb-5'>
                <div className='grid grid-cols-3 gap-5 mb-[30px] '>
                    <div>
                        <p className='form__label'>Gender*</p>
                        <select name="gender" value={formData.gender} onChange={handelInputChange} className='form__input py-3.5'>
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div>
                        <p className='form__label'>Specialization*</p>
                        <select name="specialization" value={formData.specialization} onChange={handelInputChange} className='form__input py-3.5'>
                            <option value="">Select</option>
                            <option value="surgeon">Surgeon</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="dermatologist">Dermatologist</option>
                        </select>
                    </div>
                    <div>
                        <p className='form__label'>Ticket Price*</p>
                        <input 
                        type="number" 
                        placeholder='100' 
                        name='ticketPrice' 
                        value={formData.ticketPrice} 
                        onChange={handelInputChange} 
                        className='form__input' />
                    </div>
                </div>
            </div>
            <div className='mb-5'>
                <p className='form__label'>Qualifications*</p>
                {formData.qualifications?.map((item, index) => (<div key={index}>
                    <div>
                        <div className='grid grid-cols-2 gap-5'> 
                            <div>
                                <p className='form__label'>Starting Data*</p>
                                <input 
                                type="date" 
                                name='startingData' 
                                value={item.startingData} 
                                className='form__input'
                                onChange={e=> handleQualificationChange (e,index)} 
                                />
                            </div>
                            <div>
                                <p className='form__label'>Ending Data*</p>
                                <input 
                                type="date" 
                                name='endingData' 
                                value={item.endingData} 
                                className='form__input'
                                onChange={e=> handleQualificationChange (e,index)} 

                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-5'> 
                            <div>
                                <p className='form__label'>Degree*</p>
                                <input 
                                type="text" 
                                name='degree' 
                                value={item.degree} 
                                className='form__input'
                                onChange={e=> handleQualificationChange (e,index)}  
                                />
                            </div>
                            <div>
                                <p className='form__label'>University*</p>
                                <input 
                                type="text" 
                                name='university' 
                                value={item.university} 
                                className='form__input'
                                onChange={e=> handleQualificationChange (e,index)} 
                                />
                            </div>
                        </div>
                            <button onClick={e=>deleteQualification(e,index)} className='bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer '>
                                <AiOutlineDelete/>
                                </button>
                    </div>
                </div>
            ))}
            <button onClick={addQualification} className='bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer '> Add Qualification</button>
            </div>
            <div className='mb-5'>
                <p className='form__label'>Experiences*</p>
                {formData.experiences?.map((item, index) => (<div key={index}>
                    <div>
                        <div className='grid grid-cols-2 gap-5'> 
                            <div>
                                <p className='form__label'>Starting Data*</p>
                                <input 
                                type="date" 
                                name='startingData' 
                                value={item.startingData} 
                                className='form__input'
                                onChange={e=> handleExperiencesChange (e,index)} 
                                />
                            </div>
                            <div>
                                <p className='form__label'>Ending Data*</p>
                                <input 
                                type="date" 
                                name='endingData' 
                                value={item.endingData} 
                                className='form__input'
                                onChange={e=> handleExperiencesChange (e,index)} 
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-5'> 
                            <div>
                                <p className='form__label'>Position*</p>
                                <input 
                                type="text" 
                                name='position' 
                                value={item.position} 
                                className='form__input'
                                onChange={e=> handleExperiencesChange (e,index)} 
                                />
                            </div>
                            <div>
                                <p className='form__label'>Hospital*</p>
                                <input 
                                type="text" 
                                name='hospital' 
                                value={item.hospital} 
                                className='form__input'
                                onChange={e=> handleExperiencesChange (e,index)} 
                                />
                            </div>
                        </div>
                            <button onClick={e=>deleteExperience(e,index)} className='bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer '>
                                <AiOutlineDelete/>
                                </button>
                    </div>
                </div>
            ))}
            <button onClick={addExperiences} className='bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer '> Add Experience</button>
            </div>
            <div className='mb-5'>
                <p className='form__label'>Time Solts*</p>
                {formData.timeSlots?.map((item, index) => (
                <div key={index}>
                    <div>
                        <div className='grid grid-cols-2 md:grid-cols-4 mb-[30px] gap-5'> 
                            <div>
                                <p className='form__label'>Day*</p>
                                    <select name="day" 
                                    value={item.day} 
                                    className='form__input py-3.5' 
                                    onChange={e=> handleTimeSlotsChange (e,index)}>
                                        <option value="">Select</option>
                                        <option value="saturday">Saturday</option>
                                        <option value="sunday">Sunday</option>
                                        <option value="monday">Monday</option>
                                        <option value="tuesday">Tuesday</option>
                                        <option value="wednesday">Wednesday</option>
                                        <option value="thursday">Thursday</option>
                                        <option value="friday">Friday</option>
                                    </select>
                            </div>
                            <div>
                                <p className='form__label'>Starting Time*</p>
                                <input 
                                type="time" 
                                name='startingTime' 
                                value={item.startingTime} 
                                className='form__input'
                                onChange={e=> handleTimeSlotsChange (e,index)} 
                                />
                            </div>
                            <div>
                                <p className='form__label'>Ending Time*</p>
                                <input 
                                type="time" 
                                name='endingTime' 
                                value={item.endingTime} 
                                className='form__input'
                                onChange={e=> handleTimeSlotsChange (e,index)} 
                                />
                            </div>
                            <div onClick={e=>deleteTimeSlots(e,index)} className='flex items-center '>
                            <button className='bg-red-600 p-2 rounded-full text-white text-[18px] cursor-pointer mt-6 '>
                                <AiOutlineDelete/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={addtimeSlots} className='bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer '> Add TimeSlot</button>
            </div>
            <div className="mb-5">
                <p className='form__label'>About*</p>
                <textarea 
                name='about' 
                rows={5} 
                value={formData.about}
                placeholder='Write about you ' 
                className='form__input'
                onChange={handelInputChange}
                ></textarea>
            </div>
            <div className="mb-5 flex items-center gap-3">
            {formData.photo && (
                            <figure className='w-[60px] h-[60px] rounded-full border-2 border-solid
                                border-primaryColor flex items-center justify-center '>
                                <img 
                                src={formData.photo} alt=""
                                className='rounded-full w-[58px] h-[58px]' />
                            </figure>
                            )}
                            <div className='relative w-[130px] h-[50px]'>
                                <input
                                        type="file"
                                        name="photo"
                                        id="customFile" 
                                        onChange={handleFileInputChange}
                                        accept='.jpg, .png'
                                        className='absolute top-0 left-0 w-full h-full  opacity-0 cursor-pointer'
                                        />
                                        <label
                                        htmlFor="customFile" 
                                        className='absolute top-0 left-0 w-full h-full  
                                        flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden 
                                        bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer '>
                                        Upload Photo
                                        </label>
                            </div>
                        </div>
            <div>
                <button 
                type='submit' 
                onClick={updateProfileHandler}
                className='bg-primaryColor  py-3 px-4  text-white rounded-lg  w-full text-[18px] leading-[30px] 
                '> Update Profile</button>
            </div>
        </form>
    </div>
    )
}

export default Profile
