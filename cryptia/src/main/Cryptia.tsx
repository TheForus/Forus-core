import Navmain from './Navmain'
import Cr from './Cr'
import Instruction from './Instruction'
import Trx from './Trx'
import React, { createContext, useEffect, useState } from 'react';



type Props = {}


interface ContextValue {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean | any>>;
    connectWallet(): void
};



export const AppContext = createContext<ContextValue | any>(null)
const Cryptia = (props: Props) => {

    const [show, setShow] = useState<boolean>(true);
    const [wallet, setwallet] = useState<boolean>(false);

    let chainId: string;

    const { ethereum }: any = window;





    const connectWallet = async (): Promise<void> => {
        if (ethereum === undefined) {
            alert('Plz install metamask')
            return;
        }
        try {
            if (ethereum) {
                const accounts = await ethereum.request({ method: "eth_requestAccounts" })
                sessionStorage.setItem('address', accounts[0]);

                chainId = await ethereum.request({ method: "eth_chainId" })
                console.log(chainId)


                if (chainId !== '0x1e15') {
                    alert('plz connect to canto testnet')
                }
            }
            setwallet(true)

        }
        catch (error) {
            console.log('Error:', error);
        }
    };

    useEffect(() => {
        if (ethereum && wallet === true) {
            ethereum.on('accountsChanged', connectWallet)
            if (chainId !== '0x1e15') {
                alert('plz connect to canto testnet')
                console.log(chainId)
            }
        }





    }, [])




    const ContextValue: ContextValue = {
        show,
        setShow,
        connectWallet
    };

    return (
        <AppContext.Provider value={ContextValue}>
            <Navmain />
            <Cr />

            <div>
                <Instruction />
                <Trx />
            </div>

        </AppContext.Provider>
    )
}

export default Cryptia