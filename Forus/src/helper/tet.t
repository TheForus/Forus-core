Forus is a privacy solution that allows users to receive funds without sharing their personal wallet address with anyone .User would always receive funds in a fresh stealth address , This ensures a level of privacy in financial transactions. Acting as a VPN for the XDC network, Forus establishes a secure and protected environment, enabling users to conduct transactions with complete confidentiality using a user friendly interface.

Here how it works?
1.The receiver creates a new "ForusKey," which is a one-time, base58 encoded address with an additional cryptographic prefix and suffix. Instead of sharing their personal wallet address, the receiver provides the ForusKey to receive funds.(Note : ForusKey is not bound to any blockchain or xdc address)

2.The receiver also generates a corresponding "signatureKey" on demand, which serves as the private key for the ForusKey. This signatureKey is securely saved for future use. (Note :Never share your signatureKey with anyone always share ForusKey to receive funds)

3.The sender generates a fresh stealth address using the receiver's ForusKey and sends funds to this new address. The sender's public key, generated on demand, is published in a designated logs directory. This entire process is completed in a single transaction.

4.The receiver scans the logs directory and perform calculations using his signatureKey and the sender's public key. Through Diffie-Hellman key exchange, the receiver derives the private key for the stealth address on which funds have been send.

5.With the derived private key, the receiver gains control over that address on which the funds have been sent and can manage the funds received securely.

"In summary Forus allows users to receive funds through addresses which are created by sender's private key and receiver's public key but only receiver do have control over the funds"

Lets take an example of Charlotte (receiver) and william (sender) to deeply understand what is happening behind the scene here:
.Charlotte generates a 'secreKey" key and a unique “ForusKey” using cryptographic algorithms. The ForusKey is used as a public key here.

.William looks up the ForusKey and generates a one-time-use ephemeral private key. The sender combines his key with the ForusKey to create a unique and anonymous stealth address, which is used to send assets to the charlotte.

.William then publishes his ephemeral public key on the xdc network, allowing Charlotte to scan it for new keys. Charlotte periodically scans the registry for new keys and uses her signatureKey to generate stealth addresses associated with her.

.If Charlotte matches assets associated with a stealth address generated using a eph public key from the registry, she can compute the spending key or private key for that address and claim the assets. The one-time-use keys used to generate the stealth addresses are discarded to ensure privacy and security.

In summary, Forus uses cryptographic algorithms and one-time-use keys to create anonymous and secure public addresses for transactions on the blockchain.

What next for Forus ???? Plus some instructions..
*Forus is still under development and not ready for public launch yet. There are important things we need to work on before it's fully functional and user-friendly. Here's what we have planned.

*Making it more User-Friendly: We want to make sure using Forus is easy and intuitive. We'll improve the design, simplify processes, and make it more user-friendly.

*Adding NFTs: Forus is now limited to xdc and xrc20 tokens only, but we have plans in integrating anonymous nfts transfers too , would expand its capabilities and attract a broader user base.

*Testing and Auditing: We'll conduct thorough testing and audits to find and fix any issues. This is important to make sure Forus is reliable, secure, and stable.

*Making it works smooth and faster : Querying data from the blockchain can be a time-consuming process for users, especially when scanning all public keys to generate the associated private key. This inefficiency poses a problem. To address this issue and improve performance, we have implemented a solution by creating a set of public keys in a database alongside the blockchain. This optimization significantly enhances the scanning process and accelerates the retrieval of private keys, ensuring a more efficient and seamless user experience.

*Deploying on the Mainnet: We need to make Forus accessible and compatible with the main blockchain network .

*Adding Cool Features: We'll keep adding new features based on what our users want. This could mean more privacy options, support for different tokens, or integration with other cool apps.

Our main goal with Forus is to make it easy to use while keeping your transactions private and secure. By working on these areas and making the necessary improvements, we hope Forus will become a trusted and widely used solution for private and secure transactions.