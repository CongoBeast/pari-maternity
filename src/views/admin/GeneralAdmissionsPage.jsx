import ModulePage from '../../components/ModulePage';
const cards=[{"title": "Admissions", "text": "Register inpatient and outpatient visits.", "button": "New admission"}, {"title": "Discharge", "text": "Manage patient checkout and discharge summaries."}];
export default function GeneralAdmissionsPage(){return <ModulePage title="General Admissions" icon="ClipboardPlus" cards={cards} />;}
