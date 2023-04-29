import { useContext } from 'react';
import { AppContext } from './Cryptia';

type Props = {}

const Navmain = (props: Props) => {

    const connect = useContext(AppContext)
    return (
        <div>

            {/* logo left */}

            <h1>Logo</h1>
            <p>Home</p>
            <p>Qna</p>


            {/* right side */}
            <p >{sessionStorage.getItem('address') !== null || false ? `${sessionStorage.getItem('address')}` : ''}</p>

            <button onClick={connect.connectWallet}> {(sessionStorage.getItem('address') === null || false) ? 'connect wallet' : 'Connected'}</button>

        </div>
    )
}

export default Navmain