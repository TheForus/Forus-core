# Here is the quick worflow of cryptia :

**Where : R=(Receiver) S=(Sender) G=(Generator)**

### R would create an crAddress (publickey) by doing following:

1.let secretKey= G * (Random Numbers)

2.let cr = G * (secretKey)

### S would send funds to R by doing Following:

1.let ephKey= G * (Random Numbers)

2.let stealthAddress = ephKey * (cr)

3.let ephpubKey = stealthaddress.slice(0,2) + G * (ephKey)

### R would accept the funds Now how would he do it?

1.If ((ephpubKey * secretKey) == stealthaddress.slice(0,2) ) returns **privatekey**
