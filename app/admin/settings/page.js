export default function SettingsPage() {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h5 className="font-bold text-xl m-0">System Settings</h5>
            <p className="text-[#6b7a8a] text-sm m-0">System configuration and preferences</p>
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="content-card">
            <div className="px-5 py-3 border-b border-[#e2e8f0]">
              <h5 className="font-semibold">Security Settings</h5>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="font-semibold text-sm">Session Timeout (minutes)</label>
                <input type="number" className="w-full p-2 border rounded-lg mt-1" value="30" />
              </div>
              <div>
                <label className="font-semibold text-sm">Max Login Attempts</label>
                <input type="number" className="w-full p-2 border rounded-lg mt-1" value="5" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked /> <span>Force SSL/HTTPS</span>
              </div>
              <button className="btn-primary w-full">Save Settings</button>
            </div>
          </div>
  
          <div className="content-card">
            <div className="px-5 py-3 border-b border-[#e2e8f0]">
              <h5 className="font-semibold">Email Configuration</h5>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="font-semibold text-sm">SMTP Host</label>
                <input type="text" className="w-full p-2 border rounded-lg mt-1" value="mail.nacca.gov.gh" />
              </div>
              <div>
                <label className="font-semibold text-sm">SMTP Port</label>
                <input type="text" className="w-full p-2 border rounded-lg mt-1" value="587" />
              </div>
              <button className="btn-primary w-full">Save Settings</button>
            </div>
          </div>
        </div>
      </div>
    );
  }