import Navmain from './Navmain'
import Cr from './Cr'
import Instruction from './Instruction'
import Trx from './Trx'
import React, { createContext, useEffect, useState } from 'react';



type Props = {}


interface ContextValue {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean | any>>;
    connectWallet(): void;
    chainid: string | null
};



export const AppContext = createContext<ContextValue | any>(null)
const Cryptia = (props: Props) => {

    const [show, setShow] = useState<boolean>(true);
    const [wallet, setwallet] = useState<boolean>(false);
    const [chainid, setchainid] = useState<string | null>('');

    let chainId: string;

    const { ethereum }: any = window;

    if (ethereum) {
        ethereum.on('accountsChanged', (accounts: any) => {
            sessionStorage.setItem('address', accounts[0]);
            console.log('hello')

        })

        ethereum.on('chainChanged', async (chId: any) => {

            if (chId !== '0x1e15') {
                alert('plz connect to canto testnet')
                return
            }
            setchainid(chId)

        })

    }




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
                setchainid(chainId)
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

  




    const ContextValue: ContextValue = {
        show,
        setShow,
        connectWallet,
        chainid
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