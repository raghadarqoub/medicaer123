
import { formateData } from '../../utils/formateData.js'

const Appointment = ({appointments}) => {
    return (
    <table>
        <thead>
        <tr>
            <th scope='col' className='px-6 py-3 '>
                Name
            </th>
            <th scope='col' className='px-6 py-3 '>
                Gendar
            </th>
            <th scope='col' className='px-6 py-3 '>
                Payment
            </th>
            <th scope='col' className='px-6 py-3 '>
                Price
            </th>
            <th scope='col' className='px-6 py-3 '>
                Booked on
            </th>
            <th scope='col' className='px-6 py-3 '>
            Age
            </th>
            <th scope='col' className='px-6 py-3 '>
            Time
            </th>
            <th scope='col' className='px-6 py-3 '>
            Day
            </th>
        </tr>
        </thead>
        <tbody>
            {appointments?.map ( item => (
                <tr key={item?._id}>
                    <th scope='row' 
                    className='flex items-center px-6 py-4 text-gray-900 whitespace-nowrap'
                    >
                        <img src={item?.user?.photo} 
                        className='w-10 h-10 rounded-full'
                        alt="" />
                        <div className='pl-3'>
                            <div className='text-base font-semibold'>{item?.user?.name}</div>
                            <div className='text-normal text-gray-500'>
                                {item?.user?.email}
                            </div>
                        </div>
                    </th>
                    <td className='px-6 py-4'>{item?.user?.gender} </td>
                    <td className='px-6 py-4'> 

                    {item.isPaid && (<div className='flex items-center'>
                        <div className='h-2.5 w-2.5 rounded-full bg-green-500 mr-2'></div>
                            Pind
                        </div>
                    )}
                    {!item.isPaid && (<div className='flex items-center'>
                        <div className='h-2.5 w-2.5 rounded-full bg-red-500 mr-2'></div>
                            UnPind
                        </div>
                    )}
                    </td>
                    <td className='px-6 py-4'>{item?.ticketPrice}</td>
                    <td className='px-6 py-4'>{formateData(item?.createdAt)}</td>
                    <td className='px-6 py-4'>{item?.user?.age} </td>
                    <td className='px-6 py-4'>{item?.selectedTimeSlot?.startingTime}-{item?.selectedTimeSlot?.endingTime} </td>
                    <td className='px-6 py-4'>{item?.selectedTimeSlot?.day} </td>

                    {/* <td className='px-6 py-4'>  */}
                </tr>
            ))}
        </tbody>
    </table>
    )
}

export default Appointment
