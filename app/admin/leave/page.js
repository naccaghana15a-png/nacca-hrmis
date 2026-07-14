'use client';

import { useState, useEffect } from 'react';

export default function LeavePage() {
  const [user, setUser] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [activeTab, setActiveTab] = useState('apply');
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
  const handleSubmitLeave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const leaveData = {
      id: Date.now(),
      reference: `NAC-LV-2026-${String(leaveApplications.length + 1).padStart(4, '0')}`,
      applicant: user?.name || 'Staff Member',
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
        { stage: 'Submitted', officer: user?.name || 'Staff Member', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), comment: 'Leave application submitted' }
      ],
      notifications: [],
      workflow: {
        current: 'director_review',
        history: [
          { stage: 'submitted', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), officer: user?.name || 'Staff Member' }
        ]
      },
      balance: leaveBalance
    };

    // Send email notifications
    const director = staffData.directors.find(d => d.department === leaveData.department);
    if (director) {
      sendEmailNotification(
        director.email,
        `Leave Application ${leaveData.reference} - Action Required`,
        `Dear ${director.name},\n\nA leave application has been submitted by ${leaveData.applicant} from the ${leaveData.department} department.\n\nDetails:\n- Type: ${leaveData.type}\n- Dates: ${leaveData.startDate} to ${leaveData.endDate}\n- Days: ${leaveData.days}\n- Reason: ${leaveData.reason}\n\nPlease review and forward to HR.\n\nRegards,\nNaCCA HRMIS System`
      );
    }

    // Send confirmation to applicant
    sendEmailNotification(
      user?.email || 'staff@nacca.gov.gh',
      `Leave Application ${leaveData.reference} - Submitted Successfully`,
      `Dear ${leaveData.applicant},\n\nYour leave application has been submitted and is pending approval.\n\nApplication Details:\n- Reference: ${leaveData.reference}\n- Type: ${leaveData.type}\n- Dates: ${leaveData.startDate} to ${leaveData.endDate}\n- Days: ${leaveData.days}\n\nYou will be notified when the application is reviewed.\n\nRegards,\nNaCCA HRMIS System`
    );

    setLeaveApplications([leaveData, ...leaveApplications]);
    setShowApplyForm(false);
    alert('✅ Leave application submitted! Notifications sent to your Director and HR.');
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
      // Forward to HR
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

      // Send HR notification
      const hrDirector = staffData.directors.find(d => d.department === 'Human Resource');
      if (hrDirector) {
        sendEmailNotification(
          hrDirector.email,
          `Leave Application ${application.reference} - HR Review Required`,
          `Dear ${hrDirector.name},\n\nA leave application has been forwarded for HR review.\n\nEmployee: ${application.applicant}\nDepartment: ${application.department}\nType: ${application.type}\nDates: ${application.startDate} to ${application.endDate}\n\nPlease verify leave balances and forward to DG.\n\nRegards,\nNaCCA HRMIS System`
        );
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

      // Send rejection notification
      sendEmailNotification(
        application.email || 'staff@nacca.gov.gh',
        `Leave Application ${application.reference} - Update`,
        `Dear ${application.applicant},\n\nYour leave application has been reviewed.\n\nStatus: Rejected\nReason: ${comment || 'Please contact HR for more details.'}\n\nRegards,\nNaCCA HRMIS System`
      );

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

  const pendingDirector = leaveApplications.filter(l => l.status === 'pending_director' || l.status === 'director_review');
  const pendingHR = leaveApplications.filter(l => l.status === 'hr_review');
  const pendingDG = leaveApplications.filter(l => l.status === 'pending_dg');
  const approved = leaveApplications.filter(l => l.status === 'approved');
  const rejected = leaveApplications.filter(l => l.status === 'rejected');

  // Check user role for workflow actions
  const isDirector = user?.role === 'DIRECTOR' || user?.role === 'SUPER_ADMIN';
  const isHR = user?.department === 'Human Resource' || user?.role === 'SUPER_ADMIN';
  const isDG = user?.role === 'DIRECTOR_GENERAL' || user?.role === 'SUPER_ADMIN';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#e2e8f0] border-t-[#0056A3] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#6b7a8a]">Loading...</p>
        </div>
      </div>
    );
  }

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
            {user?.department ? `${user.department} Department` : 'NaCCA'} Leave Approval Workflow
          </p>
        </div>
        <button onClick={() => setShowApplyForm(true)} className="btn-primary">
          <i className="fas fa-plus mr-2"></i>Apply for Leave
        </button>
      </div>

      {/* ... rest of your existing code ... */}
    </div>
  );
}