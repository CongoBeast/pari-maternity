import React, {useState} from 'react';

export default function BillingManagementPage(){
 const [payments,setPayments]=useState([{id:'INV-1001',patient:'Tariro Moyo',amount:120,'method':'Cash','status':'Paid'}]);
 const [method,setMethod]=useState('Cash');
 const add=()=>setPayments([{id:'INV-'+(1000+payments.length+1),patient:'Walk-in Patient',amount:50,method,status:'Pending'},...payments]);
 return <div className="pm-card"><h2>Patient Billing & Payments</h2><p>Invoices, deposits and Zimbabwe payment options.</p>
 <select value={method} onChange={e=>setMethod(e.target.value)}>{['Cash','EcoCash','OneMoney','Bank Transfer','Swipe / POS','Medical Aid','Insurance Claim'].map(x=><option key={x}>{x}</option>)}</select>
 <button onClick={add} className="btn btn-primary m-3">Create Payment</button>
 <table className="table"><tbody>{payments.map(p=><tr key={p.id}><td>{p.id}</td><td>{p.patient}</td><td>${p.amount}</td><td>{p.method}</td><td>{p.status}</td></tr>)}</tbody></table></div>
}
