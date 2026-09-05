import ModulePage from '../../components/ModulePage';
const cards=[{"title": "Invoices", "text": "Create and reconcile invoices.", "button": "Create invoice"}, {"title": "Costs", "text": "Monitor hospital expenditure.", "button": "Analyse costs"}, {"title": "Payments", "text": "Review patient payments.", "button": "View payments"}];
export default function AccountingPage(){return <ModulePage title="Accounting Operations" icon="Calculator" cards={cards} />;}
