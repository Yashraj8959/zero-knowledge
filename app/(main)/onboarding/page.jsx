import { industries } from "@/data/industries"
import { getUserOnboardingStatus } from "@/actions/user"

import OnboardingForm from "./_components/Onboarding-form"
import { redirect } from "next/navigation";

// this is the server component and we are fetching api here that's why we are not making this component a client 
const OnboardingPage = async () => {
    // check if the user is already onboarded
    const {isOnboarded} = await getUserOnboardingStatus();
    if(isOnboarded){
        // redirect to dashboard if user is already onboarded
        redirect("/dashboard");
    }
  return (
    <main>
        <OnboardingForm industries = {industries} />
    </main>
  )
}

export default OnboardingPage 
