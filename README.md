Cryptia allows you to receive funds without revealing your wallet address with anyone


Lets understand it :

Where R=(Receiver) S=(Sender)


Receiver would create an address by doing following:
1.SecretKey= G *(Random Numbers)
2.CR Address = G * (SecretKey)

Sender would send funds by doing Following:
1.EphKey= G *(Random Numbers)
2.Stealth Address = EphKey * (CR Address)
3 EphPubKey = 2bytes of Stealth address + G * (EphKey)

Receiver would accept the funds Now how would he do it?
1.Private key = If(EphPubKey * SecretKey) == 2bytes of Stealth address 


