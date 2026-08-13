import { ManuseioArmaLeadProvider } from "./ManuseioArmaLeadContext";
import { ManuseioArmaNavbar } from "./ManuseioArmaNavbar";
import { ManuseioArmaHero } from "./ManuseioArmaHero";
import { ManuseioArmaProblem } from "./ManuseioArmaProblem";
import { ManuseioArmaSolution } from "./ManuseioArmaSolution";
import { ManuseioArmaLearn } from "./ManuseioArmaLearn";
import { ManuseioArmaSupervision } from "./ManuseioArmaSupervision";
import { ManuseioArmaAudience } from "./ManuseioArmaAudience";
import { ManuseioArmaAbout } from "./ManuseioArmaAbout";
import { ManuseioArmaLogistics } from "./ManuseioArmaLogistics";
import { ManuseioArmaFaq } from "./ManuseioArmaFaq";
import { ManuseioArmaCtaFinal } from "./ManuseioArmaCtaFinal";
import { ManuseioArmaFooter } from "./ManuseioArmaFooter";

export function ManuseioArmaPageClient() {
  return (
    <ManuseioArmaLeadProvider>
      <ManuseioArmaNavbar />
      <ManuseioArmaHero />
      <ManuseioArmaProblem />
      <ManuseioArmaSolution />
      <ManuseioArmaLearn />
      <ManuseioArmaSupervision />
      <ManuseioArmaAudience />
      <ManuseioArmaAbout />
      <ManuseioArmaLogistics />
      <ManuseioArmaFaq />
      <ManuseioArmaCtaFinal />
      <ManuseioArmaFooter />
    </ManuseioArmaLeadProvider>
  );
}
