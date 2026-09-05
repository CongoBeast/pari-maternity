import React, { useMemo, useState } from 'react';
import { MonitorCog, Plus, Eye, Wrench, ShieldCheck, PowerOff, CalendarClock } from 'lucide-react';
import {
  PageHeader, MetricCard, StatusBadge, SearchFilter, Modal, FormField,
  DetailGrid, DetailItem, Toast, EmptyState, money
} from '../../components/AdminOperationsUI';

const INITIAL = [
  { id:'EQ-000184', assetTag:'VMS-ICU-014', name:'Patient Monitor IntelliVue MX450', category:'Monitoring', manufacturer:'Philips', model:'MX450', serial:'PH-MX450-99214', location:'High Care · Bed HC-04', custodian:'Critical Care Unit', acquired:'14 Feb 2024', purchase:8450, warranty:'13 Feb 2027', status:'In service', condition:'Good', lastService:'20 Jun 2026', nextService:'20 Dec 2026', supplier:'MedEquip Zimbabwe', notes:'Preventive maintenance every 6 months.', history:[['20 Jun 2026','Preventive maintenance completed','Biomedical Engineering'],['18 Mar 2026','Moved to High Care HC-04','Assets Office'],['14 Feb 2024','Commissioned and acceptance tested','Biomedical Engineering']] },
  { id:'EQ-000132', assetTag:'VMS-RAD-006', name:'Portable Ultrasound System', category:'Imaging', manufacturer:'Mindray', model:'M7', serial:'MR-M7-55102', location:'Radiology · Ultrasound Room 2', custodian:'Radiology', acquired:'09 Sep 2023', purchase:19750, warranty:'08 Sep 2026', status:'Maintenance due', condition:'Fair', lastService:'02 Mar 2026', nextService:'02 Sep 2026', supplier:'HealthTech Solutions', notes:'Probe connector intermittent; inspect during scheduled maintenance.', history:[['02 Sep 2026','Scheduled service became due','System'],['02 Mar 2026','Software calibration and probe inspection','HealthTech Solutions'],['09 Sep 2023','Commissioned','Biomedical Engineering']] },
  { id:'EQ-000219', assetTag:'VMS-ER-021', name:'Defibrillator / AED', category:'Emergency', manufacturer:'ZOLL', model:'R Series', serial:'ZR-774103', location:'Emergency Room · Resus 1', custodian:'Emergency Department', acquired:'11 Jan 2025', purchase:12100, warranty:'10 Jan 2028', status:'Available', condition:'Excellent', lastService:'15 Jul 2026', nextService:'15 Jan 2027', supplier:'Acacia Medical', notes:'Daily readiness check required.', history:[['05 Sep 2026','Daily readiness check passed','ER Charge Nurse'],['15 Jul 2026','Preventive service completed','Biomedical Engineering'],['11 Jan 2025','Commissioned','Biomedical Engineering']] },
  { id:'EQ-000071', assetTag:'VMS-TH-003', name:'Anaesthesia Workstation', category:'Theatre', manufacturer:'GE Healthcare', model:'Carestation 650', serial:'GE-CS650-1130', location:'Theatre 2', custodian:'Operating Theatre', acquired:'23 Apr 2021', purchase:31800, warranty:'Expired', status:'Inspection', condition:'Poor', lastService:'17 Aug 2026', nextService:'Pending', supplier:'Surgical Systems Africa', notes:'Gas analyser fault under review. Restricted from clinical use.', history:[['03 Sep 2026','Removed from service pending inspection','Biomedical Engineering'],['17 Aug 2026','Fault reported: gas analyser alarm','Theatre 2'],['23 Apr 2021','Commissioned','Biomedical Engineering']] },
];

const empty={assetTag:'',name:'',category:'Monitoring',manufacturer:'',model:'',serial:'',location:'',custodian:'',acquired:'05 Sep 2026',purchase:'',warranty:'',supplier:'',condition:'Excellent',status:'Inspection',notes:''};

export default function MedicalAssetsPage(){
  const [assets,setAssets]=useState(INITIAL);
  const [search,setSearch]=useState('');
  const [filter,setFilter]=useState('All');
  const [selected,setSelected]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const [showService,setShowService]=useState(false);
  const [form,setForm]=useState(empty);
  const [serviceNote,setServiceNote]=useState('Preventive maintenance completed; functional tests passed.');
  const [toast,setToast]=useState('');

  const filtered=useMemo(()=>assets.filter(a=>{
    const q=search.toLowerCase();
    const hit=!q||[a.id,a.assetTag,a.name,a.category,a.manufacturer,a.location,a.serial].join(' ').toLowerCase().includes(q);
    return hit&&(filter==='All'||a.status===filter||a.category===filter);
  }),[assets,search,filter]);

  const saveAsset=()=>{
    if(!form.name.trim()||!form.assetTag.trim())return;
    const next={...form,id:`EQ-${String(220+assets.length).padStart(6,'0')}`,purchase:Number(form.purchase||0),lastService:'Not yet serviced',nextService:'To be scheduled',history:[['05 Sep 2026','Asset registered and awaiting acceptance inspection','Assets Office']]};
    setAssets([next,...assets]);setShowNew(false);setForm(empty);setToast(`${next.assetTag} added to equipment register`);
  };

  const patch=(patch,msg)=>{
    if(!selected)return;
    const next={...selected,...patch};setAssets(xs=>xs.map(x=>x.id===selected.id?next:x));setSelected(next);if(msg)setToast(msg);
  };

  const completeService=()=>{
    if(!selected)return;
    const history=[['05 Sep 2026',serviceNote,'Biomedical Engineering'],...(selected.history||[])];
    patch({status:'In service',condition:selected.condition==='Poor'?'Fair':selected.condition,lastService:'05 Sep 2026',nextService:'05 Mar 2027',history},'Maintenance record saved and asset returned to service');
    setShowService(false);
  };

  return <>
    <PageHeader icon="MonitorCog" title="Medical Equipment Lifecycle" subtitle="Control the full asset lifecycle from acquisition and commissioning through maintenance, movement and retirement." actions={<>
      <button className="pm-btn pm-btn-outline"><CalendarClock size={15}/> Maintenance calendar</button>
      <button className="pm-btn pm-btn-primary" onClick={()=>setShowNew(true)}><Plus size={15}/> Add equipment</button>
    </>}/>

    <div className="ops-metrics">
      <MetricCard icon="MonitorCog" label="Registered assets" value={assets.length} note={`Book value ${money(assets.reduce((s,a)=>s+a.purchase,0))}`}/>
      <MetricCard icon="ShieldCheck" label="Ready for use" value={assets.filter(a=>['In service','Available'].includes(a.status)).length} note="Clinically available" tone="success"/>
      <MetricCard icon="Wrench" label="Maintenance due" value={assets.filter(a=>a.status==='Maintenance due').length} note="Service action required" tone="warning"/>
      <MetricCard icon="AlertTriangle" label="Restricted / inspection" value={assets.filter(a=>a.status==='Inspection').length} note="Not cleared for routine use" tone="danger"/>
    </div>

    <div className="ops-workspace">
      <SearchFilter search={search} onSearch={setSearch} placeholder="Search asset tag, serial, equipment, manufacturer or location…">
        <select value={filter} onChange={e=>setFilter(e.target.value)}>{['All','In service','Available','Maintenance due','Inspection','Retired','Monitoring','Imaging','Emergency','Theatre'].map(x=><option key={x}>{x}</option>)}</select>
      </SearchFilter>
      <div className="ops-table-wrap">
        {filtered.length?<table className="ops-table"><thead><tr><th>Asset</th><th>Equipment</th><th>Location</th><th>Condition</th><th>Maintenance</th><th>Status</th><th></th></tr></thead>
          <tbody>{filtered.map(a=><tr key={a.id} onClick={()=>setSelected(a)}>
            <td><div className="ops-cell-primary">{a.assetTag}</div><div className="ops-cell-sub">{a.id} · {a.serial}</div></td>
            <td><div className="ops-cell-primary">{a.name}</div><div className="ops-cell-sub">{a.manufacturer} {a.model} · {a.category}</div></td>
            <td><div className="ops-cell-primary">{a.location}</div><div className="ops-cell-sub">{a.custodian}</div></td>
            <td><div className="ops-cell-primary">{a.condition}</div><div className="ops-cell-sub">Acquired {a.acquired}</div></td>
            <td><div className="ops-cell-primary">Next: {a.nextService}</div><div className="ops-cell-sub">Last: {a.lastService}</div></td>
            <td><StatusBadge status={a.status}/></td>
            <td><button className="ops-icon-button" onClick={e=>{e.stopPropagation();setSelected(a)}}><Eye size={15}/></button></td>
          </tr>)}</tbody></table>:<EmptyState icon="MonitorX" title="No equipment matches this view"/>}
      </div>
    </div>

    <Modal open={showNew} onClose={()=>setShowNew(false)} title="Register medical equipment" subtitle="Create the asset record before acceptance inspection and commissioning." icon="MonitorCog" size="lg" footer={<><button className="pm-btn pm-btn-ghost" onClick={()=>setShowNew(false)}>Cancel</button><button className="pm-btn pm-btn-primary" onClick={saveAsset}>Add equipment</button></>}>
      <div className="ops-form-grid">
        <FormField label="Asset tag"><input value={form.assetTag} onChange={e=>setForm({...form,assetTag:e.target.value})} placeholder="VMS-XXX-000"/></FormField>
        <FormField label="Equipment name"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Ventilator"/></FormField>
        <FormField label="Category"><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Monitoring</option><option>Imaging</option><option>Emergency</option><option>Theatre</option><option>Laboratory</option><option>Life support</option></select></FormField>
        <FormField label="Manufacturer"><input value={form.manufacturer} onChange={e=>setForm({...form,manufacturer:e.target.value})}/></FormField>
        <FormField label="Model"><input value={form.model} onChange={e=>setForm({...form,model:e.target.value})}/></FormField>
        <FormField label="Serial number"><input value={form.serial} onChange={e=>setForm({...form,serial:e.target.value})}/></FormField>
        <FormField label="Location"><input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Department · room / bay"/></FormField>
        <FormField label="Custodian department"><input value={form.custodian} onChange={e=>setForm({...form,custodian:e.target.value})}/></FormField>
        <FormField label="Acquisition date"><input value={form.acquired} onChange={e=>setForm({...form,acquired:e.target.value})}/></FormField>
        <FormField label="Purchase cost (USD)"><input type="number" value={form.purchase} onChange={e=>setForm({...form,purchase:e.target.value})}/></FormField>
        <FormField label="Warranty expiry"><input value={form.warranty} onChange={e=>setForm({...form,warranty:e.target.value})}/></FormField>
        <FormField label="Supplier"><input value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})}/></FormField>
        <label className="ops-field wide"><span>Notes / acceptance requirements</span><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label>
      </div>
    </Modal>

    <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?.name||''} subtitle={`${selected?.assetTag||''} · ${selected?.id||''}`} icon="MonitorCog" size="lg" footer={<button className="pm-btn pm-btn-ghost" onClick={()=>setSelected(null)}>Close</button>}>
      {selected&&<>
        <div className="ops-callout"><MonitorCog size={18}/><div><strong>{selected.location}</strong><span>{selected.notes}</span></div></div>
        <DetailGrid>
          <DetailItem label="Lifecycle status" value={<StatusBadge status={selected.status}/>}/><DetailItem label="Condition" value={selected.condition}/>
          <DetailItem label="Manufacturer / model" value={`${selected.manufacturer} ${selected.model}`}/><DetailItem label="Serial number" value={selected.serial}/>
          <DetailItem label="Custodian" value={selected.custodian}/><DetailItem label="Supplier" value={selected.supplier}/>
          <DetailItem label="Purchase cost" value={money(selected.purchase)}/><DetailItem label="Warranty" value={selected.warranty}/>
          <DetailItem label="Last service" value={selected.lastService}/><DetailItem label="Next service" value={selected.nextService}/>
        </DetailGrid>
        <div className="ops-section"><div className="ops-section-title"><h4>Asset actions</h4></div><div className="ops-inline-actions">
          <button className="pm-btn pm-btn-outline" onClick={()=>setShowService(true)}><Wrench size={14}/> Record maintenance</button>
          <button className="pm-btn pm-btn-outline" onClick={()=>patch({location:'Biomedical Workshop',status:'Inspection'},'Asset moved to Biomedical Workshop for inspection')}><MonitorCog size={14}/> Send to workshop</button>
          <button className="pm-btn pm-btn-outline" onClick={()=>patch({status:'Available'},'Asset marked available for allocation')}><ShieldCheck size={14}/> Mark available</button>
          <button className="pm-btn pm-btn-ghost" style={{color:'var(--pm-danger)'}} onClick={()=>patch({status:'Retired',location:'Decommissioned Assets Store'},'Asset retired from clinical service')}><PowerOff size={14}/> Retire asset</button>
        </div></div>
        <div className="ops-section"><div className="ops-section-title"><h4>Lifecycle history</h4></div><div className="ops-timeline">
          {(selected.history||[]).map((h,i)=><div className="ops-timeline-row" key={i}><div className="ops-timeline-mark"/><div className="ops-timeline-content"><strong>{h[1]}</strong><span>{h[0]} · {h[2]}</span></div></div>)}
        </div></div>
      </>}
    </Modal>

    <Modal open={showService} onClose={()=>setShowService(false)} title="Record maintenance event" subtitle={selected?`${selected.assetTag} · ${selected.name}`:''} icon="Wrench" size="sm" footer={<><button className="pm-btn pm-btn-ghost" onClick={()=>setShowService(false)}>Cancel</button><button className="pm-btn pm-btn-primary" onClick={completeService}>Complete maintenance</button></>}>
      <FormField label="Maintenance outcome"><textarea value={serviceNote} onChange={e=>setServiceNote(e.target.value)}/></FormField>
      <div className="ops-summary-strip"><div className="ops-summary-box"><span>Previous service</span><strong style={{fontSize:'.86rem'}}>{selected?.lastService}</strong></div><div className="ops-summary-box"><span>New service date</span><strong style={{fontSize:'.86rem'}}>05 Sep 2026</strong></div><div className="ops-summary-box"><span>Next due</span><strong style={{fontSize:'.86rem'}}>05 Mar 2027</strong></div></div>
    </Modal>
    <Toast message={toast} onClose={()=>setToast('')}/>
  </>;
}
