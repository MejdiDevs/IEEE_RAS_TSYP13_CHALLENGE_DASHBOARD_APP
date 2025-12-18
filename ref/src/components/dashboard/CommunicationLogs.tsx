import { motion } from "framer-motion";
import { MessageSquare, Radio, AlertTriangle, CheckCircle } from "lucide-react";

// Mock communication events
const commEvents = [
  {
    id: 1,
    type: "mesh_message",
    simTime: 1245.32,
    from: "UAV-001",
    to: "UAV-003",
    messageType: "FORWARD_ANNOUNCEMENT",
    status: "success",
  },
  {
    id: 2,
    type: "vehicle_status",
    simTime: 1245.45,
    agent: "UAV-002",
    battery: 62,
    status: "active",
  },
  {
    id: 3,
    type: "mesh_message",
    simTime: 1245.78,
    from: "UAV-005",
    to: "BROADCAST",
    messageType: "WINNER_DECISION",
    status: "success",
  },
  {
    id: 4,
    type: "vehicle_status",
    simTime: 1246.01,
    agent: "UAV-003",
    battery: 23,
    status: "charging",
  },
  {
    id: 5,
    type: "mesh_message",
    simTime: 1246.34,
    from: "UAV-004",
    to: "UAV-001",
    messageType: "FORWARD_ANNOUNCEMENT",
    status: "failed",
  },
  {
    id: 6,
    type: "vehicle_status",
    simTime: 1246.89,
    agent: "UAV-001",
    battery: 85,
    status: "active",
  },
];

const getEventIcon = (event: typeof commEvents[0]) => {
  if (event.type === "mesh_message") {
    return <MessageSquare className="w-4 h-4" />;
  }
  return <Radio className="w-4 h-4" />;
};

const getStatusIcon = (event: typeof commEvents[0]) => {
  if (event.type === "mesh_message" && "status" in event) {
    if (event.status === "failed") {
      return <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
    }
    return <CheckCircle className="w-3.5 h-3.5 text-green-400" />;
  }
  return null;
};

export const CommunicationLogs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass rounded-xl"
    >
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-orbitron text-lg font-bold">Communication Logs</h3>
            <p className="font-inter text-sm text-muted-foreground">
              Real-time mesh network activity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-inter text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2 max-h-[350px] overflow-y-auto font-mono text-sm">
        {commEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <div className="p-1.5 rounded bg-purple-primary/20 text-purple-light mt-0.5">
              {getEventIcon(event)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-muted-foreground">[{event.simTime.toFixed(2)}s]</span>
                {event.type === "mesh_message" ? (
                  <>
                    <span className="text-blue-light">{event.from}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-accent">{event.to}</span>
                    <span className="text-purple-light text-xs px-1.5 py-0.5 rounded bg-purple-primary/20">
                      {event.messageType}
                    </span>
                    {getStatusIcon(event)}
                  </>
                ) : (
                  <>
                    <span className="text-blue-light">{event.agent}</span>
                    <span className="text-muted-foreground">status:</span>
                    <span className={event.status === "active" ? "text-green-400" : "text-accent"}>
                      {event.status}
                    </span>
                    <span className="text-muted-foreground">bat: {event.battery}%</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
