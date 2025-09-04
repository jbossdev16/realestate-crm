export default function Home() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Real Estate CRM
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your comprehensive CRM solution for real estate agencies
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🏠 Properties
              </h3>
              <p className="text-gray-600">
                Manage your property listings and inventory
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                👥 Leads
              </h3>
              <p className="text-gray-600">
                Track and convert potential clients
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🤖 AI Assistant
              </h3>
              <p className="text-gray-600">
                Get intelligent insights and recommendations
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              ✅ System Status
            </h3>
            <div className="text-sm text-green-700">
              <p>• Database: Connected</p>
              <p>• Redis: Connected</p>
              <p>• Qdrant: Connected</p>
              <p>• MinIO: Connected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
