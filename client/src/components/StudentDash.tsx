
const StudentDash = ({ user }: any) => {

  return (
    <div>
      <h1>Student Dashboard: {user.name}</h1>
      <form 
      onSubmit={() => {}}
      >
        <button type="submit">Mark Attendance</button>
      </form>
    </div>
  )
  
};

export default StudentDash;