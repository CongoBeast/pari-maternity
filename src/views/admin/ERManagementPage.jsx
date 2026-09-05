import React, { useMemo, useState } from 'react';
import { Siren, Ambulance, Eye, Bed, UserRoundCheck, Activity, Stethoscope } from 'lucide-react';
import {
  PageHeader, MetricCard, StatusBadge, SearchFilter, Modal, FormField,
  DetailGrid, DetailItem, Toast, EmptyState
} from '../../components/AdminOperationsUI';

const INITIAL_CASES = [
  { id:'ER-260905-031', patient:'Kudzai Chitiyo', patientId:'PT-10891', age:38, sex:'Male', arrival:'05 Sep 2026 · 07:46', mode:'Ambulance', complaint:'Severe chest pain, diaphoresis and nausea', triage:'Immediate', acuity:1, vitals:'BP 174/108 · HR 118 · SpO₂ 91%', bay:'Resus 1', doctor:'Dr. N. Dhlamini', nurse:'Nurse T. Mberi', status:'In consultation', notes:'ECG completed. Cardiac enzymes requested.' },
  { id:'ER-260905-030', patient:'Rutendo Shoko', patientId:'PT-10217', age:24, sex:'Female', arrival:'05 Sep 2026 · 07:32', mode:'Walk-in', complaint:'Deep laceration to left forearm', triage:'Very urgent', acuity:2, vitals:'BP 118/72 · HR 96 · SpO₂ 98%', bay:'Procedure 2', doctor:'Dr. P. Ncube', nurse:'Nurse C. Nyathi', status:'Triaged', notes:'Bleeding controlled. Awaiting wound review.' },
  { id:'ER-260905-027', patient:'Simbarashe Donga', patientId:'PT-10044', age:67, sex:'Male', arrival:'05 Sep 2026 · 06:58', mode:'Family vehicle', complaint:'Confusion and high blood glucose', triage:'Urgent', acuity:3, vitals:'BP 146/88 · HR 102 · SpO₂ 96%', bay:'Bay 6', doctor:'Dr. R. Moyo', nurse:'Nurse S. Dube', status:'Observation', notes:'IV fluids commenced. Repeat glucose in 30 minutes.' },
  { id:'ER-260905-019', patient:'Munashe Zulu', patientId:'PT-09518', age:11, sex:'Male', arrival:'05 Sep 2026 · 05:41', mode:'Walk-in', complaint:'Fever and vomiting for 24 hours', triage:'Standard', acuity:4, vitals:'Temp 38.7°C · HR 104 · SpO₂ 99%', bay:'Paeds 3', doctor:'Dr. L. Hove', nurse:'Nurse K. Zhou', status:'Waiting', notes:'Oral fluids tolerated. Awaiting doctor assessment.' },
];

const emptyForm={patient:'',patientId:'',age:'',sex:'Female',mode:'Walk-in',complaint:'',triage:'Urgent',vitals:'',bay:'Unassigned',doctor:'Unassigned',nurse:'Triage Nurse',notes:''};

const triageBadge=(triage)=>{
  const cls=triage==='Immediate'?'pm-badge-danger':triage==='Very urgent'?'pm-badge-warning':triage==='Urgent'?'pm-badge-info':'pm-badge-neutral';
  return <span className={`pm-badge ${cls}`}>{triage}</span>;
};

export default function ERManagementPage(){
  const [cases,setCases]=useState(INITIAL_CASES);
  const [search,setSearch]=useState('');
  const [filter,setFilter]=useState('All');
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [form,setForm]=useState(emptyForm);
  const [toast,setToast]=useState('');

  const filtered=useMemo(()=>cases.filter(c=>{
    const q=search.toLowerCase();
    const hit=!q||[c.id,c.patient,c.patientId,c.complaint,c.bay,c.doctor].join(' ').toLowerCase().includes(q);
    return hit&&(filter==='All'||c.status===filter||c.triage===filter);
  }),[cases,search,filter]);

  const updateSelected=(patch,msg)=>{
    if(!selected)return;
    const next={...selected,...patch};
    setCases(cs=>cs.map(c=>c.id===selected.id?next:c));
    setSelected(next); if(msg)setToast(msg);
  };

  const register=()=>{
    if(!form.patient.trim()||!form.complaint.trim())return;
    const acuity=form.triage==='Immediate'?1:form.triage==='Very urgent'?2:form.triage==='Urgent'?3:4;
    const next={...form,id:`ER-260905-${String(cases.length+32).padStart(3,'0')}`,patientId:form.patientId||`PT-${11100+cases.length}`,age:Number(form.age||0),arrival:'05 Sep 2026 · now',acuity,status:'Triaged'};
    setCases([next,...cases]);setShowNew(false);setForm(emptyForm);setToast(`${next.patient} registered and triaged`);
  };

  const avgWait=Math.round(cases.reduce((sum,c)=>sum+(c.status==='Waiting'?38:c.status==='Triaged'?18:8),0)/cases.length);
  return <>
    <PageHeader icon="Siren" title="Emergency Room" subtitle="Live emergency arrivals, triage acuity, treatment bays and patient disposition." actions={<>
      <button className="pm-btn pm-btn-outline"><Activity size={15}/> Capacity view</button>
      <button className="pm-btn pm-btn-primary" style={{background:'var(--pm-danger)'}} onClick={()=>setShowNew(true)}><Ambulance size={15}/> Register emergency</button>
    </>}/>

    <div className="ops-metrics">
      <MetricCard icon="Siren" label="Active ER cases" value={cases.filter(c=>!['Discharged','Admitted'].includes(c.status)).length} note="Current emergency census" tone="danger"/>
      <MetricCard icon="AlertTriangle" label="High acuity" value={cases.filter(c=>c.acuity<=2).length} note="Immediate / very urgent" tone="warning"/>
      <MetricCard icon="Clock3" label="Average wait" value={`${avgWait} min`} note="Triage to clinician" tone="info"/>
      <MetricCard icon="Bed" label="Bays occupied" value={`${cases.filter(c=>c.bay!=='Unassigned').length}/12`} note="Resus, procedure & observation" tone="success"/>
    </div>

    <div className="ops-workspace">
      <SearchFilter search={search} onSearch={setSearch} placeholder="Search ER number, patient, complaint, bay or clinician…">
        <select value={filter} onChange={e=>setFilter(e.target.value)}>{['All','Waiting','Triaged','In consultation','Observation','Immediate','Very urgent','Urgent'].map(x=><option key={x}>{x}</option>)}</select>
      </SearchFilter>
      <div className="ops-table-wrap">
        {filtered.length?<table className="ops-table">
          <thead><tr><th>Case</th><th>Patient</th><th>Triage</th><th>Presenting complaint</th><th>Bay / Clinician</th><th>Status</th><th></th></tr></thead>
          <tbody>{filtered.map(c=><tr key={c.id} onClick={()=>setSelected(c)}>
            <td><div className="ops-cell-primary">{c.id}</div><div className="ops-cell-sub">{c.arrival} · {c.mode}</div></td>
            <td><div className="ops-cell-primary">{c.patient}</div><div className="ops-cell-sub">{c.patientId} · {c.age} yrs · {c.sex}</div></td>
            <td>{triageBadge(c.triage)}<div className="ops-cell-sub">Acuity {c.acuity}</div></td>
            <td><div className="ops-cell-primary">{c.complaint}</div><div className="ops-cell-sub">{c.vitals}</div></td>
            <td><div className="ops-cell-primary">{c.bay}</div><div className="ops-cell-sub">{c.doctor}</div></td>
            <td><StatusBadge status={c.status}/></td>
            <td><button className="ops-icon-button" onClick={e=>{e.stopPropagation();setSelected(c)}}><Eye size={15}/></button></td>
          </tr>)}</tbody>
        </table>:<EmptyState icon="Siren" title="No emergency cases match this filter"/>}
      </div>
    </div>

    <Modal open={showNew} onClose={()=>setShowNew(false)} title="Register emergency arrival" subtitle="Capture initial presentation and triage priority." icon="Ambulance" size="lg" footer={<><button className="pm-btn pm-btn-ghost" onClick={()=>setShowNew(false)}>Cancel</button><button className="pm-btn pm-btn-primary" style={{background:'var(--pm-danger)'}} onClick={register}>Register & triage</button></>}>
      <div className="ops-form-grid">
        <FormField label="Patient name"><input value={form.patient} onChange={e=>setForm({...form,patient:e.target.value})} placeholder="Full name"/></FormField>
        <FormField label="Patient ID" hint="Leave blank if unknown"><input value={form.patientId} onChange={e=>setForm({...form,patientId:e.target.value})} placeholder="PT-xxxxx"/></FormField>
        <FormField label="Age"><input type="number" value={form.age} onChange={e=>setForm({...form,age:e.target.value})}/></FormField>
        <FormField label="Sex"><select value={form.sex} onChange={e=>setForm({...form,sex:e.target.value})}><option>Female</option><option>Male</option><option>Other</option></select></FormField>
        <FormField label="Arrival mode"><select value={form.mode} onChange={e=>setForm({...form,mode:e.target.value})}><option>Walk-in</option><option>Ambulance</option><option>Family vehicle</option><option>Police</option><option>Inter-facility transfer</option></select></FormField>
        <FormField label="Triage category"><select value={form.triage} onChange={e=>setForm({...form,triage:e.target.value})}><option>Immediate</option><option>Very urgent</option><option>Urgent</option><option>Standard</option></select></FormField>
        <label className="ops-field wide"><span>Presenting complaint</span><textarea value={form.complaint} onChange={e=>setForm({...form,complaint:e.target.value})} placeholder="Primary symptoms, mechanism of injury or reason for emergency attendance"/></label>
        <FormField label="Initial vital signs"><input value={form.vitals} onChange={e=>setForm({...form,vitals:e.target.value})} placeholder="BP · HR · Temp · SpO₂"/></FormField>
        <FormField label="Treatment bay"><select value={form.bay} onChange={e=>setForm({...form,bay:e.target.value})}><option>Unassigned</option><option>Resus 1</option><option>Resus 2</option><option>Procedure 1</option><option>Procedure 2</option><option>Bay 5</option><option>Bay 6</option><option>Paeds 3</option></select></FormField>
        <FormField label="Assigned doctor"><select value={form.doctor} onChange={e=>setForm({...form,doctor:e.target.value})}><option>Unassigned</option><option>Dr. N. Dhlamini</option><option>Dr. P. Ncube</option><option>Dr. R. Moyo</option><option>Dr. L. Hove</option></select></FormField>
        <FormField label="Triage nurse"><input value={form.nurse} onChange={e=>setForm({...form,nurse:e.target.value})}/></FormField>
      </div>
    </Modal>

    <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?.patient||''} subtitle={`${selected?.id||''} · arrived ${selected?.arrival||''}`} icon="Siren" size="lg" footer={<button className="pm-btn pm-btn-ghost" onClick={()=>setSelected(null)}>Close</button>}>
      {selected&&<>
        <div className="ops-callout"><Siren size={18}/><div><strong>{selected.triage} · Acuity {selected.acuity}</strong><span>{selected.complaint}</span></div></div>
        <DetailGrid>
          <DetailItem label="Current status" value={<StatusBadge status={selected.status}/>}/><DetailItem label="Arrival mode" value={selected.mode}/>
          <DetailItem label="Vital signs" value={selected.vitals} wide/><DetailItem label="Treatment bay" value={selected.bay}/><DetailItem label="Assigned doctor" value={selected.doctor}/>
          <DetailItem label="Primary nurse" value={selected.nurse}/><DetailItem label="Patient ID" value={selected.patientId}/><DetailItem label="Clinical notes" value={selected.notes} wide/>
        </DetailGrid>
        <div className="ops-section"><div className="ops-section-title"><h4>Emergency workflow</h4></div><div className="ops-inline-actions">
          <button className="pm-btn pm-btn-outline" onClick={()=>updateSelected({status:'In consultation',doctor:selected.doctor==='Unassigned'?'Dr. N. Dhlamini':selected.doctor,bay:selected.bay==='Unassigned'?'Bay 5':selected.bay},'Patient moved into active consultation')}><Stethoscope size={14}/> Start consultation</button>
          <button className="pm-btn pm-btn-outline" onClick={()=>updateSelected({status:'Observation'},'Patient moved to observation')}><Activity size={14}/> Observation</button>
          <button className="pm-btn pm-btn-outline" onClick={()=>updateSelected({status:'Admitted'},'Patient admitted from emergency room')}><Bed size={14}/> Admit patient</button>
          <button className="pm-btn pm-btn-primary" onClick={()=>updateSelected({status:'Discharged'},'Emergency encounter discharged')}><UserRoundCheck size={14}/> Discharge</button>
        </div></div>
        <div className="ops-section"><div className="ops-section-title"><h4>Care timeline</h4></div><div className="ops-timeline">
          <div className="ops-timeline-row"><div className="ops-timeline-mark"/><div className="ops-timeline-content"><strong>Arrival registered</strong><span>{selected.arrival} · {selected.mode}</span></div></div>
          <div className="ops-timeline-row"><div className="ops-timeline-mark"/><div className="ops-timeline-content"><strong>Triage completed</strong><span>{selected.triage} · {selected.vitals}</span></div></div>
          <div className="ops-timeline-row"><div className="ops-timeline-mark"/><div className="ops-timeline-content"><strong>Current care state</strong><span>{selected.status} · {selected.bay} · {selected.doctor}</span></div></div>
        </div></div>
      </>}
    </Modal>
    <Toast message={toast} onClose={()=>setToast('')}/>
  </>;
}
