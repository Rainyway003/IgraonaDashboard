import { Authenticated, GitHubBanner, Refine, WelcomePage } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { App as AntdApp } from "antd";
import { BrowserRouter, Route, Routes } from "react-router";

import dataProvider from './providers/data-provider'
import ShowTournaments from "./content/tournaments/ShowTournaments";
import Home from "./content/Home";
import AppLayout from "./components/AppLayout/AppLayout";
import CreateTournament from "./content/tournaments/create/CreateT";
import EditTournament from "./content/tournaments/edit/EditT";
import { resources } from "./config/resources";
import ShowTeams from "./content/teams/ShowTeams";
import Login from "./content/login/Login";
import { authProvider } from "./providers/auth-provider";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <AntdApp>
          <Refine
            dataProvider={dataProvider}
            authProvider={authProvider}
            notificationProvider={useNotificationProvider}
            routerProvider={routerBindings}
            resources={resources}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "4cEHo1-TlgDsX-WcifnB",
            }}
          >
            <Authenticated key="protected" fallback={<Login></Login>}>
              <Routes>
                <Route index element={<WelcomePage />} />
                <Route element={<AppLayout />}>
                  <Route path="/tournaments" >
                    <Route index element={<ShowTournaments />} />
                    <Route path="new" element={<CreateTournament />} />
                    <Route path="edit/:id" element={<EditTournament />} />
                  </Route>
                  <Route path="/tournaments/:id" >
                    <Route index element={<ShowTeams />} />
                  </Route>
                  <Route path="/dashboard" element={<Home />} />
                </Route>
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Authenticated>
          </Refine>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
