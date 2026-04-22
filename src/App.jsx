// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider';
import Layout from './components/Layout';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';
import InvoiceForm from './components/InvoiceForm';
import InvoiceEdit from './pages/InvoiceEdit';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<InvoiceList />} />
            <Route path="invoice/new" element={<InvoiceForm />} />
            <Route path="invoice/:id" element={<InvoiceDetail />} />
            <Route path="invoice/:id/edit" element={<InvoiceEdit />} /> 
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;