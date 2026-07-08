import React, { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const PAYMENT_STATUS = {
  ADVANCE_PENDING: "Advance Pending",
  ADVANCE_RECEIVED: "Advance Received",
  PARTIALLY_PAID: "Partially Paid",
  PAID_IN_FULL: "Paid in Full",
  OVERDUE: "Overdue",
};

export const PAYMENT_TYPE = {
  ADVANCE: "Advance",
  MILESTONE: "Milestone",
  FINAL: "Final",
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([
    {
      id: "proj-1",
      name: "Acme Website Redesign",
      client: "Acme Corp",
      clientEmail: "acme-client@example.com",
      status: "In Progress",
      budget: 4500,
      advanceAccepted: true,
      advanceType: "percentage",
      advanceValue: 20,
      advanceAmount: 900,
      advanceReceivedAmount: 900,
      totalPaid: 900,
      paymentStatus: PAYMENT_STATUS.ADVANCE_RECEIVED,
      progress: 65,
      dueDate: "2026-07-15",
      payments: [
        { id: "pay-1", type: PAYMENT_TYPE.ADVANCE, amount: 900, date: "2026-06-10" }
      ],
    },
    {
      id: "proj-2",
      name: "Mobile App API Integration",
      client: "Stark Industries",
      clientEmail: "stark-client@example.com",
      status: "In Progress",
      budget: 6200,
      advanceAccepted: true,
      advanceType: "fixed",
      advanceValue: 1500,
      advanceAmount: 1500,
      advanceReceivedAmount: 0,
      totalPaid: 0,
      paymentStatus: PAYMENT_STATUS.ADVANCE_PENDING,
      progress: 40,
      dueDate: "2026-07-30",
      payments: [],
    },
    {
      id: "proj-3",
      name: "Brand Identity & Guidelines",
      client: "Wayne Enterprises",
      clientEmail: "wayne-client@example.com",
      status: "In Review",
      budget: 2800,
      advanceAccepted: false,
      advanceType: "percentage",
      advanceValue: 0,
      advanceAmount: 0,
      advanceReceivedAmount: 0,
      totalPaid: 1400,
      paymentStatus: PAYMENT_STATUS.PARTIALLY_PAID,
      progress: 95,
      dueDate: "2026-06-28",
      payments: [
        { id: "pay-2", type: PAYMENT_TYPE.MILESTONE, amount: 1400, date: "2026-06-20" }
      ],
    },
  ]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setProjects(prev => prev.map(proj => {
      if (proj.paymentStatus !== PAYMENT_STATUS.PAID_IN_FULL && proj.dueDate < today && proj.paymentStatus !== PAYMENT_STATUS.OVERDUE) {
        return { ...proj, paymentStatus: PAYMENT_STATUS.OVERDUE };
      }
      return proj;
    }));
  }, []);

  const calculateStatus = (proj, totalPaid, advanceReceived) => {
    if (totalPaid >= proj.budget) return PAYMENT_STATUS.PAID_IN_FULL;
    
    const today = new Date().toISOString().split('T')[0];
    if (proj.dueDate < today) return PAYMENT_STATUS.OVERDUE;

    if (proj.advanceAccepted) {
      if (advanceReceived >= proj.advanceAmount) {
        return totalPaid > advanceReceived ? PAYMENT_STATUS.PARTIALLY_PAID : PAYMENT_STATUS.ADVANCE_RECEIVED;
      }
      return PAYMENT_STATUS.ADVANCE_PENDING;
    }
    
    return totalPaid > 0 ? PAYMENT_STATUS.PARTIALLY_PAID : PAYMENT_STATUS.PARTIALLY_PAID; // Default for non-advance
  };

  const addProject = (projectData) => {
    const newProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
      advanceReceivedAmount: 0,
      totalPaid: 0,
      payments: [],
      progress: 0,
    };
    newProject.paymentStatus = calculateStatus(newProject, 0, 0);
    setProjects([...projects, newProject]);
  };

  const recordPayment = (projectId, paymentData) => {
    setProjects(prevProjects => prevProjects.map(proj => {
      if (proj.id === projectId) {
        const newPayment = {
          ...paymentData,
          id: `pay-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
        };
        
        const updatedPayments = [...proj.payments, newPayment];
        const newTotalPaid = proj.totalPaid + paymentData.amount;
        let newAdvanceReceived = proj.advanceReceivedAmount;
        if (paymentData.type === PAYMENT_TYPE.ADVANCE) {
          newAdvanceReceived += paymentData.amount;
        }

        return {
          ...proj,
          payments: updatedPayments,
          totalPaid: newTotalPaid,
          advanceReceivedAmount: newAdvanceReceived,
          paymentStatus: calculateStatus(proj, newTotalPaid, newAdvanceReceived),
        };
      }
      return proj;
    }));
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, recordPayment }}>
      {children}
    </ProjectContext.Provider>
  );
};
