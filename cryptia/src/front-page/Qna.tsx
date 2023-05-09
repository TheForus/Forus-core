import React, { useState } from "react";
import { IoAddSharp } from "react-icons/io5";

type Props = {};

const Qna = (props: Props) => {
  const [showAnswers, setShowAnswers] = useState<boolean[]>([]);

  const toggleAnswer = (index: number) => {
    const updatedShowAnswers = [...showAnswers];
    updatedShowAnswers[index] = !updatedShowAnswers[index];
    setShowAnswers(updatedShowAnswers);
  };

  return (
    <div
      id="faq"
      className="p-5 py-10 flex flex-col items-center justify-center bg-[#10F1B4] dark:bg-bgBlack"
    >
      <h1 className="montserrat-subheading text-2xl mb-6 text-white dark:text-[#435864] border-b pb-2 border-gray-200">
        FAQ
      </h1>
      <div
        className="xl:p-14 xl:px-20 bg-[#ECFFFA]  dark:bg-bgBlack md:w-[790px] lg:w-[900px] p-5 rounded-md
       shadow-lg flex flex-col items-start justify-center"
      >
        <h4
          onClick={() => toggleAnswer(0)}
          className={`${
            showAnswers[0] && "dark:text-[#09d8a1]"
          } text-left justify-between w-full dark:text-gray-300 dark:hover:text-[white] dark:hover:shadow-lg hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 text-gray-600 gap-16`}
        >
          1: How does Cryptia ensure the privacy and confidentiality of
          financial transactions?
          <span>
            {showAnswers[0] ? (
              <IoAddSharp
                color="#10F1B4"
                className="lg:text-4xl text-3xl rotate-45 transition-all duration-100"
              />
            ) : (
              <IoAddSharp
                color="#10F1B4"
                className="lg:text-4xl text-3xl duration-100"
              />
            )}
          </span>
        </h4>
        {showAnswers[0] && (
          <p className="dark:text-gray-300 w-[90%] px-4  pb-5  montserrat-subheading text-[#58707e] text-left">
            Cryptia employs secure secret addresses and a one-time public key
            mechanism, making it virtually impossible to trace or monitor
            transactions by anyone else. This ensures enhanced privacy and
            confidentiality.
          </p>
        )}
        <h4
          onClick={() => toggleAnswer(1)}
          className={`${
            showAnswers[1] && "dark:text-[#09d8a1]"
          } text-left justify-between w-full dark:text-gray-300 dark:hover:text-[white] dark:hover:shadow-lg hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 text-gray-600 gap-16`}
        >
          2: What is a "stealth address" in Cryptia, and how does it enhance
          privacy?
          <span>
            {showAnswers[1] ? (
              <IoAddSharp
                color="#10F1B4"
                className="lg:text-4xl text-3xl rotate-45 transition-all duration-100"
              />
            ) : (
              <IoAddSharp
                color="#10F1B4"
                className="lg:text-4xl text-3xl duration-100"
              />
            )}
          </span>
        </h4>
        {showAnswers[1] && (
          <p className="dark:text-gray-300 w-[90%] px-4  pb-5  montserrat-subheading text-[#58707e] text-left">
            A "stealth address" is a unique and anonymous address exclusively
            linked to the intended recipient. It guarantees utmost privacy by
            making it difficult for anyone else to trace the recipient or
            monitor their transactions.
          </p>
        )}
        <h4
          onClick={() => toggleAnswer(2)}
          className={`${
            showAnswers[2] && "dark:text-[#09d8a1]"
          } text-left justify-between w-full dark:text-gray-300 dark:hover:text-[white] dark:hover:shadow-lg hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 text-gray-600 gap-16`}
        >
          3: How do I generate a unique Cr address?
          <span>
            {showAnswers[2] ? (
              <IoAddSharp
                color="#10F1B4"
                className="lg:text-4xl text-3xl rotate-45 transition-all duration-100"
              />
            ) : (
              <IoAddSharp
                color="#10F1B4"
                className="lg:text-4xl text-3xl duration-100"
              />
            )}
          </span>
        </h4>
        {showAnswers[2] && (
          <p className="dark:text-gray-300 w-[90%] px-4  pb-5  montserrat-subheading text-[#58707e] text-left">
            Simply click the "generate" button on our app, and a unique Cr
            address will be generated for you. Make sure to save the
            accompanying secret key in a secure location for future use.
          </p>
        )}
        <h4
          onClick={() => toggleAnswer(3)}
          className={`${
            showAnswers[3] && "dark:text-[#09d8a1]"
          } text-left justify-between w-full dark:text-gray-300 dark:hover:text-[white] dark:hover:shadow-lg hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 text-gray-600 gap-16`}
        >
          4: Can I retrieve my private key after funds have been sent to my
          Cryptia address?
          <span>
            {showAnswers[3] ? (
              <IoAddSharp
                color="#10F1B4"
                className="lg:text-4xl text-3xl rotate-45 transition-all duration-100"
              />
            ) : (
              <IoAddSharp
                color="#10F1B4"
                className="lg:text-4xl text-3xl duration-100"
              />
            )}
          </span>
        </h4>
        {showAnswers[3] && (
          <p className="dark:text-gray-300 w-[90%] px-4  pb-5  montserrat-subheading text-[#58707e] text-left">
            Yes, you can retrieve your private key by clicking on the "match"
            button or by pasting your secret key (optional) into our app. This
            will allow you to access the specific address where the funds have
            been sent.
          </p>
        )}
        <h4
          onClick={() => toggleAnswer(4)}
          className={`${
            showAnswers[4] && "dark:text-[#09d8a1]"
          } text-left justify-between w-full dark:text-gray-300 dark:hover:text-[white] dark:hover:shadow-lg hover:text-gray-700
        lg:text-lg cursor-pointer flex items-center
         montserrat-subheading py-4 text-gray-600 gap-16`}
        >
          5: Is Cryptia suitable for users with varying levels of technical
          expertise?
          <span>
            {showAnswers[4] ? (
              <IoAddSharp
                color="#10F1B4"
                className="lg:text-4xl text-3xl rotate-45 transition-all duration-100"
              />
            ) : (
              <IoAddSharp
                color="#10F1B4"
                className="lg:text-4xl text-3xl duration-100"
              />
            )}
          </span>
        </h4>
        {showAnswers[4] && (
          <p className="dark:text-gray-300 w-[90%] px-4  pb-5  montserrat-subheading text-[#58707e] text-left">
            Absolutely! Cryptia has been designed with a user-friendly
            interface, making it accessible and easy to use for individuals with
            different levels of technical knowledge. Our app provides a seamless
            and intuitive experience for all users.
          </p>
        )}
      </div>
    </div>
  );
};

export default Qna;
