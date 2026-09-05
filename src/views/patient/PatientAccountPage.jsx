import ModulePage from '../../components/ModulePage';
const cards=[{"title": "Transaction history", "text": "Previous payments, invoices and receipts are available.", "button": "View transactions"}, {"title": "Checkout", "text": "Pay outstanding balances using cash, EcoCash, bank transfer, insurance or card.", "button": "Start checkout"}];
export default function PatientAccountPage(){return <ModulePage title="Patient Account & Checkout" icon="CreditCard" cards={cards} />;}
