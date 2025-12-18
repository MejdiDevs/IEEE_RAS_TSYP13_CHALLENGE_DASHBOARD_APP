import { useState, useEffect } from 'react'
import { Task } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
  onSave: (task: Task) => void
}

export function TaskForm({ open, onOpenChange, task, onSave }: TaskFormProps) {
  const [formData, setFormData] = useState<Omit<Task, 'service_time' | 'estimated_energy' | 'required_uavs'>>({
    id: '',
    location: [0.0, 0.0],
    demand: 0.0,
    time_window: [0.0, 0.0],
    priority: 1,
    task_type: 'delivery'
  })

  useEffect(() => {
    if (task) {
      setFormData({
        id: task.id,
        location: task.location,
        demand: task.demand,
        time_window: task.time_window,
        priority: task.priority,
        task_type: task.task_type
      })
    } else {
      setFormData({
        id: '',
        location: [0.0, 0.0],
        demand: 0.0,
        time_window: [0.0, 0.0],
        priority: 1,
        task_type: 'delivery'
      })
    }
  }, [task, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.id.trim()) {
      alert('Task ID is required')
      return
    }
    onSave(formData as Task)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add Task'}</DialogTitle>
          <DialogDescription>
            {task ? 'Update task information' : 'Add a new task'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">Task ID *</Label>
            <Input
              id="id"
              value={formData.id}
              onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
              required
              disabled={!!task}
              placeholder="1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lon">Longitude</Label>
              <Input
                id="lon"
                type="number"
                step="0.1"
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
                value={formData.location[1]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: [prev.location[0], parseFloat(e.target.value) || 0]
                }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="demand">Demand</Label>
              <Input
                id="demand"
                type="number"
                step="0.1"
                min="0"
                value={formData.demand}
                onChange={(e) => setFormData(prev => ({ ...prev, demand: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                min="1"
                max="5"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tw_start">Time Window Start</Label>
              <Input
                id="tw_start"
                type="number"
                step="0.1"
                min="0"
                value={formData.time_window[0]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  time_window: [parseFloat(e.target.value) || 0, prev.time_window[1]]
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tw_end">Time Window End</Label>
              <Input
                id="tw_end"
                type="number"
                step="0.1"
                min="0"
                value={formData.time_window[1]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  time_window: [prev.time_window[0], parseFloat(e.target.value) || 0]
                }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Task Type</Label>
            <select
              id="type"
              value={formData.task_type}
              onChange={(e) => setFormData(prev => ({ ...prev, task_type: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="delivery">Delivery</option>
              <option value="reconnaissance">Reconnaissance</option>
            </select>
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

