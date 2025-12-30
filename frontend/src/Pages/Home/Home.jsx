import NavBar from "../../components/NavBar"
import Hero from "./components/Hero"
import SkillCategories from "./components/SkillCategories"
import PopularMembers from "./components/PopularMembers"
import ActiveMembers from "./components/ActiveMembers"
import SkillRequests from "./components/SkillRequests"

export default function Home(){
    return(
        <div className="min-h-screen bg-linear-to-br from-[#F3E8FF] to-white w-full">
            <NavBar />

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <Hero />
                <SkillCategories />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <PopularMembers />
                    <ActiveMembers />
                    <SkillRequests />
                </div>
            </div>
        </div>
    )
}
