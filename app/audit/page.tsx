import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Download, Eye, AlertTriangle, CheckCircle, Clock, User } from "lucide-react"

const auditLogs = [
  {
    id: "AL001",
    timestamp: "2024-01-15 14:30:22",
    action: "Tender Created",
    entity: "TND-2024-001",
    user: "John Smith (Procuring Officer)",
    details: "New tender for IT Infrastructure created",
    blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
    severity: "info",
    ipAddress: "192.168.1.100",
  },
  {
    id: "AL002",
    timestamp: "2024-01-15 15:45:10",
    action: "Bid Submitted",
    entity: "BID-2024-001",
    user: "TechCorp Ltd (Vendor)",
    details: "Bid submitted for tender TND-2024-001",
    blockchainHash: "0x2b3c4d5e6f7890abcdef1234567890ab",
    severity: "info",
    ipAddress: "203.45.67.89",
  },
  {
    id: "AL003",
    timestamp: "2024-01-15 16:20:33",
    action: "Evaluation Started",
    entity: "TND-2024-001",
    user: "Sarah Johnson (Evaluation Committee)",
    details: "Bid evaluation process initiated",
    blockchainHash: "0x3c4d5e6f7890abcdef1234567890abcd",
    severity: "info",
    ipAddress: "192.168.1.101",
  },
  {
    id: "AL004",
    timestamp: "2024-01-15 17:10:15",
    action: "Anomaly Detected",
    entity: "BID-2024-002",
    user: "System",
    details: "Unusual bid pattern detected - price significantly below market rate",
    blockchainHash: "0x4d5e6f7890abcdef1234567890abcdef",
    severity: "warning",
    ipAddress: "System",
  },
  {
    id: "AL005",
    timestamp: "2024-01-15 18:30:45",
    action: "Contract Awarded",
    entity: "CNT-2024-001",
    user: "Michael Brown (Procurement Head)",
    details: "Contract awarded to TechCorp Ltd for $125,000",
    blockchainHash: "0x5e6f7890abcdef1234567890abcdef12",
    severity: "success",
    ipAddress: "192.168.1.102",
  },
]

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />
    case "success":
      return <CheckCircle className="h-4 w-4 text-emerald-500" />
    case "info":
    default:
      return <Clock className="h-4 w-4 text-blue-500" />
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "warning":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "success":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "info":
    default:
      return "bg-blue-50 text-blue-700 border-blue-200"
  }
}

export default function AuditPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Audit Trail</h1>
          <p className="text-slate-600 mt-2">Complete blockchain-verified audit log of all system activities</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input placeholder="Search logs..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="tender">Tender Actions</SelectItem>
                <SelectItem value="bid">Bid Actions</SelectItem>
                <SelectItem value="contract">Contract Actions</SelectItem>
                <SelectItem value="system">System Actions</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <div className="space-y-4">
        {auditLogs.map((log) => (
          <Card key={log.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex items-center gap-2">{getSeverityIcon(log.severity)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-slate-900">{log.action}</h3>
                      <Badge variant="outline" className={getSeverityColor(log.severity)}>
                        {log.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="secondary">{log.entity}</Badge>
                    </div>
                    <p className="text-slate-600">{log.details}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.user}
                      </div>
                      <div>{log.timestamp}</div>
                      <div>IP: {log.ipAddress}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Blockchain Hash</p>
                          <code className="text-xs font-mono text-slate-700">{log.blockchainHash}</code>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Eye className="h-3 w-3" />
                          Verify
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center">
        <Button variant="outline">Load More Logs</Button>
      </div>
    </div>
  )
}
