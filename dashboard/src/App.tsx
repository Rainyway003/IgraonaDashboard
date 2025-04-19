import { GitHubBanner, Refine, WelcomePage } from "@refinedev/core";
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
import ShowTournaments from "./content/ShowTournaments";
import Home from "./content/Home";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <AntdApp>
          <Refine
            dataProvider={dataProvider}
            notificationProvider={useNotificationProvider}
            routerProvider={routerBindings}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "4cEHo1-TlgDsX-WcifnB",
            }}
          >
            <Routes>
              <Route index element={<WelcomePage />} />
              <Route path="/tournaments" element={<ShowTournaments />} />
              <Route path="/dashboard" element={<Home />} />
            </Routes>
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
