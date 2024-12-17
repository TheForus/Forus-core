import Nav from "./Nav";
import Header from "./Header";
import Tutorial from "./Tutorial";
import Features from "./Features";
import Qna from "./Qna";
import Footer from "./Footer";

// import HeaderRibbon from '../components/HeaderRibbon';


type Props = {};

const Wrapper = (props: Props) => {
 
  return (


    <div className=" ">
      {/* <HeaderRibbon /> */}
      <Nav />
      {/* <div className=" mt-[1px] dark:mt-0 "></div> */}
      <Header />
      <Features />
      <Tutorial />
      <Qna />
      <Footer />
    </div>
  );
};

export default Wrapper;