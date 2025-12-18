import { motion } from "framer-motion";
import { MessageSquare, Radio, AlertTriangle, CheckCircle } from "lucide-react";
import { useData } from "@/contexts/DataContext";

const getEventIcon = (event: any) => {
  if (event.type === "mesh_message") {
    return <MessageSquare className="w-4 h-4" />;
  }
  return <Radio className="w-4 h-4" />;
};

const getStatusIcon = (event: any) => {
  if (event.type === "mesh_message" && "status" in event) {
    if (event.status === "failed") {
      return <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
    }
    return <CheckCircle className="w-3.5 h-3.5 text-green-400" />;
  }
  return null;
};

interface CommunicationLogsProps {
  fullHeight?: boolean;
}

export const CommunicationLogs = ({ fullHeight = false }: CommunicationLogsProps) => {
  const { commEvents } = useData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={`glass rounded-xl ${fullHeight ? 'flex flex-col h-full min-h-0' : ''}`}
    >
      <div className={`p-6 border-b border-border/50 ${fullHeight ? 'flex-shrink-0' : ''}`}>
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

      <div className={`p-4 space-y-2 font-mono text-sm ${fullHeight ? 'flex-1 overflow-y-auto min-h-0' : 'max-h-[350px] overflow-y-auto'}`}>
        {commEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground font-inter">
            No communication events yet. Load a communication log file to see events.
          </div>
        ) : (
          commEvents.map((event, index) => (
            <motion.div
              key={event.id || index}
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
                  <span className="text-muted-foreground">[{event.sim_time?.toFixed(2) || '0.00'}s]</span>
                  {event.type === "mesh_message" ? (
                    <>
                      <span className="text-blue-light">{event.from}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-accent">{event.to}</span>
                      {event.message?.message_type && (
                        <span className="text-purple-light text-xs px-1.5 py-0.5 rounded bg-purple-primary/20">
                          {event.message.message_type}
                        </span>
                      )}
                      {getStatusIcon(event)}
                    </>
                  ) : (
                    <>
                      <span className="text-blue-light">{event.agent || event.from}</span>
                      <span className="text-muted-foreground">status:</span>
                      <span className="text-green-400">active</span>
                      {event.battery !== undefined && (
                        <span className="text-muted-foreground">bat: {event.battery}%</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

