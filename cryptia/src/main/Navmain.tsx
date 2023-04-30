import logo from '../Logos/foxlogo.png'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from './Cryptia';


type Props = {}

const Navmain  = (props: Props) => {
    const connect = useContext(AppContext)
    const navigate = useNavigate();
    return (
        <div className="sm:p-8 p-3 pb-12 ">
            <div className="sm:px-7 flex justify-between">
                {/* leftside logo */}
                <div className='flex items-center cursor-pointer' onClick={() => navigate('/')}>
                    <img height={45} width={65} src={logo} alt="" />
                    <p className='ml-14 text-[#58707e] montserrat-subtitle underline-offset-8 font-semibold underline decoration-[#10F1B4]  text-[1.1rem]'>Home</p>
                    <p className='ml-14 text-[#58707e] montserrat-subtitle underline-offset-8 font-semibold underline decoration-[#10F1B4]  text-[1.1rem]'>QnA</p>

                </div>

                {/* rigt side */}
                <div className="sm:flex-row flex-co flex space-x-3 items-center">
                  
                    <p className="sm:text-[1rem] montserrat-small  text-gray-500  font-semibold text-[0.8rem]">{sessionStorage.getItem('address') !== null || false ? `${sessionStorage.getItem('address')?.slice(0,19)}...` : ''}</p>
                    <button onClick={connect.connectWallet} className="montserrat-subtitle border-1 p-1 sm:text-[1rem] text-[0.8rem] hover:text-white hover:bg-[#10F1B4] shadow-xl px-2 sm:px-4 rounded-md bg-[#10F1B4E] text-[#10F1B4] font-semibold border-white ">
                        {sessionStorage.getItem('address') === null || false ? 'connect wallet' : 'Connected'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navmain 