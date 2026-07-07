import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { authenticationRoutePaths} from './common/routePaths';


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* authentication routes */}
        <Route>
          {authenticationRoutePaths.map((route) => (
            <Route path={route.path} key={route.path} element={route.element} />
          ))}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}