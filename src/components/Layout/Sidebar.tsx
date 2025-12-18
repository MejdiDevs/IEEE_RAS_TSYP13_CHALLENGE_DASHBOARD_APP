import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'
import { Button } from '@/components/ui/Button'
import { VehicleForm } from '@/components/VehicleForm'
import { Vehicle, Task, CommunicationEvent } from '@/types'
import { normalizeConfig } from '@/lib/normalize'
import { Upload, Plus, LogOut, Download } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface SidebarProps {
  onEditVehicle: (vehicle: Vehicle) => void
}

export function Sidebar({ onEditVehicle }: SidebarProps) {
  const { logout } = useAuth()
  const { vehicles, tasks, addVehicle, loadConfig, loadCommLog } = useData()
  const [vehicleFormOpen, setVehicleFormOpen] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'config' | 'comm') => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (type === 'config') {
        const { vehicles, tasks, warnings } = normalizeConfig(
          data.vehicles || [],
          data.tasks || []
        )
        await loadConfig(vehicles, tasks, warnings)
        toast.success('Configuration loaded successfully!')
        if (warnings.length > 0) {
          warnings.forEach(w => toast.warning(w))
        }
      } else {
        const events = data.events || []
        await loadCommLog(events)
        toast.success('Communication log loaded successfully!')
      }
    } catch (error: any) {
      toast.error(`Error loading file: ${error.message}`)
    }

    e.target.value = ''
  }

  const handleDownloadScenario = () => {
    const scenario = { vehicles, tasks }
    const blob = new Blob([JSON.stringify(scenario, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'scenario_config.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-64 bg-card border-r p-4 space-y-4 h-screen overflow-y-auto">
      <div>
        <h2 className="text-lg font-semibold mb-4">Configuration</h2>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium mb-2">Load Config JSON</label>
            <input
              type="file"
              accept=".json"
              onChange={(e) => handleFileUpload(e, 'config')}
              className="hidden"
              id="config-upload"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('config-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Load Config
            </Button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Load Comm Log JSON</label>
            <input
              type="file"
              accept=".json"
              onChange={(e) => handleFileUpload(e, 'comm')}
              className="hidden"
              id="comm-upload"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('comm-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Load Comm Log
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Add Vehicle</h2>
        <Button
          className="w-full"
          onClick={() => setVehicleFormOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleDownloadScenario}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Scenario
        </Button>
      </div>

      <div className="pt-4 border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <VehicleForm
        open={vehicleFormOpen}
        onOpenChange={setVehicleFormOpen}
        onSave={async (vehicle) => {
          await addVehicle(vehicle)
          toast.success('Vehicle added successfully!')
        }}
      />
    </div>
  )
}


