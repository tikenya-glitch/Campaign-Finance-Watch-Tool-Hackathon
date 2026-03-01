import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import FinancialFlow from './modules/FinancialFlow';
import ActorMatrix from './modules/ActorMatrix';
import SecureVault from './modules/SecureVault';
import VerifiedClaims from './modules/VerifiedClaims';
import RegulatoryContext from './modules/Regulatory';
import AdminHub from './modules/AdminHub';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<FinancialFlow />} />
                        <Route path="actors" element={<ActorMatrix />} />
                        <Route path="vault" element={<SecureVault />} />
                        <Route path="claims" element={<VerifiedClaims />} />
                        <Route path="regulatory" element={<RegulatoryContext />} />
                        <Route path="admin" element={<AdminHub />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
