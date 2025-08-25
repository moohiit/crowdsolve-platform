import React from 'react'
import { useSelector } from 'react-redux'

function UserDashboard() {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className='p-4 mt-16 max-w-7xl mx-auto'>
      <h1 className='bg-gray'>User Dashboard</h1>
      <p>Welcome to the User dashboard.</p>
      {user && user.role === 'user' && (<>
        <div>
          <h2 className='text-xl font-bold mb-4'>User Panel</h2>
          <p>As a user, you have access to the following features:</p>
          <ul className='list-disc list-inside'>
            <li>Report Problems: Submit issues or problems you encounter.</li>
            <li>View Status: Check the status of your reported problems.</li>
            <li>Profile Management: Update your personal information and preferences.</li>
          </ul>
        </div>
      </>)}
    </div>
  )
}

export default UserDashboard