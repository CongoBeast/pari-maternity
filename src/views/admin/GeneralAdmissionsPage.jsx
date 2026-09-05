import React, { useMemo, useState } from 'react';
import { ClipboardPlus, Eye, LogOut, BedDouble, UserPlus } from 'lucide-react';
import {
  PageHeader, MetricCard, StatusBadge, SearchFilter, Modal, FormField,
  DetailGrid, DetailItem, Toast, EmptyState
} from '../../components/AdminOperationsUI';

const INITIAL = [
  { id:'ADM-260905-014', patientId:'PT-10482', name:'Tendai Muchengeti', age:46, sex:'Male', type:'Inpatient', department:'General Medicine', doctor:'Dr. R. Moyo', ward:'Medical Ward A', bed:'A-12', admitted:'05 Sep 2026 · 07:42', reason:'Persistent chest pain and shortness of breath', status:'Admitted', contact:'+263 77 425 1903', nextOfKin:'Rudo Muchengeti · +263 71 662 4109', payer:'CIMAS Medical Aid' },
  { id:'ADM-260905-013', patientId:'PT-10138', name:'Rumbidzai Ncube', age:29, sex:'Female', type:'Outpatient', department:'Surgical Clinic', doctor:'Dr. T. Chirwa', ward:'—', bed:'—', admitted:'05 Sep 2026 · 07:15', reason:'Post-operative wound review', status:'Observation', contact:'+263 78 118 2407', nextOfKin:'Nomusa Ncube · +263 77 304 9931', payer:'Self-pay' },
  { id:'ADM-260904-052', patientId:'PT-09884', name:'Farai Nyamande', age:61, sex:'Male', type:'Inpatient', department:'Cardiology', doctor:'Dr. S. Gomo', ward:'High Care', bed:'HC-04', admitted:'04 Sep 2026 · 18:20', reason:'Hypertensive emergency monitoring', status:'Admitted', contact:'+263 71 908 2301', nextOfKin:'Nyasha Nyamande · +263 78 219 4800', payer:'PSMAS' },
  { id:'ADM-260904-047', patientId:'PT-07631', name:'Chipo Dube', age:34, sex:'Female', type:'Day Case', department:'Endoscopy', doctor:'Dr. B. Mlambo', ward:'Day Unit', bed:'DU-03', admitted:'04 Sep 2026 · 13:05', reason:'Scheduled upper GI endoscopy', status:'Discharged', contact:'+263 77 991 7720', nextOfKin:'Kudakwashe Dube · +263 71 425 8810', payer:'BonVie Medical Aid' },
];

const emptyForm = { name:'', patientId:'', age:'', sex:'Female', type:'Inpatient', department:'General Medicine', doctor:'Dr. R. Moyo', ward:'Medical Ward A', bed:'', reason:'', contact:'', nextOfKin:'', payer:'Self-pay' };

export default function GeneralAdmissionsPage(){
  const [records,setRecords] = useState(INITIAL);
  const [search,setSearch] = useState('');
  const [status,setStatus] = useState('All');
  const [selected,setSelected] = useState(null);
  const [showNew,setShowNew] = useState(false);
  const [showDischarge,setShowDischarge] = useState(false);
  const [form,setForm] = useState(emptyForm);
  const [dischargeNote,setDischargeNote] = useState('');
  const [toast,setToast] = useState('');

  const filtered = useMemo(()=>records.filter(r=>{
    const q=search.toLowerCase();
    const hit=!q || [r.id,r.patientId,r.name,r.department,r.doctor,r.ward].join(' ').toLowerCase().includes(q);
    return hit && (status==='All' || r.status===status);
  }),[records,search,status]);

  const admitted = records.filter(r=>r.status==='Admitted').length;
  const observation = records.filter(r=>r.status==='Observation').length;
  const today = records.filter(r=>r.admitted.startsWith('05 Sep 2026')).length;
  const bedsUsed = records.filter(r=>r.status==='Admitted' && r.bed!=='—').length;

  const createAdmission=()=>{
    if(!form.name.trim() || !form.reason.trim()) return;
    const next={...form,id:`ADM-260905-${String(records.length+15).padStart(3,'0')}`,patientId:form.patientId || `PT-${String(11000+records.length)}`,age:Number(form.age||0),admitted:'05 Sep 2026 · now',status:form.type==='Outpatient'?'Observation':'Admitted',bed:form.bed||'Pending allocation'};
    setRecords([next,...records]); setShowNew(false); setForm(emptyForm); setToast(`${next.name} admitted successfully`);
  };

  const discharge=()=>{
    if(!selected) return;
    setRecords(rs=>rs.map(r=>r.id===selected.id?{...r,status:'Discharged',dischargeNote}:r));
    setSelected({...selected,status:'Discharged',dischargeNote}); setShowDischarge(false); setDischargeNote(''); setToast(`Discharge completed for ${selected.name}`);
  };

  const allocateBed=()=>{
    if(!selected) return;
    const bed = selected.bed==='Pending allocation' || selected.bed==='—' ? 'A-18' : selected.bed;
    setRecords(rs=>rs.map(r=>r.id===selected.id?{...r,ward:selected.ward==='—'?'Medical Ward A':selected.ward,bed,status:'Admitted'}:r));
    setSelected({...selected,ward:selected.ward==='—'?'Medical Ward A':selected.ward,bed,status:'Admitted'}); setToast(`Bed ${bed} allocated`);
  };

  return <>
    <PageHeader icon="ClipboardPlus" title="General Admissions" subtitle="Register, place, transfer and discharge inpatient, outpatient and day-case encounters." actions={<>
      <button className="pm-btn pm-btn-outline"><BedDouble size={15}/> Bed board</button>
      <button className="pm-btn pm-btn-primary" onClick={()=>setShowNew(true)}><UserPlus size={15}/> New admission</button>
    </>} />

    <div className="ops-metrics">
      <MetricCard icon="ClipboardCheck" label="Admissions today" value={today} note="Across all service points" />
      <MetricCard icon="BedDouble" label="Currently admitted" value={admitted} note={`${bedsUsed} beds allocated`} tone="info" />
      <MetricCard icon="Clock3" label="Observation" value={observation} note="Awaiting disposition" tone="warning" />
      <MetricCard icon="LogOut" label="Discharges today" value={records.filter(r=>r.status==='Discharged').length} note="Completed patient check-outs" tone="success" />
    </div>

    <div className="ops-workspace">
      <SearchFilter search={search} onSearch={setSearch} placeholder="Search admission, patient, ward or doctor…">
        <select value={status} onChange={e=>setStatus(e.target.value)}>{['All','Admitted','Observation','Discharged'].map(x=><option key={x}>{x}</option>)}</select>
      </SearchFilter>
      <div className="ops-table-wrap">
        {filtered.length ? <table className="ops-table">
          <thead><tr><th>Admission</th><th>Patient</th><th>Encounter</th><th>Department / Doctor</th><th>Placement</th><th>Status</th><th></th></tr></thead>
          <tbody>{filtered.map(r=><tr key={r.id} onClick={()=>setSelected(r)}>
            <td><div className="ops-cell-primary">{r.id}</div><div className="ops-cell-sub">{r.admitted}</div></td>
            <td><div className="ops-cell-primary">{r.name}</div><div className="ops-cell-sub">{r.patientId} · {r.age} yrs · {r.sex}</div></td>
            <td><div className="ops-cell-primary">{r.type}</div><div className="ops-cell-sub">{r.reason}</div></td>
            <td><div className="ops-cell-primary">{r.department}</div><div className="ops-cell-sub">{r.doctor}</div></td>
            <td><div className="ops-cell-primary">{r.ward}</div><div className="ops-cell-sub">Bed {r.bed}</div></td>
            <td><StatusBadge status={r.status}/></td>
            <td><div className="ops-row-actions"><button className="ops-icon-button" onClick={e=>{e.stopPropagation();setSelected(r)}}><Eye size={15}/></button></div></td>
          </tr>)}</tbody>
        </table>:<EmptyState icon="ClipboardX" title="No admissions found" />}
      </div>
    </div>

    <Modal open={showNew} onClose={()=>setShowNew(false)} title="Register admission" subtitle="Create a new hospital encounter and initial placement." icon="UserPlus" size="lg" footer={<><button className="pm-btn pm-btn-ghost" onClick={()=>setShowNew(false)}>Cancel</button><button className="pm-btn pm-btn-primary" onClick={createAdmission}>Create admission</button></>}>
      <div className="ops-form-grid">
        <FormField label="Patient full name"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full legal name" /></FormField>
        <FormField label="Existing patient ID" hint="Leave blank for a new patient record"><input value={form.patientId} onChange={e=>setForm({...form,patientId:e.target.value})} placeholder="PT-xxxxx" /></FormField>
        <FormField label="Age"><input type="number" value={form.age} onChange={e=>setForm({...form,age:e.target.value})}/></FormField>
        <FormField label="Sex"><select value={form.sex} onChange={e=>setForm({...form,sex:e.target.value})}><option>Female</option><option>Male</option><option>Other</option></select></FormField>
        <FormField label="Encounter type"><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Inpatient</option><option>Outpatient</option><option>Day Case</option></select></FormField>
        <FormField label="Department"><select value={form.department} onChange={e=>setForm({...form,department:e.target.value})}><option>General Medicine</option><option>General Surgery</option><option>Cardiology</option><option>Paediatrics</option><option>Orthopaedics</option><option>Endoscopy</option></select></FormField>
        <FormField label="Attending doctor"><select value={form.doctor} onChange={e=>setForm({...form,doctor:e.target.value})}><option>Dr. R. Moyo</option><option>Dr. T. Chirwa</option><option>Dr. S. Gomo</option><option>Dr. B. Mlambo</option></select></FormField>
        <FormField label="Payer / medical aid"><select value={form.payer} onChange={e=>setForm({...form,payer:e.target.value})}><option>Self-pay</option><option>CIMAS Medical Aid</option><option>PSMAS</option><option>First Mutual Health</option><option>BonVie Medical Aid</option><option>Corporate account</option></select></FormField>
        <FormField label="Ward"><select value={form.ward} onChange={e=>setForm({...form,ward:e.target.value})}><option>Medical Ward A</option><option>Medical Ward B</option><option>Surgical Ward</option><option>High Care</option><option>Day Unit</option></select></FormField>
        <FormField label="Bed"><input value={form.bed} onChange={e=>setForm({...form,bed:e.target.value})} placeholder="e.g. A-18" /></FormField>
        <FormField label="Contact number"><input value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} placeholder="+263…" /></FormField>
        <FormField label="Next of kin"><input value={form.nextOfKin} onChange={e=>setForm({...form,nextOfKin:e.target.value})} placeholder="Name · phone" /></FormField>
        <label className="ops-field wide"><span>Reason for admission</span><textarea value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} placeholder="Presenting complaint / admission indication" /></label>
      </div>
    </Modal>

    <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?.name || ''} subtitle={`${selected?.id || ''} · ${selected?.patientId || ''}`} icon="ClipboardCheck" size="lg" footer={selected && selected.status!=='Discharged'?<><button className="pm-btn pm-btn-outline" onClick={allocateBed}><BedDouble size={14}/> Allocate / confirm bed</button><button className="pm-btn pm-btn-primary" onClick={()=>setShowDischarge(true)}><LogOut size={14}/> Start discharge</button></>:<button className="pm-btn pm-btn-ghost" onClick={()=>setSelected(null)}>Close</button>}>
      {selected && <>
        <div className="ops-callout"><ClipboardPlus size={18}/><div><strong>{selected.type} encounter</strong><span>{selected.reason}</span></div></div>
        <DetailGrid>
          <DetailItem label="Status" value={<StatusBadge status={selected.status}/>} />
          <DetailItem label="Admitted" value={selected.admitted}/>
          <DetailItem label="Department" value={selected.department}/><DetailItem label="Attending doctor" value={selected.doctor}/>
          <DetailItem label="Ward" value={selected.ward}/><DetailItem label="Bed" value={selected.bed}/>
          <DetailItem label="Patient contact" value={selected.contact}/><DetailItem label="Payer" value={selected.payer}/>
          <DetailItem label="Next of kin" value={selected.nextOfKin} wide/>
        </DetailGrid>
        <div className="ops-section"><div className="ops-section-title"><h4>Encounter activity</h4></div><div className="ops-timeline">
          <div className="ops-timeline-row"><div className="ops-timeline-mark"/><div className="ops-timeline-content"><strong>Admission registered</strong><span>{selected.admitted} · Front Desk</span></div></div>
          <div className="ops-timeline-row"><div className="ops-timeline-mark"/><div className="ops-timeline-content"><strong>Clinical service assigned</strong><span>{selected.department} · {selected.doctor}</span></div></div>
          <div className="ops-timeline-row"><div className="ops-timeline-mark"/><div className="ops-timeline-content"><strong>{selected.status==='Discharged'?'Discharge completed':'Current placement'}</strong><span>{selected.status==='Discharged'?(selected.dischargeNote||'Patient checked out'):`${selected.ward} · Bed ${selected.bed}`}</span></div></div>
        </div></div>
      </>}
    </Modal>

    <Modal open={showDischarge} onClose={()=>setShowDischarge(false)} title="Complete patient discharge" subtitle={selected ? `${selected.name} · ${selected.id}` : ''} icon="LogOut" size="sm" footer={<><button className="pm-btn pm-btn-ghost" onClick={()=>setShowDischarge(false)}>Cancel</button><button className="pm-btn pm-btn-primary" onClick={discharge}>Confirm discharge</button></>}>
      <div className="ops-callout"><LogOut size={18}/><div><strong>Close the current encounter</strong><span>Bed capacity will be released and the admission will move to discharged.</span></div></div>
      <FormField label="Discharge summary / disposition"><textarea value={dischargeNote} onChange={e=>setDischargeNote(e.target.value)} placeholder="Stable for home, follow-up instructions, transfer destination…" /></FormField>
    </Modal>
    <Toast message={toast} onClose={()=>setToast('')}/>
  </>;
}
