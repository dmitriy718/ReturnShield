import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FindOrder from './pages/FindOrder';
import SelectItems from './pages/SelectItems';
import ReturnReason from './pages/ReturnReason';
import ExchangeOption from './pages/ExchangeOption';
import SuccessPage from './pages/SuccessPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<FindOrder />} />
                <Route path="/select-items" element={<SelectItems />} />
                <Route path="/return-reason" element={<ReturnReason />} />
                <Route path="/exchange-option" element={<ExchangeOption />} />
                <Route path="/success" element={<SuccessPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
