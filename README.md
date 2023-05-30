Cryptia is a privacy solution that allows users to receive funds without sharing their personal wallet address with anyone .User would always receive funds in a fresh stealth address , This ensures a level of privacy in financial transactions. Acting as a VPN for the XDC network, Cryptia establishes a secure and protected environment, enabling users to conduct transactions with complete confidentiality using a user friendly interface.

##Here how it works?
1.The receiver creates a new "CP address," which is a one-time, base58 encoded address with an additional cryptographic prefix and suffix. Instead of sharing their personal wallet address, the receiver provides the CP address to receive funds.(Note : Cp address is not bound to any blockchain or xdc address)

2.The receiver also generates a corresponding "secretKey" on demand, which serves as the private key for the CP address. This secretKey is securely saved for future use. (Note :Never share your secretKey with anyone always share Cp address to receive funds)

3.The sender generates a fresh stealth address using the receiver's CP address and sends funds to this new address. The sender's public key, generated on demand, is published in a designated logs directory. This entire process is completed in a single transaction.

4.The receiver scans the logs directory and perform calculations using his secretKey and the sender's public key. Through Diffie-Hellman key exchange, the receiver derives the private key for the stealth address on which funds have been send.

5.With the derived private key, the receiver gains control over that address on which the funds have been sent and can manage the funds received securely.

"In summary cryptia allows users to receive funds through addresses which are created by sender's private key and receiver's public key but only receiver do have control over the funds"
