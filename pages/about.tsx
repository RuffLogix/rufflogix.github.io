import { NextPage } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";

const About: NextPage = () => {
    return (
        <div>
            <Header />
            <img 
                src="./images/rufflogix-logo.png" 
                className='object-cover h-screen w-full'
                alt="banner" 
            />
        </div>
    )
}

export default About;