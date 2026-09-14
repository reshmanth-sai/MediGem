"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PRESET_CASES, ClinicalCaseData } from "@/lib/casesData";
import { QuickReferralModal } from "@/components/history/QuickReferralModal";
import {
  ArrowRightLeft,
  Ambulance,
  Building2,
  Phone,
  Clock,
  Printer,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Activity,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  Search,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransferRecord {
  id: string;
  patientCaseId: string;
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  village: string;
  primaryDiagnosis: string;
  priority: "STAT" | "HIGH" | "URGENT";
  destinationHospital: string;
  department: string;
  transportMode: string;
  ambulanceNumber?: string;
  driverContact?: string;
  escortWorker: string;
  status: "IN_TRANSIT" | "DISPATCHED" | "ACCEPTED" | "AWAITING_TRANSPORT";
  dispatchTime: string;
  eta: string;
  preTransferMeds: string[];
  vitalsAtDispatch: string;
  receivingPhysician: string;
}

const INITIAL_TRANSFERS: TransferRecord[] = [
  {
    id: "TR-2025-019",
    patientCaseId: "DEMO-ACUTE-CARDIAC",
    patientName: "Sunita Devi",
    patientId: "PID-2025-0019",
    age: 62,
    gender: "Female",
    village: "Sundarpur Sub-Center",
    primaryDiagnosis: "Acute Coronary Syndrome (Possible STEMI)",
    priority: "STAT",
    destinationHospital: "District Hospital, Gorakhpur",
    department: "Emergency Cardiology & ICU",
    transportMode: "108 Advanced Life Support (ALS) Ambulance",
    ambulanceNumber: "UP-53-G-1082",
    driverContact: "+91 98765-43210 (Driver Manoj)",
    escortWorker: "Rajesh Singh (ANM)",
    status: "IN_TRANSIT",
    dispatchTime: "10:15 AM",
    eta: "18 mins (En route via NH-28)",
    preTransferMeds: ["Aspirin 325mg non-enteric chewed STAT", "O2 @ 4L/min via mask", "IV Normal Saline patent"],
    vitalsAtDispatch: "BP 165/102 mmHg · HR 115 bpm · SpO2 92%",
    receivingPhysician: "Dr. K. Sharma (CMO Emergency)",
  },
  {
    id: "TR-2025-021",
    patientCaseId: "DEMO-SNAKEBITE",
    patientName: "Rajesh Verma",
    patientId: "PID-2025-0088",
    age: 38,
    gender: "Male",
    village: "Rampur Sub-Center",
    primaryDiagnosis: "Suspected Viper Envenomation with 20WBCT Failure",
    priority: "STAT",
    destinationHospital: "District Hospital, Gorakhpur",
    department: "Toxicology & Intensive Care",
    transportMode: "108 Basic Life Support (BLS) Ambulance",
    ambulanceNumber: "UP-53-G-1044",
    driverContact: "+91 94521-77890 (Driver Suresh)",
    escortWorker: "Priya Sharma (ANM)",
    status: "DISPATCHED",
    dispatchTime: "10:28 AM",
    eta: "25 mins (Ambulance arrived at Sub-Center)",
    preTransferMeds: ["Limb immobilized at heart level", "No tourniquet applied", "ASV 10 vials prepped"],
    vitalsAtDispatch: "BP 118/76 mmHg · HR 104 bpm · 20WBCT Non-Clotting",
    receivingPhysician: "Dr. A. Verma (On-Call Toxicologist)",
  },
  {
    id: "TR-2025-014",
    patientCaseId: "CASE-8901",
    patientName: "Lakshmi Ammal",
    patientId: "PID-2025-0042",
    age: 62,
    gender: "Female",
    village: "Kovilpatti",
    primaryDiagnosis: "Stage 2 Essential Hypertension with Refractory Cephalea",
    priority: "URGENT",
    destinationHospital: "Community Health Center (CHC) Deoria",
    department: "Internal Medicine OPD",
    transportMode: "Facilitated Sub-Center Vehicle",
    escortWorker: "ASHA Shanti Devi",
    status: "ACCEPTED",
    dispatchTime: "09:45 AM",
    eta: "Arrived & Registered at CHC",
    preTransferMeds: ["Amlodipine 5mg reviewed", "BP counseling documented"],
    vitalsAtDispatch: "BP 150/90 mmHg · HR 88 bpm · SpO2 96%",
    receivingPhysician: "Dr. Vikram Patel (Medical Officer)",
  },
  {
    id: "TR-2025-011",
    patientCaseId: "DEMO-WOUND",
    patientName: "Fatima Begum",
    patientId: "PID-2025-0063",
    age: 48,
    gender: "Female",
    village: "Gauri Bazar",
    primaryDiagnosis: "Post-Operative Surgical Site Cellulitis with Pyrexia",
    priority: "HIGH",
    destinationHospital: "District Hospital, Gorakhpur",
    department: "General Surgery Unit 2",
    transportMode: "Patient Family Vehicle with PHC Referral Slip",
    escortWorker: "Priya Sharma (ANM)",
    status: "AWAITING_TRANSPORT",
    dispatchTime: "Pending",
    eta: "Vehicle scheduled 11:15 AM",
    preTransferMeds: ["Wound swab taken", "Sterile dry dressing applied", "Paracetamol 650mg given"],
    vitalsAtDispatch: "BP 132/88 mmHg · Temp 38.6°C · Pulse 98 bpm",
    receivingPhysician: "Dr. N. Roy (Consultant Surgeon)",
  },
];

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<TransferRecord[]>(INITIAL_TRANSFERS);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRecord>(INITIAL_TRANSFERS[0]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [referralModalPatient, setReferralModalPatient] = useState<ClinicalCaseData | null>(null);

  const filteredTransfers = transfers.filter((t) => {
    const matchesQuery =
      t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destinationHospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.primaryDiagnosis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "ALL" ||
      (filterStatus === "STAT" && t.priority === "STAT") ||
      (filterStatus === "IN_TRANSIT" && (t.status === "IN_TRANSIT" || t.status === "DISPATCHED")) ||
      (filterStatus === "ACCEPTED" && t.status === "ACCEPTED") ||
      (filterStatus === "AWAITING" && t.status === "AWAITING_TRANSPORT");

    return matchesQuery && matchesFilter;
  });

  const handleOpenPrintMemo = (transfer: TransferRecord) => {
    const matchedCase = PRESET_CASES[transfer.patientCaseId] || PRESET_CASES["CASE-8901"];
    setReferralModalPatient(matchedCase);
  };

  const handleUpdateStatus = (transferId: string, newStatus: TransferRecord["status"]) => {
    setTransfers((prev) =>
      prev.map((t) => (t.id === transferId ? { ...t, status: newStatus } : t))
    );
    if (selectedTransfer.id === transferId) {
      setSelectedTransfer((prev) => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <AppShell>
      <div className="max-w-[1600px] mx-auto space-y-4 pb-16">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rule pb-3.5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                <ArrowRightLeft className="h-4 w-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
                Referral Transfers Workstation
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-body-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                {transfers.length} Active Transfers
              </span>
            </div>
            <p className="text-body-sm text-ink-muted mt-1">
              Active inter-facility escalations, 108 ambulance dispatches, and emergency hospital handovers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenPrintMemo(selectedTransfer)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rule bg-surface text-body-sm font-medium text-ink hover:bg-surface-raised transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-ink-muted" />
              <span>Print Transfer Manifest</span>
            </button>
            <Link
              href="/history"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-action hover:bg-action-hover text-on-action text-body-sm font-semibold transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Referral from Queue</span>
            </Link>
          </div>
        </div>

        {/* Operational Statistics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-rule bg-surface space-y-1">
            <div className="flex items-center justify-between text-body-sm text-ink-muted font-medium">
              <span>STAT Emergencies</span>
              <ShieldAlert className="h-4 w-4 text-risk-emergency" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-risk-emergency">
              {transfers.filter((t) => t.priority === "STAT").length}
            </div>
            <p className="text-body-sm text-ink-muted">Immediate ICU/Cath escalation</p>
          </div>

          <div className="p-3.5 rounded-xl border border-rule bg-surface space-y-1">
            <div className="flex items-center justify-between text-body-sm text-ink-muted font-medium">
              <span>108 Ambulance En Route</span>
              <Ambulance className="h-4 w-4 text-action" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-ink">
              {transfers.filter((t) => t.status === "IN_TRANSIT" || t.status === "DISPATCHED").length}
            </div>
            <p className="text-body-sm text-emerald-600 font-medium">Avg transit time: 24 mins</p>
          </div>

          <div className="p-3.5 rounded-xl border border-rule bg-surface space-y-1">
            <div className="flex items-center justify-between text-body-sm text-ink-muted font-medium">
              <span>Accepted at Tertiary</span>
              <Building2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">
              {transfers.filter((t) => t.status === "ACCEPTED").length}
            </div>
            <p className="text-body-sm text-ink-muted">District Hospital Gorakhpur</p>
          </div>

          <div className="p-3.5 rounded-xl border border-rule bg-surface space-y-1">
            <div className="flex items-center justify-between text-body-sm text-ink-muted font-medium">
              <span>Awaiting Transport</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-amber-600">
              {transfers.filter((t) => t.status === "AWAITING_TRANSPORT").length}
            </div>
            <p className="text-body-sm text-ink-muted">Scheduled for morning departure</p>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2.5 rounded-xl border border-rule bg-surface">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "ALL", label: "All Transfers", count: transfers.length },
              { id: "STAT", label: "STAT Emergency", count: transfers.filter((t) => t.priority === "STAT").length },
              { id: "IN_TRANSIT", label: "En Route / Dispatched", count: transfers.filter((t) => t.status === "IN_TRANSIT" || t.status === "DISPATCHED").length },
              { id: "ACCEPTED", label: "Accepted", count: transfers.filter((t) => t.status === "ACCEPTED").length },
              { id: "AWAITING", label: "Awaiting", count: transfers.filter((t) => t.status === "AWAITING_TRANSPORT").length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-body-sm font-semibold transition-colors whitespace-nowrap inline-flex items-center gap-1.5",
                  filterStatus === tab.id
                    ? "bg-action text-on-action"
                    : "text-ink-muted hover:text-ink hover:bg-surface-raised"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-body-sm",
                    filterStatus === tab.id ? "bg-on-action/20 text-on-action" : "bg-rule/60 text-ink-muted"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
            <input
              type="text"
              placeholder="Search patient, hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-body-sm bg-surface-sunken border border-rule rounded-lg text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-action"
            />
          </div>
        </div>

        {/* Master-Detail Split Workstation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Transfer List Table */}
          <div className="lg:col-span-7 space-y-3">
            <div className="border border-rule rounded-xl bg-surface overflow-hidden">
              <div className="divide-y divide-rule">
                {filteredTransfers.length === 0 ? (
                  <div className="p-8 text-center text-ink-muted text-body-sm">
                    No active transfers match your current filter.
                  </div>
                ) : (
                  filteredTransfers.map((t) => {
                    const isSelected = selectedTransfer.id === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTransfer(t)}
                        className={cn(
                          "p-4 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                          isSelected ? "bg-selected" : "hover:bg-surface-raised"
                        )}
                      >
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-ink">{t.patientName}</span>
                            <span className="text-body-sm text-ink-muted">
                              {t.age}y / {t.gender.charAt(0)} · {t.patientId}
                            </span>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-body-sm font-bold uppercase tracking-wider",
                                t.priority === "STAT"
                                  ? "bg-red-100 text-red-700 border border-red-200"
                                  : t.priority === "HIGH"
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : "bg-blue-100 text-blue-700 border border-blue-200"
                              )}
                            >
                              {t.priority}
                            </span>
                          </div>

                          <p className="text-body-sm text-ink font-medium truncate">
                            {t.primaryDiagnosis}
                          </p>

                          <div className="flex items-center gap-3 text-body-sm text-ink-muted flex-wrap">
                            <span className="inline-flex items-center gap-1">
                              <Building2 className="h-3 w-3 text-action shrink-0" />
                              <strong className="text-ink">{t.destinationHospital}</strong>
                            </span>
                            <span>·</span>
                            <span className="inline-flex items-center gap-1">
                              <Ambulance className="h-3 w-3 text-ink-muted shrink-0" />
                              <span>{t.transportMode}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1.5 shrink-0">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-md text-body-sm font-semibold inline-flex items-center gap-1",
                              t.status === "IN_TRANSIT"
                                ? "bg-risk-moderate-subtle text-risk-moderate border border-risk-moderate-border animate-pulse"
                                : t.status === "DISPATCHED"
                                ? "bg-action-subtle text-action border border-action/20"
                                : t.status === "ACCEPTED"
                                ? "bg-risk-low-subtle text-risk-low border border-risk-low-border"
                                : "bg-surface-sunken text-ink-muted border border-rule"
                            )}
                          >
                            {t.status === "IN_TRANSIT" && "In transit"}
                            {t.status === "DISPATCHED" && "Dispatched"}
                            {t.status === "ACCEPTED" && "Accepted"}
                            {t.status === "AWAITING_TRANSPORT" && "⏳ Awaiting"}
                          </span>
                          <span className="text-body-sm font-medium text-ink-muted">
                            {t.eta}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Transfer Detail & Handover Protocol Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="border border-rule rounded-xl bg-surface p-4 sm:p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-rule pb-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm font-mono font-semibold text-action">
                      {selectedTransfer.id}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-body-sm font-bold uppercase",
                        selectedTransfer.priority === "STAT"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      )}
                    >
                      {selectedTransfer.priority} Transfer
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-ink mt-1">
                    {selectedTransfer.patientName}
                  </h3>
                  <p className="text-body-sm text-ink-muted">
                    {selectedTransfer.age}y / {selectedTransfer.gender} · {selectedTransfer.village}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenPrintMemo(selectedTransfer)}
                    className="p-1.5 rounded-lg border border-rule hover:bg-surface-raised text-ink transition-colors"
                    title="Print Referral Memorandum"
                  >
                    <Printer className="h-4 w-4 text-ink-muted" />
                  </button>
                  <Link
                    href={`/results/${selectedTransfer.patientCaseId}`}
                    className="p-1.5 rounded-lg border border-rule hover:bg-surface-raised text-action transition-colors"
                    title="Open Case Clinical View"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Destination Facility & Department */}
              <div className="p-3 rounded-lg border border-rule bg-surface-raised/40 space-y-2">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="font-semibold text-ink-muted uppercase tracking-wider text-body-sm">
                    Receiving Facility
                  </span>
                  <span className="text-body-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Bed Allocated
                  </span>
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-ink">
                    {selectedTransfer.destinationHospital}
                  </div>
                  <div className="text-body-sm text-ink-muted">
                    {selectedTransfer.department} · {selectedTransfer.receivingPhysician}
                  </div>
                </div>
              </div>

              {/* Pre-Departure Stabilization Checklist */}
              <div className="space-y-2">
                <span className="text-body-sm font-semibold text-ink uppercase tracking-wider block">
                  Pre-Departure Stabilization Administered
                </span>
                <div className="space-y-1.5">
                  {selectedTransfer.preTransferMeds.map((med, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-md bg-surface-raised border border-rule text-body-sm text-ink flex items-center gap-2"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-risk-low shrink-0" />
                      <span>{med}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transit & Escort Logistics */}
              <div className="grid grid-cols-2 gap-2 text-body-sm">
                <div className="p-2.5 rounded-lg border border-rule bg-surface-raised/30 space-y-0.5">
                  <span className="text-body-sm text-ink-muted font-semibold uppercase block">
                    Transport Vehicle
                  </span>
                  <p className="font-bold text-ink truncate">{selectedTransfer.transportMode}</p>
                  {selectedTransfer.ambulanceNumber && (
                    <p className="text-body-sm font-mono text-action font-semibold">
                      {selectedTransfer.ambulanceNumber}
                    </p>
                  )}
                </div>

                <div className="p-2.5 rounded-lg border border-rule bg-surface-raised/30 space-y-0.5">
                  <span className="text-body-sm text-ink-muted font-semibold uppercase block">
                    Assigned Escort
                  </span>
                  <p className="font-bold text-ink truncate">{selectedTransfer.escortWorker}</p>
                  <p className="text-body-sm text-ink-muted">Rampur Sub-Center Staff</p>
                </div>
              </div>

              {/* Vitals at Dispatch */}
              <div className="p-2.5 rounded-lg border border-rule bg-surface-raised/30 text-body-sm flex items-center justify-between">
                <span className="text-ink-muted font-medium">Vitals at Handover:</span>
                <span className="font-mono font-bold text-ink">{selectedTransfer.vitalsAtDispatch}</span>
              </div>

              {/* Handover Status Update Controls */}
              <div className="pt-2 border-t border-rule space-y-2">
                <span className="text-body-sm font-semibold text-ink-muted uppercase tracking-wider block">
                  Update Inter-Facility Status
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedTransfer.id, "IN_TRANSIT")}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg border text-body-sm font-semibold transition-all",
                      selectedTransfer.status === "IN_TRANSIT"
                        ? "bg-risk-moderate text-on-action border-risk-moderate"
                        : "border-rule hover:bg-hover text-ink"
                    )}
                  >
                    In Transit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedTransfer.id, "ACCEPTED")}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg border text-body-sm font-semibold transition-all",
                      selectedTransfer.status === "ACCEPTED"
                        ? "bg-risk-low text-on-action border-risk-low"
                        : "border-rule hover:bg-hover text-ink"
                    )}
                  >
                    Handed Over
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedTransfer.id, "AWAITING_TRANSPORT")}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg border text-body-sm font-semibold transition-all",
                      selectedTransfer.status === "AWAITING_TRANSPORT"
                        ? "bg-action text-on-action border-action"
                        : "border-rule hover:bg-hover text-ink"
                    )}
                  >
                    Awaiting
                  </button>
                </div>
              </div>

              {/* Print Memorandum Button */}
              <button
                type="button"
                onClick={() => handleOpenPrintMemo(selectedTransfer)}
                className="w-full py-2.5 bg-action hover:bg-action-hover text-on-action font-semibold text-body-sm rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>Open & Print Official Clinical Memorandum</span>
              </button>
            </div>
          </div>
        </div>

        {/* Clinical Referral Memorandum Modal */}
        <QuickReferralModal
          isOpen={!!referralModalPatient}
          onClose={() => setReferralModalPatient(null)}
          patient={referralModalPatient}
        />
      </div>
    </AppShell>
  );
}
