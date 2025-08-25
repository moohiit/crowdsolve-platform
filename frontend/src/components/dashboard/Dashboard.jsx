import React from 'react'
import { useSelector } from 'react-redux'

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className='p-4 mt-16 max-w-7xl mx-auto'>
      <h1 className='bg-gray'>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard. Here you can manage users, view analytics, and configure settings.</p>
      <p>This is the sample role based access dashboard</p>
      {user && user.role === 'admin' && (<>
        <div>
          <h2 className='text-xl font-bold mb-4'>Admin Panel</h2>
          <p>As an admin, you have access to the following features:</p>
          <ul className='list-disc list-inside'>
            <li>User Management: Add, remove, and modify user accounts.</li>
            <li>Analytics Dashboard: View site usage statistics and reports.</li>
            <li>Settings: Configure application-wide settings and preferences.</li>
          </ul>
        </div>
      </>)}
    </div>
  )
}

export default Dashboard