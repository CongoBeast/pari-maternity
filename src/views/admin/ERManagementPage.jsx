import ModulePage from '../../components/ModulePage';
const cards=[{"title": "Emergency triage", "text": "Prioritise incoming emergencies.", "button": "Start triage"}, {"title": "ER beds", "text": "Monitor emergency capacity."}];
export default function ERManagementPage(){return <ModulePage title="Emergency Room" icon="Siren" cards={cards} />;}
