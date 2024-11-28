import { Footer } from "../components/Footer";
import { HeaderLoggedIn } from "../components/HeaderLoggedIn";
import { PersonnelDashboard } from "../components/PersonnelDashboard";
export const PersonnelPage = () => {
  return (
    <div className="personnel-page flex flex-col">
      <div className="personnel-page-content flex flex-col">
        <HeaderLoggedIn />
        <PersonnelDashboard />
        <Footer />
      </div>
    </div>
  );
};
