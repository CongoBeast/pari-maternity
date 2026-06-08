import React from 'react';
import * as Icons from 'lucide-react';

export default function PlaceholderPage({ title, icon = 'Construction' }) {
  const Icon = Icons[icon] || Icons.Construction;
  return (
    <div className="pm-placeholder">
      <Icon size={52} />
      <h3>{title}</h3>
      <p>This section is ready to be built. Add your page component and wire it up in the router.</p>
    </div>
  );
}
