export const requestColumnHeaders = (user) => {
  return (
    <thead>
    <tr>
      <th>
        Subject
      </th>
      <th>
        Request
      </th>
      <th>
        Status
      </th>
      <th>
        Agent Assigned
      </th>
      <th>
        Date
      </th>
      {user.role != 2 && 
        <>
          <th>Customer Name</th>
          <th>Handle Assignment</th>
        </>
      }
    </tr>
    </thead>
  )
}

export const usersColumnHeaders = () => {
  return (
    <thead>
    <tr>
      <th>
        Username
      </th>
      <th>
        Email
      </th>
      <th>
        Role
      </th>
      <th>
        Action
      </th>
    </tr>
    </thead>
  )
}