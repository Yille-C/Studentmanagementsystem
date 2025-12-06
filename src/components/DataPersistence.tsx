import { useState, useEffect } from 'react';
import { AppData } from '../App';
import { Download, Upload, Database, Save, RefreshCw } from 'lucide-react';

interface DataPersistenceProps {
  appData: AppData;
  setAppData: (data: AppData) => void;
}

export function DataPersistence({ appData, setAppData }: DataPersistenceProps) {
  const [autoSave, setAutoSave] = useState(true);

  // Auto-save to localStorage
  useEffect(() => {
    if (autoSave) {
      localStorage.setItem('studentManagementData', JSON.stringify(appData));
    }
  }, [appData, autoSave]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('studentManagementData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.students || parsed.grades || parsed.attendance) {
          // Don't auto-load, just indicate it's available
        }
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, []);

  const saveToJSON = () => {
    const dataStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `student-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.students && data.grades && data.attendance) {
          setAppData(data);
          alert('Data loaded successfully!');
        } else {
          alert('Invalid data format');
        }
      } catch (error) {
        alert('Error loading file: ' + error);
      }
    };
    reader.readAsText(file);
  };

  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem('studentManagementData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setAppData(parsed);
        alert('Data loaded from browser storage!');
      } catch (error) {
        alert('Error loading data: ' + error);
      }
    } else {
      alert('No saved data found');
    }
  };

  const clearLocalStorage = () => {
    if (confirm('Are you sure you want to clear all saved data from browser storage?')) {
      localStorage.removeItem('studentManagementData');
      alert('Browser storage cleared!');
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all current data? This will reset students, grades, and attendance.')) {
      setAppData({ students: [], grades: [], attendance: [] });
      alert('All data cleared!');
    }
  };

  const hasData = appData.students.length > 0 || appData.grades.length > 0 || appData.attendance.length > 0;

  return (
    <div>
      <h2 className="mb-6 text-indigo-900">Data Persistence</h2>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <Save className="w-5 h-5 text-green-600" />
            <h3 className="text-green-900">Browser Storage (LocalStorage)</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Data is automatically saved to your browser&apos;s local storage and persists between sessions.
          </p>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-green-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Auto-save enabled</span>
            </label>
            <button
              onClick={loadFromLocalStorage}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Load from Browser
            </button>
            <button
              onClick={clearLocalStorage}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear Storage
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Download className="w-5 h-5 text-blue-600" />
            <h3 className="text-blue-900">JSON File Export/Import</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Export your data as a JSON file for backup or import data from a previously saved file.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={saveToJSON}
              disabled={!hasData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Download JSON
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload JSON
              <input
                type="file"
                accept=".json"
                onChange={loadFromJSON}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-purple-600" />
            <h3 className="text-purple-900">Database Integration (MySQL/Supabase)</h3>
          </div>
          <p className="text-gray-700 mb-4">
            For production use with MySQL or cloud database storage, you&apos;ll need to connect to a backend service.
            Supabase provides an easy way to add database functionality to this application.
          </p>
          <div className="bg-white p-4 rounded-lg border border-purple-300">
            <p className="text-gray-700 mb-2">Features with database integration:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
              <li>Persistent storage across devices</li>
              <li>Real-time data synchronization</li>
              <li>Multi-user access and collaboration</li>
              <li>Advanced querying and filtering</li>
              <li>Automated backups</li>
            </ul>
            <p className="text-purple-700">
              Database integration would be configured through a backend API or service like Supabase.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="mb-4 text-gray-900">Current Data Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Students</p>
              <p className="text-blue-900">{appData.students.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Grade Records</p>
              <p className="text-green-900">{appData.grades.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
              <p className="text-gray-600 mb-1">Attendance Records</p>
              <p className="text-purple-900">{appData.attendance.length}</p>
            </div>
          </div>
          <button
            onClick={clearAllData}
            disabled={!hasData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
