import React, {useState} from 'react';
import * as Icons from 'lucide-react';

export default function ModulePage({title, icon='LayoutDashboard', cards=[]}) {
 const [items,setItems]=useState(cards);
 const [notice,setNotice]=useState('');
 const Icon=Icons[icon]||Icons.LayoutDashboard;
 return <div>
  <div className="pm-page-header"><Icon size={32}/><div><h2>{title}</h2><p>Vista Medical Systems operational module</p></div></div>
  {notice && <div className="alert alert-success">{notice}</div>}
  <div className="row g-3">{items.map((c,i)=><div className="col-md-4" key={i}>
   <div className="pm-card h-100"><h5>{c.title}</h5><p>{c.text}</p><button className="btn btn-primary" onClick={()=>setNotice(c.action||'Action completed')}>{c.button||'Open'}</button></div>
  </div>)}</div>
 </div>
}
