import Nav from "./Nav";
import Header from "./Header";
import Features from "./Features";
import Footer from "./FooterSection";

type Props = {};

const Wrapper = (props: Props) => {
  return (
    <div className="min-h-screen bg-[#0b1220] text-slate-100">
      <Nav />
      <Header />
      <Features />
      <Footer />
    </div>
  );
};

export default Wrapper;
