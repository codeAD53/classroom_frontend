import { GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import Dashboard from "./pages/dashboard";
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import { BookOpen, GraduationCap, Home } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import SubjectsList from "./pages/subjects/lists";
import SubjectsCreate from "./pages/subjects/create";
import ClassesList from "./pages/classes/list";
import ClassesCreate from "./pages/classes/create";

function App() {
  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "B66RM9-PKTYYx-GReDht",
              }}
              resources={[
                {
                  name: 'dashboard', 
                  list: '/', 
                  meta: {label: 'Home', icon: <Home />} 
                },
                {
                  name: 'subjects',
                  list: '/subjects',
                  create: '/subjects/create',
                  meta: {label: 'Subjects', icon: <BookOpen />}
                },
                {
                  name: 'classes',
                  list: '/classes',
                  create: '/classes/create',
                  meta: {label: 'Classes', icon: <GraduationCap/>}
                }
              ]}
            >
              <Routes>
                <Route element={
                  <Layout>
                    <Outlet/>
                  </Layout>
                }>

                <Route path="/" element={<Dashboard/>} />
                <Route path = 'subjects'>
                  <Route index element={<SubjectsList/>}></Route>
                  <Route path="create" element={<SubjectsCreate/>}></Route>
                </Route>
                <Route path='classes'>
                  <Route index element={<ClassesList/>}></Route>
                <Route path='create' element={<ClassesCreate/>}>
                </Route>
                </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
