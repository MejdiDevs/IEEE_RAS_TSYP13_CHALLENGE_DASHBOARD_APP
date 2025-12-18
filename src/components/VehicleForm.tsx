import { useState, useEffect } from 'react'
import { Vehicle } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'

interface VehicleFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle?: Vehicle | null
  onSave: (vehicle: Vehicle) => void
}

export function VehicleForm({ open, onOpenChange, vehicle, onSave }: VehicleFormProps) {
  const [formData, setFormData] = useState<Omit<Vehicle, 'remaining_capacity'>>({
    id: '',
    capacity: 50.0,
    energy_capacity: 100.0,
    location: [0.0, 0.0],
    speed: 5.0,
    vehicle_type: 'delivery',
    capabilities: ['delivery']
  })

  useEffect(() => {
    if (vehicle) {
      setFormData({
        id: vehicle.id,
        capacity: vehicle.capacity,
        energy_capacity: vehicle.energy_capacity,
        location: vehicle.location,
        speed: vehicle.speed,
        vehicle_type: vehicle.vehicle_type,
        capabilities: vehicle.capabilities
      })
    } else {
      setFormData({
        id: '',
        capacity: 50.0,
        energy_capacity: 100.0,
        location: [0.0, 0.0],
        speed: 5.0,
        vehicle_type: 'delivery',
        capabilities: ['delivery']
      })
    }
  }, [vehicle, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.id.trim()) {
      alert('Vehicle ID is required')
      return
    }
    onSave(formData as Vehicle)
    onOpenChange(false)
  }

  const toggleCapability = (cap: string) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.includes(cap)
        ? prev.capabilities.filter(c => c !== cap)
        : [...prev.capabilities, cap]
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
          <DialogDescription>
            {vehicle ? 'Update vehicle information' : 'Add a new vehicle to the fleet'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">Vehicle ID *</Label>
            <Input
              id="id"
              value={formData.id}
              onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
              required
              disabled={!!vehicle}
              placeholder="veh0"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Weight Capacity</Label>
              <Input
                id="capacity"
                type="number"
                step="0.1"
                min="0"
                max="1000"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="energy">Energy Capacity</Label>
              <Input
                id="energy"
                type="number"
                step="0.1"
                min="0"
                max="10000"
                value={formData.energy_capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, energy_capacity: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lon">Longitude</Label>
              <Input
                id="lon"
                type="number"
                step="0.1"
                min="-180"
                max="180"
                value={formData.location[0]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: [parseFloat(e.target.value) || 0, prev.location[1]]
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                type="number"
                step="0.1"
                min="-90"
                max="90"
                value={formData.location[1]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: [prev.location[0], parseFloat(e.target.value) || 0]
                }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="speed">Speed</Label>
            <Input
              id="speed"
              type="number"
              step="0.1"
              min="0.1"
              max="100"
              value={formData.speed}
              onChange={(e) => setFormData(prev => ({ ...prev, speed: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Vehicle Type</Label>
            <Select
              id="type"
              value={formData.vehicle_type}
              onChange={(e) => {
                const newType = e.target.value as Vehicle['vehicle_type']
                setFormData(prev => ({
                  ...prev,
                  vehicle_type: newType,
                  capabilities: prev.capabilities.includes(newType)
                    ? prev.capabilities
                    : [newType, ...prev.capabilities.filter(c => c !== newType)]
                }))
              }}
            >
              <option value="delivery">Delivery</option>
              <option value="reconnaissance">Reconnaissance</option>
              <option value="strike">Strike</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Capabilities</Label>
            <div className="flex flex-wrap gap-2">
              {['delivery', 'reconnaissance', 'strike'].map(cap => (
                <label key={cap} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.capabilities.includes(cap)}
                    onChange={() => toggleCapability(cap)}
                    className="rounded"
                  />
                  <span className="text-sm capitalize">{cap}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

