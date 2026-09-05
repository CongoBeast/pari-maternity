import ModulePage from '../../components/ModulePage';
const cards=[{"title": "Daily collections", "text": "Track payments received and outstanding balances.", "button": "View collections"}, {"title": "Suppliers & RFQs", "text": "Manage quotations, purchase requests and vendors.", "button": "Open procurement"}, {"title": "Insurance & claims", "text": "Process medical aid and insurer billing workflows.", "button": "Review claims"}];
export default function FinanceDashboard(){return <ModulePage title="Finance & Revenue Dashboard" icon="DollarSign" cards={cards} />;}
