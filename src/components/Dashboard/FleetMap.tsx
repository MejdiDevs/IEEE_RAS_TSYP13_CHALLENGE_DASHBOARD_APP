import { motion } from "framer-motion";
import { Car, Target, Warehouse } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { greedyAllocation } from "@/lib/allocation";
import { useMemo, useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// We're using custom icons, so no need to configure default icons

const getVehicleColor = (status: string) => {
  switch (status) {
    case "active":
      return "#22c55e";
    case "idle":
      return "#3b82f6";
    case "charging":
      return "#eab308";
    default:
      return "#6b7280";
  }
};

const getTaskColor = (priority: number) => {
  if (priority >= 4) return "#ef4444";
  if (priority >= 3) return "#eab308";
  return "#3b82f6";
};

// Custom vehicle marker icon (triangle) - matches original style
const createVehicleIcon = (status: string) => {
  const color = getVehicleColor(status);
  return L.divIcon({
    className: "custom-vehicle-marker",
    html: `
      <svg width="24" height="24" viewBox="0 0 24 24" style="filter: drop-shadow(0 0 4px ${color})">
        <polygon
          points="12,2 22,20 12,16 2,20"
          fill="${color}"
          stroke="${color}"
          stroke-width="1"
        />
      </svg>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 20],
  });
};

// Custom task marker icon (rotated square/diamond) - matches original style
const createTaskIcon = (priority: number) => {
  const color = getTaskColor(priority);
  return L.divIcon({
    className: "custom-task-marker",
    html: `
      <div style="
        width: 16px;
        height: 16px;
        transform: rotate(45deg);
        background-color: ${color}33;
        border: 2px solid ${color};
        box-shadow: 0 0 4px ${color};
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

// Custom warehouse marker icon
const createWarehouseIcon = () => {
  const color = "#f97316"; // Orange color for warehouse
  return L.divIcon({
    className: "custom-warehouse-marker",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: ${color};
        border: 3px solid white;
        box-shadow: 0 0 8px ${color}, 0 0 12px ${color}88;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 18px;
      ">W</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Helper function to calculate distance between two points
const calculateDistance = (pos1: [number, number], pos2: [number, number]): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (pos2[0] - pos1[0]) * Math.PI / 180;
  const dLon = (pos2[1] - pos1[1]) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(pos1[0] * Math.PI / 180) * Math.cos(pos2[0] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Component to handle map bounds updates
const MapBounds = ({ vehicles, tasks, warehouse }: { vehicles: any[], tasks: any[], warehouse?: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (vehicles.length === 0 && tasks.length === 0 && !warehouse) return;
    
    const allLats = [
      ...vehicles.map(v => v.location[0]), 
      ...tasks.map(t => t.location[0]),
      ...(warehouse ? [warehouse[0]] : [])
    ];
    const allLngs = [
      ...vehicles.map(v => v.location[1]), 
      ...tasks.map(t => t.location[1]),
      ...(warehouse ? [warehouse[1]] : [])
    ];
    
    if (allLats.length === 0 || allLngs.length === 0) return;
    
    const bounds = L.latLngBounds(
      allLats.map((lat, i) => [lat, allLngs[i]] as [number, number])
    );
    
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, vehicles, tasks, warehouse]);
  
  return null;
};

// Task Marker Component
const TaskMarker = ({ 
  task, 
  isSelected, 
  onSelect, 
  onDeselect 
}: { 
  task: { id: string; location: [number, number]; priority: number };
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
}) => {
  const markerRef = useRef<L.Marker>(null);
  
  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      if (isSelected) {
        marker.openPopup();
      } else {
        marker.closePopup();
      }
    }
  }, [isSelected]);
  
  return (
    <Marker
      position={task.location}
      icon={createTaskIcon(task.priority)}
      ref={markerRef}
      eventHandlers={{
        click: () => {
          if (isSelected) {
            onDeselect();
          } else {
            onSelect();
          }
        },
      }}
    >
      <Popup
        className="custom-popup"
        onClose={onDeselect}
      >
        <div className="font-inter">
          <div className="font-semibold text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-red-400" />
            Task {task.id}
          </div>
          <div className="text-xs text-muted-foreground">Priority: {task.priority}</div>
        </div>
      </Popup>
    </Marker>
  );
};

// Vehicle Marker Component
const VehicleMarker = ({ 
  vehicle, 
  isSelected, 
  onSelect, 
  onDeselect 
}: { 
  vehicle: { id: string; location: [number, number]; status: string; type: string };
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
}) => {
  const markerRef = useRef<L.Marker>(null);
  
  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      if (isSelected) {
        marker.openPopup();
      } else {
        marker.closePopup();
      }
    }
  }, [isSelected]);
  
  return (
    <Marker
      position={vehicle.location}
      icon={createVehicleIcon(vehicle.status)}
      ref={markerRef}
      eventHandlers={{
        click: () => {
          if (isSelected) {
            onDeselect();
          } else {
            onSelect();
          }
        },
      }}
    >
      <Popup
        className="custom-popup"
        onClose={onDeselect}
      >
        <div className="font-inter">
          <div className="font-semibold text-sm flex items-center gap-2">
            <Car className="w-4 h-4 text-green-400" />
            {vehicle.id}
          </div>
          <div className="text-xs text-muted-foreground">Status: {vehicle.status}</div>
          <div className="text-xs text-muted-foreground">Type: {vehicle.type}</div>
        </div>
      </Popup>
    </Marker>
  );
};


export const FleetMap = () => {
  const { vehicles, tasks, customTaskOrders } = useData();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  // Store original vehicle positions to track movement
  const vehicleOriginsRef = useRef<Map<string, [number, number]>>(new Map());

  const assignments = useMemo(() => {
    if (vehicles.length === 0 || tasks.length === 0) return {};
    const vehiclesCopy = vehicles.map(v => ({ ...v, remaining_capacity: v.capacity }));
    return greedyAllocation(vehiclesCopy, tasks);
  }, [vehicles, tasks]);

  // Calculate warehouse location as average of vehicle starting positions
  const warehouseLocation = useMemo(() => {
    if (vehicles.length === 0) return null;
    
    // Store original positions on first render
    vehicles.forEach(v => {
      if (!vehicleOriginsRef.current.has(v.id)) {
        vehicleOriginsRef.current.set(v.id, [v.location[1], v.location[0]]);
      }
    });
    
    // Calculate average of original positions (or current if no origin stored)
    const positions = vehicles.map(v => {
      const origin = vehicleOriginsRef.current.get(v.id);
      return origin || [v.location[1], v.location[0]];
    });
    
    const avgLat = positions.reduce((sum, pos) => sum + pos[0], 0) / positions.length;
    const avgLng = positions.reduce((sum, pos) => sum + pos[1], 0) / positions.length;
    
    return [avgLat, avgLng] as [number, number];
  }, [vehicles]);

  const vehicleData = useMemo(() => {
    return vehicles.map(v => ({
      id: v.id,
      location: [v.location[1], v.location[0]] as [number, number], // Convert [lng, lat] to [lat, lng]
      status: assignments[v.id]?.length > 0 ? "active" : "idle",
      type: v.vehicle_type || "delivery",
    }));
  }, [vehicles, assignments]);

  const taskData = useMemo(() => {
    return tasks.map(t => ({
      id: t.id,
      location: [t.location[1], t.location[0]] as [number, number], // Convert [lng, lat] to [lat, lng]
      priority: t.priority,
    }));
  }, [tasks]);

  const center = useMemo(() => {
    if (vehicles.length === 0 && tasks.length === 0) {
      return [0, 0] as [number, number];
    }
    
    const allLats = [
      ...vehicles.map(v => v.location[1]), 
      ...tasks.map(t => t.location[1]),
      ...(warehouseLocation ? [warehouseLocation[0]] : [])
    ];
    const allLngs = [
      ...vehicles.map(v => v.location[0]), 
      ...tasks.map(t => t.location[0]),
      ...(warehouseLocation ? [warehouseLocation[1]] : [])
    ];
    
    if (allLats.length === 0 || allLngs.length === 0) {
      return [0, 0] as [number, number];
    }
    
    const avgLat = allLats.reduce((a, b) => a + b, 0) / allLats.length;
    const avgLng = allLngs.reduce((a, b) => a + b, 0) / allLngs.length;
    
    return [avgLat, avgLng] as [number, number];
  }, [vehicles, tasks, warehouseLocation]);

  // Calculate warehouse-to-vehicle connections
  // All warehouse connections are faint since vehicles have already left the warehouse
  const getWarehouseConnections = useMemo(() => {
    if (!warehouseLocation) return new Map();
    
    const connections = new Map<string, [number, number][]>();
    
    vehicleData.forEach(vehicle => {
      // All warehouse-to-vehicle connections are considered "done" (vehicles have left)
      connections.set(vehicle.id, [warehouseLocation, vehicle.location]);
    });
    
    return connections;
  }, [warehouseLocation, vehicleData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-xl overflow-hidden"
    >
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-orbitron text-lg font-bold">Fleet Map</h3>
            <p className="font-inter text-sm text-muted-foreground">
              Real-time vehicle and task positions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-green-400" />
              <span className="font-inter text-xs text-muted-foreground">Vehicle</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-red-400" />
              <span className="font-inter text-xs text-muted-foreground">Task</span>
            </div>
            <div className="flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-orange-500" />
              <span className="font-inter text-xs text-muted-foreground">Warehouse</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative aspect-[16/9] bg-gradient-to-br from-background via-purple-primary/5 to-background">
        {typeof window !== 'undefined' && (
          <MapContainer
            key="map-container"
            center={center}
            zoom={vehicles.length === 0 && tasks.length === 0 ? 2 : 10}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
            className="leaflet-container-dark"
            whenCreated={(map) => {
              // Ensure map is properly initialized
              if (vehicleData.length > 0 || taskData.length > 0) {
                const allLats = [...vehicleData.map(v => v.location[0]), ...taskData.map(t => t.location[0])];
                const allLngs = [...vehicleData.map(v => v.location[1]), ...taskData.map(t => t.location[1])];
                if (allLats.length > 0 && allLngs.length > 0) {
                  const bounds = L.latLngBounds(
                    allLats.map((lat, i) => [lat, allLngs[i]] as [number, number])
                  );
                  map.fitBounds(bounds, { padding: [50, 50] });
                }
              }
            }}
          >
            {/* Dark theme tile layer */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            <MapBounds vehicles={vehicleData} tasks={taskData} warehouse={warehouseLocation || undefined} />

            {/* Warehouse Marker */}
            {warehouseLocation && (
              <Marker
                position={warehouseLocation}
                icon={createWarehouseIcon()}
              >
                <Popup className="custom-popup">
                  <div className="font-inter">
                    <div className="font-semibold text-sm flex items-center gap-2">
                      <Warehouse className="w-4 h-4 text-orange-500" />
                      Warehouse
                    </div>
                    <div className="text-xs text-muted-foreground">Fleet Origin</div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Warehouse to Vehicle Connection Lines - All faint since vehicles have left */}
            {warehouseLocation && vehicleData.map(vehicle => {
              const connection = getWarehouseConnections.get(vehicle.id);
              if (!connection || connection.length !== 2) return null;
              
              return (
                <Polyline
                  key={`warehouse-route-${vehicle.id}`}
                  positions={connection}
                  pathOptions={{
                    color: '#085FD2',
                    weight: 3,
                    opacity: 0.35,
                    dashArray: '10, 5',
                  }}
                />
              );
            })}

            {/* Vehicle to Task Route Lines - Single continuous line per vehicle */}
            {Object.entries(assignments).map(([vehicleId, taskIds]) => {
              const vehicle = vehicleData.find(v => v.id === vehicleId);
              if (!vehicle || taskIds.length === 0) return null;
              
              // Use custom order if available, otherwise use greedy allocation order
              const customOrder = customTaskOrders[vehicleId];
              const orderedTaskIds = customOrder && customOrder.length > 0 ? customOrder : taskIds;
              
              // Get all assigned tasks with their locations in order
              const assignedTasks = orderedTaskIds
                .map(taskId => taskData.find(t => t.id === taskId))
                .filter(Boolean) as Array<{ id: string; location: [number, number] }>;
              
              if (assignedTasks.length === 0) return null;
              
              // Create a single continuous route: vehicle → task1 → task2 → task3...
              const routePositions: [number, number][] = [
                vehicle.location,
                ...assignedTasks.map(t => t.location)
              ];
              
              return (
                <Polyline
                  key={`route-${vehicleId}`}
                  positions={routePositions}
                  pathOptions={{
                    color: '#085FD2',
                    weight: 3,
                    opacity: 0.8,
                    dashArray: '10, 5',
                  }}
                />
              );
            })}

            {/* Task Markers */}
            {taskData.map((task) => (
              <TaskMarker
                key={`task-${task.id}`}
                task={task}
                isSelected={selectedTask === task.id}
                onSelect={() => {
                  setSelectedTask(task.id);
                  setSelectedVehicle(null);
                }}
                onDeselect={() => setSelectedTask(null)}
              />
            ))}

            {/* Vehicle Markers */}
            {vehicleData.map((vehicle) => (
              <VehicleMarker
                key={`vehicle-${vehicle.id}`}
                vehicle={vehicle}
                isSelected={selectedVehicle === vehicle.id}
                onSelect={() => {
                  setSelectedVehicle(vehicle.id);
                  setSelectedTask(null);
                }}
                onDeselect={() => setSelectedVehicle(null)}
              />
            ))}
          </MapContainer>
        )}
      </div>
    </motion.div>
  );
};
