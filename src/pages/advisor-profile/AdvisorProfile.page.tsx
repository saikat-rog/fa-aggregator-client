import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { AboutCard } from "../../components/advisor/profile/AboutCard";
import { ContactFormCard } from "../../components/advisor/profile/ContactFormCard";
import { EducationalDisclaimer } from "../../components/advisor/profile/EducationalDisclaimer";
import { ExpertiseCard } from "../../components/advisor/profile/ExpertiseCard";
import { ProfileHeroCard } from "../../components/advisor/profile/ProfileHeroCard";
import { AuthPromptDialog } from "../../components/dialog/AuthPromptDialog";
import { PincodePromptDialog } from "../../components/dialog/PincodePromptDialog";
import { NotFoundState } from "../../components/pageNotFound/PageNotFound";
import { AdvisorProfileSeo } from "./AdvisorProfile.seo";
import { useAdvisorProfileController } from "./AdvisorProfile.controller";

const getProxiedImageUrl = (url: string) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;

export function AdvisorProfilePage() {
  const controller = useAdvisorProfileController();

  if (controller.loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#E7E1D6] border-t-[#6C4BFF]" />
          <p className="text-xs font-bold font-heading uppercase tracking-wider text-[#7A7286]">Loading creator profile...</p>
        </div>
      </div>
    );
  }

  if (controller.error || !controller.advisor) {
    return <NotFoundState onButtonClick={() => controller.navigate("/creators")} />;
  }

  const advisorData = controller.advisor;

  return (
    <div className="min-h-screen pb-12 text-[#201A2B]">
      <AdvisorProfileSeo advisor={advisorData} />
      
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/creators"
            className="inline-flex items-center gap-2 text-xs font-bold font-heading text-[#7A7286] hover:text-[#FF5A36] transition"
          >
            <FiArrowLeft className="h-3.5 w-3.5" /> Back to Browse Creators
          </Link>
        </div>

        <section className="space-y-6">
          <EducationalDisclaimer />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
            <div className="space-y-6">
              <ProfileHeroCard
                name={advisorData.name || "Creator"}
                username={advisorData.username || "creator"}
                pincode={advisorData.pincode}
                state={advisorData.state || "-"}
                country={advisorData.country || "-"}
                industry={advisorData.industries?.join(", ")}
                category={advisorData.category}
                instagramEngagementRateScore={
                  advisorData.instagramEngagementRateScore
                }
                profilePictureUrl={advisorData.profilePictureUrl || undefined}
                personalWebsite={advisorData.personalWebsite}
                emailForContact={advisorData.emailForContact}
                userCanOpenLinks={controller.userCanOpenLinks}
                emailVisible={controller.emailVisible}
                socialLinks={controller.socialLinks}
                onWebsiteOpen={(url) => controller.openAction("website", url)}
                onEmailOpen={(mailto) => controller.openAction("email", mailto)}
                onShareProfile={controller.shareProfile}
                onSocialOpen={(url) => controller.openAction("social", url)}
                isSaved={controller.isSaved(advisorData.id)}
                saveLoading={
                  controller.isSavingByAdvisorId[advisorData.id] ||
                  controller.isUnsavingByAdvisorId[advisorData.id]
                }
                onToggleSave={controller.handleToggleSave}
                getProxiedImageUrl={getProxiedImageUrl}
              />
              {controller.saveActionError ? (
                <p className="px-2 text-xs font-semibold text-rose-600">
                  {controller.saveActionError}
                </p>
              ) : null}

              <div className="grid gap-6 md:grid-cols-2">
                <AboutCard about={advisorData.about || ""} />
                <ExpertiseCard
                  advisorId={advisorData.id}
                  marketFocus={advisorData.marketFocus}
                  expertiseIndeces={advisorData.expertiseIndeces}
                />
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <ContactFormCard
                advisorName={advisorData.name || "Creator"}
                formData={controller.formData}
                formSubmitting={controller.formSubmitting}
                canSubmitEnquiry={controller.userCanOpenLinks}
                formMessage={controller.formMessage}
                onChange={controller.handleFormChange}
                onLockedSubmit={() => {
                  controller.setPendingActionType("email");
                  controller.setAuthDialogOpen(true);
                }}
                onSubmit={controller.handleFormSubmit}
              />
            </aside>
          </div>
        </section>
      </div>

      <AuthPromptDialog
        open={controller.authDialogOpen}
        role={controller.role}
        actionType={controller.pendingActionType}
        onClose={controller.closeAuthDialog}
        onLoginAsUser={() => {
          controller.closeAuthDialog();
          controller.navigate("/auth?role=user");
        }}
        onLogoutAndLoginAsUser={controller.logoutAndLoginAsUser}
      />
      <PincodePromptDialog
        open={controller.pincodeDialogOpen}
        onClose={() => controller.setPincodeDialogOpen(false)}
        onSuccess={controller.handlePincodeSuccess}
      />
    </div>
  );
}
