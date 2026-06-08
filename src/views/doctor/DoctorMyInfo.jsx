import React, { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Building2, Badge, Award, Edit2, Check, X,
  Save, AlertCircle, Key, Shield, Clock, FileText, Briefcase, Heart, MoreVertical
} from 'lucide-react';

// Sample doctor data - in production, this would come from an API
const initialDoctorData = {
  // Personal Information
  firstName: 'Margaret',
  lastName: 'Dube',
  dateOfBirth: '1985-03-15',
  gender: 'Female',
  nationality: 'Zimbabwean',
  idNumber: 'ZW123456789X',
  
  // Contact Information
  email: 'margaret.dube@hospital.co.zw',
  phone: '+263 4 XXX XXXX',
  mobile: '+263 77 XXX XXXX',
  residentialAddress: '45 Borrowdale Road, Harare',
  emergencyContact: 'Dr. David Muskwe',
  emergencyPhone: '+263 77 XXX XXXX',
  
  // Professional Information
  registrationNumber: 'ZMC/2008/0521',
  specialization: 'Obstetrics & Gynaecology',
  qualifications: 'MBCHB (University of Zimbabwe), FCOG (Zimbabwe)',
  dateJoined: '2015-08-01',
  department: 'Obstetrics & Gynaecology',
  designation: 'Senior Doctor',
  
  // Hospital Related
  employmentStatus: 'Full-time Permanent',
  officeLocation: 'OG Wing, 3rd Floor, Room 301',
  officePhone: '+263 4 XXX XXXX Ext. 301',
  workingHours: 'Monday - Friday: 08:00 - 17:00, On-call: Weekends & Public Holidays',
  yearsOfExperience: 15,
  
  // Additional
  licenseExpiry: '2025-12-31',
  insuranceNumber: 'PHYM/ZW/2024/0521',
};

function EditableField({ label, value, onEdit, isEditing, field, onSave, onCancel, type = 'text' }) {
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(field, tempValue);
    onEdit(null);
  };

  if (isEditing) {
    return (
      <div style={{ marginBottom: 16 }}>
        <label style={{
          display: 'block',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: 6,
          color: 'var(--pm-text-primary)'
        }}>
          {label}
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type={type}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '2px solid var(--pm-primary)',
              borderRadius: 6,
              fontSize: '0.9rem',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
            }}
          />
          <button
            onClick={handleSave}
            style={{
              padding: '10px 12px',
              background: 'var(--pm-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            <Check size={18} />
          </button>
          <button
            onClick={() => {
              setTempValue(value);
              onCancel();
            }}
            style={{
              padding: '10px 12px',
              background: 'var(--pm-surface-2)',
              color: 'var(--pm-text-primary)',
              border: '1px solid var(--pm-border)',
              borderRadius: 6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'var(--pm-border)'}
            onMouseLeave={(e) => e.target.style.background = 'var(--pm-surface-2)'}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <label style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--pm-text-muted)'
        }}>
          {label}
        </label>
      </div>
      <div style={{
        padding: '10px 12px',
        background: 'var(--pm-surface)',
        border: '1px solid var(--pm-border)',
        borderRadius: 6,
        fontSize: '0.95rem',
        color: 'var(--pm-text-primary)',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>{value}</span>
        <button
          onClick={() => onEdit(field)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            transition: 'background 0.2s',
            color: 'var(--pm-primary)'
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--pm-surface-2)'}
          onMouseLeave={(e) => e.target.style.background = 'none'}
        >
          <Edit2 size={16} />
        </button>
      </div>
    </div>
  );
}

function InfoCard({ title, icon: Icon, children }) {
  return (
    <div className="pm-card">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: '1px solid var(--pm-border)'
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: 'var(--pm-surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--pm-primary)'
        }}>
          <Icon size={20} />
        </div>
        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ReadOnlyField({ label, value, icon: Icon }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '12px 0',
      borderBottom: '1px solid var(--pm-border)'
    }}>
      {Icon && (
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: 'var(--pm-surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--pm-primary)',
          marginTop: 2,
          flexShrink: 0
        }}>
          <Icon size={16} />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--pm-text-muted)',
          marginBottom: 4
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '0.95rem',
          color: 'var(--pm-text-primary)',
          fontWeight: 500
        }}>
          {value}
        </div>
      </div>
    </div>
  );
}

export default function DoctorMyInfo({ user, onNavigate }) {
  const [doctorData, setDoctorData] = useState(initialDoctorData);
  const [editingField, setEditingField] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (field, value) => {
    setDoctorData(prev => ({
      ...prev,
      [field]: value
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const yearsExperience = new Date().getFullYear() - new Date(doctorData.dateJoined).getFullYear();
  const yearsToLicenseExpiry = new Date(doctorData.licenseExpiry).getFullYear() - new Date().getFullYear();

  return (
    <div>
      {/* Header with Profile Picture and Basic Info */}
      <div className="pm-card" style={{ marginBottom: 24 }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 24
        }}>
          {/* Profile Avatar */}
          <div style={{
            width: 120,
            height: 120,
            borderRadius: 12,
            background: 'linear-gradient(135deg, var(--pm-primary) 0%, #667eea 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '3rem',
            fontWeight: 700,
            flexShrink: 0
          }}>
            {doctorData.firstName[0]}{doctorData.lastName[0]}
          </div>

          {/* Basic Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
              <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
                Dr. {doctorData.firstName} {doctorData.lastName}
              </h2>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                background: '#dbeafe',
                color: 'var(--pm-primary)',
                padding: '4px 10px',
                borderRadius: 6
              }}>
                {doctorData.employmentStatus}
              </span>
            </div>
            <div style={{ fontSize: '1.05rem', color: 'var(--pm-text-muted)', marginBottom: 12 }}>
              {doctorData.specialization}
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--pm-text-muted)', marginBottom: 2 }}>Experience</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{yearsExperience} years</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--pm-text-muted)', marginBottom: 2 }}>Member Since</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{new Date(doctorData.dateJoined).getFullYear()}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--pm-text-muted)', marginBottom: 2 }}>License Valid</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: yearsToLicenseExpiry <= 1 ? 'var(--pm-danger)' : '#16a34a' }}>
                  {yearsToLicenseExpiry} year{yearsToLicenseExpiry !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Notification */}
        {saveSuccess && (
          <div style={{
            marginTop: 16,
            padding: '12px 16px',
            background: '#dcfce7',
            border: '1px solid #86efac',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#166534'
          }}>
            <Check size={16} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Changes saved successfully</span>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="row g-3">
        {/* Left Column - Personal & Contact Info (Editable) */}
        <div className="col-12 col-lg-6">
          {/* Personal Information */}
          <InfoCard title="Personal Information" icon={User}>
            <EditableField
              label="First Name"
              value={doctorData.firstName}
              onEdit={setEditingField}
              isEditing={editingField === 'firstName'}
              field="firstName"
              onSave={handleSave}
              onCancel={() => setEditingField(null)}
            />
            <EditableField
              label="Last Name"
              value={doctorData.lastName}
              onEdit={setEditingField}
              isEditing={editingField === 'lastName'}
              field="lastName"
              onSave={handleSave}
              onCancel={() => setEditingField(null)}
            />
            <EditableField
              label="Date of Birth"
              value={doctorData.dateOfBirth}
              onEdit={setEditingField}
              isEditing={editingField === 'dateOfBirth'}
              field="dateOfBirth"
              onSave={handleSave}
              onCancel={() => setEditingField(null)}
              type="date"
            />
            <EditableField
              label="Gender"
              value={doctorData.gender}
              onEdit={setEditingField}
              isEditing={editingField === 'gender'}
              field="gender"
              onSave={handleSave}
              onCancel={() => setEditingField(null)}
            />
            <EditableField
              label="Nationality"
              value={doctorData.nationality}
              onEdit={setEditingField}
              isEditing={editingField === 'nationality'}
              field="nationality"
              onSave={handleSave}
              onCancel={() => setEditingField(null)}
            />
            <EditableField
              label="National ID Number"
              value={doctorData.idNumber}
              onEdit={setEditingField}
              isEditing={editingField === 'idNumber'}
              field="idNumber"
              onSave={handleSave}
              onCancel={() => setEditingField(null)}
            />
          </InfoCard>

          {/* Contact Information */}
          <InfoCard title="Contact Information" icon={Mail} style={{ marginTop: 16 }}>
            <EditableField
              label="Email Address"
              value={doctorData.email}
              onEdit={setEditingField}
              isEditing={editingField === 'email'}
              field="email"
              onSave={handleSave}
              onCancel={() => setEditingField(null)}
              type="email"
            />
            <EditableField
              label="Office Phone"
              value={doctorData.phone}
              onEdit={setEditingField}
              isEditing={editingField === 'phone'}
              field="phone"
              onSave={handleSave}
              onCancel={() => setEditingField(null)}
              type="tel"
            />
            <EditableField
              label="Mobile Phone"
              value={doctorData.mobile}
              onEdit={setEditingField}
              isEditing={editingField === 'mobile'}
              field="mobile"
              onSave={handleSave}
              onCancel={() => setEditingField(null)}
              type="tel"
            />
            <EditableField
              label="Residential Address"
              value={doctorData.residentialAddress}
              onEdit={setEditingField}
              isEditing={editingField === 'residentialAddress'}
              field="residentialAddress"
              onSave={handleSave}
              onCancel={() => setEditingField(null)}
            />
            <EditableField
              label="Emergency Contact Name"
              value={doctorData.emergencyContact}
              onEdit={setEditingField}
              isEditing={editingField === 'emergencyContact'}
              field="emergencyContact"
              onSave={handleSave}
              onCancel={() => setEditingField(null)}
            />
            <EditableField
              label="Emergency Contact Phone"
              value={doctorData.emergencyPhone}
              onEdit={setEditingField}
              isEditing={editingField === 'emergencyPhone'}
              field="emergencyPhone"
              onSave={handleSave}
              onCancel={() => setEditingField(null)}
              type="tel"
            />
          </InfoCard>
        </div>

        {/* Right Column - Professional & Hospital Info */}
        <div className="col-12 col-lg-6">
          {/* Professional Information - Read Only */}
          <InfoCard title="Professional Information" icon={Briefcase}>
            <ReadOnlyField
              label="Registration Number"
              value={doctorData.registrationNumber}
              icon={Badge}
            />
            <ReadOnlyField
              label="Specialization"
              value={doctorData.specialization}
              icon={Heart}
            />
            <ReadOnlyField
              label="Qualifications"
              value={doctorData.qualifications}
              icon={Award}
            />
            <ReadOnlyField
              label="Years of Experience"
              value={`${yearsExperience} years (Joined: ${new Date(doctorData.dateJoined).toLocaleDateString()})`}
              icon={Clock}
            />
          </InfoCard>

          {/* Hospital Information - Read Only */}
          <InfoCard title="Hospital Information" icon={Building2} style={{ marginTop: 16 }}>
            <ReadOnlyField
              label="Department"
              value={doctorData.department}
              icon={Building2}
            />
            <ReadOnlyField
              label="Designation"
              value={doctorData.designation}
              icon={Briefcase}
            />
            <ReadOnlyField
              label="Employment Status"
              value={doctorData.employmentStatus}
              icon={FileText}
            />
            <ReadOnlyField
              label="Office Location"
              value={doctorData.officeLocation}
              icon={MapPin}
            />
            <ReadOnlyField
              label="Office Extension"
              value={doctorData.officePhone}
              icon={Phone}
            />
            <ReadOnlyField
              label="Working Hours"
              value={doctorData.workingHours}
              icon={Clock}
            />
          </InfoCard>

          {/* Credentials & Licenses - Read Only */}
          <InfoCard title="Credentials & Licenses" icon={Shield} style={{ marginTop: 16 }}>
            <ReadOnlyField
              label="License Expiry Date"
              value={new Date(doctorData.licenseExpiry).toLocaleDateString()}
              icon={Calendar}
            />
            <ReadOnlyField
              label="Medical Insurance Number"
              value={doctorData.insuranceNumber}
              icon={Shield}
            />
          </InfoCard>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginTop: 24,
        flexWrap: 'wrap'
      }}>
        <button
          className="pm-btn pm-btn-primary"
          onClick={() => alert('Password change functionality would be implemented here')}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Key size={16} /> Change Password
        </button>
        <button
          className="pm-btn pm-btn-outline"
          onClick={() => alert('Notifications settings would be implemented here')}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Shield size={16} /> Security & Privacy
        </button>
        <button
          className="pm-btn pm-btn-outline"
          onClick={() => onNavigate('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}