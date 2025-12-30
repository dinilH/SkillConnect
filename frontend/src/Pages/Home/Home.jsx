import { useAuth } from "../../AuthContext"
import NavBar from "../../components/NavBar"
import Hero from "./components/Hero"
import SkillCategories from "./components/SkillCategories"
import PopularMembers from "./components/PopularMembers"
import ActiveMembers from "./components/ActiveMembers"
import SkillRequests from "./components/SkillRequests"
import AboutSection from "./components/AboutSection"
import GPACalculator from "../../components/GPACalculator"

export default function Home(){
    const { isAuthenticated } = useAuth();

    return(
        <div className="min-h-screen bg-linear-to-br from-[#F3E8FF] to-white w-full">
            <NavBar />

            {/* Hero takes full width */}
            <Hero />
            
            {/* Content sections with constrained width */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Show About Section only for logged-out users */}
                {!isAuthenticated && <AboutSection />}
                
                {/* GPA Calculator - available to all users */}
                <div className="my-12">
                    <GPACalculator />
                </div>

                {/* Show these sections only for logged-in users */}
                {isAuthenticated && (
                    <>
                        <SkillCategories />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                            <PopularMembers />
                            <ActiveMembers />
                            <SkillRequests />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
