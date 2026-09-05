const STORAGE_KEY = 'vista-finance-ledger-v2';

export const PAYMENT_METHODS = [
  'Cash — USD',
  'Cash — ZiG',
  'EcoCash — USD',
  'EcoCash — ZiG',
  'OneMoney',
  'Visa / Mastercard POS',
  'ZIPIT / Bank Transfer',
  'Medical Aid / Insurance',
];

export const DEFAULT_PATIENT_ID = 'PT-20418';

const seed = {
  patients: [
    {
      id: 'PT-20418', accountNo: 'VMS-ACC-002941', name: 'Amara Ngwendeza',
      phone: '+263 77 245 9182', email: 'amara.ngwendeza@email.com', dob: '1996-08-12',
      nationalId: '63-184921-K-63', address: '12 Carrick Creagh Road, Borrowdale, Harare',
      medicalAid: 'CIMAS iGo', memberNo: 'CIM-908211', plan: 'Private Patient',
    },
    { id: 'PT-20441', accountNo: 'VMS-ACC-003004', name: 'Tariro Moyo', phone: '+263 71 208 4401', email: 'tariro.moyo@email.com', medicalAid: 'First Mutual Health', memberNo: 'FMH-401933', plan: 'Medical Aid' },
    { id: 'PT-20387', accountNo: 'VMS-ACC-002880', name: 'Ruvimbo Chikonde', phone: '+263 77 410 3016', email: 'ruvimbo.c@email.com', medicalAid: 'Self Pay', memberNo: '—', plan: 'Private Patient' },
    { id: 'PT-20291', accountNo: 'VMS-ACC-002714', name: 'Nyasha Sibanda', phone: '+263 78 556 1093', email: 'nyasha.s@email.com', medicalAid: 'Old Mutual', memberNo: 'OMH-708331', plan: 'Medical Aid' },
    { id: 'PT-20502', accountNo: 'VMS-ACC-003115', name: 'Kudzai Chirwa', phone: '+263 71 900 8244', email: 'kudzai.c@email.com', medicalAid: 'CIMAS', memberNo: 'CIM-440817', plan: 'Medical Aid' },
  ],
  invoices: [
    {
      id: 'INV-260905-018', patientId: 'PT-20418', date: '2026-09-05', dueDate: '2026-09-12',
      visit: 'Outpatient consultation', clinician: 'Dr. Sarah Mpande', currency: 'USD',
      total: 360, paid: 160, status: 'Partial',
      lines: [
        { id: 'LN-1', category: 'Consultation', description: 'Specialist consultation', qty: 1, unitPrice: 45, amount: 45 },
        { id: 'LN-2', category: 'Laboratory', description: 'Full blood count + urinalysis', qty: 1, unitPrice: 55, amount: 55 },
        { id: 'LN-3', category: 'Medication', description: 'Ferrous Sulfate 325 mg — 30 tablets', qty: 1, unitPrice: 18, amount: 18 },
        { id: 'LN-4', category: 'Medication', description: 'Prenatal Multivitamin — 30 tablets', qty: 1, unitPrice: 22, amount: 22 },
        { id: 'LN-5', category: 'Imaging', description: 'Obstetric ultrasound', qty: 1, unitPrice: 120, amount: 120 },
        { id: 'LN-6', category: 'Facility', description: 'Day observation / treatment bay', qty: 1, unitPrice: 100, amount: 100 },
      ],
    },
    {
      id: 'INV-260822-011', patientId: 'PT-20418', date: '2026-08-22', dueDate: '2026-08-22',
      visit: 'Pharmacy & laboratory', clinician: 'Dr. Sarah Mpande', currency: 'USD',
      total: 145, paid: 145, status: 'Paid',
      lines: [
        { id: 'LN-1', category: 'Laboratory', description: 'Glucose tolerance test', qty: 1, unitPrice: 70, amount: 70 },
        { id: 'LN-2', category: 'Medication', description: 'Calcium Carbonate 500 mg — 60 tablets', qty: 1, unitPrice: 25, amount: 25 },
        { id: 'LN-3', category: 'Consultation', description: 'Results review consultation', qty: 1, unitPrice: 50, amount: 50 },
      ],
    },
    {
      id: 'INV-260724-037', patientId: 'PT-20418', date: '2026-07-24', dueDate: '2026-08-07',
      visit: 'Emergency assessment', clinician: 'Dr. Tendai Mlambo', currency: 'USD',
      total: 820, paid: 620, status: 'Partial',
      lines: [
        { id: 'LN-1', category: 'Emergency', description: 'Emergency room assessment', qty: 1, unitPrice: 110, amount: 110 },
        { id: 'LN-2', category: 'Imaging', description: 'Emergency ultrasound', qty: 1, unitPrice: 150, amount: 150 },
        { id: 'LN-3', category: 'Laboratory', description: 'Emergency laboratory panel', qty: 1, unitPrice: 95, amount: 95 },
        { id: 'LN-4', category: 'Medication', description: 'IV fluids and administered medicines', qty: 1, unitPrice: 85, amount: 85 },
        { id: 'LN-5', category: 'Facility', description: 'Observation admission — 1 night', qty: 1, unitPrice: 380, amount: 380 },
      ],
    },
    { id: 'INV-260904-021', patientId: 'PT-20441', date: '2026-09-04', dueDate: '2026-09-18', visit: 'General admission', clinician: 'Dr. K. Chuma', currency: 'USD', total: 740, paid: 300, status: 'Partial', lines: [{ id: 'LN-1', category: 'Admission', description: 'General admission and treatment', qty: 1, unitPrice: 740, amount: 740 }] },
    { id: 'INV-260903-014', patientId: 'PT-20387', date: '2026-09-03', dueDate: '2026-09-10', visit: 'Outpatient', clinician: 'Dr. L. Ncube', currency: 'USD', total: 125, paid: 0, status: 'Unpaid', lines: [{ id: 'LN-1', category: 'Consultation', description: 'General consultation and medication', qty: 1, unitPrice: 125, amount: 125 }] },
    { id: 'INV-260829-008', patientId: 'PT-20291', date: '2026-08-29', dueDate: '2026-09-05', visit: 'Surgical admission', clinician: 'Dr. T. Mlambo', currency: 'USD', total: 1240, paid: 940, status: 'Partial', lines: [{ id: 'LN-1', category: 'Surgery', description: 'Surgical theatre, ward and medication', qty: 1, unitPrice: 1240, amount: 1240 }] },
    { id: 'INV-260821-032', patientId: 'PT-20502', date: '2026-08-21', dueDate: '2026-08-28', visit: 'Emergency room', clinician: 'Dr. R. Zhou', currency: 'USD', total: 510, paid: 0, status: 'Overdue', lines: [{ id: 'LN-1', category: 'Emergency', description: 'Emergency treatment and diagnostics', qty: 1, unitPrice: 510, amount: 510 }] },
  ],
  payments: [
    { id: 'PAY-260905-004', patientId: 'PT-20418', invoiceId: 'INV-260905-018', date: '2026-09-05 08:14', amount: 100, method: 'EcoCash — USD', reference: 'EC-981442106', receivedBy: 'Patient Portal', status: 'Confirmed' },
    { id: 'PAY-260905-002', patientId: 'PT-20418', invoiceId: 'INV-260905-018', date: '2026-09-05 07:31', amount: 60, method: 'Visa / Mastercard POS', reference: 'POS-804551', receivedBy: 'Cashier 02', status: 'Confirmed' },
    { id: 'PAY-260822-009', patientId: 'PT-20418', invoiceId: 'INV-260822-011', date: '2026-08-22 11:04', amount: 145, method: 'Cash — USD', reference: 'RCPT-260822-119', receivedBy: 'Cashier 01', status: 'Confirmed' },
    { id: 'PAY-260802-006', patientId: 'PT-20418', invoiceId: 'INV-260724-037', date: '2026-08-02 15:21', amount: 420, method: 'Medical Aid / Insurance', reference: 'CIM-CLM-822901', receivedBy: 'Insurance Desk', status: 'Confirmed' },
    { id: 'PAY-260724-012', patientId: 'PT-20418', invoiceId: 'INV-260724-037', date: '2026-07-24 20:05', amount: 200, method: 'Cash — USD', reference: 'RCPT-260724-772', receivedBy: 'Emergency Cashier', status: 'Confirmed' },
    { id: 'PAY-260904-003', patientId: 'PT-20441', invoiceId: 'INV-260904-021', date: '2026-09-04 14:20', amount: 300, method: 'ZIPIT / Bank Transfer', reference: 'ZIPIT-714050', receivedBy: 'Accounts', status: 'Confirmed' },
    { id: 'PAY-260829-011', patientId: 'PT-20291', invoiceId: 'INV-260829-008', date: '2026-08-29 16:47', amount: 940, method: 'Medical Aid / Insurance', reference: 'OMH-PA-553011', receivedBy: 'Insurance Desk', status: 'Confirmed' },
  ],
  expenses: [
    { id: 'EXP-260905-01', date: '2026-09-05', category: 'Pharmacy stock', supplier: 'Varichem Pharmaceuticals', description: 'Routine pharmaceutical replenishment', amount: 2840, status: 'Approved', reference: 'PO-260901-18' },
    { id: 'EXP-260904-03', date: '2026-09-04', category: 'Laboratory', supplier: 'MedLab Supplies Zimbabwe', description: 'Reagents and collection tubes', amount: 1160, status: 'Approved', reference: 'PO-260902-07' },
    { id: 'EXP-260903-02', date: '2026-09-03', category: 'Maintenance', supplier: 'MedTech Africa (Pvt) Ltd', description: 'Patient monitor preventive maintenance', amount: 690, status: 'Pending', reference: 'RFQ-260826-04' },
    { id: 'EXP-260901-06', date: '2026-09-01', category: 'Medical consumables', supplier: 'Surgimed Zimbabwe', description: 'Syringes, cannulas and dressings', amount: 1725, status: 'Approved', reference: 'PO-260829-11' },
  ],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getFinanceData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (_) {}
  const initial = clone(seed);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(initial)); } catch (_) {}
  return initial;
}

export function saveFinanceData(data) {
  const next = clone(data);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('vista-finance-updated', { detail: next }));
  } catch (_) {}
  return next;
}

export function resetFinanceData() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  return getFinanceData();
}

function makeId(prefix) {
  const now = new Date();
  const stamp = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${stamp}-${rand}`;
}

export function recordPayment(data, paymentInput) {
  const next = clone(data);
  const invoice = next.invoices.find((item) => item.id === paymentInput.invoiceId);
  if (!invoice) throw new Error('Invoice not found.');

  const currentBalance = Math.max(0, Number(invoice.total) - Number(invoice.paid));
  const amount = Number(paymentInput.amount);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Enter a valid payment amount.');
  if (amount > currentBalance + 0.001) throw new Error('Payment cannot exceed the outstanding invoice balance.');

  invoice.paid = Number((Number(invoice.paid) + amount).toFixed(2));
  const remaining = Math.max(0, Number((Number(invoice.total) - invoice.paid).toFixed(2)));
  invoice.status = remaining === 0 ? 'Paid' : 'Partial';

  const now = new Date();
  const payment = {
    id: makeId('PAY'),
    patientId: invoice.patientId,
    invoiceId: invoice.id,
    date: `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`,
    amount,
    method: paymentInput.method,
    reference: paymentInput.reference || makeId('REF'),
    receivedBy: paymentInput.receivedBy || 'Finance Desk',
    status: 'Confirmed',
  };
  next.payments.unshift(payment);
  saveFinanceData(next);
  return { data: next, payment, invoice };
}

export function createExpense(data, expenseInput) {
  const next = clone(data);
  const expense = {
    id: makeId('EXP'),
    date: expenseInput.date || new Date().toISOString().slice(0, 10),
    category: expenseInput.category || 'Other',
    supplier: expenseInput.supplier || 'Internal / Other',
    description: expenseInput.description || 'Expense entry',
    amount: Number(expenseInput.amount) || 0,
    status: expenseInput.status || 'Pending',
    reference: expenseInput.reference || makeId('REF'),
  };
  next.expenses.unshift(expense);
  saveFinanceData(next);
  return { data: next, expense };
}

export function createInvoice(data, invoiceInput) {
  const next = clone(data);
  const lines = (invoiceInput.lines || []).filter((line) => line.description && Number(line.amount) > 0).map((line, index) => ({
    id: `LN-${index + 1}`,
    category: line.category || 'Other',
    description: line.description,
    qty: Number(line.qty) || 1,
    unitPrice: Number(line.unitPrice || line.amount) || 0,
    amount: Number(line.amount) || 0,
  }));
  const total = Number(lines.reduce((sum, line) => sum + Number(line.amount), 0).toFixed(2));
  if (!invoiceInput.patientId || total <= 0) throw new Error('Patient and at least one billable line are required.');
  const invoice = {
    id: makeId('INV'),
    patientId: invoiceInput.patientId,
    date: invoiceInput.date || new Date().toISOString().slice(0, 10),
    dueDate: invoiceInput.dueDate || new Date().toISOString().slice(0, 10),
    visit: invoiceInput.visit || 'Hospital services',
    clinician: invoiceInput.clinician || 'Vista Medical Systems',
    currency: 'USD',
    total,
    paid: 0,
    status: 'Unpaid',
    lines,
  };
  next.invoices.unshift(invoice);
  saveFinanceData(next);
  return { data: next, invoice };
}

export function money(value, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-ZW', { style: 'currency', currency, minimumFractionDigits: 2 }).format(Number(value) || 0);
  } catch (_) {
    return `$${(Number(value) || 0).toFixed(2)}`;
  }
}

export function patientBalance(data, patientId) {
  const invoices = data.invoices.filter((invoice) => invoice.patientId === patientId);
  const billed = invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);
  const paid = invoices.reduce((sum, invoice) => sum + Number(invoice.paid), 0);
  return { billed, paid, outstanding: Math.max(0, billed - paid), invoices };
}

export function invoiceBalance(invoice) {
  return Math.max(0, Number(invoice.total) - Number(invoice.paid));
}
