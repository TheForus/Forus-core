import React from 'react'

type Props = {}

const Features = (props: Props) => {
    return (
        <>
            <h1>Features and Capabilities</h1> {/* Heading */}
            <div>
                <h4>Enhanced Privacy Protection</h4>
                <i>privacy</i>
                <p>Cryptia ensures utmost privacy by employing secure secret addresses for transactions.Transactions are conducted through a unique and anonymous 'stealth address' exclusively linked to the recipient, making it virtually impossible to trace or monitor transactions by anyone else</p>
            </div>

            <div>
                <h4>User-Friendly Interface</h4>
                <i></i>
                <p>Cryptia offers an intuitive and user-friendly interface, enhancing the overall user experience.The interface allows for seamless navigation and ease of use, making it accessible to individuals with varying levels of technical expertise.</p>
            </div>

            <div>
                <h4>Secure Fund Transfer</h4>
                <i></i>
                <p>Cryptia employs a one-time public key mechanism, generating fresh addresses for each transaction.This approach ensures that financial information remains private and secure, protecting users from potential attacks or data breaches.</p>
            </div>


            <div>
                <h4>Unique Address Generation</h4>
                <i></i>
                <p>To initiate secure transactions, Cryptia allows users to generate a unique 'CR address' and share it with the sender.Using specific calculations, the sender can generate a corresponding 'stealth address' for receiving funds securely..</p>
            </div>


            <div>
                <h4>Confidentiality and Untraceability</h4>
                <i></i>
                <p>By prioritizing privacy and security, Cryptia ensures that users' financial transactions remain confidential and untraceable.The use of secure secret addresses and the one-time public key mechanism significantly enhances the confidentiality of transactions, providing users with peace of mind.</p>
            </div>

        </>

    )
}

export default Features