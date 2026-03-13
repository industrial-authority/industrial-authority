import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle, Clock, Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedAuditId, setSelectedAuditId] = useState<number | null>(null);
  const [findings, setFindings] = useState("");
  const [recommendations, setRecommendations] = useState("");

  const auditsQuery = trpc.audits.getAll.useQuery();
  const updateStatusMutation = trpc.audits.updateStatus.useMutation();
  const completeMutation = trpc.audits.complete.useMutation();

  // Redirect if not admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="border-destructive/30 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">You don't have permission to access the admin dashboard.</p>
            <Button onClick={() => setLocation("/")} className="w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedAudit = auditsQuery.data?.find((a) => a.id === selectedAuditId);

  const handleStatusUpdate = async (auditId: number, status: "pending" | "in_progress" | "completed" | "delivered") => {
    try {
      await updateStatusMutation.mutateAsync({ id: auditId, status });
      auditsQuery.refetch();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCompleteAudit = async () => {
    if (!selectedAuditId || !findings || !recommendations) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await completeMutation.mutateAsync({
        id: selectedAuditId,
        findings,
        recommendations,
      });
      setFindings("");
      setRecommendations("");
      setSelectedAuditId(null);
      auditsQuery.refetch();
    } catch (error) {
      console.error("Error completing audit:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case "in_progress":
        return "bg-blue-500/20 text-blue-700 border-blue-500/30";
      case "completed":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      case "delivered":
        return "bg-accent/20 text-accent border-accent/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "in_progress":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.name || "Admin"}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              logout();
              setLocation("/");
            }}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Audits List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Audit Requests</CardTitle>
                <CardDescription>Manage all incoming audit requests</CardDescription>
              </CardHeader>
              <CardContent>
                {auditsQuery.isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                  </div>
                ) : auditsQuery.data?.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No audit requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {auditsQuery.data?.map((audit) => (
                      <div
                        key={audit.id}
                        onClick={() => setSelectedAuditId(audit.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedAuditId === audit.id
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent/50 hover:bg-card"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{audit.companyName}</h3>
                            <p className="text-sm text-muted-foreground">{audit.companyEmail}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1 ${getStatusColor(audit.status)}`}>
                            {getStatusIcon(audit.status)}
                            {audit.status.replace(/_/g, " ").toUpperCase()}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{audit.industry || "Not specified"}</span>
                          <span className="font-semibold text-accent">
                            {audit.auditType === "basic"
                              ? "$250"
                              : audit.auditType === "authority_engine"
                              ? "$5,000"
                              : "$2,500/mo"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Audit Details & Actions */}
          <div>
            {selectedAudit ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Audit Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Company</Label>
                    <p className="font-semibold">{selectedAudit.companyName}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="text-sm break-all">{selectedAudit.companyEmail}</p>
                  </div>

                  {selectedAudit.companyPhone && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      <p className="text-sm">{selectedAudit.companyPhone}</p>
                    </div>
                  )}

                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Select
                      value={selectedAudit.status}
                      onValueChange={(value) =>
                        handleStatusUpdate(
                          selectedAudit.id,
                          value as "pending" | "in_progress" | "completed" | "delivered"
                        )
                      }
                    >
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedAudit.status !== "delivered" && (
                    <>
                      <div>
                        <Label htmlFor="findings">Findings</Label>
                        <Textarea
                          id="findings"
                          value={findings}
                          onChange={(e) => setFindings(e.target.value)}
                          placeholder="Enter audit findings..."
                          className="bg-input border-border mt-2"
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label htmlFor="recommendations">Recommendations</Label>
                        <Textarea
                          id="recommendations"
                          value={recommendations}
                          onChange={(e) => setRecommendations(e.target.value)}
                          placeholder="Enter recommendations..."
                          className="bg-input border-border mt-2"
                          rows={4}
                        />
                      </div>

                      <Button
                        onClick={handleCompleteAudit}
                        disabled={completeMutation.isPending || !findings || !recommendations}
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        {completeMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Complete & Send Report"
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground text-sm">Select an audit to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
