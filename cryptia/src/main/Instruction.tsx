import { useContext } from 'react';
import { AppContext } from './Cryptia';

type Props = {}

const Instruction = (props: Props) => {
    const { show } = useContext(AppContext);
    return (

        <>

            {show ?
                <div> {/* on Transfer */}
                    <h1>Transfer</h1>

                    <p>Safely insert the recipient's Cr address into the designated field.</p>
                    <p>Specify the exact amount and the specific token or coin you intend to transfer, ensuring a flawless transaction.</p>
                    <p> Securely initiate transfer with "Transfer" button, ensuring prompt delivery of funds to the recipient's designated address.</p>


                    <h4>29,032</h4>
                    <p>More than 29,032 stealth addresses have been generated</p>

                </div>

                :
                <div> {/* on accept*/}
                    <h1>Accept</h1>

                    <p>Click on the "Match" button or optionally paste your secret key to effortlessly retrieve your private key.</p>
                    <p>Gain access to the specific address where the funds have been sent.</p>

                    <h4>29,032</h4>
                    <p>More than 29,032 Funds have been received</p>


                </div>

            }

        </>
    )
}

export default Instruction