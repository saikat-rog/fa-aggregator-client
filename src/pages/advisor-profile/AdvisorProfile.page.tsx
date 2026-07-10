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
      {controller.pincodeDialogOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pincode-dialog-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !controller.pincodeSubmitting) {
              controller.setPincodeDialogOpen(false);
            }
          }}
        >
          <form
            onSubmit={controller.submitPincode}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 id="pincode-dialog-title" className="text-xl font-semibold text-slate-950">
              Enter your PIN code
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Provide your six-digit Indian PIN code to view the advisor’s email.
            </p>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              PIN code
              <input
                value={controller.pincode}
                onChange={(event) => controller.setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                autoComplete="postal-code"
                pattern="[1-9][0-9]{5}"
                maxLength={6}
                autoFocus
                required
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            {controller.pincodeError ? (
              <p role="alert" className="mt-3 text-sm text-rose-700">{controller.pincodeError}</p>
            ) : null}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" disabled={controller.pincodeSubmitting} onClick={() => controller.setPincodeDialogOpen(false)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60">Cancel</button>
              <button type="submit" disabled={controller.pincodeSubmitting} className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                {controller.pincodeSubmitting ? "Saving..." : "Save and view email"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
