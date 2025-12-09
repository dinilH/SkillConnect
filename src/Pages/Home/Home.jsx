import NavBar from "../../components/NavBar"
import Hero from "./components/Hero"
import SkillCategories from "./components/SkillCategories"
import PopularMembers from "./components/PopularMembers"
import ActiveMembers from "./components/ActiveMembers"
import SkillRequests from "./components/SkillRequests"

export default function Home(){
    return(
        
        <div>
            <NavBar />
            <Hero />
            <SkillCategories />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PopularMembers />
                <ActiveMembers />
                <SkillRequests />
            </div>

        </div>
    )
}
