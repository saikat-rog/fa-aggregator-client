import { AboutCard } from "../../components/advisor/profile/AboutCard";
import { ContactFormCard } from "../../components/advisor/profile/ContactFormCard";
import { EducationalDisclaimer } from "../../components/advisor/profile/EducationalDisclaimer";
import { ExpertiseCard } from "../../components/advisor/profile/ExpertiseCard";
import { ProfileHeroCard } from "../../components/advisor/profile/ProfileHeroCard";
import { AuthPromptDialog } from "../../components/dialog/AuthPromptDialog";
import { NotFoundState } from "../../components/pageNotFound/PageNotFound";
import { AdvisorProfileSeo } from "./AdvisorProfile.seo";
import { useAdvisorProfileController } from "./AdvisorProfile.controller";

const getProxiedImageUrl = (url: string) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;

export function AdvisorProfilePage() {
  const controller = useAdvisorProfileController();

  if (controller.loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-slate-600">Loading advisor profile...</p>
        </div>
      </div>
    );
  }

  if (controller.error || !controller.advisor) {
    return <NotFoundState onButtonClick={() => controller.navigate("/")} />;
  }

  const advisorData = controller.advisor;

  return (
    <div className="min-h-screen pb-8 text-slate-900">
      <AdvisorProfileSeo advisor={advisorData} />
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden">
          <EducationalDisclaimer />

          <div className="grid gap-6 py-3 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:p-8">
            <div className="space-y-3">
              <ProfileHeroCard
                name={advisorData.name || "Advisor"}
                username={advisorData.username || "advisor"}
                state={advisorData.state || "-"}
                country={advisorData.country || "-"}
                industry={advisorData.industries?.join(", ")}
                ppp={advisorData.ppp}
                category={advisorData.category}
                profilePictureUrl={advisorData.profilePictureUrl || undefined}
                personalWebsite={advisorData.personalWebsite}
                emailForContact={advisorData.emailForContact}
                userCanOpenLinks={controller.userCanOpenLinks}
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
                <p className="px-2 text-sm font-medium text-rose-600">
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

            <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <ContactFormCard
                advisorName={advisorData.name || "Advisor"}
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
          controller.navigate("/auth");
        }}
        onLogoutAndLoginAsUser={controller.logoutAndLoginAsUser}
      />
    </div>
  );
}
