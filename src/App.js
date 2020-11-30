import UsersTable from "./views/usersTable/UsersTable";
import LanguageSelector from "./components/LanguageSelector/LanguageSelector";
import { useTranslation } from "react-i18next";
import "semantic-ui-css/semantic.min.css";
import "./i18n";

function App() {
  const { t } = useTranslation();

  return (
    <div>
      <LanguageSelector />
      <h1>{t("usersManager")}</h1>
      <UsersTable />
    </div>
  );
}

export default App;
