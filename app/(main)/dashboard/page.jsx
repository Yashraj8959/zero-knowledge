import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_components/DashboardView";
import { getAssessments } from "@/actions/interview";

const IndustryInsightsPage = async () => {
    const {isOnboarded} = await getUserOnboardingStatus();
    const assessments = await getAssessments();

    if(!isOnboarded){
        redirect("/onboarding");
        return null; 
    }
    // first user is onboarded then get the industryInsights
    const insights = await getIndustryInsights();
    return (
        <div className="container mx-auto"> 
            <DashboardView insights={insights} assessments={assessments} />
        </div>
    );
};

export default IndustryInsightsPage;