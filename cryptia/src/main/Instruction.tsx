import { useContext } from 'react';
import { AppContext } from './Cryptia';

type Props = {}

const Instruction = (props: Props) => {
    const { show } = useContext(AppContext);
    return (

        <>
        <div className='border-r border-gray-600'>

            {show ?
                <div className='flex text-left flex-col gap-3 w-[90%]'> {/* on Transfer */}
                    <h1 className='montserrat-subheading text-gray-900 font-semibold text-[1.3rem]'>Transfer</h1>

                    <div className='montserrat-heading text-gray-700'>
                    <p>Safely insert the recipient's Cr address into the designated field.</p>
                    <p>Specify the exact amount and the specific token or coin you intend to transfer, ensuring a flawless transaction.</p>
                    <p> Securely initiate transfer with "Transfer" button, ensuring prompt delivery of funds to the recipient's designated address.</p>
                    </div>
                    
                    <div className='montserrat-heading'>
                    <h4 className='font-semibold'>29,032</h4>
                    <p>More than 29,032 stealth addresses have been generated</p>
                    </div>

                </div>

                :
                <div className='flex text-left flex-col gap-3 w-[80%]'> {/* on Accept */}
                    <h1 className='montserrat-subheading text-gray-900 font-semibold text-[1.3rem]'>Accept</h1>

                    <div className='montserrat-heading text-gray-700'>
                    <p>Click on the "Match" button or optionally paste your secret key to effortlessly retrieve your private key.</p>
                    <p>Gain access to the specific address where the funds have been sent.</p>
                    </div>

                    <div className='montserrat-heading'>
                    <h4 className='font-semibold'>29,032</h4>
                    <p>More than 29,032 Funds have been received</p>
                    </div>

                </div>
            }
        </div>
        </>
    )
}

export default Instruction