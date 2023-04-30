// main : #02e48a
// text : #00db84

import React from 'react';
import { MdOutlineSecurity, MdPrivacyTip } from 'react-icons/md';
import { AiOutlineTransaction } from 'react-icons/ai';
import { BsCurrencyExchange } from 'react-icons/bs';
import FeatureBlock from '../components/FeatureBlock';

type Props = {}

const Features = (props: Props) => {
    return (
        <>
        <div className='sm:px-20 px-12 p-4 flex flex-col py-10 space-y-10 justify-center items-center'>
            <h1 className='montserrat-heading py-4 text-3xl 
            font-semibold text-[#09ec7a] border-b border-gray-400 '>Features and Capabilities</h1> {/* Heading */}
            <div className='md:grid flex flex-col grid-rows-3 lg:grid-rows-2
             sm:grid-flow-col gap-4'>
                <FeatureBlock 
                  heading='Enhanced Privacy Protection'
                  subheading="Cryptia ensures utmost privacy by employing secure secret addresses for transactions.Transactions are conducted 
                  through a unique and anonymous 'stealth address' exclusively linked to the recipient, making it virtually impossible to trace or monitor transactions by anyone else"
                >
                  <MdPrivacyTip color='#09ec7a' className='text-[60px]' />
                </FeatureBlock>
                <FeatureBlock 
                  heading='User-Friendly Interface'
                  subheading="Cryptia offers an intuitive and user-friendly interface, enhancing the 
                  overall user experience.The interface allows for seamless navigation and ease of use, making it accessible to individuals with varying levels of technical expertise."
                >
                  <MdPrivacyTip color='#09ec7a' className='text-[60px]' />
                </FeatureBlock>
                <FeatureBlock 
                  heading='Secure Fund Transfer'
                  subheading="Cryptia ensures utmost privacy by employing secure secret addresses for transactions.Transactions are conducted through 
                  a unique and anonymous 'stealth address' exclusively linked to the recipient, making it virtually impossible to trace or monitor transactions by anyone else"
                >
                  <AiOutlineTransaction color='#09ec7a' className='text-[60px]' />
                </FeatureBlock>
                <FeatureBlock 
                  heading='Unique Address Generation'
                  subheading="To initiate secure transactions, Cryptia allows users to generate a unique 'CR address' and share it with the 
                  sender.Using specific calculations, the sender can generate a corresponding 'stealth address' for receiving funds securely.."
                >
                  <MdPrivacyTip color='#09ec7a' className='text-[60px]' />
                </FeatureBlock>
                <FeatureBlock 
                  heading='Confidentiality and Untraceability'
                  subheading="By prioritizing privacy and security, Cryptia ensures that users' financial transactions remain confidential and untraceable.The use of secure secret addresses and the one-time public key mechanism 
                  significantly enhances the confidentiality of transactions, providing users with peace of mind."
                >
                  <MdOutlineSecurity color='#09ec7a' className='text-[60px]' />
                </FeatureBlock>
                <FeatureBlock 
                  heading='Easy to Use'
                  subheading="Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur id unde ullam. Error possimus sit eveniet eligendi, blanditiis impedit debitis."
                >
                  <BsCurrencyExchange color='#09ec7a' className='text-[60px]' />
                </FeatureBlock>
            </div>
        </div>
        </>

    )
}

export default Features