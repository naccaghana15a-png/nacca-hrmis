'use client';

import { useState, useEffect } from 'react';

export default function LeavePage() {
  const [user, setUser] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [activeTab, setActiveTab] = useState('apply');

  // ============================================================
  // 📊 FETCH LOGGED-IN USER - ADDED THIS
  // ============================================================
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

export default function LeavePage() {
  const [user, setUser] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [activeTab, setActiveTab] = useState('apply');

  // ============================================================
  // 📊 FETCH LOGGED-IN USER
  // ============================================================
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // ============================================================
  // 📧 ADD THESE MAILTO HELPER FUNCTIONS HERE
  // ============================================================
  
  // Open email client with pre-filled message
  const openEmailClient = (to, subject, body) => {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const mailtoLink = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
    window.location.href = mailtoLink;
    return true;
  };

  // Get the director for a department
  const getDirectorForDepartment = (department) => {
    const director = staffData.directors.find(d => 
      d.department === department && d.status === 'Active'
    );
    return director || null;
  };

  // Get HR Director
  const getHRDirector = () => {
    return staffData.directors.find(d => d.department === 'Human Resource');
  };

  // Get Director-General
  const getDG = () => {
    return staffData.directors.find(d => d.role === 'Director-General');
  };

  // Real NaCCA Staff Data (existing code continues here)
  const staffData = {
    directors: [
      // ... existing directors
    ],
    // ... rest of staffData
  };

  // Real NaCCA Staff Data
  const staffData = {
    directors: [
      { id: 'D001', name: 'Prof. Samuel Ofori Bekoe', role: 'Director-General', department: 'Executive', email: 'samuel.bekoe@nacca.gov.gh' },
      { id: 'D002', name: 'Dr. J. R. Achoanya Ayam', role: 'Deputy Director-General', department: 'Executive', email: 'j.achoanya@nacca.gov.gh' },
      { id: 'D003', name: 'Dr. Eric Amoah', role: 'Deputy Director-General', department: 'Executive', email: 'eric.amoah@nacca.gov.gh' },
      { id: 'D004', name: 'Anita Frances Cordeiro Collison', role: 'Director, SAQA', department: 'Assessment', email: 'anita.collison@nacca.gov.gh' },
      { id: 'D005', name: 'Reginald George Quartey', role: 'Director, Curriculum Development', department: 'Curriculum', email: 'reginald.quartey@nacca.gov.gh' },
      { id: 'D006', name: 'Dr. Mercy Nyamekye', role: 'Director, RPME', department: 'Research', email: 'mercy.nyamekye@nacca.gov.gh' },
      { id: 'D007', name: 'Joana Vanderpuje', role: 'Director, Instructional Resources', department: 'Instructional Resources', email: 'joana.vanderpuje@nacca.gov.gh' },
      { id: 'D008', name: 'Elijah Intsiful', role: 'Director, Human Resources & Admin', department: 'Human Resource', email: 'elijah.intsiful@nacca.gov.gh' },
      { id: 'D009', name: 'Rebecca Abu Gariba', role: 'Director, Corporate Affairs', department: 'Corporate Affairs', email: 'rebecca.gariba@nacca.gov.gh' },
    ],
    staff: [
      { id: 'S001', name: 'Joachim Kwame Seyram Honu', department: 'Assessment', email: 'joachim.honu@nacca.gov.gh', director: 'D004' },
      { id: 'S002', name: 'Richard Teye', department: 'Assessment', email: 'richard.teye@nacca.gov.gh', director: 'D004' },
      { id: 'S003', name: 'Genevieve Mensah', department: 'Curriculum', email: 'genevieve.mensah@nacca.gov.gh', director: 'D005' },
      { id: 'S004', name: 'Thomas Kumah Osei', department: 'Curriculum', email: 'thomas.osei@nacca.gov.gh', director: 'D005' },
      { id: 'S005', name: 'Abigail Owusu Birago', department: 'Research', email: 'abigail.birago@nacca.gov.gh', director: 'D006' },
      { id: 'S006', name: 'Kenneth Wontumi', department: 'Instructional Resources', email: 'kenneth.wontumi@nacca.gov.gh', director: 'D007' },
      { id: 'S007', name: 'Seth Nii Nartey', department: 'Corporate Affairs', email: 'seth.nartey@nacca.gov.gh', director: 'D009' },
    ]
  };

  // Leave Applications with Full Workflow Tracking
  const [leaveApplications, setLeaveApplications] = useState([
    {
      id: 1,
      reference: 'NAC-LV-2026-0001',
      applicant: 'Joachim Kwame Seyram Honu',
      applicantId: 'S001',
      department: 'Assessment',
      type: 'Annual Leave',
      startDate: '2026-07-15',
      endDate: '2026-07-19',
      days: 5,
      reason: 'Family vacation',
      status: 'pending_director',
      currentStage: 'Director Review',
      submittedAt: '2026-07-10 09:30:00',
      updatedAt: '2026-07-10 09:30:00',
      actions: [
        { stage: 'Submitted', officer: 'Joachim Honu', timestamp: '2026-07-10 09:30:00', comment: 'Leave application submitted' },
      ],
      notifications: [
        { to: 'joachim.honu@nacca.gov.gh', type: 'submission', sent: true, timestamp: '2026-07-10 09:31:00' }
      ],
      workflow: {
        current: 'director_review',
        history: [
          { stage: 'submitted', timestamp: '2026-07-10 09:30:00', officer: 'Joachim Honu' }
        ]
      },
      balance: { annual: 12, casual: 5, sick: 9 }
    },
    {
      id: 2,
      reference: 'NAC-LV-2026-0002',
      applicant: 'Richard Teye',
      applicantId: 'S002',
      department: 'Assessment',
      type: 'Sick Leave',
      startDate: '2026-07-12',
      endDate: '2026-07-13',
      days: 2,
      reason: 'Medical appointment',
      status: 'hr_review',
      currentStage: 'HR Review',
      submittedAt: '2026-07-09 14:15:00',
      updatedAt: '2026-07-10 08:45:00',
      actions: [
        { stage: 'Submitted', officer: 'Richard Teye', timestamp: '2026-07-09 14:15:00', comment: 'Leave application submitted' },
        { stage: 'Director Approved', officer: 'Anita Collison', timestamp: '2026-07-10 08:30:00', comment: 'Approved - valid medical reason' },
        { stage: 'Forwarded to HR', officer: 'Anita Collison', timestamp: '2026-07-10 08:35:00', comment: 'Forwarded for HR review' },
      ],
      notifications: [
        { to: 'richard.teye@nacca.gov.gh', type: 'submission', sent: true, timestamp: '2026-07-09 14:16:00' },
        { to: 'anita.collison@nacca.gov.gh', type: 'director_action', sent: true, timestamp: '2026-07-09 14:17:00' },
        { to: 'elijah.intsiful@nacca.gov.gh', type: 'hr_notification', sent: true, timestamp: '2026-07-10 08:36:00' },
      ],
      workflow: {
        current: 'hr_review',
        history: [
          { stage: 'submitted', timestamp: '2026-07-09 14:15:00', officer: 'Richard Teye' },
          { stage: 'director_approved', timestamp: '2026-07-10 08:30:00', officer: 'Anita Collison' },
          { stage: 'hr_review', timestamp: '2026-07-10 08:45:00', officer: 'Elijah Intsiful' }
        ]
      },
      balance: { annual: 14, casual: 5, sick: 7 }
    },
    {
      id: 3,
      reference: 'NAC-LV-2026-0003',
      applicant: 'Genevieve Mensah',
      applicantId: 'S003',
      department: 'Curriculum',
      type: 'Annual Leave',
      startDate: '2026-07-20',
      endDate: '2026-07-24',
      days: 5,
      reason: 'Personal vacation',
      status: 'approved',
      currentStage: 'Final Approved',
      submittedAt: '2026-07-05 10:00:00',
      updatedAt: '2026-07-08 16:20:00',
      actions: [
        { stage: 'Submitted', officer: 'Genevieve Mensah', timestamp: '2026-07-05 10:00:00', comment: 'Leave application submitted' },
        { stage: 'Director Approved', officer: 'Reginald Quartey', timestamp: '2026-07-06 09:15:00', comment: 'Approved - work schedule clear' },
        { stage: 'HR Verified', officer: 'Elijah Intsiful', timestamp: '2026-07-07 11:30:00', comment: 'Leave balance sufficient - approved' },
        { stage: 'DG Approved', officer: 'Prof. Samuel Ofori Bekoe', timestamp: '2026-07-08 16:20:00', comment: 'Approved' },
      ],
      notifications: [
        { to: 'genevieve.mensah@nacca.gov.gh', type: 'submission', sent: true, timestamp: '2026-07-05 10:01:00' },
        { to: 'reginald.quartey@nacca.gov.gh', type: 'director_action', sent: true, timestamp: '2026-07-05 10:02:00' },
        { to: 'elijah.intsiful@nacca.gov.gh', type: 'hr_notification', sent: true, timestamp: '2026-07-06 09:16:00' },
        { to: 'samuel.bekoe@nacca.gov.gh', type: 'dg_notification', sent: true, timestamp: '2026-07-07 11:31:00' },
        { to: 'genevieve.mensah@nacca.gov.gh', type: 'final_decision', sent: true, timestamp: '2026-07-08 16:21:00' },
      ],
      workflow: {
        current: 'completed',
        history: [
          { stage: 'submitted', timestamp: '2026-07-05 10:00:00', officer: 'Genevieve Mensah' },
          { stage: 'director_approved', timestamp: '2026-07-06 09:15:00', officer: 'Reginald Quartey' },
          { stage: 'hr_verified', timestamp: '2026-07-07 11:30:00', officer: 'Elijah Intsiful' },
          { stage: 'dg_approved', timestamp: '2026-07-08 16:20:00', officer: 'Prof. Samuel Ofori Bekoe' }
        ]
      },
      balance: { annual: 9, casual: 5, sick: 9 }
    }
  ]);

  // Leave Balance
  const leaveBalance = {
    annual: 14,
    casual: 5,
    sick: 9,
    study: 30,
    maternity: 90,
    paternity: 14
  };

  // Workflow Stages
  const workflowStages = [
    { key: 'submitted', label: 'Submitted', icon: 'fa-file-alt', color: 'text-blue-500' },
    { key: 'director_review', label: 'Director Review', icon: 'fa-user-check', color: 'text-yellow-500' },
    { key: 'hr_review', label: 'HR Review', icon: 'fa-clipboard-check', color: 'text-purple-500' },
    { key: 'dg_review', label: 'DG Review', icon: 'fa-crown', color: 'text-red-500' },
    { key: 'completed', label: 'Final Decision', icon: 'fa-check-circle', color: 'text-green-500' }
  ];

  const getWorkflowStatus = (status) => {
    const map = {
      'pending_director': 'Director Review',
      'pending_hr': 'HR Review',
      'pending_dg': 'DG Review',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'hr_review': 'HR Review',
      'director_review': 'Director Review'
    };
    return map[status] || status;
  };

  const getStatusBadge = (status) => {
    const map = {
      'pending_director': '<span class="badge-review"><i class="fas fa-clock mr-1"></i>Director Review</span>',
      'pending_hr': '<span class="badge-review"><i class="fas fa-clock mr-1"></i>HR Review</span>',
      'pending_dg': '<span class="badge-review"><i class="fas fa-clock mr-1"></i>DG Review</span>',
      'approved': '<span class="badge-approved"><i class="fas fa-check-circle mr-1"></i>Approved</span>',
      'rejected': '<span class="badge-rejected"><i class="fas fa-times-circle mr-1"></i>Rejected</span>',
      'hr_review': '<span class="badge-review"><i class="fas fa-clock mr-1"></i>HR Review</span>',
      'director_review': '<span class="badge-review"><i class="fas fa-clock mr-1"></i>Director Review</span>'
    };
    return map[status] || `<span class="badge-pending">${status}</span>`;
  };

  // Email notification simulation
  const sendEmailNotification = (to, subject, body) => {
    console.log(`📧 Email sent to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    return true;
  };

  // Handle Leave Application Submission
 
// Handle Leave Application Submission
// Handle Leave Application Submission
const handleSubmitLeave = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const leaveData = {
    id: Date.now(),
    reference: `NAC-LV-2026-${String(leaveApplications.length + 1).padStart(4, '0')}`,
    applicant: user?.name || 'Staff Member',
    applicantId: user?.staffId || 'N/A',
    department: user?.department || 'Unknown',
    type: formData.get('leaveType'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    days: calculateDays(formData.get('startDate'), formData.get('endDate')),
    reason: formData.get('reason'),
    status: 'pending_director',
    currentStage: 'Director Review',
    submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    actions: [
      { 
        stage: 'Submitted', 
        officer: user?.name || 'Staff Member', 
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), 
        comment: 'Leave application submitted' 
      }
    ],
    notifications: [],
    workflow: {
      current: 'director_review',
      history: [
        { 
          stage: 'submitted', 
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), 
          officer: user?.name || 'Staff Member' 
        }
      ]
    },
    balance: leaveBalance
  };

  // Add to the beginning of the array
  setLeaveApplications(prev => [leaveData, ...prev]);

  // ============================================================
  // 📧 OPEN EMAIL CLIENTS FOR NOTIFICATIONS
  // ============================================================

  // 1. Confirmation to applicant
  const applicantSubject = `Leave Application ${leaveData.reference} - Submitted Successfully`;
  const applicantBody = `
Dear ${leaveData.applicant},

Your leave application has been submitted successfully.

📋 APPLICATION DETAILS:
• Reference: ${leaveData.reference}
• Type: ${leaveData.type}
• Dates: ${leaveData.startDate} to ${leaveData.endDate}
• Days: ${leaveData.days}
• Reason: ${leaveData.reason}

Status: Pending Director Review

You will receive further notifications as your application progresses.

Regards,
NaCCA HRMIS System
  `;

  // 2. Notification to Director
  const director = getDirectorForDepartment(leaveData.department);
  const directorSubject = `Leave Application ${leaveData.reference} - Action Required (Director Review)`;
  const directorBody = `
Dear ${director?.name || 'Director'},

A leave application has been submitted by ${leaveData.applicant} from the ${leaveData.department} department.

📋 APPLICATION DETAILS:
• Reference: ${leaveData.reference}
• Type: ${leaveData.type}
• Dates: ${leaveData.startDate} to ${leaveData.endDate}
• Days: ${leaveData.days}
• Reason: ${leaveData.reason}

🔗 Please review and take action on this application.

You can review it here: https://nacca-hrmis.vercel.app/admin/leave

Regards,
NaCCA HRMIS System
  `;

  // 3. Notification to HR (Awareness)
  const hr = getHRDirector();
  const hrSubject = `New Leave Application - ${leaveData.reference} (Awaiting Director Approval)`;
  const hrBody = `
Dear ${hr?.name || 'HR Director'},

A leave application has been submitted by ${leaveData.applicant} from the ${leaveData.department} department.

📋 APPLICATION DETAILS:
• Reference: ${leaveData.reference}
• Type: ${leaveData.type}
• Dates: ${leaveData.startDate} to ${leaveData.endDate}
• Days: ${leaveData.days}

Status: Awaiting Director Review

You will be notified when the Director forwards it for HR review.

Regards,
NaCCA HRMIS System
  `;

  // 4. Notification to DG (Awareness)
  const dg = getDG();
  const dgSubject = `New Leave Application - ${leaveData.reference} (Awaiting Director Approval)`;
  const dgBody = `
Dear ${dg?.name || 'Director-General'},

A leave application has been submitted by ${leaveData.applicant} from the ${leaveData.department} department.

📋 APPLICATION DETAILS:
• Reference: ${leaveData.reference}
• Type: ${leaveData.type}
• Dates: ${leaveData.startDate} to ${leaveData.endDate}
• Days: ${leaveData.days}

Status: Awaiting Director Review

You will be notified when the application reaches your desk.

Regards,
NaCCA HRMIS System
  `;

  // ✅ Show a prompt asking which notifications to send
  const sendNotifications = confirm(
    `✅ Leave application submitted!\n\n` +
    `📧 Email notifications will be sent to:\n` +
    `• You (Staff) - Confirmation\n` +
    `• ${director?.name || 'Your Director'} - Action Required\n` +
    `• ${hr?.name || 'HR Director'} - Awareness\n` +
    `• ${dg?.name || 'Director-General'} - Awareness\n\n` +
    `Click OK to open your email client(s) and send notifications.\n` +
    `Click Cancel to skip emails.`
  );

  if (sendNotifications) {
    // Open email client for each notification
    openEmailClient(user?.email || 'staff@nacca.gov.gh', applicantSubject, applicantBody);
    
    if (director) {
      setTimeout(() => {
        openEmailClient(director.email, directorSubject, directorBody);
      }, 500);
    }
    
    if (hr) {
      setTimeout(() => {
        openEmailClient(hr.email, hrSubject, hrBody);
      }, 1000);
    }
    
    if (dg) {
      setTimeout(() => {
        openEmailClient(dg.email, dgSubject, dgBody);
      }, 1500);
    }
    
    alert('📧 Email clients opened!\n\nPlease send each email to the respective recipients.');
  }

  setShowApplyForm(false);
  setActiveTab('director');
};

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Handle Workflow Actions
const handleDirectorAction = (id, action, comment = '') => {
  const application = leaveApplications.find(l => l.id === id);
  if (!application) return;

  if (action === 'approve') {
    const updated = {
      ...application,
      status: 'hr_review',
      currentStage: 'HR Review',
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actions: [
        ...application.actions,
        { stage: 'Director Approved', officer: user?.name || 'Director', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), comment: comment || 'Forwarded to HR' }
      ],
      workflow: {
        ...application.workflow,
        current: 'hr_review',
        history: [
          ...application.workflow.history,
          { stage: 'director_approved', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), officer: user?.name || 'Director' }
        ]
      }
    };

    // 📧 Send email notifications
    const hr = getHRDirector();
    if (hr) {
      const subject = `Leave Application ${application.reference} - HR Review Required`;
      const body = `
Dear ${hr.name},

The leave application from ${application.applicant} has been forwarded for HR review.

📋 APPLICATION DETAILS:
• Reference: ${application.reference}
• Type: ${application.type}
• Dates: ${application.startDate} to ${application.endDate}
• Days: ${application.days}
• Director: ${user?.name || 'Director'}

🔗 Please verify leave balances and forward to DG.

Regards,
NaCCA HRMIS System
      `;
      
      if (confirm(`📧 Open email client to notify ${hr.name}?`)) {
        openEmailClient(hr.email, subject, body);
      }
    }

    // 📧 Notify applicant
    const applicantSubject = `Leave Application ${application.reference} - Status Update`;
    const applicantBody = `
Dear ${application.applicant},

Your leave application has been approved by your Director.

📋 APPLICATION DETAILS:
• Reference: ${application.reference}
• Type: ${application.type}
• Dates: ${application.startDate} to ${application.endDate}

Status: Forwarded to HR for verification.

Regards,
NaCCA HRMIS System
    `;
    
    if (confirm(`📧 Open email client to notify ${application.applicant}?`)) {
      openEmailClient(application.email || 'staff@nacca.gov.gh', applicantSubject, applicantBody);
    }

    setLeaveApplications(leaveApplications.map(l => l.id === id ? updated : l));
    alert(`✅ Application ${application.reference} forwarded to HR.`);

  } else if (action === 'reject') {
    const updated = {
      ...application,
      status: 'rejected',
      currentStage: 'Rejected',
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actions: [
        ...application.actions,
        { stage: 'Rejected', officer: user?.name || 'Director', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), comment: comment || 'Application rejected' }
      ],
      workflow: {
        ...application.workflow,
        current: 'completed',
        history: [
          ...application.workflow.history,
          { stage: 'rejected', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), officer: user?.name || 'Director' }
        ]
      }
    };

    // 📧 Notify applicant of rejection
    const subject = `Leave Application ${application.reference} - Update`;
    const body = `
Dear ${application.applicant},

Your leave application has been reviewed.

📋 APPLICATION DETAILS:
• Reference: ${application.reference}
• Type: ${application.type}
• Dates: ${application.startDate} to ${application.endDate}

Status: ❌ Rejected
Reason: ${comment || 'Please contact HR for more details.'}

Regards,
NaCCA HRMIS System
    `;
    
    if (confirm(`📧 Open email client to notify ${application.applicant}?`)) {
      openEmailClient(application.email || 'staff@nacca.gov.gh', subject, body);
    }

    setLeaveApplications(leaveApplications.map(l => l.id === id ? updated : l));
    alert(`❌ Application ${application.reference} rejected.`);
  }
};

  const handleHRAction = (id, action, comment = '') => {
    const application = leaveApplications.find(l => l.id === id);
    if (!application) return;

    if (action === 'approve') {
      // Forward to DG
      const updated = {
        ...application,
        status: 'pending_dg',
        currentStage: 'DG Review',
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        actions: [
          ...application.actions,
          { stage: 'HR Verified', officer: user?.name || 'HR Director', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), comment: comment || 'Leave balance verified - Forward to DG' }
        ],
        workflow: {
          ...application.workflow,
          current: 'dg_review',
          history: [
            ...application.workflow.history,
            { stage: 'hr_verified', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), officer: user?.name || 'HR Director' }
          ]
        }
      };

      // Send DG notification
      const dg = staffData.directors.find(d => d.role === 'Director-General');
      if (dg) {
        sendEmailNotification(
          dg.email,
          `Leave Application ${application.reference} - Final Approval Required`,
          `Dear ${dg.name},\n\nA leave application requires your final approval.\n\nEmployee: ${application.applicant}\nDepartment: ${application.department}\nType: ${application.type}\nDates: ${application.startDate} to ${application.endDate}\nLeave Balance: ${JSON.stringify(application.balance)}\n\nPlease review and approve/decline.\n\nRegards,\nNaCCA HRMIS System`
        );
      }

      setLeaveApplications(leaveApplications.map(l => l.id === id ? updated : l));
      alert(`✅ Application ${application.reference} forwarded to Director-General.`);

    } else if (action === 'reject') {
      const updated = {
        ...application,
        status: 'rejected',
        currentStage: 'Rejected by HR',
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        actions: [
          ...application.actions,
          { stage: 'Rejected by HR', officer: user?.name || 'HR Director', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), comment: comment || 'Application rejected at HR level' }
        ],
        workflow: {
          ...application.workflow,
          current: 'completed',
          history: [
            ...application.workflow.history,
            { stage: 'hr_rejected', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), officer: user?.name || 'HR Director' }
          ]
        }
      };

      // Send rejection notification
      sendEmailNotification(
        application.email || 'staff@nacca.gov.gh',
        `Leave Application ${application.reference} - Update`,
        `Dear ${application.applicant},\n\nYour leave application has been reviewed by HR.\n\nStatus: Rejected\nReason: ${comment || 'Please contact HR for more details.'}\n\nRegards,\nNaCCA HRMIS System`
      );

      setLeaveApplications(leaveApplications.map(l => l.id === id ? updated : l));
      alert(`❌ Application ${application.reference} rejected by HR.`);
    }
  };

  const handleDGApproval = (id, action, comment = '') => {
    const application = leaveApplications.find(l => l.id === id);
    if (!application) return;

    if (action === 'approve') {
      const updated = {
        ...application,
        status: 'approved',
        currentStage: 'Final Approved',
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        actions: [
          ...application.actions,
          { stage: 'DG Approved', officer: user?.name || 'Director-General', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), comment: comment || 'Approved' }
        ],
        workflow: {
          ...application.workflow,
          current: 'completed',
          history: [
            ...application.workflow.history,
            { stage: 'dg_approved', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), officer: user?.name || 'Director-General' }
          ]
        }
      };

      // Send final approval notification
      sendEmailNotification(
        application.email || 'staff@nacca.gov.gh',
        `Leave Application ${application.reference} - Approved!`,
        `Dear ${application.applicant},\n\nYour leave application has been APPROVED! 🎉\n\nApplication Details:\n- Reference: ${application.reference}\n- Type: ${application.type}\n- Dates: ${application.startDate} to ${application.endDate}\n- Days: ${application.days}\n\nEnjoy your leave!\n\nRegards,\nNaCCA HRMIS System`
      );

      setLeaveApplications(leaveApplications.map(l => l.id === id ? updated : l));
      alert(`✅ Application ${application.reference} APPROVED!`);

    } else if (action === 'reject') {
      const updated = {
        ...application,
        status: 'rejected',
        currentStage: 'Rejected by DG',
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        actions: [
          ...application.actions,
          { stage: 'DG Rejected', officer: user?.name || 'Director-General', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), comment: comment || 'Application declined' }
        ],
        workflow: {
          ...application.workflow,
          current: 'completed',
          history: [
            ...application.workflow.history,
            { stage: 'dg_rejected', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), officer: user?.name || 'Director-General' }
          ]
        }
      };

      // Send rejection notification
      sendEmailNotification(
        application.email || 'staff@nacca.gov.gh',
        `Leave Application ${application.reference} - Update`,
        `Dear ${application.applicant},\n\nYour leave application has been reviewed.\n\nStatus: Rejected by Director-General\nReason: ${comment || 'Please contact HR for more details.'}\n\nRegards,\nNaCCA HRMIS System`
      );

      setLeaveApplications(leaveApplications.map(l => l.id === id ? updated : l));
      alert(`❌ Application ${application.reference} REJECTED.`);
    }
  };

  // Get applications by status for tabs
  const getApplicationsByStatus = (status) => {
    return leaveApplications.filter(l => l.status === status);
  };
// Get applications by status
const pendingDirector = leaveApplications.filter(l => l.status === 'pending_director' || l.status === 'director_review');
const pendingHR = leaveApplications.filter(l => l.status === 'hr_review');
const pendingDG = leaveApplications.filter(l => l.status === 'pending_dg');
const approved = leaveApplications.filter(l => l.status === 'approved');
const rejected = leaveApplications.filter(l => l.status === 'rejected');

  // Check user role for workflow actions
  const isDirector = user?.role === 'DIRECTOR' || user?.role === 'SUPER_ADMIN';
  const isHR = user?.department === 'Human Resource' || user?.role === 'SUPER_ADMIN';
  const isDG = user?.role === 'DIRECTOR_GENERAL' || user?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h5 className="font-bold text-xl m-0">
            <i className="fas fa-calendar-check text-[#0056A3] mr-2"></i>
            Leave Management
          </h5>
          <p className="text-[#6b7a8a] text-sm m-0">
            {user?.department ? `${user.department} Department` : 'NaCCA'} Leave Approval Workflow System
          </p>
        </div>
        <button onClick={() => setShowApplyForm(true)} className="btn-primary">
          <i className="fas fa-plus mr-2"></i>Apply for Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {Object.entries(leaveBalance).map(([type, days]) => (
          <div key={type} className="stat-card text-center p-3">
            <div className="text-xl font-bold text-[#0056A3]">{days}</div>
            <div className="text-xs text-[#6b7a8a] capitalize">{type}</div>
          </div>
        ))}
      </div>

      {/* Workflow Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="stat-card text-center p-3 bg-blue-50 border-blue-200">
          <div className="text-lg font-bold text-blue-600">{pendingDirector.length}</div>
          <div className="text-xs text-blue-600">Director Review</div>
        </div>
        <div className="stat-card text-center p-3 bg-purple-50 border-purple-200">
          <div className="text-lg font-bold text-purple-600">{pendingHR.length}</div>
          <div className="text-xs text-purple-600">HR Review</div>
        </div>
        <div className="stat-card text-center p-3 bg-red-50 border-red-200">
          <div className="text-lg font-bold text-red-600">{pendingDG.length}</div>
          <div className="text-xs text-red-600">DG Review</div>
        </div>
        <div className="stat-card text-center p-3 bg-green-50 border-green-200">
          <div className="text-lg font-bold text-green-600">{approved.length}</div>
          <div className="text-xs text-green-600">Approved</div>
        </div>
        <div className="stat-card text-center p-3 bg-gray-50 border-gray-200">
          <div className="text-lg font-bold text-gray-600">{rejected.length}</div>
          <div className="text-xs text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Workflow Visualization */}
      <div className="content-card">
        <div className="px-5 py-3 border-b border-[#e2e8f0]">
          <h5 className="font-semibold flex items-center gap-2">
            <i className="fas fa-route text-[#0056A3]"></i> Leave Approval Workflow
          </h5>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            {workflowStages.map((stage, index) => (
              <div key={stage.key} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${stage.color} ${index <= 3 ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <i className={`fas ${stage.icon}`}></i>
                  </div>
                  <span className="text-xs font-semibold mt-1">{stage.label}</span>
                </div>
                {index < workflowStages.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap border-b border-[#e2e8f0] pb-2">
        <button onClick={() => setActiveTab('apply')} className={`px-4 py-2 rounded-lg transition ${activeTab === 'apply' ? 'bg-[#0056A3] text-white' : 'hover:bg-[#f4f7fc]'}`}>
          <i className="fas fa-pen mr-2"></i>Apply
        </button>
        <button onClick={() => setActiveTab('director')} className={`px-4 py-2 rounded-lg transition ${activeTab === 'director' ? 'bg-[#0056A3] text-white' : 'hover:bg-[#f4f7fc]'}`}>
          <i className="fas fa-user-check mr-2"></i>Director Review ({pendingDirector.length})
        </button>
        <button onClick={() => setActiveTab('hr')} className={`px-4 py-2 rounded-lg transition ${activeTab === 'hr' ? 'bg-[#0056A3] text-white' : 'hover:bg-[#f4f7fc]'}`}>
          <i className="fas fa-clipboard-check mr-2"></i>HR Review ({pendingHR.length})
        </button>
        <button onClick={() => setActiveTab('dg')} className={`px-4 py-2 rounded-lg transition ${activeTab === 'dg' ? 'bg-[#0056A3] text-white' : 'hover:bg-[#f4f7fc]'}`}>
          <i className="fas fa-crown mr-2"></i>DG Review ({pendingDG.length})
        </button>
        <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-lg transition ${activeTab === 'history' ? 'bg-[#0056A3] text-white' : 'hover:bg-[#f4f7fc]'}`}>
          <i className="fas fa-history mr-2"></i>History
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'apply' && (
          <div className="content-card">
            <div className="px-5 py-3 border-b border-[#e2e8f0]">
              <h5 className="font-semibold">Apply for Leave</h5>
            </div>
            <div className="p-5">
              <form onSubmit={handleSubmitLeave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-sm">Leave Type *</label>
                    <select name="leaveType" className="w-full p-2 border rounded-lg mt-1" required>
                      <option value="">Select Type</option>
                      <option>Annual Leave</option>
                      <option>Casual Leave</option>
                      <option>Sick Leave</option>
                      <option>Study Leave</option>
                      <option>Maternity Leave</option>
                      <option>Paternity Leave</option>
                      <option>Compassionate Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-sm">Department</label>
                    <input type="text" className="w-full p-2 border rounded-lg mt-1 bg-gray-50" value={user?.department || 'N/A'} readOnly />
                  </div>
                  <div>
                    <label className="font-semibold text-sm">Start Date *</label>
                    <input type="date" name="startDate" className="w-full p-2 border rounded-lg mt-1" required />
                  </div>
                  <div>
                    <label className="font-semibold text-sm">End Date *</label>
                    <input type="date" name="endDate" className="w-full p-2 border rounded-lg mt-1" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-semibold text-sm">Reason *</label>
                    <textarea name="reason" className="w-full p-2 border rounded-lg mt-1" rows="3" required placeholder="Explain the reason for your leave request..."></textarea>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  <i className="fas fa-info-circle mr-2"></i>
                  Your application will follow this workflow:
                  <ol className="list-decimal list-inside mt-1 text-xs text-blue-600">
                    <li>Submitted to your Director for review</li>
                    <li>Forwarded to Human Resources for verification</li>
                    <li>Sent to Director-General for final approval</li>
                    <li>You will receive email notifications at each stage</li>
                  </ol>
                </div>

                <div className="flex gap-3 pt-4 mt-4 border-t border-[#e2e8f0]">
                  <button type="button" onClick={() => setShowApplyForm(false)} className="btn-outline flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">
                    <i className="fas fa-paper-plane mr-2"></i>Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'director' && (
          <div className="content-card">
            <div className="px-5 py-3 border-b border-[#e2e8f0]">
              <h5 className="font-semibold flex items-center gap-2">
                <i className="fas fa-user-check text-yellow-500"></i> Director Review ({pendingDirector.length})
              </h5>
            </div>
            <div className="p-0">
              {pendingDirector.length === 0 ? (
                <div className="p-5 text-center text-[#6b7a8a]">
                  <i className="fas fa-check-circle text-3xl text-green-500 mb-2 block"></i>
                  <p>No applications pending Director review.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#f4f7fc]">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Reference</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Employee</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Department</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Dates</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      {pendingDirector.map((app) => (
                        <tr key={app.id} className="hover:bg-[#f8fafc]">
                          <td className="px-4 py-2 text-sm font-mono font-semibold">{app.reference}</td>
                          <td className="px-4 py-2 text-sm">{app.applicant}</td>
                          <td className="px-4 py-2 text-sm">{app.department}</td>
                          <td className="px-4 py-2 text-sm">{app.type}</td>
                          <td className="px-4 py-2 text-sm">{app.startDate} - {app.endDate}</td>
                          <td className="px-4 py-2">
                            <button onClick={() => handleDirectorAction(app.id, 'approve', 'Approved - forwarded to HR')} className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition text-sm mr-1" title="Approve & Forward to HR">
                              <i className="fas fa-check"></i>
                            </button>
                            <button onClick={() => {
                              const comment = prompt('Reason for rejection:');
                              if (comment !== null) handleDirectorAction(app.id, 'reject', comment);
                            }} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition text-sm" title="Reject">
                              <i className="fas fa-times"></i>
                            </button>
                            <button onClick={() => setSelectedLeave(app)} className="text-[#0056A3] hover:bg-[#0056A3]/10 p-1.5 rounded-lg transition text-sm" title="View Details">
                              <i className="fas fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'hr' && (
          <div className="content-card">
            <div className="px-5 py-3 border-b border-[#e2e8f0]">
              <h5 className="font-semibold flex items-center gap-2">
                <i className="fas fa-clipboard-check text-purple-500"></i> HR Review ({pendingHR.length})
              </h5>
            </div>
            <div className="p-0">
              {pendingHR.length === 0 ? (
                <div className="p-5 text-center text-[#6b7a8a]">
                  <i className="fas fa-check-circle text-3xl text-green-500 mb-2 block"></i>
                  <p>No applications pending HR review.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#f4f7fc]">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Reference</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Employee</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Department</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Balance</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      {pendingHR.map((app) => (
                        <tr key={app.id} className="hover:bg-[#f8fafc]">
                          <td className="px-4 py-2 text-sm font-mono font-semibold">{app.reference}</td>
                          <td className="px-4 py-2 text-sm">{app.applicant}</td>
                          <td className="px-4 py-2 text-sm">{app.department}</td>
                          <td className="px-4 py-2 text-sm">{app.type}</td>
                          <td className="px-4 py-2 text-sm">{app.balance?.[app.type.toLowerCase().replace(' ', '')] || 'N/A'}</td>
                          <td className="px-4 py-2">
                            <button onClick={() => handleHRAction(app.id, 'approve', 'Leave balance verified - Forward to DG')} className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition text-sm mr-1" title="Verify & Forward to DG">
                              <i className="fas fa-check-double"></i>
                            </button>
                            <button onClick={() => {
                              const comment = prompt('Reason for rejection:');
                              if (comment !== null) handleHRAction(app.id, 'reject', comment);
                            }} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition text-sm" title="Reject">
                              <i className="fas fa-times"></i>
                            </button>
                            <button onClick={() => setSelectedLeave(app)} className="text-[#0056A3] hover:bg-[#0056A3]/10 p-1.5 rounded-lg transition text-sm" title="View Details">
                              <i className="fas fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'dg' && (
          <div className="content-card">
            <div className="px-5 py-3 border-b border-[#e2e8f0]">
              <h5 className="font-semibold flex items-center gap-2">
                <i className="fas fa-crown text-red-500"></i> DG Review ({pendingDG.length})
              </h5>
            </div>
            <div className="p-0">
              {pendingDG.length === 0 ? (
                <div className="p-5 text-center text-[#6b7a8a]">
                  <i className="fas fa-check-circle text-3xl text-green-500 mb-2 block"></i>
                  <p>No applications pending Director-General review.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#f4f7fc]">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Reference</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Employee</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Department</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">HR Verified</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      {pendingDG.map((app) => (
                        <tr key={app.id} className="hover:bg-[#f8fafc]">
                          <td className="px-4 py-2 text-sm font-mono font-semibold">{app.reference}</td>
                          <td className="px-4 py-2 text-sm">{app.applicant}</td>
                          <td className="px-4 py-2 text-sm">{app.department}</td>
                          <td className="px-4 py-2 text-sm">{app.type}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className="text-green-600"><i className="fas fa-check-circle mr-1"></i>Verified</span>
                          </td>
                          <td className="px-4 py-2">
                            <button onClick={() => handleDGApproval(app.id, 'approve', 'Approved')} className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition text-sm mr-1" title="Approve">
                              <i className="fas fa-check-double"></i>
                            </button>
                            <button onClick={() => {
                              const comment = prompt('Reason for rejection:');
                              if (comment !== null) handleDGApproval(app.id, 'reject', comment);
                            }} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition text-sm" title="Reject">
                              <i className="fas fa-times"></i>
                            </button>
                            <button onClick={() => setSelectedLeave(app)} className="text-[#0056A3] hover:bg-[#0056A3]/10 p-1.5 rounded-lg transition text-sm" title="View Details">
                              <i className="fas fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="content-card">
            <div className="px-5 py-3 border-b border-[#e2e8f0]">
              <h5 className="font-semibold flex items-center gap-2">
                <i className="fas fa-history text-[#0056A3]"></i> Leave History & Audit Trail
              </h5>
            </div>
            <div className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f4f7fc]">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Reference</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Employee</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Current Stage</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#6b7a8a]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {[...approved, ...rejected].map((app) => (
                      <tr key={app.id} className="hover:bg-[#f8fafc]">
                        <td className="px-4 py-2 text-sm font-mono font-semibold">{app.reference}</td>
                        <td className="px-4 py-2 text-sm">{app.applicant}</td>
                        <td className="px-4 py-2 text-sm">{app.type}</td>
                        <td className="px-4 py-2" dangerouslySetInnerHTML={{ __html: getStatusBadge(app.status) }} />
                        <td className="px-4 py-2 text-sm">{app.currentStage}</td>
                        <td className="px-4 py-2">
                          <button onClick={() => setSelectedLeave(app)} className="text-[#0056A3] hover:bg-[#0056A3]/10 p-1.5 rounded-lg transition text-sm" title="View Details">
                            <i className="fas fa-eye"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Leave Details Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-bold text-xl">
                <i className="fas fa-file-alt text-[#0056A3] mr-2"></i>
                Leave Application Details
              </h5>
              <button onClick={() => setSelectedLeave(null)} className="text-[#6b7a8a] hover:text-[#1a2a3a]">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm"><strong>Reference:</strong> {selectedLeave.reference}</p>
                <p className="text-sm"><strong>Applicant:</strong> {selectedLeave.applicant}</p>
                <p className="text-sm"><strong>Department:</strong> {selectedLeave.department}</p>
                <p className="text-sm"><strong>Type:</strong> {selectedLeave.type}</p>
                <p className="text-sm"><strong>Dates:</strong> {selectedLeave.startDate} - {selectedLeave.endDate}</p>
                <p className="text-sm"><strong>Days:</strong> {selectedLeave.days}</p>
                <p className="text-sm"><strong>Status:</strong> <span dangerouslySetInnerHTML={{ __html: getStatusBadge(selectedLeave.status) }} /></p>
                <p className="text-sm"><strong>Current Stage:</strong> {selectedLeave.currentStage}</p>
              </div>
              <div>
                <p className="text-sm"><strong>Submitted:</strong> {selectedLeave.submittedAt}</p>
                <p className="text-sm"><strong>Last Updated:</strong> {selectedLeave.updatedAt}</p>
                <p className="text-sm"><strong>Reason:</strong> {selectedLeave.reason}</p>
                {selectedLeave.balance && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold">Leave Balance</p>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {Object.entries(selectedLeave.balance).map(([type, days]) => (
                        <div key={type} className="text-center">
                          <span className="text-xs text-[#6b7a8a] capitalize">{type}</span>
                          <span className="block font-bold">{days}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Trail */}
            <div className="border-t border-[#e2e8f0] pt-4">
              <h6 className="font-semibold text-sm mb-3">
                <i className="fas fa-history text-[#0056A3] mr-2"></i>
                Workflow Audit Trail
              </h6>
              <div className="space-y-2">
                {selectedLeave.actions.map((action, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${index === 0 ? 'bg-blue-500' : index === selectedLeave.actions.length - 1 ? 'bg-green-500' : 'bg-gray-500'}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{action.stage}</p>
                      <p className="text-xs text-[#6b7a8a]">
                        Officer: {action.officer} | {action.timestamp}
                      </p>
                      {action.comment && (
                        <p className="text-xs text-gray-600 mt-1">Comment: {action.comment}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            {selectedLeave.notifications && selectedLeave.notifications.length > 0 && (
              <div className="border-t border-[#e2e8f0] pt-4 mt-4">
                <h6 className="font-semibold text-sm mb-3">
                  <i className="fas fa-envelope text-[#0056A3] mr-2"></i>
                  Notification History
                </h6>
                <div className="space-y-1">
                  {selectedLeave.notifications.map((notif, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                      <span>{notif.to}</span>
                      <span className="text-xs text-[#6b7a8a]">{notif.timestamp}</span>
                      <span className={`text-xs font-semibold ${notif.sent ? 'text-green-600' : 'text-red-600'}`}>
                        {notif.sent ? '✓ Sent' : '✗ Failed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end mt-4 pt-4 border-t border-[#e2e8f0]">
              <button onClick={() => setSelectedLeave(null)} className="btn-primary">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-bold text-xl">
                <i className="fas fa-pen text-[#0056A3] mr-2"></i>
                Apply for Leave
              </h5>
              <button onClick={() => setShowApplyForm(false)} className="text-[#6b7a8a] hover:text-[#1a2a3a]">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitLeave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-sm">Leave Type *</label>
                  <select name="leaveType" className="w-full p-2 border rounded-lg mt-1" required>
                    <option value="">Select Type</option>
                    <option>Annual Leave</option>
                    <option>Casual Leave</option>
                    <option>Sick Leave</option>
                    <option>Study Leave</option>
                    <option>Maternity Leave</option>
                    <option>Paternity Leave</option>
                    <option>Compassionate Leave</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-sm">Department</label>
                  <input type="text" className="w-full p-2 border rounded-lg mt-1 bg-gray-50" value={user?.department || 'N/A'} readOnly />
                </div>
                <div>
                  <label className="font-semibold text-sm">Start Date *</label>
                  <input type="date" name="startDate" className="w-full p-2 border rounded-lg mt-1" required />
                </div>
                <div>
                  <label className="font-semibold text-sm">End Date *</label>
                  <input type="date" name="endDate" className="w-full p-2 border rounded-lg mt-1" required />
                </div>
                <div className="md:col-span-2">
                  <label className="font-semibold text-sm">Reason *</label>
                  <textarea name="reason" className="w-full p-2 border rounded-lg mt-1" rows="3" required placeholder="Explain the reason for your leave request..."></textarea>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                <i className="fas fa-info-circle mr-2"></i>
                Your application will follow this workflow:
                <ol className="list-decimal list-inside mt-1 text-xs text-blue-600">
                  <li>Submitted to your Director for review</li>
                  <li>Forwarded to Human Resources for verification</li>
                  <li>Sent to Director-General for final approval</li>
                  <li>You will receive email notifications at each stage</li>
                </ol>
              </div>

              <div className="flex gap-3 pt-4 mt-4 border-t border-[#e2e8f0]">
                <button type="button" onClick={() => setShowApplyForm(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">
                  <i className="fas fa-paper-plane mr-2"></i>Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}