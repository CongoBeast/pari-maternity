import React,{useState} from 'react';
export default function QueueManagementPage(){const [q,setQ]=useState(['Patient A']);return <div className="pm-card"><h2>Consultation Ticket Queue</h2><button className="btn btn-success" onClick={()=>setQ([...q,'New Patient '+(q.length+1)])}>Issue Ticket</button>{q.map((x,i)=><div key={i}>Ticket {i+1}: {x}</div>)}</div>}
